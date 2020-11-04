const url =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US",
  api_key = "064a095d09fe3dff6f8350dae42af935",
  img_url = "https://image.tmdb.org/t/p/w500",
  overlay = document.getElementById("overlay"),
  closeModalButton = document.getElementById("close-modal-button");

overlay.addEventListener("click", () => {
  const modal = document.querySelector(".trailerModal.active");
  console.log(modal);
  closeModal(modal);
});

closeModalButton.addEventListener("click", () => {
  closeModal(modal);
});

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function latestMovie(latest) {
  const carousel = document.createElement("div");
  carousel.classList.add("carousel-inner");
  for (let i = 0; i < 3; i++) {
    const newMovie = document.createElement("div");
    newMovie.classList.add("carousel-item");
    i == 0 ? newMovie.classList.add("active") : "no";
    newMovie.innerHTML = `
        <img src="${img_url}${latest[i].poster_path}" class="d-block w-100" alt="poster">
        <div class="carousel-caption d-none d-md-block">
          <div class="carousel-element">
          <h1>
            LATEST <span class="mainTitleSpan">ON</span>LINE
            <span class="mainTitleSpan">MO</span>VIES
          </h1>
          <p>${latest[i].original_title}.</p>
          <button class="stage-button" onclick="trailer(${latest[i].id}, '${latest[i].original_title}')">WATCH TRAILER</button>
        </div>
      </div>`;
    carousel.appendChild(newMovie);
  }
  document.getElementById("carouselFilmProposition").appendChild(carousel);
}

function movieCard(data) {
  let movieGenre;
  for (let i = 0; i < 5; i++) {
    genres.map((el) =>
      el.id == data[i].genre_ids[0] ? (movieGenre = el.name) : "no"
    );
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.style.width = "12rem";
    newCard.innerHTML = `
    <img src="${img_url}${data[i].poster_path}" class="card-img-top" alt="poster">
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title text-center">${data[i].original_title}</h5>
      <div class="d-flex justify-content-between">
      <p class="card-text m-0">${data[i].release_date}</p>
      <p class="m-0">${movieGenre}</p>
      </div>
    </div>`;
    document.getElementById("movieCardTarget").appendChild(newCard);
  }
}

function showTrailer(id, title) {
  const link = `youtube.com/embed/${id}`;
  document.getElementById("modal").classList.add("active");
  document.getElementById("overlay").classList.add("active");
  document.getElementById("trailerTitle").innerHTML = title;
  document.getElementById("trailerTarget").src = link;
}

fetch(
  "https://api.themoviedb.org/3/movie/now_playing?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US&page=1"
)
  .then((res) => res.json())
  .then((data) => {
    const movies = data.results;
    latestMovie(movies);
  })
  .catch((error) => {
    console.log(error);
  });

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const movies = data.results;
    movieCard(movies);
  })
  .catch((error) => {
    console.log(error);
  });

function trailer(movieId, title) {
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US`
  )
    .then((res) => res.json())
    .then((data) => {
      const trailerId = data.results[0].key;
      showTrailer(trailerId, title);
    })
    .catch((error) => {
      console.log(error);
    });
}
