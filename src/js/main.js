'use strict';

// Variables globales
const searchInput = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_searchBtn');
const resetBtn = document.querySelector('.js_resetBtn');
const movieList = document.querySelector('.js_movieList');

// Fetch al API
let dataAnime = [];
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
  movieList.innerHTML = '';

  for (const eachAnime of dataAnime) {
    movieList.innerHTML += `<li>
    <img src=${eachAnime.image_url} alt="Cover image" class="cover-img">
    <h2>${eachAnime.title}</h2></li>`;
  }
  setPlaceholder();
}

// function setPlaceholder() {
//   const coverImgs = document.querySelectorAll('.cover-img');

//   for (const eachImg of coverImgs) {
//     eachImg.src = '';
//     console.log(eachImg.src);

//     if (eachImg.src === '') {
//       console.log(eachImg);
//       eachImg.src =
//         'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
//     }
//   }
// }

function renderMessage() {
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

searchBtn.addEventListener('click', handleClickSearch);
