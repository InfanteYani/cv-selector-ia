import os
import re
import tempfile

import numpy as np
import PyPDF2
from flask import Blueprint, request, jsonify, current_app

from database import query_one, query_all, execute

bp = Blueprint("cv", __name__, url_prefix="/api")


def limpiar_texto(texto):
    texto = texto.lower()
    texto = re.sub(r"http\S+|www\S+|https\S+", "", texto, flags=re.MULTILINE)
    texto = re.sub(r"[^a-z\s]", " ", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto


def extraer_texto_pdf(ruta):
    texto = ""
    with open(ruta, "rb") as archivo:
        lector = PyPDF2.PdfReader(archivo)
        for pagina in lector.pages:
            if pagina.extract_text():
                texto += pagina.extract_text() + " "
    return texto


@bp.route("/analizar-cv", methods=["POST"])
def analizar_cv():
    if "file" not in request.files:
        return jsonify({"error": "No se proporcionó ningún archivo"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400

    modelo = current_app.config["MODELO_CV"]
    vectorizador = current_app.config["VECTORIZADOR"]
    encoder = current_app.config["ENCODER"]

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        file.save(tmp.name)
        tmp.close()

        texto_crudo = extraer_texto_pdf(tmp.name)
        texto_limpio = limpiar_texto(texto_crudo)

        if not texto_limpio:
            return jsonify({"error": "No se pudo extraer texto del PDF"}), 400

        X = vectorizador.transform([texto_limpio]).toarray()
        prediccion = modelo.predict(X, verbose=0)

        clase_indice = int(np.argmax(prediccion[0]))
        confianza = float(prediccion[0][clase_indice]) * 100
        categoria = encoder.inverse_transform([clase_indice])[0]
        categorias = encoder.classes_

        probabilidades = [
            {"categoria": str(cat), "confianza": round(float(prediccion[0][i]) * 100, 2)}
            for i, cat in enumerate(categorias)
        ]
        probabilidades.sort(key=lambda x: x["confianza"], reverse=True)

        texto_muestra = texto_crudo[:500].strip() if texto_crudo else ""
        texto_completo = texto_crudo.strip() if texto_crudo else ""

        cv_id = execute(
            """INSERT INTO cv_analisis
               (filename, categoria, confianza, probabilidades, texto_muestra, texto_completo)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (file.filename, categoria, round(confianza, 2),
             str(probabilidades), texto_muestra, texto_completo),
        )

        return jsonify({
            "success": True,
            "cv_id": cv_id,
            "categoria_detectada": categoria,
            "confianza": round(confianza, 2),
            "mensaje": f"El currículo fue clasificado para el área de {categoria}.",
            "probabilidades": probabilidades,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)


@bp.route("/cv/historial", methods=["GET"])
def historial_cv():
    rows = query_all(
        "SELECT id, filename, categoria, confianza, texto_muestra, created_at FROM cv_analisis ORDER BY created_at DESC"
    )
    return jsonify({"historial": rows})


@bp.route("/cv/<int:cv_id>", methods=["GET"])
def obtener_cv(cv_id):
    row = query_one(
        "SELECT * FROM cv_analisis WHERE id = ?", (cv_id,),
    )
    if not row:
        return jsonify({"error": "Análisis no encontrado"}), 404
    return jsonify({"cv": row})


@bp.route("/cv/<int:cv_id>", methods=["DELETE"])
def eliminar_cv(cv_id):
    row = query_one("SELECT id FROM cv_analisis WHERE id = ?", (cv_id,))
    if not row:
        return jsonify({"error": "Análisis no encontrado"}), 404
    execute("DELETE FROM cv_analisis WHERE id = ?", (cv_id,))
    return jsonify({"success": True})


@bp.route("/cv/stats", methods=["GET"])
def stats_cv():
    total = query_one("SELECT COUNT(*) as c FROM cv_analisis")["c"]
    confianza_promedio = query_one("SELECT AVG(confianza) as avg FROM cv_analisis")["avg"] or 0

    por_categoria = query_all(
        "SELECT categoria, COUNT(*) as cantidad, AVG(confianza) as confianza_promedio "
        "FROM cv_analisis GROUP BY categoria ORDER BY cantidad DESC"
    )

    ultimos_7_dias = query_all(
        "SELECT DATE(created_at) as fecha, COUNT(*) as cantidad "
        "FROM cv_analisis "
        "WHERE created_at >= DATE('now', '-7 days') "
        "GROUP BY DATE(created_at) ORDER BY fecha ASC"
    )

    return jsonify({
        "total": total,
        "confianza_promedio": round(float(confianza_promedio), 2),
        "por_categoria": por_categoria,
        "ultimos_7_dias": ultimos_7_dias,
    })
