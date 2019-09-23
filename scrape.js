const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('post.csv');

// Write Headers
writeStream.write(`Title,Link,Date \n`);

request('https://en.wikipedia.org/wiki/Cil', (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    console.log($)

    $('.mw-parser-output > p').each((i, el) => {
        console.log("\n\n\n");
        console.log(i, $(el).text());

    });

    console.log('Scraping Done...');
  }
});