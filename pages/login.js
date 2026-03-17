import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Parse from '@/lib/parseConfig';
import { FiEye, FiEyeOff, FiPhone, FiMail, FiLock, FiUser } from 'react-icons/fi';
import styles from '@/styles/login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', gender: '', email: '', phone: '', password: '' });
  const [showSignupPw, setShowSignupPw] = useState(false);

  const getEmailByPhone = async (phone) => {
    try {
      const query = new Parse.Query('_User');
      query.equalTo('phone', phone.replace(/[^\d]/g, ''));
      const user = await query.first();
      return user ? user.get('email') : null;
    } catch { return null; }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!email || !password) { setError('Please enter your credentials.'); setLoading(false); return; }
      if (email.trim().toLowerCase() === 'admin@medicover.com' && password.trim() === 'admin123') {
        localStorage.setItem('currentUser', JSON.stringify({ id: 'admin-001', email: 'admin@medicover.com', name: 'Admin', role: 'admin' }));
        localStorage.setItem('role', 'admin');
        localStorage.setItem('name', 'Admin');
        localStorage.setItem('email', 'admin@medicover.com');
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/admin/dashboard'), 100);
        return;
      }
      let loginEmail = email;
      if (/^\d{10,15}$/.test(email.replace(/[^\d]/g, ''))) {
        loginEmail = await getEmailByPhone(email);
        if (!loginEmail) { setError('Phone number not found.'); setLoading(false); return; }
      }
      const user = await Parse.User.logIn(loginEmail, password);
      const role = user.get('role') || 'patient';
      localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.get('email'), phone: user.get('phone'), name: user.get('name'), role }));
      localStorage.setItem('role', role);
      localStorage.setItem('name', user.get('name'));
      localStorage.setItem('email', user.get('email'));
      localStorage.setItem('phone', user.get('phone'));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        if (role === 'admin') router.push('/admin/dashboard');
        else if (role === 'doctor') router.push('/doctor/dashboard');
        else router.push('/patient/dashboard');
      }, 100);
    } catch (err) {
      setError(err.message?.includes('Invalid username') ? 'Invalid email or password.' : err.message || 'Login failed.');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (!form.name || !form.email || !form.phone || !form.password || !form.gender) {
        setError('All fields are required.'); setLoading(false); return;
      }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const user = new Parse.User();
      user.set('username', form.email);
      user.set('email', form.email);
      user.set('password', form.password);
      user.set('name', form.name);
      user.set('phone', form.phone.replace(/[^\d]/g, ''));
      user.set('gender', form.gender);
      user.set('role', 'patient');
      await user.signUp();
      setSuccess('Account created! Please sign in.');
      setIsSignup(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Signup failed.');
      setLoading(false);
    }
  };

  const features = [
    { icon: '🔐', title: 'Patient Access',          desc: 'Login exclusively for patients to securely view all their medical records.' },
    { icon: '📊', title: 'Real-Time Report Access', desc: 'Access or download your reports in real time after each hospital visit.' },
    { icon: '📋', title: 'Paperless System',        desc: 'Medicover operates a paperless system ensuring convenience and sustainability.' },
  ];

  return (
    <div className={styles.page}>

      {/* ── LEFT PANEL ── */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.illustration}>
            <svg viewBox="0 0 320 220" className={styles.illSvg} xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="160" cy="110" rx="130" ry="90" fill="rgba(255,255,255,0.1)" />
              <rect x="95" y="35" width="105" height="145" rx="8" fill="white" opacity="0.95"/>
              <rect x="95" y="35" width="105" height="145" rx="8" fill="none" stroke="#3d3d8f" strokeWidth="1.5"/>
              <rect x="128" y="28" width="40" height="16" rx="4" fill="#3d3d8f"/>
              <rect x="136" y="24" width="24" height="10" rx="5" fill="#5a5aaf"/>
              <line x1="110" y1="70"  x2="185" y2="70"  stroke="#d0d5f5" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="110" y1="85"  x2="178" y2="85"  stroke="#d0d5f5" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="110" y1="100" x2="182" y2="100" stroke="#d0d5f5" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="110" y1="115" x2="170" y2="115" stroke="#d0d5f5" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="118" cy="138" r="9" fill="#4caf50" opacity="0.9"/>
              <polyline points="113,138 117,143 125,133" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="65" cy="125" r="13" fill="#ffb74d"/>
              <rect x="53" y="140" width="26" height="32" rx="6" fill="#e57373"/>
              <line x1="66" y1="112" x2="66" y2="105" stroke="#ffb74d" strokeWidth="2"/>
              <rect x="222" y="105" width="8" height="52" rx="3" fill="#5c6bc0"/>
              <rect x="214" y="98"  width="24" height="13" rx="3" fill="#7986cb"/>
              <ellipse cx="226" cy="104" rx="13" ry="8" fill="none" stroke="#5c6bc0" strokeWidth="2"/>
              <ellipse cx="226" cy="155" rx="16" ry="4" fill="#5c6bc0" opacity="0.4"/>
              <circle cx="262" cy="55" r="7"  fill="#ef5350" opacity="0.85"/>
              <circle cx="278" cy="72" r="5"  fill="#42a5f5" opacity="0.85"/>
              <circle cx="258" cy="78" r="4"  fill="#66bb6a" opacity="0.85"/>
              <line x1="262" y1="55" x2="278" y2="72" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5"/>
              <line x1="278" y1="72" x2="258" y2="78" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5"/>
              <rect x="46" y="62" width="22" height="6" rx="2" fill="#ef5350" opacity="0.9"/>
              <rect x="53" y="55" width="6"  height="22" rx="2" fill="#ef5350" opacity="0.9"/>
            </svg>
          </div>

          <div className={styles.featureList}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <p className={styles.featureTitle}>{f.title}</p>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={styles.right}>
        <button className={styles.closeBtn} onClick={() => router.push('/')} aria-label="Close">✕</button>
        <div className={styles.rightInner}>
          <div className={styles.logoWrap}>
            <img src="/medicover-mainlogo.png" alt="Medicover" className={styles.logo} />
          </div>

          <h1 className={styles.title}>
            {isSignup ? 'Create Your Account' : 'Welcome to Medicover Patient Portal'}
          </h1>
          <p className={styles.subtitle}>
            {isSignup
              ? 'Sign up to access your health records securely.'
              : 'Access and manage your health records securely by logging in anytime, from anywhere.'}
          </p>

          {error   && <p className={styles.errorMsg}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          {!isSignup ? (
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email or Phone Number</label>
                <div className={styles.inputWrap}>
                  <FiMail className={styles.inputIcon} />
                  <input type="text" placeholder="Enter email or 10-digit mobile number"
                    className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrap}>
                  <FiLock className={styles.inputIcon} />
                  <input type={showPw ? 'text' : 'password'} placeholder="Enter your password"
                    className={styles.input} value={password} onChange={e => setPassword(e.target.value)} />
                  <span className={styles.eyeBtn} onClick={() => setShowPw(p => !p)}>
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </span>
                </div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in…' : 'Login'}
              </button>
              <p className={styles.toggle}>
                Don&apos;t have an account?{' '}
                <span onClick={() => { setIsSignup(true); setError(''); setSuccess(''); }}>Sign Up</span>
              </p>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleSignup}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputWrap}>
                  <FiUser className={styles.inputIcon} />
                  <input type="text" placeholder="Your full name" className={styles.input}
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Gender</label>
                  <div className={styles.inputWrap}>
                    <select className={styles.input} value={form.gender}
                      onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Phone</label>
                  <div className={styles.inputWrap}>
                    <FiPhone className={styles.inputIcon} />
                    <input type="tel" placeholder="10-digit number" className={styles.input}
                      value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email</label>
                <div className={styles.inputWrap}>
                  <FiMail className={styles.inputIcon} />
                  <input type="email" placeholder="your@email.com" className={styles.input}
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrap}>
                  <FiLock className={styles.inputIcon} />
                  <input type={showSignupPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                    className={styles.input} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                  <span className={styles.eyeBtn} onClick={() => setShowSignupPw(p => !p)}>
                    {showSignupPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </span>
                </div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
              <p className={styles.toggle}>
                Already have an account?{' '}
                <span onClick={() => { setIsSignup(false); setError(''); setSuccess(''); }}>Sign In</span>
              </p>
            </form>
          )}

          {!isSignup && (
            <div className={styles.appLinks}>
              <p className={styles.appLinksLabel}>Download our app</p>
              <div className={styles.appBtns}>
                <a href="#" className={styles.appStoreBtn}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className={styles.appStoreBtnText}>
                    <span className={styles.appStoreBtnSub}>Download on the</span>
                    <span className={styles.appStoreBtnMain}>App Store</span>
                  </div>
                </a>
                <a href="#" className={styles.appStoreBtn}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M3.18 23.76c.3.17.64.24.99.2l11.7-11.7-2.61-2.61L3.18 23.76zm16.14-12.9L16.6 9.2 5.54.4a1.14 1.14 0 0 0-1.17-.1l10.44 10.44 4.51 2.12zM22 10.96a1.25 1.25 0 0 0 0-2.14l-2.74-1.58-3.02 3.02 3.02 3.02L22 11.76v-.8zM4.37.3A1.17 1.17 0 0 0 3.18.5v22.26l10.08-10.08L4.37.3z"/></svg>
                  <div className={styles.appStoreBtnText}>
                    <span className={styles.appStoreBtnSub}>Get it on</span>
                    <span className={styles.appStoreBtnMain}>Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
