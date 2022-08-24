//starts by typing node app.js into the console, can accept params

const fs = require("fs"); //necessary to interact with local file system
const nReadlines = require("n-readlines"); //module that synchronously loads line by line using buffer (not in memory)
const INPUT_FILENAME = "ReadLines.txt";
const OUTPUT_FILENAME = "output.txt";
const inputLines = new nReadlines(INPUT_FILENAME); //instance of n-readlines line reader
/*
 * function that creates and/or empties a named file
 * w+ flag either opens and deletes a file's contents (if already exists) or creates a new one and opens it (if doesn't exist)
 */
const emptyOutputTextFile = () => {
  try {
    fs.writeFile(OUTPUT_FILENAME, "", { flag: "w+" }, (err) => {
      if (err) {
        console.error(err);
      }
    });
    return true;
  } catch (e) {
    console.error(e);
    console.log("-----Failed in emptyOutputTextFile-----");
    return false;
  }
};

/*
 * function that accepts a boolean for whether or not the subject data is text and writes data to a new file
 * if source data is text: loop through line by line (trimming whitespace), processing text  line with optional prepended or appended data, then write new line to output file
 * if source data is not text: loop through line by line (without trimming whitespace), processing line data with optional prepended or appended data, then write new line to output file
 */
const writeToOutputFile = (isText) => {
  //used to gather any console params
  const args = process.argv.length > 2 ? process.argv.slice(2) : false;

  //instantiating a "line" to be used with n-readlines
  let line;

  //initializes a counter
  let lineNum = 1;

  try {
    while ((line = inputLines.next())) {
      // set 3rd param to args[0] to accept console params as appended data or "" to not append anything
      const lineToWrite = buildLine(line, "", "", isText);
      //   const lineToWrite = buildLine(line, lineNum, "", isText);
      // const lineToWrite = buildLine(line, lineNum, args[0], isText);
      fs.appendFileSync(OUTPUT_FILENAME, lineToWrite, (err) => {
        if (err) {
          console.error(err);
          return false;
        }
      });
      console.log(line.toString());
      lineNum++;
    }
    console.log("-----Completed-----");
    return true;
  } catch (e) {
    console.error(e);
    console.log("-----Failed in writeToOutputFile-----");
    return false;
  }
};

/*
 * function that accepts one line from a file, data to prepend to that line, and data to append to that line
 */
const buildLine = (line, toPrepend, toAppend, isText) => {
  if (isText) {
    // pattern for writing commands to console input
    if (toAppend === "addDate") {
      return `${toPrepend} ${line.toString().trim()} ${Date.now()}\n`;
    } else {
      return `${toPrepend} ${line.toString().trim()}${toAppend}\n`;
    }
  } else {
    return `${toPrepend} ${line} ${toAppend}\n`;
  }
};

//writeToOutputFile only runs if successful emptyOutputTextFile return
emptyOutputTextFile() && writeToOutputFile(true);
