var request = require('sync-request');
var minify = require('html-minifier').minify;
var cheerio = require('cheerio');
var fs = require('fs');


var exercise = {};

exercise.one = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Return the address of all the html pages in
    //  the MIT course catalog - string array.
    //  For example, the first page for Course 1 is:
    //  http://student.mit.edu/catalog/m1a.html
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q1');

    var res = request('GET', 'http://student.mit.edu/catalog/index.cgi');
    var pageHtml = res.getBody().toString();
    var linksArray = [];


    var $ = cheerio.load(pageHtml);
    links = $('ul li a');
    $(links).each(function(i, link){
        //console.log($(link).attr('href') + '\n ');
        link = 'http://student.mit.edu/catalog/' + $(link).attr('href');
        linksArray.push(link);
    });
    
    // console.log(linksArray);
    // console.log('scrape for more pages inside each link');



    linksArray.forEach(function(item, index){
        res = request('GET', item);
        pageHtml = res.getBody().toString();
        $ = cheerio.load(pageHtml);

        pages = $('td[valign=middle][align=center] b a');
        $(pages).each(function(i, page){
            page = 'http://student.mit.edu/catalog/' + $(page).attr('href');
            if(linksArray.includes(page)){
                // already pushed that inside page
            }else{
                // found new inside page, then push
                linksArray.push(page);
            }
            
        })
    });
    
    // //sort by alphabet
    // linksArray.sort(function(a,b){
    //     if(a < b) return -1;
    //     if(a > b) return 1;
    //     return 0;
    // });

    console.log(linksArray);


    return linksArray;

};

exercise.two = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Download every course catalog page.
    //
    //  You can use the NPM package "request".
    //  Or curl with the NPM package shelljs.
    //
    //  Save every page to "your_folder/catalog"
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q2');

    var urls = exercise.one();

    urls.forEach(function(url, index){
        var res = request('GET', url);
        var filename = './catalog/' + index + '.html';
        fs.writeFileSync(filename, res.getBody().toString());
    });

    console.log('Downloaded all htmls');

};

exercise.three = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Combine all files into one,
    //  save to "your_folder/catalog/catalog.txt"
    //
    //  You can use the file system API,
    //  https://nodejs.org/api/fs.html
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q3');

    var files = [];
    // var linksArray = exercise.one();


    // I noticed when append all 88 pages, the script will get error. I guess it's from the memory leakage.
    for (var i = 0; i < 46; i++){
        files.push('./catalog/' + i + '.html');
    }

    files.forEach(function(item, index){
        var data = fs.readFileSync(item);
        fs.appendFileSync('./catalog/combinedHtmlText.txt', data);
    });

    console.log('Combined all htmls into a text');

};

exercise.four = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Remove line breaks and whitespaces
    //  from the file. Return a string of
    //  scrubbed HTML. In other words, HTML without
    //  line breaks or whitespaces.
    //
    //  You can use the NPM package "html-minifier".
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q4');
    var data = fs.readFileSync('./catalog/combinedHtmlText.txt');
    
    var minifiedData = minify(data.toString(),{
        collapseWhitespace: true,
        minifyJS : true,
        minifyCSS : true
    });

    var cleanedData = minifiedData.replace(/'/g, '');
    fs.writeFileSync('./catalog/cleanedCombinedHtmlText.txt', cleanedData);

};

exercise.five = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Load your scrubbed HTML into the DOM.
    //  Use the DOM structure to get all the courses.
    //
    //  Return an array of courses.
    //
    //  You can use the NPM package "cheerio".
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q5');

    var data = fs.readFileSync('./catalog/cleanedCombinedHtmlText.txt');
    var $ = cheerio.load(data);
    var courses = [];

    $('h3').each(function(i, course){
        courses.push($(course).text());
    });

    // console.log('Courses List');
    // console.log(courses);
    return courses;

};

exercise.six = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Return an array of course titles.
    //
    //  You can use the NPM package cheerio.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q6');
    // courses and course titles are the same?


    var data = fs.readFileSync('./catalog/cleanedCombinedHtmlText.txt');
    var $ = cheerio.load(data);
    var titles = [];

    $('h3').each(function(i, title){
        titles.push($(title).text());
    });

    // console.log('Courses List');
    // console.log(courses);
    console.log(titles);

    return titles;
};

exercise.seven = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Filter out punctuation, numbers,
    //  and common words like "and", "the", "a", etc.
    //
    //  Return clean array.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q7');
    var titles = exercise.six();

    var prohibitedWords1 = [' and ',' the ',' for ',' with ',' and: ',' via ',' urg ',' whoi ',' thg ',' ind ',' that ',' epe ',' epw ',' sts ','35ur','3s50'];
    var words = titles.map(function(title){
        
    
        var cleanedTitle1 = title.toLowerCase();
    
        cleanedTitle1 = cleanedTitle1.replace(/[^a-zA-Z0-9]/g,' ');
    
        for (var i = 0; i < prohibitedWords1.length; i++) {
            cleanedTitle1 = cleanedTitle1.replace(prohibitedWords1[i], " ");
        }
    
        cleanedTitle1.replace(/\[/g,' ');
        cleanedTitle1.replace(/\]/g,' ');
        cleanedTitle1.replace(/\./g,' ');
        cleanedTitle1.replace(/\&/g,' ');
        cleanedTitle1.replace(/\s.\s/g,' ');
        cleanedTitle1.replace(/\s..\s/g,' ');
        cleanedTitle1.replace(/^..\s/g,' ');
        cleanedTitle1.replace(/^.\s/g,' ');
        cleanedTitle1.replace(/\s.$/g,' ');
        cleanedTitle1.replace(/\s..$/g,' ');
        // var result_title = cleanedTitle1.match(/([a-z]+)/g);
        var result_title = cleanedTitle1.match(/(\w+[a-z]\w+)/g);

        // var cleanedTitle2 = cleanedTitle1.replace(/\s.\s/g,' ');
        // var cleanedTitle3 = cleanedTitle2.replace(/\s..\s/g,' '); // space any 2 chars space //
        // var cleanedTitle4 = cleanedTitle3.replace(/^..\s/g,' '); // beginning
        // var cleanedTitle5 = cleanedTitle4.replace(/^.\s/g,' ');
        // var cleanedTitle6 = cleanedTitle5.replace(/\s.$/g,' ');
        // var cleanedTitle7 = cleanedTitle6.replace(/\s..$/g,' ');
        // var cleanedTitle8 = cleanedTitle7.match(/([a-z]+)/g);

        return result_title;
    });

    console.log(words);
    return words;

};

exercise.eight = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Make an array of words from the titles.
    //
    //  Return array of words.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q8');

    var words = exercise.seven();
    var wordsFlat = words.reduce(function(previous, current){
        return previous.concat(current);
    },[]);

    // console.log(wordsFlat);

    return wordsFlat;


};

exercise.nine = function(){
    // -----------------------------------------------
    //   YOUR CODE
    //
    //  Count the word frequency.
    //
    //  Return a word count array.
    //
    //  See homework guide document for more info.
    // -----------------------------------------------

    console.log('Q9');

    var wordsFlat = exercise.eight();

    var scores = wordsFlat.reduce(function(previous,current){
        if(current in previous){
            previous[current] += 1;
        }else{
            previous[current] = 1;
        }
        return previous;
    },{});

    console.log(scores);
    return scores;

};


module.exports = exercise;
