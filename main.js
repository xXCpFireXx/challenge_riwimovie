const apiKey = import.meta.env.VITE_MOVIES_API;

console.log(apiKey)

document.getElementById("searchButton").addEventListener("click", (e) => {
  searchMovie();
});

const inputSearchMovie = document.getElementById("movieName");
inputSearchMovie.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    searchMovie();
  }
});

async function searchMovie() {
  const movieName = document.getElementById("movieName").value.trim();

  if (!movieName) {
    alert("Please enter a movie name");
    return;
  }

  const urlSearch = `http://www.omdbapi.com/?s=${movieName}&type=movie&apikey=${apiKey}`;

  try {
    const response = await fetch(urlSearch);
    const data = await response.json();

    if (data.Response === "False") {
      alert("Movie not found");
      return;
    }

    // Limpiar cualquier resultado anterior
    const resultsContainer = document.getElementById("movieResults");
    resultsContainer.innerHTML = ""; // Limpiar antes de agregar nuevos resultados

    // Iterar sobre el array 'Search' y agregar los resultados
    data.Search.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie-item");

      movieElement.innerHTML = `
                <h3>${movie.Title} (${movie.Year})</h3>
                <img src="${
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/200x300?text=No+Poster"
                }" alt="${movie.Title} Poster" />
                <p><strong>Year:</strong> ${movie.Year}</p>
            `;

      // Añadir evento para abrir el modal
      movieElement.addEventListener("click", () => openModal(movie));

      resultsContainer.appendChild(movieElement); // Añadir cada película al contenedor
    });

    document.getElementById("movieName").value = "";
  } catch (error) {
    console.error("Error getting movie details:", error);
    alert("There was a problem getting the movie details");
  }
}

// Función para abrir el modal con los detalles de la película seleccionada
// Mostrar el modal
async function openModal(movie) {
  // Obtén los elementos del modal
  const modal = document.getElementById("movieModal");
  const modalContent = document.querySelector(".modal-content");
  const closeBtn = document.querySelector(".close");
  const movieTitle = movie.Title;

  const urlGetMovieInfo = `http://www.omdbapi.com/?t=${movieTitle}&type=movie&apikey=${apiKey}`;

  try {
    const response = await fetch(urlGetMovieInfo);
    const data = await response.json();

    if (data.Response === "False") {
      alert("Movie not found");
      return;
    }

    // Asignar los datos de la película al modal
    document.getElementById("modalMoviePoster").src = movie.Poster;
    document.getElementById("modalMovieTitle").innerText = movie.Title;
    document.getElementById("modalMovieYear").innerText = `Released: ${data.Released}`;
    document.getElementById('modalMoviePlot').innerText = `${data.Plot}`;
    document.getElementById('modalMovieGenre').innerText = `Genre: ${data.Genre}`;

    // Mostrar el modal
    modal.style.display = "flex";

    // Cerrar el modal cuando se hace clic en el botón de cierre (X)
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };

    // Cerrar el modal si se hace clic fuera del contenido del modal
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  } catch (error) {
    console.error("Error getting movie details:", error);
    alert("There was a problem getting the movie details");
  }
}
