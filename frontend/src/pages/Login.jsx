import React, {useState} from 'react';
import axios from 'axios';

export default function Login({onLogin}){
  const [email,setEmail] = useState('patient@demo.com');
  const [password,setPassword] = useState('demo123');
  const submit = async (e)=>{
    e.preventDefault();
    try{
      const r = await axios.post('http://localhost:3000/api/auth/login', {email,password});
      onLogin(r.data.token);
    }catch(e){ alert('error'); }
  };
  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" />
      <button>Login</button>
    </form>
  );
}
