import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <h1>Welcome to CHARUSAT!</h1>
      <h2>Current Local Date and Time:</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {currentTime.toLocaleString()}
      </p>
    </div>
  );
};

export default App;
