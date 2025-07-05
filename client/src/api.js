const API_URL = import.meta.env.VITE_API_URL;

// Transactions
export async function getTransactions(ownerId) {
  const res = await fetch(`${API_URL}/api/transactions?ownerId=${ownerId}`);
  return res.json();
}

export async function addTransaction(data, ownerId) {
  const res = await fetch(`${API_URL}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ownerId }),
  });
  return res.json();
}

export async function editTransaction(id, data, ownerId) {
  const res = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ownerId }),
  });
  return res.json();
}

export async function deleteTransaction(id, ownerId) {
  const res = await fetch(`${API_URL}/api/transactions/${id}?ownerId=${ownerId}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Budgets
export async function getBudgets(ownerId) {
  const res = await fetch(`${API_URL}/api/budgets?ownerId=${ownerId}`);
  return res.json();
}

export async function addBudget(data, ownerId) {
  const res = await fetch(`${API_URL}/api/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ownerId }),
  });
  return res.json();
}

export async function editBudget(id, data, ownerId) {
  const res = await fetch(`${API_URL}/api/budgets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ownerId }),
  });
  return res.json();
}

export async function deleteBudget(id, ownerId) {
  const res = await fetch(`${API_URL}/api/budgets/${id}?ownerId=${ownerId}`, {
    method: 'DELETE',
  });
  return res.json();
} 