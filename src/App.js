// App.js
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginGoogle from './pages/login';
import "./App.css";
import { Component } from 'react';
import ErrorPage from './pages/error';
import MainPage from './pages/main';
class App extends Component {
  render() {
    return (
      <>
      <BrowserRouter basename='/'>
      <h1>In BrowserRouter but not Routes</h1>
        <Routes>          
          <Route path='*' element={<ErrorPage/>}/>
          <Route path="/login" element={<LoginGoogle />} />
          <Route path="/" element={<MainPage/>}/>
        </Routes>
      </BrowserRouter>
      </>
    );
  }
}

export default App;