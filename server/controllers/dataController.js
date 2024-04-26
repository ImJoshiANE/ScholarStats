// ---------- External Imports ----------
const puppeteer = require('puppeteer');
const { Parser } = require('json2csv');
const fs = require('fs');

// ---------- Internal Imports ----------
const {makeUrl} = require("../utils/makeUrl");

exports.fetchData = async (req, res, err) => {
    const gsId = req.body.gsId;
    const url = makeUrl(gsId);

    // opening the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    const scholarArticles = await page.evaluate(() => {
      // Use JavaScript to extract data from the page
      const articles = Array.from(document.querySelectorAll('a.gsc_a_at')).map(a => a.href);
      const titles = Array.from(document.querySelectorAll('a.gsc_a_at')).map(a => a.textContent);
      return {titles, articles}
    });

    // console.log(scholarArticles);

    // console.log(scholarArticles);
    const journalDataField = ['Title', 'Authors', 'Publication date', 'Journal', 'Volume', 'Issue', 'Pages', 'Publisher', 'Description'];
    const journalData = [];

    const conferenceDataField = ['Title', 'Authors', 'Publication date', 'Conference', 'Pages', 'Publisher', 'Description'];
    const conferenceData = [];

    for(let i=0; i<scholarArticles.articles.length; i++){
      await page.goto(scholarArticles.articles[i]);

      const publicationData = await page.evaluate( () =>{
        const attributes = Array.from(document.querySelectorAll('div.gsc_oci_field')).map(div => div.textContent);
        const values = Array.from(document.querySelectorAll('div.gsc_oci_value')).map(div => div.textContent);

        return {attributes, values};
      });

      const {attributes, values} = publicationData;
      let isJournal = true;
      const obj = {};
      obj["Title"] = scholarArticles.titles[i];

      for(let i=0; i<attributes.length; i++){
        if(attributes[i]=='Total citations' || attributes[i]=='Scholar articles' || attributes[i]==undefined) continue;
        if(attributes[i]=='Conference') isJournal = false;
        obj[attributes[i]] = values[i];
      }

      if(isJournal) journalData.push(obj);
      else conferenceData.push(obj);
    }

    console.log(journalData);
    console.log(conferenceData);

    // Converting to CSV -- Journal Data and saving it.
    let json2csvParser = new Parser({ journalDataField });
    const journalDatacsv = json2csvParser.parse(journalData.map((item) => {
      const obj = {};
      for(let i=0; i<journalDataField.length; i++){
        obj[journalDataField[i]] = item[journalDataField[i]] || "N/A";
      }
      return obj;
    }));

    let filePath = `./csvdata/journal_data_${gsId}.csv`;
    fs.writeFile(filePath, journalDatacsv, (err) => {
      if (err) {
        console.error('Error saving CSV file:', err);
      } else {
        console.log('CSV file saved successfully:', filePath);
      }
    });

    // Converting to CSV -- Conference Data and saving it
    json2csvParser = new Parser({ conferenceDataField });
    const conferenceDatacsv = json2csvParser.parse(conferenceData.map((item) => {
      const obj = {};
      for(let i=0; i<conferenceDataField.length; i++){
        obj[conferenceDataField[i]] = item[conferenceDataField[i]] || "N/A";
      }
      return obj;
    }));

    filePath = `./csvdata/conference_data_${gsId}.csv`;
    fs.writeFile(filePath, conferenceDatacsv, (err) => {
      if (err) {
        console.error('Error saving CSV file:', err);
      } else {
        console.log('CSV file saved successfully:', filePath);
      }
    });

    // closing the browser
    await browser.close();
}