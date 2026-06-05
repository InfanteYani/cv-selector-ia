from flask import Blueprint, request, jsonify
from database import query_one

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    dni = data.get("dni", "").strip()
    password = data.get("password", "").strip()

    if not dni or not password:
        return jsonify({"error": "DNI y contraseña son obligatorios"}), 400

    user = query_one(
        "SELECT id, dni, nombre, email, rol FROM ciudadanos WHERE dni = ? AND password = ?",
        (dni, password),
    )
    if not user:
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify({"success": True, "user": user})
