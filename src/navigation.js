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

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
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

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')


    getTrendingMoviesPreview()
    getCategoriesPreview()
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

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, categoryData] = location.hash.split('=') // ['#category', 'id-name']
    const [categoryId, categoryName] = categoryData.split('-')

    headerCategoryTitle.innerHTML = decodeURI(categoryName);

    getMoviesByCategory(categoryId);
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

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')
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
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // ['#search', 'platzi']
    let query = location.hash.split('=')[1];
    query = query.replaceAll('%20', ' ');
    console.log('Buscando la peli: '+query)
    getMoviesBySearch(query);

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

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies()
}