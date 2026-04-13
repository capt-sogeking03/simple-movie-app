import { API_KEY, endpoints } from "./config.js";

async function getMovies() {
  try {
    // Send GET Request for bunch of movies
    const requests = endpoints.map((url) => fetch(url));

    const responses = await Promise.all(requests);

    const movies = await Promise.all(
      responses.map((res) => {
        if (!res.ok) throw new Error(`Http error! status: ${res.status}`);
        return res.json();
      }),
    );

    createMoviesGrid(movies);

    console.log(responses);
  } catch (err) {
    console.error("Error", err);
  }
}

function createMoviesGrid(movies) {
  const movieContainer = document.getElementById("movie-container");

  movieContainer.replaceChildren();

  movies.forEach(async (movie) => {
    const movieMetadata = {
      title: movie.Title,
      year: movie.Year,
      rating: movie.imdbRating,
      poster: movie.Poster,
    };

    const card = await createMovieCard(movieMetadata);

    // console.log(movie.Poster);

    movieContainer.append(card);
  });
}

async function createMovieCard(metadata) {
  const article = document.createElement("article");
  const img = document.createElement("img");
  const pTitle = document.createElement("p");
  const pYear = document.createElement("p");
  const pRating = document.createElement("p");
  const div = document.createElement("div");

  pTitle.textContent = metadata.title;
  pYear.textContent = metadata.year;
  pRating.textContent = metadata.rating;
  img.src = metadata.poster;

  div.append(pYear, pRating);

  article.append(img, pTitle, div);
  article.classList.add("c-movie-card");

  return article;
}

getMovies();
