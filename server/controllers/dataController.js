// ---------- External Imports ----------
const cheerio = require("cheerio");
const axios = require("axios");
const { Parser } = require("json2csv");
const fs = require("fs");

// ---------- Internal Imports ----------
const Publications = require("../models/Publications");
const ResearchData = require("../models/ResearchData");
const { makeUrl } = require("../utils/makeUrl");
const catchAsync = require("../utils/catchAsync");

// Call this function to apply "cheerio-scraping" to the profile page and get the metadata
const fetchPublicationMetaData = async (url, gsId) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const articles = $("a.gsc_a_at")
    .map((index, element) => $(element).attr("href"))
    .get();
  const titles = $("a.gsc_a_at")
    .map((index, element) => $(element).text())
    .get();
  const citationYear = $("span.gsc_g_t")
    .map((index, element) => $(element).text())
    .get();
  const citationCountPerYear = $("span.gsc_g_al")
    .map((index, element) => $(element).text())
    .get();
  const citationsData = $("tr > td.gsc_rsb_std:nth-child(2)")
    .map((index, element) => $(element).text())
    .get();

  return {
    titles,
    articles,
    citationYear,
    citationCountPerYear,
    citationsData,
  };
};

// Call this function to fetch publication data from the article page
const fetchPublicationData = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const attributes = $("div.gsc_oci_field")
      .map((index, element) => $(element).text())
      .get();
    const values = $("div.gsc_oci_value")
      .map((index, element) => $(element).text())
      .get();

    attributes.push("Total Citations");
    values.push($("div.gsc_oci_value > div > a").text());

    return { attributes, values };
  } catch (error) {
    console.error("Error fetching publication data:", error);
    return null;
  }
};

// Call this to prepare publication
const preparePublication = (publicationData) => {
  const singlePublication = {};

  const { attributes, values } = publicationData;
  let isJournal = true;

  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i] == "Scholar articles" || attributes[i] == undefined)
      continue;
    if (attributes[i] == "Conference") isJournal = false;
    singlePublication[attributes[i]] = values[i];
  }

  if (isJournal) singlePublication["Type"] = "Journal";
  else singlePublication["Type"] = "Conference";

  return singlePublication;
};

// Convert data to CSV and save it to the file and update link in the database
const convertToCsvAndSave = async (gsId, publication, publicationDataField) => {
  let json2csvParser = new Parser({ publicationDataField });

  const publicationDataCSV = json2csvParser.parse(
    publication.map((item) => item)
  );

  let filePath = `./public/publications_${gsId}.csv`;

  fs.writeFile(filePath, publicationDataCSV, (err) => {
    if (err) {
      console.error("Error saving CSV file:", err);
    }
  });
};

// call this function to create object from keys and values arrays
function createObject(keys, values) {
  const result = {};

  // Iterate over the keys array
  keys.forEach((key, index) => {
    // Add key-value pair to the result object
    result[key] = values[index];
  });

  return result;
}

// Handler for /user/fetchData
exports.fetchData = async (req, res, err) => {
  const gsId = req.body.gsId;
  const url = makeUrl(gsId);

  const scholarArticles = await fetchPublicationMetaData(url, gsId);

  const publicationDataField = [
    "Title",
    "Authors",
    "Publication date",
    "Type",
    "Volume",
    "Issue",
    "Pages",
    "Publisher",
    "Description",
    "Total Citations",
  ];

  const publications = [];

  for (let i = 0; i < scholarArticles.articles.length; i++) {
    const publicationUrl =
      "https://scholar.google.com/" + scholarArticles.articles[i];
    const publicationData = await fetchPublicationData(publicationUrl);

    const singlePublication = preparePublication(publicationData);
    singlePublication["Title"] = scholarArticles.titles[i];

    const obj = {};
    for (let i = 0; i < publicationDataField.length; i++) {
      obj[publicationDataField[i]] =
        singlePublication[publicationDataField[i]] || "N/A";
    }
    publications.push(obj);
  }

  convertToCsvAndSave(gsId, publications, publicationDataField);
  const downloadUrl = process.env.DOMAIN_NAME;
  +`/publications_${gsId}.csv`;

  // console.log(publications);

  const publicationsInstance = await Publications.create({
    gsId: gsId,
    publications: publications,
  }); // Save the data to the database

  await ResearchData.create({
    gsId: gsId,
    citationsCount: scholarArticles.citationsData[0],
    hIndex: scholarArticles.citationsData[1],
    iIndex: scholarArticles.citationsData[2],
    papersCount: publications.length,
    citationsPerYear: createObject(scholarArticles.citationYear, scholarArticles.citationCountPerYear),
    publications: publicationsInstance._id,
  });

  const researchInstance = await ResearchData.findOne({ gsId: gsId }).populate('publications').exec();

  res.status(200).json({
    researchInstance
  });
};
