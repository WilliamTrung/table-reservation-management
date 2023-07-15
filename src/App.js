// App.js
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginGoogle from './pages/login';
import "./App.css";
import "./Loading.css";
import { Component } from 'react';
import ErrorPage from './pages/error';
import MainPage from './pages/main';
import ProfileComponent from './pages/profile';
class App extends Component {
  render() {
    return (
      <>
      <BrowserRouter basename='/'>
        <Routes>          
          <Route path='*' element={<ErrorPage/>}/>
          <Route path="/login" element={<LoginGoogle />} />
          <Route path="/" element={<MainPage/>}/>
          <Route path='/profile' element={<ProfileComponent/>}/>
        </Routes>
      </BrowserRouter>
      </>
    );
  }
}

export default App;