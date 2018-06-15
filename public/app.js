$.ajax({
    method: "GET",
       url: "/scrape"
   })
   .then(function(data) {
    for (var i = 0; i < data.length; i++) {
        let articleContainer = $("<div>");
        articleContainer.attr("class", "container")
        let card = $("<div>");
        card.addClass("card float-left scrape-card");
        let cardHeader = $("<p>");
        cardHeader.attr({"class": "card-header", "id": i + "-header"});
        cardHeader.append(data[i].title);
        card.append(cardHeader);
        const cardBody = $("<div>");
        cardBody.attr("class", "card-body");
        cardBody.addClass("scraped-card-body")
        const cardText = $("<p>");
        cardText.attr({ "class": "card-text", "id": i + "-text" });
        const image = $("<img>");
        image.attr({"src": data[i].image, "id": i + "-image", "class": "card-image" });
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
   })

$.getJSON("/articles", function(data) {
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
        cardBody.addClass("row")
        const articleInfo = $("<div>");
        articleInfo.addClass("article-info");
        articleInfo.addClass("col-md-6");
        const cardText = $("<p>");
        cardText.attr({ "class": "card-text", "id": i + "-text" });
        const image = $("<img>");
        image.attr({"src": data[i].image, "id": i + "-image", "class": "card-image" });
        
        if (data[i].summary !== "") {
            cardText.append(data[i].summary);
        }
        const link = $("<a>");
        link.attr({ "href": data[i].link, "target": "_blank", "id": i + "-link" });
        link.append("Link to Article")
        const commentDiv = $("<div>");
        commentDiv.attr({'id': i + "-comment-div", "class": "comment-div"});
        commentDiv.addClass("col-md-6")
        commentDiv.append("<h3><u>Articles Comments</u></h3>")
        const commentsDisplay = $("<div>");
        commentsDisplay.attr("id", data[i]._id + "-comments")
        const commentText = $("<textarea>");
        commentText.attr({"id": i + "-comment-input", "class": "comment-text-area"});
        const addComments = $("<button>");
        addComments.attr({"class": "add-comment-btn", "id": [data[i]._id, i]})
        addComments.append("Add a Comment");
        articleInfo.append([image, cardText, link])
        commentDiv.append([ commentsDisplay, commentText, addComments ])
        cardBody.append([articleInfo, commentDiv])
        card.append(cardBody);
        articleContainer.append(card);
        showComments(data[i]._id)       
      $("#saved-articles").append(articleContainer);
    }
})


$(document).on("click", ".save-button", function(event) {
    const index = $(this).attr("id").slice(0, 1);
    const result = {
        title: $("#" + index + "-header").text(),
        image: $("#" + index + "-image").attr("src"),
        summary: $("#" + index + "-text").text(),
        link: $("#" + index + "-link").attr("href")
    }
    $.ajax({
        method: "POST",
        url: "/save",
        data: result
    }).then(function(data) {
        console.log(data)
    }).catch(function(error) {
        return error;
    })
})

function showComments(id) {
    $.ajax({
        method: "GET",
        url: "/articles/" + id
    })
    .then(function(data) {
        console.log(data);
        let comments = data.comments;
        console.log(comments)
        comments.forEach(element => {
            $("#" + id + "-comments").append(element.comment + "<br>")
        });
        
    })
}

function submitComment() {
    let _id = $(this).attr("id");
    _id = _id.slice(0, _id.length - 2)
    let articleNum = $(this).attr("id")
    articleNum = articleNum.slice(articleNum.length - 1, articleNum.length)
    let comment = $("#" + articleNum + "-comment-input").val();
    $.ajax({
        method: 'POST',
        url: '/articles/' + _id,
        data: {
            comment: comment
        }
    })
    .then(function(data) {
        location.reload();
        $("#" + articleNum + "-comment-input").empty();
    })

    .catch(function(error) {
        return error
    })
}
$(document).on("click", ".add-comment-btn", submitComment);
  