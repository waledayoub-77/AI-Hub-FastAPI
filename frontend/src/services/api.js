const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export function fetchCategories() {
  return request('/categories')
}

export function fetchModelsByCategory(categoryId) {
  return request(`/models?categoryId=${categoryId}`)
}

export function fetchModelById(modelId) {
  return request(`/models/${modelId}`)
}

export function useModel(key, input) {
  return request('/ai/use-model', {
    method: 'POST',
    body: JSON.stringify({ key, input }),
  })
}

function normalizeModelToken(value = '') {
  return value.toString().trim().toLowerCase()
}

export function getOfficialModelUrl(model) {
  if (!model) {
    return null
  }

  const explicitUrl = model.official_url || model.url || model.website_url || model.link
  if (explicitUrl) {
    return explicitUrl
  }

  const keyToken = normalizeModelToken(model.key)
  if (OFFICIAL_MODEL_URLS[keyToken]) {
    return OFFICIAL_MODEL_URLS[keyToken]
  }

  const nameToken = normalizeModelToken(model.name).replace(/\s+/g, '-')
  if (OFFICIAL_MODEL_URLS[nameToken]) {
    return OFFICIAL_MODEL_URLS[nameToken]
  }

  if (nameToken.includes('blackbox')) {
    return OFFICIAL_MODEL_URLS.blackbox
  }

  return null
}
