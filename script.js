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

    console.log(movies);
  } catch (err) {
    console.error("Error", err);
  }
}

function createMoviesGrid(movies) {
  const movieContainer = document.querySelector("#movie-container");

  movieContainer.replaceChildren();

  // create movie card
  movies.forEach((movie) => {
    const movieMetadata = {
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      rating: movie.imdbRating,
      poster: movie.Poster,
    };

    const card = createMovieCard(movieMetadata);

    movieContainer.append(card);
  });

  // add event for detail screen
  movieContainer.addEventListener("click", (e) => navigateToDetails(e));
}

const navigateToDetails = async (e) => {
  const container = document.querySelector("#movie-container");
  // const root = document.querySelector("#root");

  // pick specific movie card
  const currentCard = e.target.closest(".c-movie-card");
  if (currentCard && container.contains(currentCard)) {
    const detailScreen = document.querySelector("#movie-detail-screen");

    detailScreen.classList.remove("u-display--none");

    const movieId = currentCard.dataset.id;

    const movie = await getMovieDetail(movieId);

    console.log(movie);

    renderMovieDetail(detailScreen, movie);

    // When entering detail screen
    history.pushState({ page: "details", id: movieId }, "", `#/movie/${movieId}`);
  }
};

function renderMovieDetail(detailScreen, movie) {
  detailScreen.innerHTML = `
      <div class="c-detail--container">
          <img src=${movie.Poster} alt="img" />
          <div class="c-detail--highlight">
            <p class="movie-detail--title">${movie.Title}</p>
            <p class="movie-detail--year">${movie.Year}</p>
            <p class="movie-detail--rating">${movie.imdbRating}</p>
          </div>
        </div>
    `;

  detailScreen.addEventListener("click", (e) => {
    if (!e.target.closest("img")) {
      window.history.back();
    }
  });
}

const getMovieDetail = async (id) => {
  try {
    const url = `http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const movie = await response.json();

    return movie;
  } catch (err) {
    console.error("failed to fetch movie\n", err);
  }
};

function createMovieCard(metadata) {
  const card = document.createElement("article");

  card.setAttribute("data-id", metadata.id);
  card.innerHTML = `
    <img src="${metadata.poster}" alt="${metadata.title}">
    <p>${metadata.title}</p>
    <div>
      <p>${metadata.year}</p>
      <p>${metadata.rating}</p>
    </div>
  `;
  card.classList.add("c-movie-card");

  return card;
}

window.addEventListener("popstate", (event) => {
  if (!event.state || event.state.page !== "details") {
    const detailScreen = document.querySelector("#movie-detail-screen");

    detailScreen.classList.add("u-display--none");
  }
});

getMovies();
