import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [calculations, setCalculations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:8000/calculations/${inputValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: inputValue }),
      });
  
      const data = await response.json();
      setResponseData(data);
      fetchCalculations();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCalculations = async () => {
    try {
      const response = await fetch('http://localhost:8000/calculations/');
      const data = await response.json();
      setCalculations(data);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);
  return (
    <div className="App">
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter data"
        />
        <button type="submit">Submit</button>
      </form>

      {responseData && (
        <div>
          <h2>Le resultat est : {JSON.stringify(responseData.result, null, 2)}</h2>
        </div>
      )}

      <h2>All Calculations</h2>
      <table>
        <thead>
          <tr>
            <th>Operation</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {calculations.map((calculation) => (
            <tr key={calculation.id}>
              <td>{calculation.expression}</td>
              <td>{calculation.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
