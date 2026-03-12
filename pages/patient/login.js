import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Parse from '@/lib/parseConfig';

export default function PatientLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter your email and password.');
        setLoading(false);
        return;
      }

      const user = await Parse.User.logIn(email, password);
      const role = user.get('role') || 'patient';

      if (role !== 'patient') {
        setError('This portal is for patients only.');
        await Parse.User.logOut();
        setLoading(false);
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.get('email'), name: user.get('name'), role }));
      localStorage.setItem('role', role);
      localStorage.setItem('name', user.get('name'));
      localStorage.setItem('email', user.get('email'));
      localStorage.setItem('phone', user.get('phone'));

      router.push('/patient/dashboard');
    } catch (err) {
      if (err.message.includes('Invalid username/password') || err.message.includes('Unauthorized')) {
        setError('Invalid email or password.');
      } else if (err.message.includes('Network')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* Left Panel */}
      <div style={{ flex: 1.4, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem 5vw' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <img src="/Logo-medicover.png" alt="Medicover Logo" style={{ width: 96, height: 96, objectFit: 'contain' }} />
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1a5fa8' }}>Medicover Hospital</span>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#222', marginBottom: '0.4rem' }}>Patient Login</h2>
        <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem' }}>Access your health portal</p>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ background: '#fdecea', color: '#e74c3c', padding: '0.7rem 1rem', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '0.85rem 1.1rem', borderRadius: 10, border: '1.5px solid #d6e6f7', fontSize: 14, outline: 'none', background: '#f7faff' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '0.85rem 1.1rem', borderRadius: 10, border: '1.5px solid #d6e6f7', fontSize: 14, outline: 'none', background: '#f7faff' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.85rem', borderRadius: 10, border: 'none', background: 'linear-gradient(90deg, #1a5fa8 0%, #2e7fc9 100%)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: 14, color: '#888' }}>
          Don't have an account?{' '}
          <span onClick={() => router.push('/signup')} style={{ color: '#1a5fa8', fontWeight: 600, cursor: 'pointer' }}>Sign Up</span>
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: 13, color: '#bbb' }}>
          Are you an admin?{' '}
          <span onClick={() => router.push('/')} style={{ color: '#1a5fa8', cursor: 'pointer' }}>Admin Login</span>
        </p>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1a5fa8 0%, #2e7fc9 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏥</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Welcome Back</h2>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: 280, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Manage your appointments, view your medical records, and stay connected with your doctors.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 260 }}>
          {['Book Appointments', 'View Medical Records', 'Track Your Health'].map(item => (
            <div key={item} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '0.7rem 1.2rem', fontSize: 14, fontWeight: 500 }}>
              ✓ {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
