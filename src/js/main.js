'use strict';

// Global variables
const searchInput = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_searchBtn');
const resetBtn = document.querySelector('.js_resetBtn');
const movieList = document.querySelector('.js_movieList');

// Fetch
let dataAnime = [];
let favMovies = [];

function findMovie() {
  const inputValue = searchInput.value;
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputValue}`)
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

function renderAnimeList() {
  // If everything goes right, then movies should show in the list
  movieList.innerHTML = '';

  for (const eachAnime of dataAnime) {
    // console.log(eachAnime.mal_id);

    movieList.innerHTML += `<li class="js_listElement">
    <img src=${eachAnime.image_url} alt="Cover image" class="cover-img">
    <h2>${eachAnime.title}</h2></li>`;
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
  const allListElements = document.querySelectorAll('.js_listElement');

  for (const eachLi of allListElements) {
    eachLi.addEventListener('click', handleClickFavorite);
  }
}

function handleClickFavorite(ev) {
  // Pushing favorite movies into new array
  favMovies.push(ev.currentTarget);

  console.log(favMovies);
}

// Listening to user search
searchBtn.addEventListener('click', handleClickSearch);
