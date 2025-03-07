# First Circle Junior Developer Take-Home Test

## Backend Utility

This utility fetches trivia questions from the Open Trivia Database API and saves the data in JSON and CSV formats.

### How to Run the Backend Utility

1. **Install dependencies**
   ```sh
   cd fc-backend-task
   npm install axios fs csv-writer html-entities
   ```
2. **Run the script**
   ```sh
   node questions.js -n 5 -f json
   ```
3. **Output**
   - The fetched trivia data will be saved as `trivia_questions.json` and `trivia_questions.csv`.

### Dependencies

- Node.js
- Axios (for API requests)
- fs (for file handling)
- csv-writer (for CSV file generation)
- html-entities (for decoding HTML entities)



---

## Frontend Application

A simple React app that displays trivia questions in a table and allows downloading them as JSON or CSV.

### How to Run the Frontend

1. **Navigate to the frontend folder**
   ```sh
   cd fc-frontend-task
   ```
2. **Install dependencies**
   ```sh
   npm install react react-dom react-scripts papaparse html-entities
   ```
3. **Start the application**
   ```sh
   npm start
   ```
4. **Open the browser** and visit `http://localhost:3000`.

### Dependencies

- React
- react-dom
- react-scripts
- papaparse (for CSV generation)
- html-entities (to decode API responses)