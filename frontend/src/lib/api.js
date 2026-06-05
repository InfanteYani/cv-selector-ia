const API_BASE = "/api"

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Error ${res.status}`)
  }
  return res.json()
}

export const api = {
  login: (dni, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ dni, password }) }),

  historialCV: () => request("/cv/historial"),
  obtenerCV: (id) => request(`/cv/${id}`),
  eliminarCV: (id) => request(`/cv/${id}`, { method: "DELETE" }),
  statsCV: () => request("/cv/stats"),
}

export async function uploadCV(file) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_BASE}/analizar-cv`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Error ${res.status}`)
  }
  return res.json()
}
