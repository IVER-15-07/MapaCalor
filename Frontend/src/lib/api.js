/**
 * Cliente HTTP centralizado - Punto de entrada
 * Función genérica para hacer peticiones HTTP
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Función genérica para hacer peticiones HTTP
 * Se usa como base en todos los módulos de endpoints
 */
export async function apiCall(endpoint, options = {}) {
  const {
    method = "GET",
    body = null,
    headers = {},
  } = options;

  try {
    const isFormData = body instanceof FormData;
    const fetchOptions = {
      method,
      headers: isFormData
        ? { ...headers }
        : {
            "Content-Type": "application/json",
            ...headers,
          },
    };

    if (body) {
      fetchOptions.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Error desconocido" }));
      throw new Error(error.detail || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}
