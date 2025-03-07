// Import Required Modules
const axios = require("axios"); // For making API requests
const fs = require("fs"); // Built-in module for file operations
const createCsvWriter = require("csv-writer").createObjectCsvWriter; // For writing CSV files
const { decode } = require("html-entities");

// Fetch Multiple Questions at Once
async function fetchData(count) {
  try {
    // const response = await axios.get("https://bored-api.appbrewery.com/random"); // not working, 502 Bad Gateway
    const response = await axios.get(`https://opentdb.com/api.php?amount=${count}`); // Trivia Questions DB
    const results = response.data.results; // Get all questions

    if (!results || results.length === 0) {
      throw new Error("No questions returned by the API.");
    }

    return results.map(result => ({
      question: decode(result.question), // Decode HTML entities
      category: decode(result.category),
      difficulty: result.difficulty,
      correct_answer: decode(result.correct_answer),
      incorrect_answers: result.incorrect_answers.map(decode).join(", "),
    }));
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null; // Return null so main() knows there's an error
  }
}

// Save Data as JSON
function saveAsJson(data) {
  fs.writeFileSync("questions.json", JSON.stringify(data, null, 2)); // JSON.stringify(value, replacer, space) // 2 for adding line breaks and indentation
  console.log("Data saved as questions.json");
}

// Save Data as CSV
function saveAsCsv(data) {
  const csvWriter = createCsvWriter({
    path: "questions.csv",
    header: [
      { id: "question", title: "Question" },
      { id: "category", title: "Category" },
      { id: "difficulty", title: "Difficulty" },
      { id: "correct_answer", title: "Correct Answer" },
      { id: "incorrect_answers", title: "Incorrect Answers" }, // Stored as a comma-separated string
    ],
  });

  csvWriter
    .writeRecords(data)
    .then(() => console.log("Data saved as questions.csv"));
}

// Print Data to Console
function printToConsole(data) {
  console.log("Fetched Questions:", JSON.stringify(data, null, 2));
}

// Handle User Input & Run the Program
async function main() {
  const args = process.argv.slice(2); // Get command line arguments
  const countIndex = args.indexOf("-n");
  const formatIndex = args.indexOf("-f");

  const count = countIndex !== -1 && args[countIndex + 1] ? parseInt(args[countIndex + 1], 10) : 1; // Default to 1
  const format = formatIndex !== -1 && args[formatIndex + 1] ? args[formatIndex + 1] : "console"; // Default to 'console'

  // Validate count
  if (isNaN(count) || count <= 0) {
    console.log("Invalid number of requests. Please enter a valid number.");
    return;
  }

  console.log(`Fetching ${count} questions...`);
  const questions = await fetchData(count);

  // Stop execution if fetching failed (questions is null)
  if (!questions || questions.length === 0) {
    console.log("No questions retrieved. Please try again.");
    return;
  }

  // Handle output format
  if (format === "json") {
    saveAsJson(questions);
  } else if (format === "csv") {
    saveAsCsv(questions);
  } else if (format === "console") {
    printToConsole(questions);
  } else {
    console.log("Invalid format. Use 'json', 'csv', or 'console'.");
  }
}

main();

/*
SAMPLE
input:
node questions.js -n 5 -f csv

args array will look like this::
[
  "node",
  "/path/to/questions.js",
  "-n",
  "5",
  "-f",
  "csv"
]

// "-n" at index 2
// "5" at index 3
// "-f" at index 4
// "csv" at index 5

count = 5;
format = "csv";
*/