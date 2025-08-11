const resultsEl = document.getElementById("results");
const input = document.getElementById("search-input");
const regionSelect = document.getElementById("region-filter");

let debounceTimer;

export function initSearch() {
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(), 300);
  });

  regionSelect.addEventListener("change", () => performSearch());

  // Initial load: show a few countries
  performSearch("g");
}

async function performSearch(q = input.value.trim()) {
  const region = regionSelect.value;

  // Remove early return here; always fetch something if no query or region

  try {
    let url;
    if (q) {
      url = `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fields=name,cca3,flags,region,population,capital`;
    } else if (region === "all") {
      url = `https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,capital`;
    } else {
      url = `https://restcountries.com/v3.1/region/${region}?fields=name,cca3,flags,region,population,capital`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API request failed: ${res.status}`);
    const data = await res.json();

    const filtered = (Array.isArray(data) ? data : []).filter(
      (c) => region === "all" || c.region === region
    );

    if (filtered.length === 0) {
      resultsEl.innerHTML = `<p style="padding:1rem">No countries found. Type a country name or choose a region.</p>`;
      return;
    }

    resultsEl.innerHTML = filtered
      .map((c) => {
        const code = c.cca3 ? c.cca3.toLowerCase() : "";
        return `
        <article class="card">
          <img src="${c.flags.svg}" alt="Flag of ${c.name.common}" loading="lazy">
          <div>
            <h3>
              ${code 
                ? `<a href="./country.html?code=${code}">${c.name.common}</a>` 
                : `${c.name.common}`
              }
            </h3>
            <p>Capital: ${c.capital ? c.capital[0] : "N/A"}</p>
            <p>Population: ${c.population.toLocaleString()}</p>
          </div>
        </article>
      `;
      })
      .join("");

  } catch (err) {
    console.error(err);
    resultsEl.innerHTML = `<p style="padding:1rem">No results or API error.</p>`;
  }
}
