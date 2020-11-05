document.addEventListener("DOMContentLoaded", async () => {
  const url =
      "https://api.themoviedb.org/3/movie/top_rated?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US",
    api_key = "064a095d09fe3dff6f8350dae42af935",
    img_url = "https://image.tmdb.org/t/p/w500",
    overlay = document.getElementById("overlay"),
    moreButton = document.getElementById("moreButton"),
    genreButtons = document.querySelectorAll(".genreButton");

  let chosenFiltre = "",
    page = 1,
    max = 20,
    shopArray = [],
    shopIndex = 0;
  latestMovieFetch(),
    cardMoviesFetch(5, "movieCardTarget"),
    overlay.addEventListener("click", () => {
      const modal = document.querySelector(".modalSelect.active");
      closeModal(modal);
    });

  openModal(document.getElementById("cookieModal"));

  document.getElementById("sendButton").addEventListener("click", () => {
    const firstName = document.getElementById("firstName").value,
      lastName = document.getElementById("lastName").value,
      email = document.getElementById("mail").value,
      subject = document.getElementById("subject").value,
      message = document.getElementById("message").value;
    window.confirm(
      `
       first name : ${firstName} 
       lastName : ${lastName} 
       email : ${email} 
       subject : ${subject} 
       message : ${message}
       Confirm ?`
    );
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

  window.onscroll = function (ev) {
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight
      ? displayUP()
      : "no";
  };

  function displayUP() {
    const btn = document.createElement("div");
    btn.classList.add("UP-button");
    btn.innerHTML = `<button type="button" class="inner-button id="goingUp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
    </svg>
  </button>`;
    document.body.appendChild(btn);
    btn.addEventListener("click", () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.removeChild(btn);
    });
  }

  function closeModal(modal) {
    if (modal == null) return;
    document.getElementById("actor").innerHTML = ``;
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }

  function openModal(modal) {
    modal.classList.add("active");
    overlay.classList.add("active");
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
          <button class="stage-button"">WATCH TRAILER</button>
        </div>
      </div>`;
      carousel.appendChild(newMovie);
    }
    document.getElementById("carouselFilmProposition").appendChild(carousel);
  }

  function movieCard(data, max, target) {
    const closeModalButton = document.querySelectorAll("[data-close-modal]"),
      openModalButton = document.querySelectorAll("[data-modal-target]");
    let movieGenre;
    for (let i = 0; i < max; i++) {
      target == "shop" ? shopArray.push(data[i]) : "no";
      genres.map((el) =>
        el.id == data[i].genre_ids[0] ? (movieGenre = el.name) : "no"
      );
      const newCard = document.createElement("div");
      newCard.classList.add("card", "filmSection");
      newCard.setAttribute("data-modal-target", "#modal");
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

    displayShop(shopArray, shopIndex);

    document.getElementById("shopPrevious").addEventListener("click", (e) => {
      shopIndex--;
      shopIndex == -1 ? (shopIndex = 7) : "ok";
      displayShop(shopArray, shopIndex);
      e.stopPropagation();
      e.preventDefault();
    });

    document.getElementById("shopNext").addEventListener("click", (e) => {
      shopIndex++;
      shopIndex == 8 ? (shopIndex = 0) : "ok";
      displayShop(shopArray, shopIndex);
      e.stopPropagation();
      e.preventDefault();
    });

    openModalButton.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        openModal(modal);
      });
    });

    closeModalButton.forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modalSelect");
        closeModal(modal);
      });
    });
  }

  function displayShop(arr, index) {
    let genreArr = [];
    genres.map((el) => {
      arr[index].genre_ids.map((ids) => {
        el.id == ids ? genreArr.push(el.name) : "no";
      });
    });
    document.getElementById(
      "shopImg"
    ).src = `${img_url}${arr[index].poster_path}`;
    document.getElementById("ShopMovieTitle").innerHTML =
      arr[index].original_title;
    document.getElementById("shopStoryLine").innerHTML = arr[index].overview;
    document.getElementById("shopDate").innerHTML = arr[index].release_date;
    document.getElementById("shopGenre").innerHTML = genreArr.join(" | ");
    document.getElementById("shopPrice").innerHTML = "18";
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
    const link = `https://youtube.com/embed/${id}`;
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

  function latestMoviesList(list) {
    for (let i = 0; i < 4; i++) {
      const newElement = document.createElement("li");
      newElement.classList.add("movieList");
      newElement.innerHTML = `<img src="${img_url}${list[i].poster_path}" alt="movie"><p class="ml-2">${list[i].original_title}</p>`;
      document.getElementById("listTarget").appendChild(newElement);
    }
  }

  function latestMovieFetch() {
    fetch(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US&page=1"
    )
      .then((res) => res.json())
      .then((data) => {
        latestMovies = data.results;
        latestMovie(latestMovies);
        latestMoviesList(latestMovies);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  cardMoviesFetch(8, "shop");

  function cardMoviesFetch(max, target) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const movies = data.results;
        movieCard(movies, max, target);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  featureMovie(1, max, chosenFiltre);

  function featureMovie(page, max, filter) {
    for (let i = 1; i <= page; i++) {
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=064a095d09fe3dff6f8350dae42af935&sort_by=popularity.desc&with_genres=${filter}&page=${i}`
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
