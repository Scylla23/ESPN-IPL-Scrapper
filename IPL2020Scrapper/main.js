const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595'

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const allMatchobj = require('./allMatch')

let dirPath = path.join(__dirname, 'IPL 2020')

dirCreator(dirPath)

function dirCreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath)
    }
}





request(url , callback)

function callback(err, response,html){
    if(err){
        console.error(err)
    }
    else{
        extractLink(html) // we have the link of home page but we want the link of view all results
    }
}

function extractLink(html){
    let $ = cheerio.load(html)  // selctor tool
    let anchorElement = $('a[data-hover="View All Results"]')  //we are selecting whoel <a> tag</a>
    let link = anchorElement.attr('href')      // .attr me href dene pr <a> ka href attr la kr dega   
    // console.log(link)  ///series/ipl-2020-21-1210595/match-results
    //this is only the half link of view all results but we want the link of whole page
    let fullLink = 'https://www.espncricinfo.com/' + link
    console.log(fullLink) 

    allMatchobj.getAllMatch(fullLink)   //we want link of all the matches ka scorecard ka linkedin
}



