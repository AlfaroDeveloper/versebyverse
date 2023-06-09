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
const comment_Array_Four = [];
const originalText = [];
const strongsArray = [];
let lastTyped, commentOne, commentTwo, commentThree, commentFour, OG, s;

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
function formatBookInput(book) {
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
  if (book.includes("1") || book.includes("2")) {
		book = book[0] + book[1].toUpperCase() + book[2];
	} else {
		book = book[0].toUpperCase() + book.slice(1);
	}
	console.log(book);
 
    return book;
  }
function code(string) {
  let bookCode;

  switch (string) {
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
    case "1Sa":
      bookCode = 9;
      break;
    case "2Sa":
      bookCode = 10;
      break;
    case "1Ki":
      bookCode = 11;
      break;
    case "2Ki":
      bookCode = 12;
      break;
    case "1Ch":
      bookCode = 13;
      break;
    case "2Ch":
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
    case "1Co":
      bookCode = 46;
      break;
    case "2Co":
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
    case "1Th":
      bookCode = 52;
      break;
    case "2Th":
      bookCode = 53;
      break;
    case "1Ti":
      bookCode = 54;
      break;
    case "2Ti":
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
    case "1Pe":
      bookCode = 60;
      break;
    case "2Pe":
      bookCode = 61;
      break;
    case "1Jn":
      bookCode = 62;
      break;
    case "2Jn":
      bookCode = 63;
      break;
    case "3Jn":
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
    commentFour,
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
  
  let book = formatBookInput(req.params.book);
  let inputNumberAdjusted = hasNumber(req.params.book);
  let NT_OT = NT(inputNumberAdjusted, book);
  
  // urls to get data from
  let urls = [
    `https://gentle-clam-frock.cyclic.app/verse/${book}/${req.params.chapter}/${req.params.verse}`,
    `https://www.studylight.org/commentaries/eng/spe/${inputNumberAdjusted}-${req.params.chapter}.html#verse-${req.params.verse}`,
    `https://www.studylight.org/commentaries/eng/bnb/${inputNumberAdjusted}-${req.params.chapter}.html#verse-${req.params.verse}`,
    `https://www.studylight.org/commentaries/eng/jfu/${inputNumberAdjusted}-${req.params.chapter}.html#verse-${req.params.verse}`,
    `https://www.studylight.org/interlinear-study-bible/${NT_OT}/${req.params.chapter}-${req.params.verse}.html`,
    `https://www.studylight.org/commentaries/eng/bcc/${inputNumberAdjusted}-${req.params.chapter}.html#verse-${req.params.verse}`,
  ];
  const request = urls.map((url) => axios.get(url));
  axios
    .all(request)
    .then((response) => {
      // Websites
      let searchedVerse = response[0].data;
      let secondHtml = response[1].data;
      let thirdHtml = response[2].data;
      let fourthHtml = response[3].data;
      let fithHtml = response[4].data;
      let sixthHtml = response[5].data;
      // Cheerio Loader
      let $;

      // Website One Bible verse
      let text = searchedVerse.verse;
      let verse = searchedVerse.verseText;
      bibleVerses.push({
        text,
        verse,
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
      $ = cheerio.load(sixthHtml);
      $(".commentaries-entry-div", sixthHtml).each(function () {
        let jsonVerse = $(this).find("h3").text();
        let name = `${req.params.book} ${req.params.chapter} ${jsonVerse}`;
        let commentary = $(this).find("p").text();

        comment_Array_Four.push({
          name,
          jsonVerse,
          commentary,
        });
      });

      // Formatting returned data
      OG = arrayLength(originalText, count);
      lastTyped = firstIndex(bibleVerses);
      commentFour = containsSearchedData(
        comment_Array_Four,
        req.params.verse,
        req.params.book,
        req.params.chapter
      );
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
