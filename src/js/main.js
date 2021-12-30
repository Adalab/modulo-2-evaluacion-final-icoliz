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

  // Make faved series in the 'Resultados' article appear with class 'faved
  // for (let indexResult = 0; indexResult < dataAnime.length; indexResult++) {
  //   const eachResultId = dataAnime[indexResult].mal_id;

  //   for (const eachFavorite of dataFavorites) {
  //     if (eachFavorite.mal_id === eachResultId) {
  //       console.log(dataAnime[indexResult]);
  //     }
  //   }
  // const comparedArrs = dataFavorites.find(
  //   (eachFavorite) => eachFavorite.mal_id === eachResultId
  // );
  // console.log(comparedArrs);
  // }

  for (const eachAnime of dataAnime) {
    // console.log(eachAnime.mal_id);
    movieList.innerHTML += `<li class="js_resultsLi results-li" data-id="${eachAnime.mal_id}">
    <img src=${eachAnime.image_url} alt="Cover image of ${eachAnime.title}" class="result-img">
    <h3>${eachAnime.title}</h3>
    <i class="fas fa-star"></i>
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
  // Function that initializes everything the flow
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
  // Finding the anime I'm clicking on in my dataAnime array through data-ID
  const clickedAnime = ev.currentTarget;
  const clickedAnimeId = parseInt(ev.currentTarget.dataset.id);

  const favedAnime = dataAnime.find(
    (eachResult) => eachResult.mal_id === clickedAnimeId
  );
  const savedAnime = dataFavorites.find(
    (eachFaved) => eachFaved.mal_id === clickedAnimeId
  );

  // When we select an anime, it changes color and class. Then before adding to dataFavorites we verify:
  if (savedAnime === undefined) {
    // 1. If the anime is NOT in dataFavorites array, push into dataFavorites array
    clickedAnime.classList.add('faved');
    dataFavorites.push(favedAnime);
  } else {
    // 2. If the anime already is in dataFavorites array, it doesn't push again. Instead, it removes the item and removes 'faved' class
    clickedAnime.classList.remove('faved');
    const removeAnimeIndex = dataFavorites.indexOf(savedAnime);
    dataFavorites.splice(removeAnimeIndex, 1);
  }

  saveInLS();
  renderFavorites();
}

function renderFavorites() {
  // If everything goes right, favorite movies should show in the list
  favMovies.innerHTML = '';

  for (const eachFavorite of dataFavorites) {
    favMovies.innerHTML += `<li class="js_favoritesLi favorites-li" data-id="${eachFavorite.mal_id}">
    <img src=${eachFavorite.image_url} alt="Cover image of ${eachFavorite.title}" class="faved-img">
    <h3>${eachFavorite.title}</h3>
    <i class="fas fa-star"></i>
    <i class="fas fa-times-circle js_closeBtn"></i>
    </li>`;
    // console.log(eachFavorite.image_url.includes('qm_50'));
  }

  if (dataFavorites.length >= 1) {
    favMovies.innerHTML +=
      '<button class="js_deleteAllFavs">Delete All Favorites</button>';
    deleteAllFavorites();
  }
  removeFavorite();
}

// Listening to user search
searchBtn.addEventListener('click', handleClickSearch);

// Local Storage
function saveInLS() {
  const dataFavObject = JSON.stringify(dataFavorites);
  localStorage.setItem('favMovies', dataFavObject);
}

function getFromLS() {
  const savedFavObject = localStorage.getItem('favMovies');
  if (savedFavObject !== null) {
    dataFavorites = JSON.parse(savedFavObject);
  }
  renderFavorites();
}

getFromLS();

// BONUS: Reset button
function handleClickReset() {
  searchInput.value = '';
}

resetBtn.addEventListener('click', handleClickReset);

// BONUS: Remove favorite from list

function removeFavorite() {
  const allRemoveBtns = document.querySelectorAll('.js_closeBtn');

  for (const eachRemoveBtn of allRemoveBtns) {
    eachRemoveBtn.addEventListener('click', handleClickRemove);
  }
}

function handleClickRemove(ev) {
  const selectedFavElementId = parseInt(
    ev.currentTarget.parentElement.dataset.id
  );

  const foundAnime = dataFavorites.find(
    (eachAnime) => eachAnime.mal_id === selectedFavElementId
  );

  const foundAnimeIndex = dataFavorites.indexOf(foundAnime);

  dataFavorites.splice(foundAnimeIndex, 1);
  saveInLS();
  renderFavorites();
}

function deleteAllFavorites() {
  const deleteAllFavsBtn = document.querySelector('.js_deleteAllFavs');
  deleteAllFavsBtn.addEventListener('click', handleClickDeleteAllFavs);
}

function handleClickDeleteAllFavs() {
  dataFavorites = [];
  saveInLS();
  renderFavorites();
}
