import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar.js';
import Footer from '../components/common/Footer.js';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;