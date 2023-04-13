import React from 'react';
import logo from './logo.svg';
import './App.css';
import dayjs from 'dayjs'

function App() {
  return (
    <div className='h-screen w-full bg-slate-500 text-white whitespace-pre p-5'>
    {
      `
Good time to realize I've never actually created a React Project, just have contriubted a 
couple thousand to projects created by others. Yipeee....

${dayjs().format("DD MMMM YYYY - dddd   hh:mm:ss")}
      `
    }
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
