// src/js/favorites.mjs
import { storage } from "./storage.mjs";
import { toggleThemeInit } from "./ui.mjs";


const favsContainer = document.getElementById("favorites-list");

toggleThemeInit();

async function loadFavorites() {
  const favCodes = storage.get("favs", []);

  if (!favCodes.length) {
    favsContainer.innerHTML = "<p>You have no favorite countries yet.</p>";
    return;
  }

  try {
    // Fetch all countries in one request
    const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${favCodes.join(",")}`);
    if (!res.ok) throw new Error("Failed to load favorite countries");
    const countries = await res.json();

    favsContainer.innerHTML = countries
      .map(
        (country) => `
        <div class="card">
          <img src="${country.flags.svg}" alt="${country.name.common} flag">
          <div class="card-content">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <a href="/country.html?code=${country.cca3}">View Details</a>
            <button class="remove-fav" data-code="${country.cca3}">Remove</button>
          </div>
        </div>
      `
      )
      .join("");

    // Attach remove button handlers
    document.querySelectorAll(".remove-fav").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const code = e.target.getAttribute("data-code");
        const updatedFavs = storage.get("favs", []).filter((c) => c !== code);
        storage.set("favs", updatedFavs);
        loadFavorites(); // reload the list
      });
    });
  } catch (err) {
    favsContainer.innerHTML = `<p>Error loading favorites: ${err.message}</p>`;
    console.error(err);
  }
}

loadFavorites();
