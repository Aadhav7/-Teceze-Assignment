import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/teceze-logo.png" alt="TECEZE" className="brand-logo" />
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <Users size={20} />
            <span>Employees</span>
          </NavLink>
          
          <NavLink to="/charts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <BarChart3 size={20} />
            <span>Analytics</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>EMS Dashboard &copy; 2026</p>
        </div>
      </aside>
    </>
  );
}
