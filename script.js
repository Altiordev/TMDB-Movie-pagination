const formSearch = document.querySelector('.formSearch');
const search = document.querySelector('.search');
const box = document.querySelector('.box');
const pagenation = document.querySelector('.pagenation');
const imgUrl = 'https://image.tmdb.org/t/p/w500';
let api = 'https://api.themoviedb.org/3/discover/movie?api_key=a4e007deab5693c31265329779905c92';
let page = 1;
let minPage = 1;
let maxPage = 10;


async function fetchData() {
    if (!search.value) {
        api = `https://api.themoviedb.org/3/discover/movie?api_key=a4e007deab5693c31265329779905c92&page=${page}`;
    } else {
        api = `https://api.themoviedb.org/3/search/movie?api_key=a4e007deab5693c31265329779905c92&query=${search.value}`;
    }

    try {
        const response = await fetch(api)
        const data = await response.json();
        box.innerHTML = '';

        pagenation.innerHTML = '';
        if (data.total_pages > 1) {
            if (minPage > 10) {
                pagenation.innerHTML = '';
                const firstPage = document.createElement('button');
                firstPage.classList.add('fisrtPage');
                firstPage.textContent = 1;

                firstPage.addEventListener('click', () => {
                    page = 1;
                    minPage = 1;
                    maxPage = 10;
                    fetchData();

                    pagenation.removeChild(firstPage);
                })

                pagenation.appendChild(firstPage)
            }

            for (let i = minPage; i <= maxPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;

                if (page == i) {
                    pageBtn.classList.add('active');
                }

                pageBtn.addEventListener('click', () => {
                    page = i;
                    fetchData()

                    if (pageBtn.textContent == maxPage) {
                        pagenation.innerHTML = '';
                        minPage += 5
                        maxPage += 5
                    } else if (minPage == 1) {
                        pagenation.innerHTML = '';
                        pageBtn.textContent = i;
                    } else if (pageBtn.textContent == minPage) {
                        pagenation.innerHTML = '';
                        minPage -= 5
                        maxPage -= 5
                    }
                })



                pagenation.append(pageBtn);
            }
        }

        data.results.map((movie) => {
            // console.log(movie);
            // console.log(data);
            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            if (movie.backdrop_path == null && movie.backdrop_path == undefined) {
                img.src = 'https://us.123rf.com/450wm/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016/167492439-no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image.jpg?ver=6}';
                img.alt = 'movie poster';
            } else {
                img.src = `${imgUrl}${movie.backdrop_path}`;
                img.alt = 'movie poster';
            }

            const movieName = document.createElement('h2');
            movieName.textContent = movie.title;

            const movieDescriptions = document.createElement('p');
            movieDescriptions.innerHTML = `<span>Overview:</span> <br>${movie.overview}`;

            const movieRating = document.createElement('span');
            movieRating.style.textShadow = '0px 0px 1px rgba(0,0,0,0.2)';
            movieRating.innerHTML = `<span>Rating:</span><br> ${movie.vote_average.toFixed(1)}`;

            if (movie.vote_average < 5) {
                movieRating.style.color = 'red'
            } else if (movie.vote_average > 5 && movie.vote_average < 8) {
                movieRating.style.color = 'yellow'
            } else if (movie.vote_average > 8) {
                movieRating.style.color = 'green'
            }

            const movieReleaseDate = document.createElement('span');
            if (movie.release_date == NaN) {
                movieReleaseDate.innerHTML = `<span>Release Date:</span> <br> <span>unknown</span>`
            } else {
                movieReleaseDate.innerHTML = `<span>Release Date:</span> <br>${movie.release_date}`
            }



            card.append(img, movieName, movieDescriptions, movieRating, movieReleaseDate);

            box.appendChild(card);
        })

    } catch (error) {

        console.log('error');

    }
}

fetchData();

formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchData();
    formSearch.reset();
})