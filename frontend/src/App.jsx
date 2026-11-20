import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header.jsx';
import Footer from './components/layout/Footer/Footer.jsx';
import ChatWidget from './components/chat/ChatWidget.jsx';
import Home from './pages/Home/Home.jsx';
import Schedules from './pages/Schedules/Schedules.jsx';
import RoutesPage from './pages/Routes/Routes.jsx';
import Announcements from './pages/Announcements/Announcements.jsx';
import About from './pages/About/About.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Services from './pages/Services/Services.jsx';
import Admin from './pages/Admin/Admin.jsx';
import AdminLogin from './pages/AdminLogin/AdminLogin.jsx';
import Auth from './pages/Auth/Auth.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './App.css';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
