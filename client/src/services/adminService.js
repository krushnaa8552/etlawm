const API_BASE = import.meta.env.VITE_SERVER_API;

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function uploadImage(file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Upload failed (${response.status})`);
    }
    return response.json(); // returns { success: true, url }
}

export async function createProduct(data) {
    const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to create product (${response.status})`);
    }
    const result = await response.json();
    return result.product;
}

export async function updateProduct(id, data) {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to update product (${response.status})`);
    }
    const result = await response.json();
    return result.product;
}

export async function deleteProduct(id) {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to delete product (${response.status})`);
    }
    return response.json();
}

// Helper to associate primary image URL to product (called after product creation)
export async function addProductImage(productId, imageUrl, isPrimary = true, sortOrder = 0) {
    const response = await fetch(`${API_BASE}/api/products/${productId}/images`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ image_url: imageUrl, is_primary: isPrimary, sort_order: sortOrder }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to add product image (${response.status})`);
    }
    return response.json();
}

export async function getAdminProfile() {
    const response = await fetch(`${API_BASE}/api/admin/profile`, {
        method: 'GET',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to fetch profile (${response.status})`);
    }
    return response.json();
}

export async function updateAdminProfile(data) {
    const response = await fetch(`${API_BASE}/api/admin/profile`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to update profile (${response.status})`);
    }
    return response.json();
}

export async function getAdminSettings() {
    const response = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'GET',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to fetch settings (${response.status})`);
    }
    return response.json();
}

export async function updateAdminSettings(data) {
    const response = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to update settings (${response.status})`);
    }
    return response.json();
}

export async function getAdminPhones() {
    const response = await fetch(`${API_BASE}/api/admin/phones`, {
        method: 'GET',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to fetch admin phones (${response.status})`);
    }
    return response.json();
}

export async function addAdminPhone(phoneNumber) {
    const response = await fetch(`${API_BASE}/api/admin/register-phone`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ phone_number: phoneNumber }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to register admin phone (${response.status})`);
    }
    return response.json();
}

export async function deleteAdminPhone(phoneNumber) {
    const response = await fetch(`${API_BASE}/api/admin/phones/${phoneNumber}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message ?? `Failed to delete admin phone (${response.status})`);
    }
    return response.json();
}

