let maxPage;
let page = 1
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
})
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
})
arrowBtn.addEventListener('click', () => {
    searchFormInput.value = '';
    location.hash = '#home';
})

langChooser.addEventListener('change', () => {
    chooseLanguage(langChooser.value);
} )

window.addEventListener('DOMContentLoaded', navigate, false)
window.addEventListener('hashchange', navigate, false)
window.addEventListener('scroll', infiniteScroll, false)


function navigate() {
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined
    }
    
    console.log({location});

    if (location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage()
    } else if (location.hash.startsWith('#movie=')) {
        moviePage()
    } else if (location.hash.startsWith('#category=')) {
        categoryPage()
    } else {
        homePage()
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
    footerCaption.innerHTML = langs[chosenLanguage()].captions.footerCaption;

}
function homePage() {
    console.log('HOME')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    language.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    trendingPreviewTitle.innerHTML = langs[chosenLanguage()].captions.trends;
    trendingBtn.innerHTML = langs[chosenLanguage()].captions.trendMore;
    categoriesPreviewTitle.innerHTML = langs[chosenLanguage()].captions.category;
    likedTitle.innerHTML = langs[chosenLanguage()].captions.likedTitle;

    getTrendingMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
}
function categoryPage() {
    console.log('CATEGORY')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    language.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, categoryData] = location.hash.split('=') // ['#category', 'id-name']
    const [categoryId, categoryName] = categoryData.split('-')

    headerCategoryTitle.innerHTML = decodeURI(categoryName);

    getMoviesByCategory(categoryId);
    infiniteScroll = getPaginatedMoviesByCategory(categoryId)
}
function moviePage() {
    console.log('MOVIE')

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    language.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    relatedMoviesTitle.innerHTML = langs[chosenLanguage()].captions.relatedMovie;

    // ['#search', 'platzi']
    let movieId = location.hash.split('=')[1];
    movieId = movieId.replaceAll('%20', ' ');
    console.log('Mostrando la peli: '+movieId);
    getMovieById(movieId);
}
function searchPage() {
    console.log('SEARCH')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#search', 'platzi']
    let query = location.hash.split('=')[1];
    query = query.replaceAll('%20', ' ');
    console.log('Buscando la peli: '+query)

    getMoviesBySearch(query);
    infiniteScroll = getPaginatedMoviesBySearch(query);

}
function trendsPage() {
    console.log('TRENDS')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    language.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    headerCategoryTitle.innerHTML = langs[chosenLanguage()].captions.trends;

    getTrendingMovies()
    infiniteScroll = getPaginatedTrendingMovies;
}

