
const request = require('request')
const cheerio = require('cheerio')

const scorecard = require('./scorecard')



function getallMatchScorecardsLink(url2){
    request(url2 , callback2) 
}

function callback2(error ,response , html){
    if(error){
        console.log(error)
    }
    else{
        extractAllMatchScorecardsLinks(html)
    }
}

function extractAllMatchScorecardsLinks(html){
    let $ = cheerio.load(html) //selector tool 

    let ScorecardArr = $('a[data-hover="Scorecard"]')  // we got all the links of scorecard in the array
    //console.log(ScorecardArr)

    for(let i = 0; i <ScorecardArr.length; i++){
        let link = $(ScorecardArr[i]).attr('href')

        let fullLink = 'https://www.espncricinfo.com/' + link
        //console.log(fullLink) 
        scorecard.ps(fullLink)
    }


}



module.exports={
    getAllMatch :getallMatchScorecardsLink,
};