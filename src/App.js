// App.js
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginGoogle from './pages/login';
import "./App.css";
import { Component } from 'react';
class AppTest extends Component {
  render() {
    return (
      <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginGoogle />} />
        </Routes>
      </BrowserRouter>
        
      </>
    );
  }
}
const App = () => {
 return (
    <>
    <div>      
        <Routes>
          <Route path="/login" element={<LoginGoogle />} />
       </Routes>
    </div>       
    </>
 );
};

export default AppTest;