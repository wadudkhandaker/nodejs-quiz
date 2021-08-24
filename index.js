const http = require('http');
const jsdom = require('jsdom').JSDOM;
const cookie = 'hasCookie=true'
const myArgs = process.argv.slice(2)[0];

const options = { 
    hostname: 'codequiz.azurewebsites.net',
    path: 'https://codequiz.azurewebsites.net/',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
        'Cookie': cookie,
        'Accept': '/',
        'Connection': 'keep-alive'
    }
};
  
callback = (response)=> {
    let str = '';

    //another chunk of data has been received, so append it to `str`
    response.on('data', (chunk)=> {
        str += chunk;
    });

    //the whole response has been received, so we just print it out here
    response.on('end', () => {
        getDataFromTable(str);
    });
}

getDataFromTable= (str)=> {
    const dom = new jsdom(str);
    const tableRows = dom.window.document.querySelectorAll("table tr");
    const jsonData = [];
    for (let i=1; i<tableRows.length; i++) {
        const fundName = tableRows[i].querySelector('td:nth-child(1)').textContent;
        const nav = tableRows[i].querySelector('td:nth-child(2)').textContent;
        jsonData.push({
        'fundName': fundName,
        'nav': nav
        });
    }
    const result = jsonData.find(data => data.fundName === myArgs);
    if(result) {
        console.log(result.nav);
    } else {
        console.log('Fund name not found');
    }
   
}
  
http.request(options, callback).end();