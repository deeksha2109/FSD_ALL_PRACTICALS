import React, { useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'


export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [err, setErr] = useState('');
    const navigate = useNavigate();


    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/register', form);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setErr(err.response?.data?.message || 'Registration failed');
        }
    }


    return (
        <div>
            <h2>Register</h2>
            {err && <p className="error">{err}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                <input className="input" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <input className="input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
                <button className="button" type="submit">Register</button>
            </form>
        </div>
    )
}