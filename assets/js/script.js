document.addEventListener("DOMContentLoaded", async () => {
  const url =
      "https://api.themoviedb.org/3/movie/top_rated?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US",
    api_key = "064a095d09fe3dff6f8350dae42af935",
    img_url = "https://image.tmdb.org/t/p/w500",
    overlay = document.getElementById("overlay"),
    closeModalButton = document.getElementById("close-modal-button"),
    moreButton = document.getElementById("moreButton"),
    genreButtons = document.querySelectorAll(".genreButton");

  let latestMovies = latestMovieFetch(),
    cardMovies = cardMoviesFetch(),
    chosenFiltre = "",
    page = 1,
    max = 20;

  overlay.addEventListener("click", () => {
    const modal = document.querySelector(".trailerModal.active");
    closeModal(modal);
  });

  closeModalButton.addEventListener("click", () => {
    closeModal(modal);
  });

  genreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("featuredMoviesTarget").innerHTML = ``;
      chosenFiltre = button.id;
      featureMovie(page, max, chosenFiltre);
    });
  });

  document.getElementById("moreButton").addEventListener("click", () => {
    document.getElementById("featuredMoviesTarget").innerHTML = ``;
    if (moreButton.innerHTML == "PLUS DE FILMS") {
      moreButton.innerHTML = "MOINS";
      page = 2;
      max = 40;
    } else {
      moreButton.innerHTML = "PLUS DE FILMS";
      page = 1;
      max = 20;
    }
    featureMovie(page, max, chosenFiltre);
  });

  function closeModal(modal) {
    if (modal == null) return;
    document.getElementById("actor").innerHTML = ``;
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
          <button class="stage-button">WATCH TRAILER</button>
        </div>
      </div>`;
      //add trailer here
      carousel.appendChild(newMovie);
    }
    document.getElementById("carouselFilmProposition").appendChild(carousel);
  }

  function movieCard(data, max, target) {
    let count = 0,
      movieGenre;
    for (let i = 0; i < max; i++) {
      genres.map((el) =>
        el.id == data[i].genre_ids[0] ? (movieGenre = el.name) : "no"
      );
      const newCard = document.createElement("div");
      newCard.classList.add("card", "filmSection");
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
      document.getElementById(target).appendChild(newCard);
      newCard.addEventListener("click", () => {
        trailer(data[i]);
      });
    }
    console.log("count : " + count + " temp " + temp);
    count >= temp - 1 ? "ok" : featureMovie(page++, max, chosenFiltre);
  }

  function trailer(movieData) {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        const trailerId = data.results[0].key;
        showTrailer(trailerId, movieData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function showTrailer(id, info) {
    console.log(info);
    const link = `youtube.com/embed/${id}`;
    document.getElementById("modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");
    document.getElementById("trailerTitle").innerHTML = info.original_title;
    document.getElementById("trailerTarget").src = link;
    document.getElementById("overview").innerHTML = info.overview;
    document.getElementById("date").innerHTML = info.release_date;
    fetch(
      `https://api.themoviedb.org/3/movie/${info.id}/credits?api_key=064a095d09fe3dff6f8350dae42af935`
    )
      .then((res) => res.json())
      .then((data) => {
        document.getElementById(
          "real"
        ).innerHTML = `writter : ${data.crew[0].name}`;
        for (let i = 0; i < 3; i++) {
          const newActor = document.createElement("li");
          newActor.innerHTML = `In the role of ${data.cast[i].character} : ${data.cast[i].name}`;
          document.getElementById("actor").appendChild(newActor);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function latestMovieFetch() {
    const promiseLatest = new Promise((succes) => {
      fetch(
        "https://api.themoviedb.org/3/movie/now_playing?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US&page=1"
      )
        .then((res) => res.json())
        .then((data) => {
          latestMovies = data.results;
          latestMovie(latestMovies);
          succes("over");
        })
        .catch((error) => {
          console.log(error);
        });
    });
    await promiseLatest;
    return latestMovies;
  }

  async function cardMoviesFetch() {
    const promiseCard = new Promise((succes) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const movies = data.results;
          movieCard(movies, 5, "movieCardTarget");
          succes("over");
        })
        .catch((error) => {
          console.log(error);
        });
    });
    await promiseCard;
    return latestMovies;
  }

  featureMovie(1, max, chosenFiltre);

  function featureMovie(page, max, filter) {
    for (let i = 1; i <= page; i++) {
      fetch(
        `http://api.themoviedb.org/3/discover/movie?api_key=064a095d09fe3dff6f8350dae42af935&sort_by=popularity.desc&with_genres=${filter}&page=${i}`
      )
        .then((res) => res.json())
        .then((data) => {
          const movies = data.results;
          movieCard(movies, max, "featuredMoviesTarget");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
});
