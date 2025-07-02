// src/components/Layout.js
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // استيراد خطاف السياق

function Layout() {
  const { logout, user } = useAuth(); // نأخذ دالة logout وبيانات المستخدم من السياق

  const navStyle = { backgroundColor: '#282c34', padding: '1rem', display: 'flex', alignItems: 'center', gap: '20px' };
  const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '1.1em' };
  const userInfoStyle = { color: 'white', marginLeft: 'auto', marginRight: '20px' };
  const logoutButtonStyle = { padding: '8px 16px', fontSize: '1em', backgroundColor: '#61dafb', color: '#282c34', border: 'none', borderRadius: '5px', cursor: 'pointer' };

  return (
    <div>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Dashboard</Link>
        <Link to="/documents" style={linkStyle}>Documents</Link>
        <Link to="/quality-events" style={linkStyle}>NCRs</Link>
        <Link to="/audits" style={linkStyle}>Audits</Link>
        <Link to="/trainings" style={linkStyle}>Trainings</Link>

        {/* نعرض اسم المستخدم إذا كان موجودًا */}
        <span style={userInfoStyle}>Welcome, {user ? user.username : 'Guest'}</span>
        
        <button onClick={logout} style={logoutButtonStyle}>Logout</button>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}
export default Layout;