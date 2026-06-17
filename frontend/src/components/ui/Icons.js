import React from 'react';

const S = ({ children, size = 18, sw = 2, fill = 'none', ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

export const IconDashboard = (p) => (<S {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></S>);
export const IconUsers = (p) => (<S {...p}><circle cx="9" cy="7" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2"/><circle cx="17" cy="9" r="3"/><path d="M22 21v-1a4 4 0 0 0-4-4"/></S>);
export const IconCalendar = (p) => (<S {...p}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></S>);
export const IconFlask = (p) => (<S {...p}><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/></S>);
export const IconSettings = (p) => (<S {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0 1.6 1.6 0 0 0-2.7-1.1 2 2 0 1 1-2.8-2.8A1.6 1.6 0 0 0 4.6 15 2 2 0 0 1 4 11a1.6 1.6 0 0 0 1.3-2.7 2 2 0 1 1 2.8-2.8A1.6 1.6 0 0 0 11 4.6 2 2 0 0 1 15 4a1.6 1.6 0 0 0 2.7 1.1 2 2 0 1 1 2.8 2.8A1.6 1.6 0 0 0 21 11a2 2 0 0 1 0 4 1.6 1.6 0 0 0-1.6 1z"/></S>);
export const IconSearch = (p) => (<S {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></S>);
export const IconPlus = (p) => (<S sw={2.2} {...p}><path d="M12 5v14M5 12h14"/></S>);
export const IconEdit = (p) => (<S {...p}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></S>);
export const IconTrash = (p) => (<S {...p}><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/></S>);
export const IconClose = (p) => (<S {...p}><path d="M18 6 6 18M6 6l12 12"/></S>);
export const IconClock = (p) => (<S {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></S>);
export const IconCheck = (p) => (<S sw={2.4} {...p}><path d="M20 6 9 17l-5-5"/></S>);
export const IconAlert = (p) => (<S {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></S>);
export const IconChart = (p) => (<S {...p}><path d="M3 3v18h18"/><path d="M7 15l3-4 3 3 4-6"/></S>);
export const IconExternal = (p) => (<S {...p}><path d="M14 3h7v7M21 3l-9 9M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></S>);
export const IconGithub = (p) => (<S {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.6 1.6 5.5 1.9 5.5 1.9a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 4 8.9c0 5.1 3 6.3 6 6.6a3.4 3.4 0 0 0-1 2.6V22"/></S>);
export const IconHospital = (p) => (<S {...p}><path d="M8 2h8M12 2v6m-7 2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><path d="M12 13v4M10 15h4"/></S>);
export const IconRefresh = (p) => (<S {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></S>);
