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

// Functions
function renderAnimeList() {
  // If everything goes right, movies should show in the list
  movieList.innerHTML = '';

  for (const eachAnime of dataAnime) {
    // Compare 'favorites' and 'results'.
    const storedInFavorites = dataFavorites.filter(
      (dataFav) => dataFav.mal_id === eachAnime.mal_id
    );
    // If a faved element is in results array too, show them with 'faved' class. If not, show it without the class.
    if (storedInFavorites.length !== 0) {
      // Length determines whether an array has content or not (content is the faved object)
      movieList.innerHTML += `<li class="js_resultsLi movie faved" data-id="${eachAnime.mal_id}"><i class="fas fa-star js_star highlighted"></i><img src=${eachAnime.image_url} alt="Cover image of ${eachAnime.title}" class="movie__img highlighted">
        <h3 class="movie__title">${eachAnime.title}</h3>
        </li>`;
    } else {
      movieList.innerHTML += `<li class="js_resultsLi movie" data-id="${eachAnime.mal_id}"><i class="fas fa-star js_star"></i><img src=${eachAnime.image_url} alt="Cover image of ${eachAnime.title}" class="movie__img js_animeTitle">
        <h3 class="movie__title">${eachAnime.title}</h3>
        </li>`;
    }
    // Set a placeholder if the image is a question mark
    // console.log(eachAnime.image_url.includes('qm_50'));
  }
  addFavorite();
}

function renderMessage() {
  // Message displayed in case no results matched the search
  movieList.innerHTML =
    '<p class="error-msg">No hay resultados para esta búsqueda, por favor introduzca otro nombre</p>';
}

function handleClickSearch(ev) {
  // Function that initializes everything the flow
  ev.preventDefault();

  if (searchInput.value === '') {
    movieList.innerHTML =
      '<p class="error-msg">Por favor, introduzca el nombre de la serie</p>';
  } else {
    findMovie();
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
  const animeStar = ev.currentTarget.childNodes[0];
  const animeTitle = ev.currentTarget.childNodes[3];

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
    animeStar.classList.add('highlighted');
    animeTitle.classList.add('highlighted');
    dataFavorites.push(favedAnime);
  } else {
    // 2. If the anime already is in dataFavorites array, it doesn't push again. Instead, it removes the item and removes 'faved' class
    clickedAnime.classList.remove('faved');
    animeStar.classList.remove('highlighted');
    animeTitle.classList.remove('highlighted');
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
    favMovies.innerHTML += `<li class="js_favoritesLi favmovie" data-id="${eachFavorite.mal_id}">
    <img src=${eachFavorite.image_url} alt="Cover image of ${eachFavorite.title}" class="favmovie__img">
    <div class="favmovie-container"><h3 class="favmovie__title">${eachFavorite.title}</h3>
    <p class="favmovie__synopsis">${eachFavorite.synopsis}</p></div>
    <i class="fas fa-times-circle js_closeBtn"></i>
    </li>`;
    // console.log(eachFavorite.image_url.includes('qm_50'));
  }

  if (dataFavorites.length >= 1) {
    favMovies.innerHTML +=
      '<button class="js_deleteAllFavs delete-button"><i class="far fa-trash-alt"></i>Borrar todo</button>';
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

// BONUS - Function to remove search and results
function handleClickReset() {
  searchInput.value = '';
}

resetBtn.addEventListener('click', handleClickReset);

function removeFavorite() {
  const allRemoveBtns = document.querySelectorAll('.js_closeBtn');

  for (const eachRemoveBtn of allRemoveBtns) {
    eachRemoveBtn.addEventListener('click', handleClickRemove);
  }
}

// BONUS - Function to remove a single element from the favorites array
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
  renderAnimeList();
}

// BONUS - Functions to remove all elements from the favorites array
function deleteAllFavorites() {
  const deleteAllFavsBtn = document.querySelector('.js_deleteAllFavs');
  deleteAllFavsBtn.addEventListener('click', handleClickDeleteAllFavs);
}

function handleClickDeleteAllFavs() {
  dataFavorites = [];
  saveInLS();
  renderFavorites();
  renderAnimeList();
}
