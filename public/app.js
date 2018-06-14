function showArticles(data) {
    for (var i = 0; i < data.length; i++) {
        let articleContainer = $("<div>");
        articleContainer.attr("class", "container")
        let card = $("<div>");
        card.addClass("card float-left");
        let cardHeader = $("<p>");
        cardHeader.attr({"class": "card-header", "id": i + "-header"});
        cardHeader.append(data[i].title);
        card.append(cardHeader);
        const cardBody = $("<div>");
        cardBody.attr("class", "card-body");
        const cardText = $("<p>");
        cardText.attr({ "class": "card-text", "id": i + "-text" });
        const image = $("<img>");
        image.attr({"src": data[i].image, "id": i + "-image" });
        cardBody.append(image);
        if (data[i].summary !== "") {
            cardText.append(data[i].summary);
        }
        const link = $("<a>");
        link.attr({ "href": data[i].link, "target": "_blank", "id": i + "-link" });
        link.append("Link to Article")
        const saveButton = $("<button>");
        saveButton.attr({"id": i + "-button", "class": "save-button"});
        saveButton.append("Save Article")
        cardBody.append(cardText)
        cardBody.append(link);
        cardBody.append(saveButton)
        card.append(cardBody);
        articleContainer.append(card);
      $("#scraped-articles").append(articleContainer);
    }
};

function scrape() {
    $.ajax({
     method: "GET",
        url: "/scrape"
    })
    .then(function(data) {
        console.log("========")
        console.log(data);
        console.log("========")
        // location.reload();
        showArticles(data);
    })
}

$(document).on("click", ".save-button", function(event) {
    const index = $(this).attr("id").slice(0, 1);
    const result = {
        title: $("#" + index + "-header").text(),
        image: $("#" + index + "-image").attr("src"),
        summary: $("#" + index + "-text").text(),
        link: $("#" + index + "-link").attr("href")
    }
    console.log(result)
})
$("#scrape").on("click", scrape);
  