import { storage } from "./storage.mjs";
import { toggleThemeInit } from "./ui.mjs";
import { getRateFromCurrency } from "./exchangeRates.mjs"; // ✅ Only use the imported version

const params = new URLSearchParams(location.search);
const code = params.get("code")?.toLowerCase(); // this is cca3 now
const el = document.getElementById("country-detail");
const title = document.getElementById("country-name");
const favBtn = document.getElementById("fav-toggle");

toggleThemeInit();

async function load() {
  if (!code) {
    el.innerHTML = "<p>No country code provided.</p>";
    return;
  }

  try {
    // Fetch country details
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!res.ok) throw new Error(`Country not found: ${res.status}`);

    const [country] = await res.json();
    if (!country) throw new Error("Country data missing");

    // Title
    title.textContent = country.name.common;

    // Emergency numbers — safe fetch in case JSON is empty or missing
    let emergency = { police: "N/A", ambulance: "N/A", fire: "N/A" };
    try {
      const emergencyResp = await fetch("./data/emergency-numbers.json");
      if (emergencyResp.ok) {
        const text = await emergencyResp.text();
        if (text.trim()) {
          const phoneData = JSON.parse(text);
          emergency = phoneData[country.cca2] || emergency;
        }
      }
    } catch (err) {
      console.warn("Could not load emergency numbers:", err);
    }

    // Currency code & exchange rate
    const currencyCode = Object.keys(country.currencies || {})[0] || "N/A";
    let rateText = "";
    if (currencyCode !== "N/A") {
      const rate = await getRateFromCurrency(currencyCode); // ✅ Uses imported helper
      if (rate !== null) {
        rateText = ` — 1 ${currencyCode} = ${rate} USD`;
      } else {
        rateText = " — Rate unavailable";
      }
    }

    // Render HTML
    el.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" width="200">
      <h2>${country.name.official}</h2>
      <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Languages:</strong> ${
        country.languages ? Object.values(country.languages).join(", ") : "N/A"
      }</p>
      <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
      <p><strong>Currency:</strong> ${currencyCode}${rateText}</p>

      <h3>Emergency Numbers</h3>
      <ul>
        <li>Police: ${emergency.police}</li>
        <li>Ambulance: ${emergency.ambulance}</li>
        <li>Fire: ${emergency.fire}</li>
      </ul>
    `;

    // Favorites toggle — storing by cca3
    const favs = storage.get("favs", []);
    const exists = favs.includes(country.cca3);
    favBtn.textContent = exists ? "Remove from favorites" : "Add to favorites";

    favBtn.onclick = () => {
      const f = storage.get("favs", []);
      if (f.includes(country.cca3)) {
        storage.set("favs", f.filter((x) => x !== country.cca3));
        favBtn.textContent = "Add to favorites";
      } else {
        f.push(country.cca3);
        storage.set("favs", f);
        favBtn.textContent = "Remove from favorites";
      }
    };

  } catch (e) {
    console.error(e);
    el.innerHTML = `<p>Error loading country details: ${e.message}</p>`;
  }
}

load();
