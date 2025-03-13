import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { decode } from "html-entities"; // Import html-entities to decode API response
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const TriviaTable = () => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("");

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
          setQuestions(formattedData.sort((a,b) => {
            const catA = a.category.toUpperCase();
            const catB = b.category.toUpperCase();
            if (catA < catB) {
              return -1;
            }
            if (catA > catB) {
              return 1;
            }

            return 0;
          }));
        }
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  // Function to handle difficulty selection
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  // Filter questions based on difficulty selection
  const filteredQuestions = difficulty
    ? questions.filter((q) => q.difficulty === difficulty)
    : questions;

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
    <div className="container mt-4">
      <h2 className="text-center">Trivia Questions</h2>

      {/* Difficulty Dropdown */}
      <div className="d-flex justify-content-center mb-3">
        <label htmlFor="difficulty">Filter by Difficulty: </label>
          <select id="difficulty" value={difficulty} onChange={handleDifficultyChange}>
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Correct Answer</th>
              <th>Incorrect Answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q, index) => (
              <tr key={index}>
                <td>{q.question}</td>
                <td>{q.category}</td>
                <td className="text-capitalize">{q.difficulty}</td>
                <td className="text-success fw-bold">{q.correct_answer}</td>
                <td className="text-danger">{q.incorrect_answers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-primary" onClick={() => console.log(filteredQuestions)}>Print to Console</button>
        <button className="btn btn-success" onClick={downloadJSON}>Download JSON</button>
        <button className="btn btn-warning" onClick={downloadCSV}>Download CSV</button>
      </div>
    </div>
  );
};

export default TriviaTable;