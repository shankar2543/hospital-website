import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/LoginSignup.module.css';
import Parse from '@/lib/parseConfig';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Helper function to determine if input is email or phone
  const getCredentialType = (input) => {
    if (input.includes('@')) return 'email';
    if (/^\d{10,15}$/.test(input.replace(/[^\d]/g, ''))) return 'phone';
    return 'email'; // Default to email
  };

  // Helper function to get email from phone number
  const getEmailByPhone = async (phone) => {
    try {
      const query = new Parse.Query('_User');
      query.equalTo('phone', phone.replace(/[^\d]/g, ''));
      const user = await query.first();
      
      if (user) {
        return user.get('email');
      }
      return null;
    } catch (err) {
      console.error('Error finding user by phone:', err);
      return null;
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please enter email/phone number and password');
        setLoading(false);
        return;
      }

      // Dummy admin credentials
      if (email.trim().toLowerCase() === 'admin@medicover.com' && password.trim() === 'admin123') {
        const adminData = { id: 'admin-001', email: 'admin@medicover.com', name: 'Admin', role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(adminData));
        localStorage.setItem('role', 'admin');
        localStorage.setItem('name', 'Admin');
        localStorage.setItem('email', 'admin@medicover.com');
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/admin/dashboard'), 100);
        return;
      }

      console.log('=== LOGIN ATTEMPT ===');
      console.log('Credential:', email);
      console.log('Parse initialized:', Parse.applicationId ? 'YES' : 'NO');
      console.log('Back4App server:', Parse.serverURL);

      // Determine if input is email or phone
      const credentialType = getCredentialType(email);
      console.log('Credential type detected:', credentialType);

      let loginEmail = email;

      // If phone, find the corresponding email
      if (credentialType === 'phone') {
        console.log('Looking up email for phone:', email);
        loginEmail = await getEmailByPhone(email);
        
        if (!loginEmail) {
          setError('Phone number not found. Please check and try again.');
          setLoading(false);
          return;
        }
        console.log('Found email:', loginEmail);
      }

      // Login with Parse/Back4App - validates credentials from Back4App
      console.log('Calling Parse.User.logIn with:', loginEmail);
      const user = await Parse.User.logIn(loginEmail, password);
      
      console.log('=== LOGIN SUCCESS ===');
      console.log('User ID:', user.id);
      console.log('Email:', user.get('email'));
      console.log('Phone:', user.get('phone'));
      console.log('Name:', user.get('name'));
      console.log('Role:', user.get('role'));
      
      // Store user info locally
      const role = user.get('role') || 'patient';
      const userData = {
        id: user.id,
        email: user.get('email'),
        phone: user.get('phone'),
        name: user.get('name'),
        role: role
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('role', role);
      localStorage.setItem('name', user.get('name'));
      localStorage.setItem('email', user.get('email'));
      localStorage.setItem('phone', user.get('phone'));
      
      console.log('User data stored in localStorage');
      setSuccess('Login successful! Redirecting to dashboard...');
      console.log('Redirecting based on role:', role);
      
      // Redirect based on role
      setTimeout(() => {
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'doctor') {
          router.push('/doctor/dashboard');
        } else {
          router.push('/patient/dashboard');
        }
      }, 100);
      
    } catch (err) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Error status:', err.status);
      console.error('Full error:', err);
      
      if (err.code === 'EAGAIN' || err.code === 'ECONNREFUSED' || err.message.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else if (err.message.includes('Invalid username/password') || err.message.includes('Unauthorized')) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (err.message.includes('not found')) {
        setError('User not found. Please check your email or sign up.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.headerRow}>
          <span className={styles.appName}>Medicover Hospital</span>
          <img src="/Logo-medicover.png" alt="Medicover Logo" className={styles.headerLogo} />
        </div>
        <h1 className={styles.titleSmall}>Login to Your Account</h1>
        <p className={styles.subtitle}>Login using social networks</p>
        <div className={styles.socialRow}>
          <button className={styles.socialBtn + ' ' + styles.fb}>f</button>
          <button className={styles.socialBtn + ' ' + styles.gplus}>G+</button>
          <button className={styles.socialBtn + ' ' + styles.linkedin}>in</button>
        </div>
        <div className={styles.orRow}><span>OR</span></div>
        <form className={styles.form} onSubmit={handleSignIn}>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p style={{ color: '#27ae60', fontWeight: 'bold', marginBottom: '10px' }}>{success}</p>}
          <input 
            type="text" 
            placeholder="Email or Phone Number" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input + ' ' + styles.inputMedium} 
          />
          <div className={styles.passwordRow}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input + ' ' + styles.inputMedium}
            />
            <span className={styles.eyeIcon} onClick={() => setShowPw(!showPw)}>
              {showPw ? <FiEyeOff size={18} color="#000" /> : <FiEye size={18} color="#000" />}
            </span>
          </div>
          <button 
            type="submit" 
            className={styles.signInBtn}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      <div className={styles.rightPanel}>
        <button className={styles.closeBtn}>×</button>
        <h2 className={styles.newHere}>New Here?</h2>
        <p className={styles.desc}>Sign up and discover a great amount of new opportunities!</p>
        <button className={styles.signUpBtn}>Sign Up</button>
      </div>
    </div>
  );
}
