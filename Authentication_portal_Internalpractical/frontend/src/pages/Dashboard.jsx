/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [err, setErr] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    navigate('/login')
                    return
                }

                const { data } = await API.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(data)
            } catch (err) {
                setErr('Unauthorized, please login again.')
                localStorage.removeItem('token')
                navigate('/login')
            }
        }

        fetchUser()
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div>
            <h2>Dashboard</h2>
            {err && <p className="error">{err}</p>}
            {user ? (
                <>
                    <p>Welcome, {user.name}!</p>
                    <p>Email: {user.email}</p>
                    <button className="button button-secondary" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Loading user...</p>
            )}
        </div>
    )
}
