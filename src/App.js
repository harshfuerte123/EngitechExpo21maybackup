import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Exhibitors from "./pages/Exhibitors";
import FAQs from "./pages/FAQs";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Gallery from "./pages/Gallery";
import Sponsors from "./pages/Sponsors";
import StallBooking from "./pages/StallBooking";
import Visitors from "./pages/Visitors";

// Admin Panel
import { AuthProvider } from "./admin/context/AuthContext";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import BlogsAdmin from "./admin/pages/Blogs";
import BlogForm from "./admin/pages/BlogForm";
import FormsAdmin from "./admin/pages/Forms";
import "./admin/admin.css"; // Import Admin CSS globally

// Intercept anchor clicks for React Router navigation
function LinkInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept internal paths
      const internalPaths = ["/", "/about", "/exhibitors", "/visitors",
        "/stall-booking", "/sponsors-partners", "/media-gallery",
        "/faqs", "/blog", "/contact"];

      const isInternal = internalPaths.includes(href) || href.startsWith('/blog/');

      if (isInternal) {
        e.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <Router>
      <LinkInterceptor />
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/exhibitors" element={<Exhibitors />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/media-gallery" element={<Gallery />} />
          <Route path="/sponsors-partners" element={<Sponsors />} />
          <Route path="/stall-booking" element={<StallBooking />} />
          <Route path="/visitors" element={<Visitors />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="blogs" element={<BlogsAdmin />} />
                  <Route path="blogs/add" element={<BlogForm />} />
                  <Route path="blogs/edit/:id" element={<BlogForm />} />
                  <Route path="forms" element={<FormsAdmin />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
