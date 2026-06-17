import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Profissionais from './pages/Profissionais';
import Atendimentos from './pages/Atendimentos';
import Exames from './pages/Exames';
import Configuracoes from './pages/Configuracoes';
import './App.css';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profissionais" element={<Profissionais />} />
            <Route path="/atendimentos" element={<Atendimentos />} />
            <Route path="/exames" element={<Exames />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
