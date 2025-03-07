import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { decode } from "html-entities"; // Import html-entities to decode API response

const TriviaTable = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=15")
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          const formattedData = data.results.map((q) => ({
            question: decode(q.question), // Decode HTML entities
            category: decode(q.category),
            difficulty: q.difficulty,
            correct_answer: decode(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(decode).join(", "),
          }));
          setQuestions(formattedData);
        }
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  // JSON & CSV download functions remain the same
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" }); // Store it in a Blob (virtual file)
    const url = URL.createObjectURL(blob); // Create a temporary URL pointing to the Blob
    const link = document.createElement("a"); // Create an invisible <a> link
    link.href = url; // and assign the URL
    link.setAttribute("download", "trivia_questions.json"); // Set the download attribute to "trivia_questions.json"
    document.body.appendChild(link); // making the link part of the document so user can "click" it
    link.click(); // Programmatically click the link/anchor tag to start downloading
    document.body.removeChild(link); // Remove the <a> tag to clean up the DOM
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(questions); // converts JSON questions array into a CSV-formatted string
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "trivia_questions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Trivia Questions</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Question</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Correct Answer</th>
            <th>Incorrect Answers</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr key={index}>
              <td>{q.question}</td>
              <td>{q.category}</td>
              <td>{q.difficulty}</td>
              <td>{q.correct_answer}</td>
              <td>{q.incorrect_answers}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => console.log(questions)}>Print to Console</button>
      <button onClick={downloadJSON}>Download JSON</button>
      <button onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};

export default TriviaTable;