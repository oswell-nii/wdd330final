export async function getRateFromCurrency(code) {
  if (!code) return null;

  const apiKey = "ae9ed1b742453b7c187b1abf"; 
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${code}/USD`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    if (data.result === "error") {
      console.warn("ExchangeRateAPI error:", data["error-type"]);
      return null;
    }
    return data.conversion_rate;
  } catch (err) {
    console.error("Failed to fetch exchange rate:", err);
    return null;
  }
}
