// src/services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function post(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API ${path} failed (${res.status}): ${text || res.statusText}`
    );
  }

  return res.json();
}

export function detectAccount(accountAddress, options = {}) {
  return post("/detect", {
    account_address: accountAddress,
    explain: true,
    explain_with_llm: true,
    max_transactions: 1000,
    ...options,
  });
}

export function detectTransactionByHash(txHash, options = {}) {
  return post("/detect/transaction", {
    transaction_hash: txHash,
    explain: true,
    explain_with_llm: true,
    ...options,
  });
}
