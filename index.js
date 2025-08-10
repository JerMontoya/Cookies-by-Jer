// https://cookie-api-cljq.onrender.com/

const API_URL = "https://cookie-api-cljq.onrender.com/recipes";
const MAX_RESULTS = 6;

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim().toLowerCase();
  if (!query) {
    clearResults();
    statusEl.textContent = "Please enter a search term.";
    return;
  }

  statusEl.textContent = "Searching...";
  try {
    const cookies = await fetchCookies();
    const filtered = cookies.filter(c =>
      c.name.toLowerCase().includes(query)
    );
    if (!filtered.length) {
      statusEl.textContent = "No results found.";
      clearResults();
      return;
    }
    renderResults(filtered.slice(0, MAX_RESULTS));
    statusEl.textContent = `Showing ${Math.min(filtered.length, MAX_RESULTS)} of ${filtered.length} result(s).`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error fetching data.";
  }
});

async function fetchCookies() {
  const resp = await fetch(API_URL);
  if (!resp.ok) throw new Error(`HTTP error: ${resp.status}`);
  return await resp.json();
}

function renderResults(items) {
  resultsEl.innerHTML = items
    .map(c => `
      <li>
        <h3>${escapeHtml(c.name)}</h3>
        <p><strong>Ingredients:</strong> ${escapeHtml(c.ingredients)}</p>
        <p><strong>Instructions:</strong> ${escapeHtml(c.instructions)}</p>
      </li>
    `)
    .join("");
}

function clearResults() {
  resultsEl.innerHTML = "";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

