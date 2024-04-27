const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  gsId: {
    type: String,
    required: true,
  },
  publications: {
    type: [
      {
        Title: String,
        Authors: String,
        "Publication date": String,
        Type: String,
        Volume: String,
        Issue: String,
        Pages: String,
        Publisher: String,
        Description: String,
        "Total Citations": String,
      },
    ],
  },
});

module.exports = mongoose.model("Publications", publicationSchema);
