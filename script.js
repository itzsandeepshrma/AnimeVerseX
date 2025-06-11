const searchInput = document.getElementById("search");
const animeList = document.getElementById("animeList");
const animeModal = document.getElementById("animeModal");
const modalContent = document.getElementById("modalContent");
const recommendContent = document.getElementById("recommendContent");
let topAnimeList = [];

async function loadTopAnime() {
  const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=25");
  const data = await res.json();
  topAnimeList = data.data;
  showRandomRecommendation();
  setInterval(showRandomRecommendation, 5000); // change every 5s
}

function showRandomRecommendation() {
  if (topAnimeList.length === 0) return;
  const random = topAnimeList[Math.floor(Math.random() * topAnimeList.length)];
  recommendContent.innerHTML = `
    <img src="${random.images.jpg.image_url}" alt="${random.title}">
    <h3>${random.title}</h3>
    <p><strong>Rating:</strong> ${random.score || 'N/A'} | <strong>Episodes:</strong> ${random.episodes}</p>
  `;
}

async function searchAnime(query) {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
  const data = await res.json();
  animeList.innerHTML = "";

  data.data.forEach(anime => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <h3>${anime.title}</h3>
      <p>Rating: ${anime.score || 'N/A'} | Episodes: ${anime.episodes}</p>
    `;
    card.addEventListener('click', () => showAnimeDetails(anime));
    animeList.appendChild(card);
  });
}

function showAnimeDetails(anime) {
  modalContent.innerHTML = `
    <h2>${anime.title}</h2>
    <p><strong>Type:</strong> ${anime.type}</p>
    <p><strong>Status:</strong> ${anime.status}</p>
    <p><strong>Episodes:</strong> ${anime.episodes}</p>
    <p><strong>Score:</strong> ${anime.score || 'N/A'}</p>
    <p><strong>Aired:</strong> ${anime.aired.string || 'N/A'}</p>
    <p><strong>Synopsis:</strong> ${anime.synopsis || 'No synopsis available.'}</p>
    ${anime.trailer.embed_url ? `<iframe src="${anime.trailer.embed_url}" frameborder="0" allowfullscreen></iframe>` : ''}
    <button class="close-btn" onclick="animeModal.style.display='none'">Close</button>
  `;
  animeModal.style.display = 'flex';
}

searchInput.addEventListener("keyup", (e) => {
  const query = e.target.value.trim();
  if (query.length > 2) searchAnime(query);
});

window.addEventListener("click", (e) => {
  if (e.target === animeModal) animeModal.style.display = 'none';
});

loadTopAnime();
