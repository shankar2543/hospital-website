import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/router';
import styles from '../styles/LoginSignup.module.css';
import Parse from '@/lib/parseConfig';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', gender: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form
      if (!form.name || !form.email || !form.phone || !form.password || !form.gender) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Validate email format
      if (!form.email.includes('@')) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      // Validate phone format (10-15 digits)
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(form.phone.replace(/[\s-()]/g, ''))) {
        setError('Please enter a valid phone number (10-15 digits)');
        setLoading(false);
        return;
      }

      // Validate password
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      console.log('Creating user with:', { 
        username: form.email, 
        email: form.email,
        phone: form.phone,
        name: form.name,
        gender: form.gender
      });

      // Create new Parse user
      const user = new Parse.User();
      user.set('username', form.email);  // Parse uses username for login
      user.set('email', form.email);
      user.set('phone', form.phone);
      user.set('password', form.password);
      user.set('name', form.name);
      user.set('gender', form.gender);
      user.set('role', 'patient');

      await user.save();

      console.log('Signup successful, user created:', {
        id: user.id,
        email: user.get('email'),
        name: user.get('name')
      });
      
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      console.error('Signup error details:', {
        message: err.message,
        code: err.code,
        fullError: err
      });
      
      if (err.message.includes('Account already exists') || err.code === 'DUPLICATE_VALUE') {
        setError('This email is already registered. Please login.');
      } else if (err.code === 'EAGAIN' || err.code === 'ECONNREFUSED') {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {/* Left Panel - Welcome Back */}
      <div className={styles.rightPanel}>
        <h2 className={styles.newHere}>Welcome Back!</h2>
        <p className={styles.desc}>Already have an account? Sign in to access your dashboard!</p>
        <button className={styles.signUpBtn} onClick={() => router.push('/')}>Sign In</button>
      </div>

      {/* Right Panel - Signup Form */}
      <div className={styles.leftPanel}>
        <div className={styles.logoRow}>
          <span className={styles.appName}>Medicover Hospital</span>
        </div>

        <h1 className={styles.title}>Patient Registration</h1>
        <p className={styles.subtitle}>Create your patient account</p>

        {error   && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.successMsg}>{success}</p>}

        <form className={styles.form} onSubmit={handleSignup}>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className={styles.input}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number (10-15 digits)"
            value={form.phone}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <div className={styles.passwordRow}>
            <input
              name="password"
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <span className={styles.eyeIcon} onClick={() => setShowPw(!showPw)}>
              {showPw ? <FiEyeOff size={18} color="#000" /> : <FiEye size={18} color="#000" />}
            </span>
          </div>
          <button type="submit" className={styles.signInBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>

    </div>
  );
}
