import { useEffect, useState } from 'react'
import socket from './utilities/socketConnection'
import './App.css';
import Widget from './components/Widget';

function App() {
  const [performanceData, setPerformanceData] = useState({})

  useEffect(() => {
    socket.on('data', data => {
      setPerformanceData({
        ...performanceData,
        [data.macA]: data,
      })
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {Object.entries(performanceData).map(entry => {
          const [key, value] = entry
          return <Widget data={value} key={key} />
        })}
      </header>
    </div>
  );
}

export default App;
