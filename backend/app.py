import os

import joblib
import tensorflow as tf
from flask import Flask, jsonify
from flask_cors import CORS

from database import init_db
from routes.auth import bp as auth_bp
from routes.cv import bp as cv_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(cv_bp)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Municipalidad Yau - Analizador de CVs"})


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Recurso no encontrado"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Error interno del servidor"}), 500


if __name__ == "__main__":
    init_db()

    print("Cargando modelos de Machine Learning...")
    app.config["MODELO_CV"] = tf.keras.models.load_model("modelos/modelo_clasificador_cv.h5")
    app.config["VECTORIZADOR"] = joblib.load("modelos/vectorizador_cv.pkl")
    app.config["ENCODER"] = joblib.load("modelos/encoder_categorias_cv.pkl")
    print("Modelos listos.")

    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True, port=5000)
