import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconDashboard, IconUsers, IconCalendar, IconFlask, IconSettings, IconHospital } from '../ui/Icons';

const main = [
  { to: '/', end: true, label: 'Dashboard', Icon: IconDashboard },
  { to: '/profissionais', label: 'Profissionais', Icon: IconUsers },
  { to: '/atendimentos', label: 'Atendimentos', Icon: IconCalendar },
  { to: '/exames', label: 'Exames', Icon: IconFlask },
];

export default function Sidebar() {
  return (
    <aside className="side">
      <div className="brand">
        <div className="logo"><IconHospital size={20} /></div>
        <div><b>Clínica Web</b><span>Gestão clínica</span></div>
      </div>
      <div className="nav-label">Principal</div>
      <nav className="nav">
        {main.map(({ to, end, label, Icon }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-label">Sistema</div>
      <nav className="nav">
        <NavLink to="/configuracoes" className={({ isActive }) => (isActive ? 'active' : '')}>
          <IconSettings /> Configurações
        </NavLink>
      </nav>
    </aside>
  );
}
