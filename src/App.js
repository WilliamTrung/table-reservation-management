// App.js
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginGoogle from './pages/login';
import "./App.css";
import "./Loading.css";
import "./Dashboard.css";
import { Component } from 'react';
import ErrorPage from './pages/error';
import Dashboard from './pages/main';
import ProfileComponent from './pages/profile';
import { ToastContainer } from 'react-toastify';
import NavigationBar from './pages/navigateBar';
import TableManagement from './pages/manage-table';
import UpdateTableComponent from './pages/manage-table/update';
import BookingPage from './pages/customer-service';
import './AssignTableToReservation.css';
import CustomerComponent from './pages/customer-service';
import ModifyReservationComponent from './pages/customer-service/modify';
import BookingComponent from './pages/customer-service/booking';
class App extends Component {
  render() {
    return (
      <div className='h-100'>
      <BrowserRouter basename='/table-reservation-management'>
        <NavigationBar />
        <Routes>          
          <Route path='*' element={<ErrorPage/>}/>
          <Route path="/login" element={<LoginGoogle />} />
          <Route path="/manage-table" element={<TableManagement />} />
          <Route path="/manage-table/update/:tableId" element={<UpdateTableComponent />}/>
          <Route path="/customer-service" element={<CustomerComponent />}/>
          <Route path="/customer-service/modify/:reservationId" element={<ModifyReservationComponent />} />
          <Route path="/booking" element={<BookingComponent />} />
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/booking" element={<BookingPage/>}/>
          {/* <Route path="/assign-table/:reservationId" element={<VacantTables />} /> */}
          <Route path='/profile' element={<ProfileComponent/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
      </div>
    );
  }
}

export default App;