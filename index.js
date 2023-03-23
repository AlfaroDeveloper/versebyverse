const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const { engine } = require("express-handlebars");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static("images"));

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./views");

// storing data in arrays
const bibleVerses = [];
const comment_Array_One = [];
const comment_Array_Two = [];
const comment_Array_Three = [];
const originalText = [];
const strongsArray = [];
let lastTyped, commentOne, commentTwo, commentThree, OG, s;

function containsSearchedData(arr, verse, book, chapter) {
  //console.log("v", verse, " ", "ch", chapter, " ", "b", book)
  if (
    arr.filter((index) => index["jsonVerse"] === `Verse ${verse}`) &&
    arr.filter((index) => index["name"] === `${book} ${chapter}:${verse}`)
  ) {
    const i = arr.findIndex(
      (e) => e.name === `${book} ${chapter} Verse ${verse}`
    );
    return arr[i];
  }
}
function firstIndex(arr) {
  return arr[arr.length - 1];
}
function checkBook(book) {
  book.toLowerCase();
  switch (book) {
    case "ezekiel":
      book = "ezk";
      break;
    case "judges":
      book = "jdg";
      break;
    case "philippians":
      book = "php";
      break;
    case "nahum":
      book = "nam";
      break;
    case "mark":
      book = "mrk";
      break;
    case "john":
      book = "jhn";
      break;
    case "philemon":
      book = "phm";
      break;
    case "james":
      book = "jas";
      break;
    case "1john":
      book = "1jn";
      break;
    case "2john":
      book = "2jn";
      break;
    case "3john":
      book = "3jn";
      break;
    default:
      book = book.substring(0, 3);
      break;
  }
  return book;
}
function hasNumber(string) {
  string.toLowerCase();
  if (string == "sng") {
    string = "song-of-solomon";
  }
  if (string[0].includes("1") || string[0].includes("2")) {
    string = string[0].replace("1", "1-") + string.slice(1);
    string = string[0].replace("2", "2-") + string.slice(1);
    return string;
  } else {
    return string;
  }
}
function code(string) {
  let bookCode;
  let deciphering = string.split(".");

  switch (deciphering[0].trim()) {
    case "Gen":
      bookCode = 1;
      break;
    case "Exo":
      bookCode = 2;
      break;
    case "Lev":
      bookCode = 3;
      break;
    case "Num":
      bookCode = 4;
      break;
    case "Deu":
      bookCode = 5;
      break;
    case "Jos":
      bookCode = 6;
      break;
    case "Jdg":
      bookCode = 7;
      break;
    case "Rut":
      bookCode = 8;
      break;
    case "1sa":
      bookCode = 9;
      break;
    case "2sa":
      bookCode = 10;
      break;
    case "1ki":
      bookCode = 11;
      break;
    case "2ki":
      bookCode = 12;
      break;
    case "1ch":
      bookCode = 13;
      break;
    case "2ch":
      bookCode = 14;
      break;
    case "Ezr":
      bookCode = 15;
      break;
    case "Neh":
      bookCode = 16;
      break;
    case "Est":
      bookCode = 17;
      break;
    case "Job":
      bookCode = 18;
      break;
    case "Psa":
      bookCode = 19;
      break;
    case "Pro":
      bookCode = 20;
      break;
    case "Ecc":
      bookCode = 21;
      break;
    case "Sng":
      bookCode = 22;
      break;
    case "Isa":
      bookCode = 23;
      break;
    case "Jer":
      bookCode = 24;
      break;
    case "Lam":
      bookCode = 25;
      break;
    case "Eze":
      bookCode = 26;
      break;
    case "Dan":
      bookCode = 27;
      break;
    case "Hos":
      bookCode = 28;
      break;
    case "Joe":
      bookCode = 29;
      break;
    case "Amo":
      bookCode = 30;
      break;
    case "Oba":
      bookCode = 31;
      break;
    case "Jon":
      bookCode = 32;
      break;
    case "Mic":
      bookCode = 33;
      break;
    case "Nam":
      bookCode = 34;
      break;
    case "Hab":
      bookCode = 35;
      break;
    case "Zep":
      bookCode = 36;
      break;
    case "Hag":
      bookCode = 37;
      break;
    case "Zec":
      bookCode = 38;
      break;
    case "Mal":
      bookCode = 39;
      break;
    case "Mat":
      bookCode = 40;
      break;
    case "Mrk":
      bookCode = 41;
      break;
    case "Luk":
      bookCode = 42;
      break;
    case "Jhn":
      bookCode = 43;
      break;
    case "Act":
      bookCode = 44;
      break;
    case "Rom":
      bookCode = 45;
      break;
    case "1co":
      bookCode = 46;
      break;
    case "2co":
      bookCode = 47;
      break;
    case "Gal":
      bookCode = 48;
      break;
    case "Eph":
      bookCode = 49;
      break;
    case "Php":
      bookCode = 50;
      break;
    case "Col":
      bookCode = 51;
      break;
    case "1th":
      bookCode = 52;
      break;
    case "2th":
      bookCode = 53;
      break;
    case "1ti":
      bookCode = 54;
      break;
    case "2ti":
      bookCode = 55;
      break;
    case "Tit":
      bookCode = 56;
      break;
    case "Phm":
      bookCode = 57;
      break;
    case "Heb":
      bookCode = 58;
      break;
    case "Jas":
      bookCode = 59;
      break;
    case "1pe":
      bookCode = 60;
      break;
    case "2pe":
      bookCode = 61;
      break;
    case "1jhn":
      bookCode = 62;
      break;
    case "2jhn":
      bookCode = 63;
      break;
    case "3jhn":
      bookCode = 64;
      break;
    case "Jud":
      bookCode = 65;
      break;
    case "Rev":
      bookCode = 66;
      break;
  }

  return bookCode;
}
function NT(string, book) {
  book = code(book);
  if (book <= 39) {
    string = `hebrew/${string}`;
  } else {
    string = `greek/${string}`;
  }
  return string;
}
function arrayLength(array, iteration) {
  let newArray = [];
  let val = "";
  for (let i = 1; i <= iteration; i++) {
    val = array[array.length - 1];
    array.pop();

    newArray.push(val);
  }
  newArray.reverse();
  return newArray;
}
function strongsFormat(arr) {
  arr.pop();
  return arr[arr.length - 1];
}

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.render("home");
});

app.get("/bibleStudy", (req, res) => {
  let imageList = [];
  imageList.push({ src: "/images/icon.png", name: "logo" });
  res.header("Access-Control-Allow-Origin", "*");
  res.render("index", {
    lastTyped,
    commentOne,
    commentTwo,
    commentThree,
    OG,
    imageList,
    strongsArray,
    s,
  });
});

app.get("/json", (req, res) => {
  res.json({
    lastTyped,
    commentOne,
    commentTwo,
    commentThree,
    OG,
    strongsArray,
    s,
  });
});

app.get("/verse/:book/:chapter/:verse", (req, res) => {
  // url parameters
  let book = checkBook(req.params.book);

  const verse = `${book}.${req.params.chapter}.${req.params.verse}`;
  const firstLetterUppercaseVerse =
    verse.charAt(0).toUpperCase() + verse.slice(1);

  let inputNumberAdjusted = hasNumber(req.params.book);

  let NT_OT = NT(inputNumberAdjusted, firstLetterUppercaseVerse);

  // urls to get data from
  let urls = [
    `https://www.bible.com/bible/100/${firstLetterUppercaseVerse.toUpperCase()}.NASB1995`,
    `https://www.studylight.org/commentaries/eng/spe/${inputNumberAdjusted}-${req.params.chapter}.html#verse-${req.params.verse}`,
    `https://www.studylight.org/commentaries/eng/bnb/${inputNumberAdjusted}-${req.params.chapter}.html#verse-${req.params.verse}`,
    `https://www.studylight.org/commentaries/eng/jfu/${inputNumberAdjusted}-${req.params.chapter}.html#verse-${req.params.verse}`,
    `https://www.studylight.org/interlinear-study-bible/${NT_OT}/${req.params.chapter}-${req.params.verse}.html`,
  ];
  const request = urls.map((url) => axios.get(url));
  axios
    .all(request)
    .then((response) => {
      // Websites
      let html = response[0].data;
      let secondHtml = response[1].data;
      let thirdHtml = response[2].data;
      let fourthHtml = response[3].data;
      let fithHtml = response[4].data;
      // Cheerio Loader
      let $ = cheerio.load(html);

      // Website One Bible verse
      $(".center.pt3", html).each(function () {
        const verse = $(this).find(".tc.f3.f2-m").text();
        const text = $(this).find(".yv-gray50.lh-copy.f3-m").text();

        bibleVerses.push({
          verse,
          text,
        });
      });

      // Second Site is commentary
      $ = cheerio.load(secondHtml);
      $(".commentaries-entry-div", secondHtml).each(function () {
        let jsonVerse = $(this).find("h3").text();
        let name = `${req.params.book} ${req.params.chapter} ${jsonVerse}`;
        let commentary = $(this).find("p").text();

        comment_Array_One.push({
          name,
          jsonVerse,
          commentary,
        });
      });

      // Third Site is commentary
      $ = cheerio.load(thirdHtml);
      $(".commentaries-entry-div", thirdHtml).each(function () {
        let jsonVerse = $(this).find("h3").text();
        let name = `${req.params.book} ${req.params.chapter} ${jsonVerse}`;
        let commentary = $(this).find("p").text();

        comment_Array_Two.push({
          name,
          jsonVerse,
          commentary,
        });
      });

      // Second Site is commentary
      $ = cheerio.load(fourthHtml);
      $(".commentaries-entry-div", fourthHtml).each(function () {
        let jsonVerse = $(this).find("h3").text();
        let name = `${req.params.book} ${req.params.chapter} ${jsonVerse}`;
        let commentary = $(this).find("p").text();

        comment_Array_Three.push({
          name,
          jsonVerse,
          commentary,
        });
      });

      //   fith site original text
      $ = cheerio.load(fithHtml);
      let count = 0;
      let strongs;
      $(".int-word", fithHtml).each(function () {
        if (NT_OT.includes("greek")) {
          strongs = `g${$(this).attr("data-str")}`;
        } else {
          strongs = `h${$(this).attr("data-str")}`;
        }

        let ogText = $(this).find(".int-word-div-olt").text();
        let enText = $(this).find(".int-word-div-eng").text();
        count++;
        originalText.push({
          strongs,
          ogText,
          enText,
        });
      });

      //   sixth site commentary

      OG = arrayLength(originalText, count);

      // Formatting returned data
      lastTyped = firstIndex(bibleVerses);
      commentOne = containsSearchedData(
        comment_Array_One,
        req.params.verse,
        req.params.book,
        req.params.chapter
      );
      commentTwo = containsSearchedData(
        comment_Array_Two,
        req.params.verse,
        req.params.book,
        req.params.chapter
      );
      commentThree = containsSearchedData(
        comment_Array_Three,
        req.params.verse,
        req.params.book,
        req.params.chapter
      );
    })
    .catch((err) => console.log(err));
  res.header("Access-Control-Allow-Origin", "*");
});

app.get("/strong/:strongID", (req, res) => {
  axios
    .get(
      `https://www.blueletterbible.org/lexicon/${req.params.strongID}/nasb20`
    )
    .then((response) => {
      let html = response.data;
      let $ = cheerio.load(html);

      $(".lexStrongsDef", html).each(function () {
        let definition = $(this).find("p").text();

        strongsArray.push({
          definition,
        });
      });
      let strong = strongsFormat(strongsArray);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(strong);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Listening on port: https://localhost:${PORT}`);
});
