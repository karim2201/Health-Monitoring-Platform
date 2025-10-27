import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export default function PatientDashboard({token}){
  const [me,setMe] = useState(null);
  const [vitals,setVitals] = useState([]);
  useEffect(()=>{
    (async ()=>{
      const r = await axios.get('http://localhost:3000/api/users/me', {headers:{Authorization:'Bearer '+token}});
      setMe(r.data);
      // setup socket
      const socket = io('http://localhost:3000');
      socket.on('connect', ()=>{
        socket.emit('auth', token);
      });
      socket.on('vital_update', (d)=>{
        setVitals(prev => [d, ...prev].slice(0,60));
      });
    })();
  },[]);
  return (
    <div>
      <h1>Dashboard {me?.profile?.firstName}</h1>
      <div>
        <h2>Latest vitals</h2>
        {vitals.length===0 ? <p>No data yet</p> : (
          <div>
            {vitals.map(v=>(
              <div key={v.id}>{v.timestamp} - HR:{v.heartRate} SpO2:{v.spo2}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
