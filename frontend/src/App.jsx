import React, {useState} from 'react';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  if(!token) return <Login onLogin={t=>{localStorage.setItem('token',t); setToken(t)}} />;
  return <PatientDashboard token={token} />;
}
