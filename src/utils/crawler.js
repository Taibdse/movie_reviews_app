
const CRAWLED_WEBSITE = 'http://phimmoi.net';
const puppeteer = require('puppeteer');

class Crawler {


    static async crawlCategories(){
        let crawledMovies = [];
        let categories = [];

        try {
            const browser = await puppeteer.launch({ headless: false })
            const page = await browser.newPage();
            
            await page.goto('http://www.phimmoi.net/the-loai/phim-hanh-dong/', { waitUntil: 'domcontentloaded', timeout: 0 });
    
         
            //get movie categories
            // categories = await page.evaluate(() => {
            //     const $menu = document.querySelector('nav div.menu-main-menu-container');
            //     // ul.dropdown-menu li
            //     const $cateDropdown = $menu.querySelector('ul#menu-main-menu li.mega.dropdown');
            //     const $cateLiList = $cateDropdown.querySelectorAll('ul.dropdown-menu li');
            //     let cateArr = [];
            //     for(const $cate of $cateLiList){
            //         const title = $cate.querySelector('a').innerText.replace(/Phim/gi, '').trim().replace(/\s\s+/g, '');
            //         const link = $cate.querySelector('a').getAttribute('href').trim();
    
            //         cateArr.push({
            //             id: Math.random().toFixed(8), title, link 
            //         });
            //     }
    
            //     return cateArr;
            // })
            
            // console.log(categories);
    
            // for(let cate of categories){
            //     const movieDetailLinks = await crawlMovieListByCategory(page, cate);
            //     crawledMovies = [...crawledMovies, ...movieDetailLinks];
            // }
    
            // console.log('movie detail links: ');


            categories = await page.evaluate(() => {
                const $menu = document.querySelector('ul#mega-menu-1');
                const $aList = $menu.querySelectorAll('li:nth-of-type(2) .sub-container:nth-of-type(1) li a');
                const arr = [];
                for(let $a of $aList){
                    arr.push({
                        id: Math.random().toFixed(8),
                        title: $a.textContent.trim().replace(/Phim/gi, '').trim(),
                        link: $a.getAttribute('href').trim(),
                        slug: $a.getAttribute('href').trim()
                    })
                }
                return arr;
            })

            categories = categories.map(cate => ({ 
                ...cate, 
                link: CRAWLED_WEBSITE + '/' + cate.link,
                slug: cate.slug.replace(/the-loai/g, '').replace(/[/]/g, '')
            }));

    
            await browser.close();
            
        } catch (error) {
            console.log('crawl errors: ' + error);
        } 
        
        console.log('============= done crawling categories ============');
        console.log(categories)

        // console.log('============ crawl movie details for every movie ========');


    }
    
    static async crawlMovieListByCategory(link = 'http://www.phimmoi.net/the-loai/phim-hanh-dong/'){

        try {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 0 });

            await page.evaluate(() => {
                $paginationLink = document.querySelector('ul.pagination li a');
                $paginationLink.click();
            })
        } catch (error) {
            console.log('crawl errors');
            console.log(error);
        }

        console.log('done crawling');


        // await page.goto(category.link, { waitUntil: 'networkidle2' });
    
        // const numOfPage = await page.evaluate(() => {
        //     const $pagination = document.querySelector('ul.page-numbers');
        //     const $page = $pagination.querySelector('li:nth-last-child(2) a');
        //     return $page.textContent;
        // });
    
        // const numOfPageToCrawl = (Number(numOfPage) > 4) ? 4 : Number(numOfPage);
        // let movieList = [];
    
        // for(let i = 1; i <= numOfPageToCrawl; i++){
        //     await page.goto(category.link + '/page/' + i, { waitUntil: 'networkidle0' });
    
        //     let movies = await page.evaluate(() => {
        //         const $boxes = document.querySelectorAll('main#main-contents > div.halim_box article .halim-item');
        //         const arr = [];
        //         for(let $item of $boxes){
        //             const movieDetailsLink = $item.querySelector('a').getAttribute('href');
        //             arr.push({
        //                 link: movieDetailsLink,
        //             });   
        //         }
        //         return arr;
        //     });
    
        //     movies = movies.map(movie => ({ ...movie, categoryId: category.id }));
        //     console.log(movies);
    
        //     movieList = [...movieList, ...movies];
    
        //     // await pageOnPaginationItem.close();
        // }
    
        // // console.log(movieDetailLinks);
    
        // return movieList;
    }
    
    static async crawlMovieDetails(page, movies){
        try {
            const browser = await puppeteer.launch({ headless: false });
            page = await browser.newPage();
            // await page.goto(movies[0].link, { waitUntil: 'networkidle2' });
            await page.goto('http://www.phimmoi.net/phim/cuoc-chien-hau-cung-10070/', { waitUntil: 'networkidle2' });
            
            const movie = await page.evaluate(() => {
                // const $wrapContent = document.querySelector('section#content > .wrap-content')

                // // title, image, description, ratings, avgRate, info {director, actors, rated, start, duration}, category

                // const title = $wrapContent.querySelector('h1.entry-title').textContent;
                // const description = $wrapContent.querySelector('article.item-content').textContent;
                // const image = $wrapContent.querySelector('img.movie-thumb').getAttribute('src');
                // const duration = $wrapContent.querySelector('.more-info span:first-child').textContent.trim().replace('/\D/g', '');
                // const country = $wrapContent.querySelector('dic.movie-detail .actors a').getAttribute('title');


                //phim.net website movie details
                const $wrapContent = document.querySelector('div.block-wrapper.page-single > div.movie-info');
                const title1 = $wrapContent.querySelector('h1.movie-title span.title-1').textContent;
                const title2 = $wrapContent.querySelector('h1.movie-title span.title-2').textContent;
                const director = $wrapContent.querySelector('a.director').textContent;
                const $actors = $wrapContent.querySelectorAll('div.block-actors div.actor-name > span.actor-name-a');
                
                let actors = '';
                for(let $actor of $actors){
                    actors += $actor.textContent + ', ';
                }
                actors = actors.substring(0, actors.length - 2);

                const country = $wrapContent.querySelector('a.country').textContent;
                const start = $wrapContent.querySelector('div.movie-meta-info dd:nth-of-type(7)').textContent;
                const duration = $wrapContent.querySelector('div.movie-meta-info dd:nth-of-type(8)').textContent.replace(/\D/g, '');
                const description = $wrapContent.querySelector('div#film-content p').textContent.replace(/\s\s+/g, '');
                const image = $wrapContent.querySelector('.movie-image img').getAttribute('src');

                return {
                    title1, title2, 
                    info: { director, actors, country, start, duration },
                    description, image
                }
            })

            console.log(movie);
        } catch (error) {
            console.log(error);
        }

        console.log('done crawl movie details');
    }
}

module.exports = Crawler;