const http = require("http");

const fs = require("fs");

const url = require("url");

const tempOverview = fs.readFileSync(`${__dirname}/templates/Template-Overview.html`,"utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/Template-Card.html`,"utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/Template-Product.html`,"utf-8");

const fileData = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const data = JSON.parse(fileData);

function replaceStringCard(prodect,cardHtml) {
    let result = cardHtml.replace(/{%IMAGE%}/g,prodect.image);
    result = result.replace(/{%PRODUCT_NAME%}/g,prodect.productName);
    result = result.replace(/{%PRICE%}/g,prodect.price);
    result = result.replace(/{%PRODUCT_ID%}/g,prodect.id);
    result = result.replace(/{%ORIGIN%}/g,prodect.from);
    result = result.replace(/{%DESCRIPTION%}/g,prodect.description);
    result = result.replace(/{%CONTENTS%}/g,prodect.nutrients);
    result = result.replace(/{%QUANTITY%}/g,prodect.quantity);
    if(prodect.organic===false){
        result = result.replace(/{%NOT_ORGANIC%}/g,"not-organic");
    }
    result = result.replace(/{%NOT_ORGANIC%}/g,"");
    return result;
}


const server = http.createServer((req,res)=>{
    const {query,pathname} = url.parse(req.url,true);
    if (pathname==="/product"){
        const product = data[query.id];
        const productHtml = replaceStringCard(product,tempProduct);
        res.writeHead(200,{"Content-type": "text/html"});
        res.end(productHtml);
    }else if(pathname==="/"){
        const cards = data.map(ele=>{
            return replaceStringCard(ele,tempCard);
        });
        const OVERVIEWPAGE = tempOverview.replace(/{%PRODUCTS%}/g,cards.join(" "));
        res.writeHead(200,{"Content-type": "text/html"});
        res.end(OVERVIEWPAGE);
    }else{
        res.writeHead(404,{
            "Content-type": "text/html"
        })
        res.end("<h1>Page Not Found</h1>")
    }
})

server.listen(3000,"localhost",()=>{
    console.log("Listening On port 3000")
})