var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: {
      type: String,
      requied: false
  },
  summary: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;