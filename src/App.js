import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const Examples = () => (
    <div>
      <p>Examples:</p>
      <p>1. Addition: 5 3 +</p>
      <p>2. Subtraction: 10 3 -</p>
      <p>3. Multiplication: 2 4 *</p>
      <p>4. Multiplication - Addition: 5 3 4 * +</p>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      setError('An error occurred while performing the calculation, please follow the structure of the exemples of NPI');
    }
  };

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/calculations/');
      const data = await response.json();
      setCalculations(data);
    } catch (error) {
      console.error('Error fetching calculations:', error);
      setError('An error occurred while fetching calculations.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('http://localhost:8000/export-csv/');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exported_data_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setError('An error occurred while exporting CSV.');
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  return (
    <div className="App">
      <p>If you want to know more about NPI, check this file: <a href="https://fr.wikipedia.org/wiki/Notation_polonaise_inverse" target="_blank" rel="noopener noreferrer">Wikipedia - Notation polonaise inverse</a></p>

      <Examples />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter data"
          title="Example: 5 3 + (Enter numbers and operators with spaces in between)"
        />
        <button type="submit">Submit</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {responseData && (
        <div>
          <h2>Le resultat est : {JSON.stringify(responseData.result, null, 2)}</h2>
        </div>
      )}



      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
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

          <h1>Exporter la data en CSV : <button className="export" onClick={handleExportCSV}>Export CSV</button></h1>

          <div>
            <h1>To get The Documentation: <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
              <button>View Documentation</button>
            </a></h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
