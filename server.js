const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const db = require("./models");
const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
    axios.get("https://www.huffingtonpost.com/").then(function(response) {  
        const $ = cheerio.load(response.data);
        const articleCard = $("div.card__content ")
        const results = [];
        articleCard.each(function(i, element) {
            const result = {};
            result.title = $(this).children("div.card__details").children("div.card__headlines")
                .children("div.card__headline").children("a.card__link").children("div.card__headline__text").text().trim();
            result.image = $(this).children(".card__image__wrapper").children("div.card__image").children("img").attr("src");
            result.summary = $(this).children("div.card__details").children("div.card__headlines")
                .children("div.card__description").children(".card__link").text();
            result.summary = result.summary.slice(0, result.summary.length - 2);
            result.link =  $(this).children("div.card__details").children("div.card__headlines")
                .children("div.card__headline").children("a.card__link").attr("href");
            result.link = 'https://www.huffingtonpost.com' + result.link;
            if (result.title !== '') {
                console.log(result.title)
                results.push(result)
            } 
        })
        console.log(results)
        res.send(results)
    })
    .then(getArticles())
})

app.get("/save", function(req, res) {
    console.log(res.body)
    // db.Article.create(result)
    // .then(function(dbArticle) {
    //     console.log(dbArticle)
    // })
    // .catch(function(err) {
    //     return res.json(err);
    // })
})

function getArticles() {
    app.get("/articles", function(req, res) {
        db.Article.find({})
        .then(function(dbArticle) {
        res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
    });
}
    

app.listen(PORT, function() {
    console.log("App running on port http://localhost:" + PORT);
})