
const puppeteer = require('puppeteer');
const FileUtils = require('./file_utils');
const { MOVIES_FILE_PATH, CATEGORIES_FILE_PATH } = require('../common/constants')
const CRAWLED_WEBSITE = 'http://phimmoi.net';


class Crawler {

    static async crawl(){
        // Crawler.crawlMovieDetails();
        const browser = await puppeteer.launch({ headless: false });

        let crawledMovies = [];
        let crawledCategories = await Crawler.crawlCategories(browser);
        

        for(let index in crawledCategories){
            // if(index <= 3){
                let cate = crawledCategories[index];
                let list = await Crawler.crawlMovieListByCategory(browser, cate);
                crawledMovies = crawledMovies.concat(list);    
            // }
            
        }

        let list = [...crawledMovies];
        crawledMovies.length = 0;

        for(let index in list){
            // if(index <= 3){
                let movie = list[index];
                const m = await Crawler.crawlMovieDetails(browser, movie);
                crawledMovies.push(m);
            // }
            
        }

        await browser.close();


        console.log(crawledMovies);
        console.log(crawledMovies.length);
        
        FileUtils.writeJsonToFile(CATEGORIES_FILE_PATH, crawledCategories);
        FileUtils.writeJsonToFile(MOVIES_FILE_PATH, crawledMovies);
    }


    static async crawlCategories(browser){
        let categories = [];

        try {
            // const browser = await puppeteer.launch({ headless: false })
            const page = await browser.newPage();
            
            await page.goto(CRAWLED_WEBSITE, { waitUntil: 'domcontentloaded', timeout: 0 });
    
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

    
           
        } catch (error) {
            console.log('crawl categories errors: ' + error);
        } 
        
        console.log('============= done crawling categories ============');
        console.log(categories);
        return categories;
    }
    
    static async crawlMovieListByCategory(browser, category){
        let movies = [];
        let page;
        try {
            // const browser = await puppeteer.launch({ headless: false });
            page = await browser.newPage();
            for(let i = 1; i <= 1; i++){
                try {
                    await page.goto(category.link + 'page-'+ i +'.html', { waitUntil: 'domcontentloaded', timeout: 0 });
                    let list = await page.$$eval('ul.list-movie li.movie-item > a', $ele => {
                        let arr = [];
                        for(let $e of $ele){
                            arr.push({
                                categoryId: 1,
                                link: $e.getAttribute('href').trim()
                            })
                        }
                        return arr;
                    });
                    
                    list = list.map(item => ({ 
                        ...item, 
                        categoryId: category.id, 
                        link: CRAWLED_WEBSITE + '/' + item.link 
                    }));

                    movies = movies.concat(list); 
                } catch (error) {
                    console.log(error);
                    break;
                }
            }

            // await browser.close();
            await page.close();

        } catch (error) {
            await page.close();
            console.log('============ crawling movie list errors ==========');
            console.log(error);
        }
        

        console.log('============= done crawling movie list ==========');
        console.log(movies);
        return movies;

    }

    static async getEleContent(page, selector){
        try {
            const val = await page.$eval(selector, $ele => $ele.textContent);
            return val;
        } catch (error) {
            return '';
        }
    }

    static async getListEleContent(page, selector){
        try {
            let list = await page.$$eval(selector, $eles => $eles.map($ele => $ele.textContent.trim()));
            if(list.length == 0) return '';
            return list.join(', ').slice(0, -2);
        } catch (error) {
            return '';
        }
    }

    static async getEleAttrValue(page, selector, attrName){
        try {
            return await page.$eval(selector, $ele => $ele.getAttribute('src'))
        } catch (error) {
            return '';
        }
    } 
    
    static async crawlMovieDetails(browser, movie){
        let page;
        try {
            page = await browser.newPage();

            await page.goto(movie.link, { waitUntil: 'domcontentloaded' });
            const wrapperClassname = 'div.block-wrapper.page-single > div.movie-info';

            const title1 = await Crawler.getEleContent(page, wrapperClassname + ' h1.movie-title span.title-1');
            const title2 = await Crawler.getEleContent(page, wrapperClassname + ' h1.movie-title span.title-2');
            const directors = await Crawler.getListEleContent(page, wrapperClassname + ' dd.dd-director a.director');
            const actors = await Crawler.getListEleContent(page, wrapperClassname + ' div.block-actors div.caroufredsel_wrapper ul#list_actor_carousel li div.actor-name > span.actor-name-a');
            const country = await Crawler.getEleContent(page, wrapperClassname + ' a.country');
            const status = await Crawler.getEleContent(page, wrapperClassname + ' .movide-dd.status');
    
            let description = await Crawler.getEleContent(page, wrapperClassname + ' div#film-content p');
            description = description.replace(/\s\s+/g, '');
            const image = await Crawler.getEleAttrValue(page, wrapperClassname + ' div.movie-image > div.movie-l-img > img', 'src');
            
            let movieDLClassname = wrapperClassname + ' div.movie-meta-info dl.movie-dl';
            let start = '', duration = '';

            try {
                let info = await page.$$eval(movieDLClassname + ' > *', $eles => {
                    let start, duration;
                    let prop = '';
                    for(let $ele of $eles){
                        
                        if($ele.tagName.toLowerCase() == 'dt'){
                            if($ele.textContent.trim() == 'Ngày khởi chiếu:') {
                                prop = 'start';
                            } else if($ele.textContent.trim() == 'Thời lượng:'){
                                prop = 'duration';
                            }
                        } else if($ele.tagName.toLowerCase() == 'dd'){
                            if(prop == 'start') {
                                prop = '';
                                start = $ele.textContent;
                            }
                            if(prop == 'duration') {
                                prop = '';
                                duration = $ele.textContent;
                            }
                        }
                    }

                    return { start, duration };
                });

                console.log(info);
                // return;

                start = info.start;
                duration = info.duration;

            } catch (error) {
                
            }

            await page.close();
            
            if(!start){
                start = '';
            } 

            if(!duration){
                duration = '';
            } 
            let startIndex = movie.link.indexOf('phimmoi.net/phim/') + 'phimmoi.net/phim/'.length;
            const slug = movie.link.substring(startIndex, movie.link.length - 1);
            return {
                categoryId: movie.categoryId,
                title1, title2,
                info: { directors, actors, country, start, duration, status },
                description, image,
                link: movie.link,
                slug
            }

            
            // const crawledMovie = await page.evaluate(() => {

              

            //     //phim.net website movie details
            //     const $wrapContent = document.querySelector('div.block-wrapper.page-single > div.movie-info');
                
            //     //elements
            //     const $title1 = $wrapContent.querySelector('h1.movie-title span.title-1');
            //     const $title2 = $wrapContent.querySelector('h1.movie-title span.title-2');
            //     const $director = $wrapContent.querySelector('a.director');
            //     const $actors = $wrapContent.querySelectorAll('div.block-actors div.actor-name > span.actor-name-a');
            //     const $country = $wrapContent.querySelector('a.country');
            //     const $start = $wrapContent.querySelector('div.movie-meta-info dd:nth-of-type(7)');
            //     const $duration = $wrapContent.querySelector('div.movie-meta-info dd:nth-of-type(8)');
            //     const $description = $wrapContent.querySelector('div#film-content p');
            //     const $image = $wrapContent.querySelector('.movie-image img');

            //     const title1 = getEleContent($title1);
            //     const title2 = getEleContent($title2);
            //     const director = getEleContent($director);
            //     const actors = getListEleContent($actors);
            //     const country = getEleContent($country);
            //     const start = getEleContent($start);
            //     const duration = getEleContent($duration).textContent.replace(/\D/g, '');;
            //     const description = getEleContent($description).textContent.replace(/\s\s+/g, '');;
            //     const image = getEleAttrValue($image, 'src');

            //     return {
            //         title1, title2, 
            //         info: { director, actors, country, start, duration },
            //         description, image
            //     }
            // });

        } catch (error) {
            console.log(error);
            await page.close();
        }

        console.log('done crawl movie details');
    }
}

module.exports = Crawler;