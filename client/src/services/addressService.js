const API = import.meta.env.VITE_SERVER_API;

export async function getAddresses() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/api/user/address`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch addresses');
  }
  return res.json();
}

export async function addAddress(addressData) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/api/user/address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(addressData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to save address');
  }
  return res.json();
}

export async function setDefaultAddress(addressId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/api/user/address/${addressId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update address');
  }
  return res.json();
}

export async function deleteAddress(addressId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/api/user/address/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete address');
  }
  return res.json();
}
