import { mockApi } from "./mockData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK_APIS === "true";

async function fetchWrapper(endpoint, options = {}) {
  if (USE_MOCK) {
    return mockApi(endpoint, options);
  }

  const token = localStorage.getItem("token");
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw data.error || { code: "SERVER_ERROR", message: "Something went wrong" };
    }

    return data.data;
  } catch (error) {
    // If it's already our standardized error shape, re-throw it
    if (error.code && error.message) {
      throw error;
    }
    // Network errors or JSON parse errors
    throw { code: "NETWORK_ERROR", message: error.message };
  }
}

const api = {
  get: (endpoint, options) => fetchWrapper(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return fetchWrapper(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  put: (endpoint, body, options) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return fetchWrapper(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  delete: (endpoint, bodyOrOptions, options) => {
    if (bodyOrOptions && !bodyOrOptions.headers && !bodyOrOptions.body && typeof bodyOrOptions === "object" && !(bodyOrOptions instanceof FormData)) {
      return fetchWrapper(endpoint, {
        ...options,
        method: "DELETE",
        body: JSON.stringify(bodyOrOptions),
      });
    }
    return fetchWrapper(endpoint, { ...(bodyOrOptions || {}), method: "DELETE" });
  },
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/uploads", formData);
  },
};

export default api;
