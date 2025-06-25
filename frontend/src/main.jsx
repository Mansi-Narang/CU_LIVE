import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css'
import App from './App.jsx'
import Event from './User/Event.jsx';
import Login from './components/Login.jsx';
import { AuthProvider } from "../src/context/AuthContext.jsx";
import Panel from './Admin/Panel.jsx';
import Signup from './components/Signup.jsx';
import CreateEventForm from './components/CreateEventForm.jsx';
import ReactLenis from 'lenis/react';
import ProtectedRoute from './context/ProtectedRoute.jsx';


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/events/:eventId' element={
          <ProtectedRoute>
            <Event />+
            
          </ProtectedRoute>
        } />
        <Route path='/organizer' element={<Panel />} />
        <Route path='/events/create' element={<CreateEventForm />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)
