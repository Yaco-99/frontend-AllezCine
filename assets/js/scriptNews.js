const img_url = "https://image.tmdb.org/t/p/w500";

function movieCard(data, max, target) {
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
  }
}

latestMovieFetch();

function latestMovieFetch() {
  fetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=064a095d09fe3dff6f8350dae42af935&language=en-US&page=1"
  )
    .then((res) => res.json())
    .then((data) => {
      latestMovies = data.results;
      movieCard(latestMovies, 10, "featuredMoviesTarget");
    })
    .catch((error) => {
      console.log(error);
    });
}
