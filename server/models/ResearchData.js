const mongoose = require("mongoose");

const researchDataSchema = new mongoose.Schema({
  gsId: {
    type: String,
    required: true,
  },
  citationsCount: {
    type: String,
    required: true,
  },
  hIndex: {
    type: String,
    required: true,
  },
  iIndex: {
    type: String,
    required: true,
  },
  papersCount: {
    type: Number,
    required: true,
  },
  citationsPerYear: {
    type: Object,
    required: true,
  },
  publications: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publications",
  },
});

module.exports = mongoose.model("ResearchData", researchDataSchema);
