// src/api/transactions.js
export async function sendTransaction(payload) {
  const url = process.env.REACT_APP_TRANSACTIONS_API_URL || window.__TRANSACTIONS_API_URL__;
  if (!url) {
    console.warn('No transactions API URL configured');
    return null;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Transactions API returned ${res.status}`);
  return res.json();
}
