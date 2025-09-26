import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  const incrementFive = () => setCount(prevCount => prevCount + 5);

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(to right, #667eea, #764ba2);
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .app {
          text-align: center;
          width: 100%;
          max-width: 500px;
        }

        .card {
          background: white;
          padding: 30px 40px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.5s ease;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin: 20px 0;
        }

        button {
          padding: 10px 16px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          background-color: #6c63ff;
          color: white;
          cursor: pointer;
          transition: 0.2s ease-in-out;
        }

        button:hover {
          background-color: #5548d9;
          transform: scale(1.05);
        }

        input {
          padding: 10px;
          margin: 8px;
          width: 80%;
          max-width: 200px;
          border: 2px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          transition: 0.2s ease-in-out;
        }

        input:focus {
          border-color: #6c63ff;
          outline: none;
        }

        hr {
          margin: 25px 0;
          border: none;
          border-top: 1px solid #ddd;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="app">
        <div className="card">
          <h2>🧮 Counter App</h2>
          <h3>Count: {count}</h3>

          <div className="button-group">
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
            <button onClick={reset}>Reset</button>
            <button onClick={incrementFive}>+5</button>
          </div>

          <hr />

          <h2>🧑 User Input</h2>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={e => setSurname(e.target.value)}
          />

          <h3>Hello, {firstName} {surname}</h3>
        </div>
      </div>
    </>
  );
};

export default App;
