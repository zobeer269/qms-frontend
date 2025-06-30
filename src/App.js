// src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// استيراد المكونات الرئيسية
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// استيراد مكونات الصفحات
import DocumentsPage from './pages/DocumentsPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import QualityEventsPage from './pages/QualityEventsPage';
import NCRDetailPage from './pages/NCRDetailPage';
import AuditsPage from './pages/AuditsPage';
import AuditDetailPage from './pages/AuditDetailPage';
import TrainingsPage from './pages/TrainingsPage';
import TrainingDetailPage from './pages/TrainingDetailPage';

import './App.css';

function App() {
  // نحصل على التوكن من السياق المركزي لتحديد حالة الدخول
  const { token } = useAuth();

  // هذا المكون هو "الحارس" الذي يحمي كل الصفحات الداخلية
  function PrivateOutlet() {
    // إذا كان المستخدم مسجلاً دخوله (يوجد توكن)، نعرض الهيكل العام للتطبيق (Layout)
    // الذي بدوره سيعرض الصفحة المطلوبة عبر <Outlet />
    // إذا لم يكن مسجلاً دخوله، نوجهه إلى صفحة الدخول
    return token ? <Layout /> : <Navigate to="/login" />;
  }

  return (
    <div className="App">
      <Routes>
        {/* المسار الأول: صفحة تسجيل الدخول */}
        {/* إذا كان المستخدم مسجلاً دخوله بالفعل وحاول الذهاب لصفحة الدخول، نوجهه للرئيسية */}
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        
        {/* المسار الثاني: كل المسارات المحمية داخل التطبيق */}
        {/* نستخدم "/*" ليمثل كل العناوين الأخرى، ونحميه بـ PrivateOutlet */}
        <Route path="/*" element={<PrivateOutlet />}>
            {/* هذه المسارات الفرعية سيتم عرضها داخل ה-Layout.
              الـ "index" هو المسار الافتراضي عند زيارة "/"
            */}
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="documents/:id" element={<DocumentDetailPage />} />
            <Route path="quality-events" element={<QualityEventsPage />} />
            <Route path="quality-events/:id" element={<NCRDetailPage />} />
            <Route path="audits" element={<AuditsPage />} />
            <Route path="audits/:id" element={<AuditDetailPage />} />
            <Route path="trainings" element={<TrainingsPage />} />
            <Route path="trainings/:id" element={<TrainingDetailPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;