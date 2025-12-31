// Simple wrapper - calls our secure API route 
//strapi.js
export async function fetchFromStrapi(endpoint) {
    const response = await fetch('/api/strapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            endpoint,
            method: 'GET'
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Fetch failed')
    }

    return response.json()
}

export async function postToStrapi(endpoint, data) {
    const response = await fetch('/api/strapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            endpoint,
            method: 'POST',
            data
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Post failed')
    }

    return response.json()
}

export async function updateStrapi(endpoint, data) {
    const response = await fetch('/api/strapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            endpoint,
            method: 'PUT',
            data
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Update failed')
    }

    return response.json()
}

export async function deleteFromStrapi(endpoint) {
    const response = await fetch('/api/strapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            endpoint,
            method: 'DELETE'
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
    }

    return response.json()
}