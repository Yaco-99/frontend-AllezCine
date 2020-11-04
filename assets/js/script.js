const url =
    "https://api.themoviedb.org/3/search/movie?api_key=064a095d09fe3dff6f8350dae42af935&query=movie",
  api_key = "064a095d09fe3dff6f8350dae42af935",
  img_url = "https://image.tmdb.org/t/p/w500";
let movies;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    movies = data.results;
  })
  .catch((error) => {
    console.log(error);
  });

console.log(movies);
