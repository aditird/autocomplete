import React, { useState } from 'react';

const CodeEditor = () => {
  const [code, setCode] = useState(""); // To track the code entered by the user
  const [completion, setCompletion] = useState(""); // To store the autocomplete result
  const [loading, setLoading] = useState(false); // To show a loading indicator

  const handleCodeChange = (event) => {
    setCode(event.target.value); // Update the code as user types
  };

  const handleAutocomplete = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code, language: 'Java' }),
      });

      const data = await response.json();
      setCompletion(data.completion); // Set the autocomplete result in the state
    } catch (error) {
      console.error("Error during autocomplete request:", error);
      setCompletion("Failed to fetch completion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={code}
        onChange={handleCodeChange}
        placeholder="Write your code here"
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={handleAutocomplete} disabled={loading}>
        {loading ? 'Loading...' : 'Autocomplete'}
      </button>
      <div>
        <h3>Autocomplete Result:</h3>
        <pre>{completion}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
