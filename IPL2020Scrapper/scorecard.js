//const url = 'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')

function processCard(url){
    request(url , callback)

}


function callback(err, response,html){
    if (err){
        console.error(err)
    }
    else{
        extrackMatchDetails(html)
    }
}

function extrackMatchDetails(html){
    let $ = cheerio.load(html)  
    let infoString = $('.header-info .description')
    let infoArr = infoString.text().split(',')
    let venue = infoArr[1].trim()
    let date = infoArr[2].trim()
    console.log(venue)
    console.log(date)

    let resultArray = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text')
    let result = resultArray.text()
    console.log(result)

    let innings_table = $(".card.content-block.match-scorecard-table .Collapsible")
    let htmlString = ''

    for (let i = 0; i <innings_table.length; i++){
        htmlString += $(innings_table[i]).html()


        let teamName = $(innings_table[i]).find('h5').text()

        teamName = teamName.split("INNINGS")[0].trim()
        //console.log(teamName)\

        let opponentidx = i == 0? 1 :0
        let opponentTeamName = $(innings_table[opponentidx]).find('h5').text()
        
        opponentTeamName = opponentTeamName.split("INNINGS")[0].trim()
        console.log( teamName, opponentTeamName)


        let currInnings = $(innings_table[i])
        let allrows = currInnings.find('.table.batsman tbody tr')

        for (let j = 0; j <allrows.length ; j++){
            let allcol = $(allrows[j]).find('td')
            let isWorthy = $(allcol[0]).hasClass('batsman-cell')

            if(isWorthy == true){
                let playerName = $(allcol[0]).text().trim();
                let runs = $(allcol[2]).text().trim();
                let balls = $(allcol[3]).text().trim();
                let fours = $(allcol[5]).text().trim();
                let sixes = $(allcol[6]).text().trim();
                let strikerate = $(allcol[7]).text().trim();

                console.log(`${playerName} || ${runs} || ${balls} || ${fours} || ${sixes} || ${strikerate}`)
                processPlayersInfo(playerName,teamName,opponentTeamName,venue,date , result, runs,balls,fours,sixes,strikerate)


            }

            
        }
        console.log('`````````````````````````````````````````')


    }
}
function processPlayersInfo(playerName,teamName, opponentTeamName,venue,date, result, runs,balls,fours,sixes,strikerate){

        let teamPath = path.join(__dirname , "IPL 2020" , teamName)
        dirCreator(teamPath)

        let filePath = path.join(teamPath ,playerName +".xlsx");
        let content = excelReader(filePath , playerName)

        let playerobj = {
            playerName,teamName, opponentTeamName,venue,date, result,runs,balls,fours,sixes,strikerate

        }

        content.push(playerobj)

        excelWriter(filePath , playerName , content)

}

function dirCreator(filepath){
    if(fs.existsSync(filepath) == false){
        fs.mkdirSync(filepath)
    }
}


function excelWriter(fileName, sheetName, jsonData) {
    let newWB = xlsx.utils.book_new();
    // Creating a new WorkBook
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    // Json is converted to sheet format (rows and cols)
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, fileName);
  }
  
  function excelReader(fileName, sheetName) {
    if (fs.existsSync(fileName) == false) {
      return [];
    }
    let wb = xlsx.readFile(fileName);
  
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans
  }



module.exports={
    ps : processCard,
};