// Data
langChooser.value = chosenLanguage()
function chosenLanguage(){
    const localLang = localStorage.getItem('language');
    let langChosen;
    if (localLang) {
        langChosen = localLang;
    } else {
        langChosen = 0;
    }
    return langChosen
}

const langs =  [
    {lang: 'es',
      captions:
      {
        trends: 'Tendencias',
        category: 'Categorias',
        likedTitle: 'Peliculas Favoritas',
        relatedMovie: 'Películas Relacionadas',
        trendMore: 'Ver Más',
        footerCaption: 'Hecho con amor en Platzi por @waltllanos',
        selectLang : 'Seleccione Idioma',
        search: 'Buscar',
      }
    },
    {lang: 'en',
      captions:
      { trends: 'Trends',
        category: 'Categories',
        likedTitle: 'Favorite Movies',
        relatedMovie: 'Related Movies',
        trendMore: 'More',
        footerCaption: 'Made with love in Platzi by @waltllanos',
        selectLang : 'Select a language',
        search: 'Search',
      }
    },
    {lang: 'pt',
      captions:
      { trends: 'Tendências',
        category: 'Categorias',
        likedTitle: 'Filmes Favoritos',
        relatedMovie: 'Filmes Relacionados',
        trendMore: 'Ver mais',
        footerCaption: 'Feito com amor em Platzi por @waltllanos',
        selectLang : 'Selecione um idioma',
        search: 'Procurar',
      }
    },
    {lang: 'fr',
      captions:
      { trends: 'Les tendances',
        category: 'Catégories',
        likedTitle: 'voir plus',
        relatedMovie: 'Films connexes',
        trendMore: 'Mehr sehen',
        footerCaption: 'Fait avec amour à Platzi par @waltllanos',
        selectLang : 'Sélectionnez une langue',
        search: 'Chercher',
      }
    },
  ]

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: { "Content-Type": "application/json;charset=UTF-8" },
  params: { api_key: API_KEY, language: langs[chosenLanguage()].lang },
});

function chooseLanguage(langNum) {
    localStorage.setItem('language', langNum);
    console.log('New Language ' + langNum);
    location.reload();
}

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if (item) {
        movies = item;
    } else {
        movies = {};
    }
    return movies
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();
    console.log(likedMovies)
    if (likedMovies[movie.id]) {
        console.log('Existe en Local');
        likedMovies[movie.id] = undefined;
    } else {
        console.log('No existe en Local');
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))
    if (location.hash.startsWith('#home') || !location.hash) {
        homePage();
    }
}

// Helpers

let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute("img-data");
            entry.target.setAttribute("src",url);
            entry.target.removeAttribute("img-data");
            observer.unobserve(entry.target); 
        } 
    });
});
    
function createMovies(
    movies, 
    container, 
    {
        lazyLoad = false, 
        clean = true
    } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.addEventListener("click", () => {
        location.hash = `#movie=${movie.id}`;
      });
    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-btn');

    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
    movieBtn.addEventListener('click', () => {
        movieBtn.classList.toggle('movie-btn--liked');
        likeMovie(movie);
    });
    
    if (movie.poster_path != null ){
        movieImg.setAttribute(
            lazyLoad ? "img-data" : "src",
            `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
        );
        if (lazyLoad) {
            observer.observe(movieImg);
        }
    } else {
        movieImg.setAttribute(
            lazyLoad ? "img-data" : "src",
            `https://thumbs.dreamstime.com/b/error-d-people-upset-metaphor-43976249.jpg`
        );
            if (lazyLoad) {
                observer.observe(movieImg);
            }
        }
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
}
function createCategories(categories, container) {
  (container.innerHTML = ""),
    categories.forEach((category) => {
      const categoryContainer = document.createElement("div");
      categoryContainer.classList.add("category-container");

      const categoryTitle = document.createElement("h3");
      categoryTitle.classList.add("category-title");
      categoryTitle.setAttribute("id", "id" + category.id);
      categoryTitle.addEventListener("click", () => {
        location.hash = `#category=${category.id}-${category.name}`;
      });
      const categoryTitleText = document.createTextNode(category.name);

      categoryTitle.appendChild(categoryTitleText);
      categoryContainer.appendChild(categoryTitle);
      container.appendChild(categoryContainer);
    });
}

// API Calls
async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  createMovies(movies, trendingMoviesPreviewList, true);
}

async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;
  console.log(maxPage);

  createMovies(movies, genericSection, {lazyLoad: true, clean: true});
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
            scrollTop, 
            scrollHeight, 
            clientHeight
        } = document.documentElement;
    
        const scrollIsBottom = (clientHeight + scrollTop) >= (scrollHeight -15)
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api("discover/movie", {
                params: {
                    with_genres: id,
                    page,
                },
              });
            const movies = data.results;
            createMovies(movies, genericSection, {lazyLoad: true, clean: false});
        }
    }
}

async function getMoviesBySearch(query) {
    const { data } = await api("search/movie", {
        params: {
          query,
        },
      });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);
    createMovies(movies, genericSection, {lazyLoad: true, clean: true});
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop, 
            scrollHeight, 
            clientHeight
        } = document.documentElement;
    
        const scrollIsBottom = (clientHeight + scrollTop) >= (scrollHeight -15)
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api("search/movie", {
                params: {
                  query,
                  page,
                },
              });
            const movies = data.results;
            createMovies(movies, genericSection, {lazyLoad: true, clean: false});
        }
    }
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  console.log(data.total_pages);
  maxPage = data.total_pages;
  console.log(maxPage);

  createMovies(movies, genericSection, {lazyLoad: true, clean: true});

//   let btnLoadMore = document.createElement('button');
//   btnLoadMore.innerText = 'Load more';
//   btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
//   genericSection.appendChild(btnLoadMore);
}

async function getPaginatedTrendingMovies() {
    const {
        scrollTop, 
        scrollHeight, 
        clientHeight
    } = document.documentElement;

    const scrollIsBottom = (clientHeight + scrollTop) >= (scrollHeight -15);
    const pageIsNotMax = page < maxPage;
    
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api("trending/movie/day", {
            params: {
                page,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, {lazyLoad: true, clean: false});
    }
    

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Load more';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
}

async function getMovieById(id) {
  const { data: movie } = await api(`movie/${id}`);

  const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
        `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average.toFixed(1);

  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer, true);
  relatedMoviesContainer.scrollTo(0, 0);
}

function getLikedMovies(){
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies)
    
    createMovies(moviesArray, likedMoviesListArticle, {lazyLoad: true, clean: true});
    
    console.log(likedMovies)

}


