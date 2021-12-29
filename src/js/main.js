'use strict';

// Global variables
const searchInput = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_searchBtn');
const resetBtn = document.querySelector('.js_resetBtn');
const movieList = document.querySelector('.js_movieList');
const favMovies = document.querySelector('.js_favMovies');

// Fetch
let dataAnime = [];
let dataFavorites = [];

function findMovie() {
  const inputValue = searchInput.value;
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputValue}&limit=15`)
    .then((response) => response.json())
    .then((data) => {
      dataAnime = data.results;
      if (dataAnime !== undefined) {
        renderAnimeList();
      } else {
        renderMessage();
      }
    });
}

// Functions
function renderAnimeList() {
  // If everything goes right, movies should show in the list
  movieList.innerHTML = '';

  for (const eachAnime of dataAnime) {
    // console.log(eachAnime.mal_id);
    movieList.innerHTML += `<li class="js_resultsLi results-li" data-id="${eachAnime.mal_id}">
    <img src=${eachAnime.image_url} alt="Cover image of ${eachAnime.title}" class="result-img">
    <h3>${eachAnime.title}</h3>
    <i class="far fa-star"></i>
    </li>`;
    // console.log(eachAnime.image_url.includes('qm_50'));
  }
  addFavorite();
}

function renderMessage() {
  // Message displayed in case no results matched the search
  movieList.innerHTML =
    'No hay resultados para esta búsqueda, por favor introduzca otro nombre';
}

function handleClickSearch(ev) {
  ev.preventDefault();

  if (searchInput.value === '') {
    movieList.innerHTML = 'Por favor, introduzca el nombre de la serie';
  } else {
    findMovie();
    renderAnimeList();
  }
}

function addFavorite() {
  // Selecting favorite movies
  const allListElements = document.querySelectorAll('.js_resultsLi');

  for (const eachLi of allListElements) {
    eachLi.addEventListener('click', handleClickFavorite);
  }
}

function handleClickFavorite(ev) {
  const clickedAnime = ev.currentTarget;

  // Finding the anime I'm clicking on in my dataAnime array through data-ID
  const clickedAnimeId = parseInt(ev.currentTarget.dataset.id);

  clickedAnime.classList.add('faved');
  const favedAnime = dataAnime.find(
    (eachResult) => eachResult.mal_id === clickedAnimeId
  );
  const savedAnime = dataFavorites.find(
    (eachFaved) => eachFaved.mal_id === clickedAnimeId
  );

  if (savedAnime === undefined) {
    // If the anime is NOT in dataFavorites array, push into dataFavorites array
    dataFavorites.push(favedAnime);
  }
  // If the anime already is in dataFavorites array, nothing happens
  renderFavorites();
}

function renderFavorites() {
  // If everything goes right, favorite movies should show in the list
  favMovies.innerHTML = '';

  for (const eachFavorite of dataFavorites) {
    favMovies.innerHTML += `<li class="js_favoritesLi favorites-li">
    <img src=${eachFavorite.image_url} alt="Cover image of ${eachFavorite.title}" class="faved-img">
    <h3>${eachFavorite.title}</h3>
    <i class="far fa-star"></i>
    <i class="far fa-times-circle"></i>
    </li>`;
    // console.log(eachFavorite.image_url.includes('qm_50'));
  }
}

// Listening to user search
searchBtn.addEventListener('click', handleClickSearch);
