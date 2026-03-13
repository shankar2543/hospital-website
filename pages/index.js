import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/LoginSignup.module.css';
import homeStyles from '../styles/home.module.css';
import Parse from '@/lib/parseConfig';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();

  // shared
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [consultForm, setConsultForm] = useState({ name: '', phone: '', email: '', date: '', problem: '' });
  const [consultSuccess, setConsultSuccess] = useState(false);
  const [isSignup, setIsSignup]   = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  // login fields
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  // signup fields
  const [form, setForm] = useState({ name: '', gender: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw]       = useState(false);
  const [showAdminPw, setShowAdminPw] = useState(false);

  // Carousel
  const carouselRef = useRef(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const CARD_COUNT = 6;

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    setCarouselIdx(Math.min(Math.round(el.scrollLeft / el.offsetWidth), CARD_COUNT - 1));
  };

  const goToCard = (i) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({ left: i * carouselRef.current.offsetWidth, behavior: 'smooth' });
    setCarouselIdx(i);
  };

  const switchMode = (toSignup) => {
    setIsSignup(toSignup);
    setError('');
    setSuccess('');
  };

  /* ── LOGIN ── */
  const getCredentialType = (input) => {
    if (input.includes('@')) return 'email';
    if (/^\d{10,15}$/.test(input.replace(/[^\d]/g, ''))) return 'phone';
    return 'email';
  };

  const getEmailByPhone = async (phone) => {
    try {
      const query = new Parse.Query('_User');
      query.equalTo('phone', phone.replace(/[^\d]/g, ''));
      const user = await query.first();
      if (user) return user.get('email');
      return null;
    } catch (err) {
      console.error('Error finding user by phone:', err);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter email/phone number and password');
        setLoading(false);
        return;
      }

      // Dummy admin
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

      const credentialType = getCredentialType(email);
      let loginEmail = email;

      if (credentialType === 'phone') {
        loginEmail = await getEmailByPhone(email);
        if (!loginEmail) {
          setError('Phone number not found. Please check and try again.');
          setLoading(false);
          return;
        }
      }

      const user = await Parse.User.logIn(loginEmail, password);
      const role = user.get('role') || 'patient';
      const userData = {
        id: user.id,
        email: user.get('email'),
        phone: user.get('phone'),
        name: user.get('name'),
        role,
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
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
      if (err.message?.includes('Network')) setError('Network error. Please check your internet connection.');
      else if (err.message?.includes('Invalid username/password') || err.message?.includes('Unauthorized')) setError('Invalid credentials. Please check your email and password.');
      else if (err.message?.includes('not found')) setError('User not found. Please check your email or sign up.');
      else setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  /* ── SIGNUP ── */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    try {
      if (!form.name || !form.email || !form.phone || !form.password || !form.gender) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      if (!form.email.includes('@')) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }
      if (!/^\d{10,15}$/.test(form.phone.replace(/[\s-()]/g, ''))) {
        setError('Please enter a valid phone number (10–15 digits)');
        setLoading(false);
        return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const user = new Parse.User();
      user.set('username', form.email);
      user.set('email', form.email);
      user.set('phone', form.phone);
      user.set('password', form.password);
      user.set('name', form.name);
      user.set('gender', form.gender);
      user.set('role', 'patient');
      await user.save();

      setSuccess('Account created! Please sign in.');
      setForm({ name: '', gender: '', email: '', phone: '', password: '' });
      setTimeout(() => switchMode(false), 1800);

    } catch (err) {
      if (err.message?.includes('Account already exists') || err.code === 'DUPLICATE_VALUE')
        setError('This email is already registered. Please login.');
      else if (err.code === 'EAGAIN' || err.code === 'ECONNREFUSED')
        setError('Network error. Please check your connection.');
      else
        setError(err.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={homeStyles.mainContainer}>

      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        {/* Navbar */}
        <nav className={styles.navbar}>
          <div className={styles.navBrand}>
            <img src="/Logo-medicover.png" alt="Medicover" className={styles.navLogo} />
            <span className={styles.navBrandName}>Medicover</span>
          </div>

          <div className={styles.navPill}>
            <a href="#" className={styles.navLink}>Home</a>
            <a href="#about" className={styles.navLink}>Services</a>
            <a href="#about" className={styles.navLink}>About Us</a>
            <a href="#" className={styles.navLink}>Doctors</a>
            <a href="#" className={styles.navLink}>Careers</a>
            <a href="#" className={styles.navLink} onClick={e => { e.preventDefault(); document.getElementById('login-form').scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>Sign In</a>
            <div className={styles.navSearch}>
              <span className={styles.navSearchIcon}>&#128269;</span>
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <button className={styles.contactBtn}>Contact Us</button>

          {/* Hamburger — mobile only */}
          <button className={styles.hamburger} onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </nav>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)}>
            <div className={styles.mobileSidebar} onClick={e => e.stopPropagation()}>
              <button className={styles.mobileSidebarClose} onClick={() => setMobileMenuOpen(false)}>✕</button>
              <a href="#" className={styles.mobileSidebarLink} onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#about" className={styles.mobileSidebarLink} onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#about" className={styles.mobileSidebarLink} onClick={() => setMobileMenuOpen(false)}>About Us</a>
              <a href="#" className={styles.mobileSidebarLink} onClick={() => setMobileMenuOpen(false)}>Doctors</a>
              <a href="#" className={styles.mobileSidebarLink} onClick={() => setMobileMenuOpen(false)}>Careers</a>
              <a href="#" className={styles.mobileSidebarLink} onClick={e => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('login-form').scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>Sign In</a>
            </div>
          </div>
        )}

        {/* Hero Body */}
        <div className={styles.heroBody}>

          {/* Left */}
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              Online Platform offers care
            </div>

            <h1 className={styles.heroTitle}>
              Smarter Healthcare<br />
              Management Starts<br />
              With <span className={styles.heroAccent}>Medicover</span>
              <span className={styles.heroDot}>.</span>
            </h1>

            <p className={styles.heroDescription}>
              Medicover is an AI-powered medical platform built to transform
              complex healthcare data into clear, actionable insights for
              patients, doctors, and administrators.
            </p>

            <div className={styles.heroCtas}>
              <button className={styles.primaryCta} onClick={() => setShowConsultForm(true)}>
                Book a Free Consultation
              </button>
              <button className={styles.secondaryCta}>
                <span className={styles.playIcon}>&#9654;</span>
                Watch a Demo
              </button>
            </div>
          </div>

          {/* Right — card toggles between login & signup */}
          <div className={styles.heroRight}>
            <div id="login-form" className={styles.loginCard}>

              {/* Card header */}
              <div className={styles.cardHeader}>
                <img src="/Logo-medicover.png" alt="Medicover" className={styles.cardLogoImg} />
                <span className={styles.cardLogoText}>Medicover Hospital</span>
              </div>

              <h2 className={styles.cardTitle}>
                {isSignup ? 'Create an Account' : 'Login to Your Account'}
              </h2>

              {error   && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}

              {/* ── LOGIN FORM ── */}
              {!isSignup && (
                <form className={styles.form} onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Email or Phone Number"
                    className={styles.input}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <div className={styles.passwordRow}>
                    <input
                      type={showAdminPw ? 'text' : 'password'}
                      placeholder="Password"
                      className={styles.input}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span className={styles.eyeIcon} onClick={() => setShowAdminPw(!showAdminPw)}>
                      {showAdminPw ? <FiEyeOff size={18} color="#fff" /> : <FiEye size={18} color="#fff" />}
                    </span>
                  </div>
                  <button type="submit" className={styles.signInBtn} disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* ── SIGNUP FORM ── */}
              {isSignup && (
                <form className={styles.form} onSubmit={handleSignup}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={styles.inputSelect}
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
                    className={styles.input}
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  <div className={styles.passwordRow}>
                    <input
                      name="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Password (min 6 chars)"
                      value={form.password}
                      onChange={handleChange}
                      className={styles.input}
                      style={{ paddingRight: '3rem' }}
                    />
                    <span className={styles.eyeIcon} onClick={() => setShowPw(!showPw)}>
                      {showPw ? <FiEyeOff size={18} color="#fff" /> : <FiEye size={18} color="#fff" />}
                    </span>
                  </div>
                  <button type="submit" className={styles.signInBtn} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Toggle link */}
              <p className={styles.signupPrompt}>
                {isSignup ? (
                  <>Already have an account?{' '}
                    <span className={styles.signupLink} onClick={() => switchMode(false)}>Sign In</span>
                  </>
                ) : (
                  <>New here?{' '}
                    <span className={styles.signupLink} onClick={() => switchMode(true)}>Create an account</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className={homeStyles.scrollableContent}>

        <section id="about" className={homeStyles.aboutSection}>
          <div className={homeStyles.aboutContainer}>
            <h2 className={homeStyles.aboutTitle}>About Medicover Hospital</h2>
            <div className={homeStyles.aboutContent}>
              <p>
                Welcome to Medicover Hospital, a leading healthcare institution dedicated to providing exceptional medical services
                to our community. With over two decades of experience in healthcare, we have built a reputation for excellence,
                compassion, and innovation.
              </p>
              <p style={{ marginTop: '20px' }}>
                Our team of highly qualified doctors, nurses, and medical professionals work together to ensure that every patient
                receives the best possible care in a comfortable and supportive environment.
              </p>
            </div>

            <div className={homeStyles.aboutGrid} ref={carouselRef} onScroll={handleCarouselScroll}>
              <div className={homeStyles.carouselSlide}>
                <div className={homeStyles.featureCard}>
                  <h3 className={homeStyles.featureTitle}>Expert Doctors</h3>
                  <p className={homeStyles.featureDescription}>Our team consists of experienced specialists across multiple disciplines, dedicated to your health and well-being.</p>
                </div>
              </div>
              <div className={homeStyles.carouselSlide}>
                <div className={homeStyles.featureCard}>
                  <h3 className={homeStyles.featureTitle}>Modern Facilities</h3>
                  <p className={homeStyles.featureDescription}>State-of-the-art medical equipment and technology for accurate diagnosis and effective treatment.</p>
                </div>
              </div>
              <div className={homeStyles.carouselSlide}>
                <div className={homeStyles.featureCard}>
                  <h3 className={homeStyles.featureTitle}>24/7 Support</h3>
                  <p className={homeStyles.featureDescription}>Round-the-clock medical support and emergency services to ensure you&apos;re never alone in your healthcare journey.</p>
                </div>
              </div>
              <div className={homeStyles.carouselSlide}>
                <div className={homeStyles.featureCard}>
                  <h3 className={homeStyles.featureTitle}>Patient Care</h3>
                  <p className={homeStyles.featureDescription}>Personalized treatment plans and compassionate care that puts your health and comfort first.</p>
                </div>
              </div>
              <div className={homeStyles.carouselSlide}>
                <div className={homeStyles.featureCard}>
                  <h3 className={homeStyles.featureTitle}>Affordable Pricing</h3>
                  <p className={homeStyles.featureDescription}>Transparent and competitive pricing, making quality healthcare accessible to everyone.</p>
                </div>
              </div>
              <div className={homeStyles.carouselSlide}>
                <div className={homeStyles.featureCard}>
                  <h3 className={homeStyles.featureTitle}>Cleanliness</h3>
                  <p className={homeStyles.featureDescription}>Strict hygiene standards and infection control protocols to ensure a safe environment.</p>
                </div>
              </div>
            </div>

            <div className={homeStyles.carouselDots}>
              {Array.from({ length: CARD_COUNT }).map((_, i) => (
                <button
                  key={i}
                  className={`${homeStyles.carouselDot}${carouselIdx === i ? ' ' + homeStyles.carouselDotActive : ''}`}
                  onClick={() => goToCard(i)}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={homeStyles.logoSection}>
          <div className={homeStyles.logoContent}>
            <h2 className={homeStyles.logoText}>Medicover Hospital</h2>
            <p className={homeStyles.logoSubtext}>Your Health, Our Priority</p>
            <button className={homeStyles.ctaButton} onClick={() => document.getElementById('login-form').scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              Get Started Today
            </button>

            {/* Ambulance animation */}
            <div className={homeStyles.ambulanceTrack}>
              <div className={homeStyles.endpoint}>
                <span className={homeStyles.endpointIcon}>🏠</span>
                <span className={homeStyles.endpointLabel}>Your Home</span>
              </div>

              <div className={homeStyles.road}>
                <div className={homeStyles.roadLine} />
                <div className={homeStyles.ambulance}>🚑</div>
              </div>

              <div className={homeStyles.endpoint}>
                <span className={homeStyles.endpointIcon}>🏥</span>
                <span className={homeStyles.endpointLabel}>Medicover Hospital</span>
              </div>
            </div>
          </div>
        </section>

        {/* Patients Speak */}
        <section className={homeStyles.patientsSpeakSection}>
          <h2 className={homeStyles.patientsSpeakTitle}>Happy Patients</h2>
          <div className={homeStyles.marqueeWrapper}>
            {/* Row 1 — scrolls right */}
            <div className={homeStyles.marqueeRow + " " + homeStyles.right}>
              {[
                { src: "https://randomuser.me/api/portraits/men/11.jpg",   label: "Rajesh, Chennai"     },
                { src: "https://randomuser.me/api/portraits/women/21.jpg", label: "Priya, Bangalore"    },
                { src: "https://randomuser.me/api/portraits/men/32.jpg",   label: "Samuel, Mumbai"      },
                { src: "https://randomuser.me/api/portraits/women/44.jpg", label: "Aisha, Hyderabad"    },
                { src: "https://randomuser.me/api/portraits/men/55.jpg",   label: "Ravi, Delhi"         },
                { src: "https://randomuser.me/api/portraits/women/63.jpg", label: "Meena, Kochi"        },
                { src: "https://randomuser.me/api/portraits/men/76.jpg",   label: "James, Pune"         },
                { src: "https://randomuser.me/api/portraits/women/85.jpg", label: "Nadia, Jaipur"       },
                { src: "https://randomuser.me/api/portraits/men/91.jpg",   label: "Chen, Coimbatore"    },
                { src: "https://randomuser.me/api/portraits/women/95.jpg", label: "Fatima, Lucknow"     },
                { src: "https://randomuser.me/api/portraits/men/11.jpg",   label: "Rajesh, Chennai"     },
                { src: "https://randomuser.me/api/portraits/women/21.jpg", label: "Priya, Bangalore"    },
                { src: "https://randomuser.me/api/portraits/men/32.jpg",   label: "Samuel, Mumbai"      },
                { src: "https://randomuser.me/api/portraits/women/44.jpg", label: "Aisha, Hyderabad"    },
                { src: "https://randomuser.me/api/portraits/men/55.jpg",   label: "Ravi, Delhi"         },
                { src: "https://randomuser.me/api/portraits/women/63.jpg", label: "Meena, Kochi"        },
                { src: "https://randomuser.me/api/portraits/men/76.jpg",   label: "James, Pune"         },
                { src: "https://randomuser.me/api/portraits/women/85.jpg", label: "Nadia, Jaipur"       },
                { src: "https://randomuser.me/api/portraits/men/91.jpg",   label: "Chen, Coimbatore"    },
                { src: "https://randomuser.me/api/portraits/women/95.jpg", label: "Fatima, Lucknow"     },
              ].map((p, i) => (
                <div key={i} className={homeStyles.patientCard}>
                  <img src={p.src} alt={p.label} />
                  <div className={homeStyles.patientCardOverlay}>{p.label}</div>
                </div>
              ))}
            </div>
            {/* Row 2 — scrolls left */}
            <div className={homeStyles.marqueeRow + " " + homeStyles.left}>
              {[
                { src: "https://randomuser.me/api/portraits/women/12.jpg", label: "Kavitha, Patna"      },
                { src: "https://randomuser.me/api/portraits/men/23.jpg",   label: "Suresh, Ahmedabad"   },
                { src: "https://randomuser.me/api/portraits/women/34.jpg", label: "Deepa, Nagpur"       },
                { src: "https://randomuser.me/api/portraits/men/45.jpg",   label: "Harish, Surat"       },
                { src: "https://randomuser.me/api/portraits/women/56.jpg", label: "Lakshmi, Vadodara"   },
                { src: "https://randomuser.me/api/portraits/men/67.jpg",   label: "Manish, Chandigarh"  },
                { src: "https://randomuser.me/api/portraits/women/78.jpg", label: "Rekha, Indore"       },
                { src: "https://randomuser.me/api/portraits/men/89.jpg",   label: "Arjun, Bhopal"       },
                { src: "https://randomuser.me/api/portraits/women/90.jpg", label: "Sindhu, Visakhapatnam"},
                { src: "https://randomuser.me/api/portraits/men/14.jpg",   label: "Ganesh, Kolkata"     },
                { src: "https://randomuser.me/api/portraits/women/12.jpg", label: "Kavitha, Patna"      },
                { src: "https://randomuser.me/api/portraits/men/23.jpg",   label: "Suresh, Ahmedabad"   },
                { src: "https://randomuser.me/api/portraits/women/34.jpg", label: "Deepa, Nagpur"       },
                { src: "https://randomuser.me/api/portraits/men/45.jpg",   label: "Harish, Surat"       },
                { src: "https://randomuser.me/api/portraits/women/56.jpg", label: "Lakshmi, Vadodara"   },
                { src: "https://randomuser.me/api/portraits/men/67.jpg",   label: "Manish, Chandigarh"  },
                { src: "https://randomuser.me/api/portraits/women/78.jpg", label: "Rekha, Indore"       },
                { src: "https://randomuser.me/api/portraits/men/89.jpg",   label: "Arjun, Bhopal"       },
                { src: "https://randomuser.me/api/portraits/women/90.jpg", label: "Sindhu, Visakhapatnam"},
                { src: "https://randomuser.me/api/portraits/men/14.jpg",   label: "Ganesh, Kolkata"     },
              ].map((p, i) => (
                <div key={i} className={homeStyles.patientCard}>
                  <img src={p.src} alt={p.label} />
                  <div className={homeStyles.patientCardOverlay}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={homeStyles.statsSection}>
          <div className={homeStyles.statsContainer}>
            <h2 className={homeStyles.statsTitle}>Why Choose Us</h2>
            <div className={homeStyles.statsGrid}>
              <div className={homeStyles.statCard}>
                <div className={homeStyles.statIcon}>🏆</div>
                <div className={homeStyles.statNumber}>20+</div>
                <div className={homeStyles.statLabel}>Years of Experience</div>
              </div>
              <div className={homeStyles.statCard}>
                <div className={homeStyles.statIcon}>👨‍⚕️</div>
                <div className={homeStyles.statNumber}>500+</div>
                <div className={homeStyles.statLabel}>Expert Doctors</div>
              </div>
              <div className={homeStyles.statCard}>
                <div className={homeStyles.statIcon}>❤️</div>
                <div className={homeStyles.statNumber}>100K+</div>
                <div className={homeStyles.statLabel}>Happy Patients</div>
              </div>
              <div className={homeStyles.statCard}>
                <div className={homeStyles.statIcon}>⭐</div>
                <div className={homeStyles.statNumber}>99%</div>
                <div className={homeStyles.statLabel}>Satisfaction Rate</div>
              </div>
            </div>

            <p className={homeStyles.whyStatement}>
              At Medicover, patients choose us because we combine cutting-edge medical technology with genuine human care.
              Our experienced doctors, transparent pricing, and round-the-clock support make us the most trusted name in healthcare —
              because your health deserves nothing less than the best.
            </p>
          </div>
        </section>

        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerContent}>
            <h3 className={homeStyles.footerTitle}>Medicover Hospital</h3>
            <p className={homeStyles.footerText}>
              Providing world-class healthcare services with a commitment to excellence, compassion, and patient satisfaction.
            </p>
            <div className={homeStyles.footerLinks}>
              <a href="#" className={homeStyles.footerLink}>About Us</a>
              <a href="#" className={homeStyles.footerLink}>Services</a>
              <a href="#" className={homeStyles.footerLink}>Contact</a>
              <a href="#" className={homeStyles.footerLink}>Privacy Policy</a>
            </div>
            <div className={homeStyles.footerDivider} />
            <div className={homeStyles.footerBottom}>
              <p>&copy; 2026 Medicover Hospital. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Consultation Form Modal */}
      {showConsultForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: 22, color: '#1a3a5c', margin: 0 }}>Book a Free Consultation</h2>
              <span onClick={() => { setShowConsultForm(false); setConsultSuccess(false); setConsultForm({ name: '', phone: '', email: '', date: '', problem: '' }); }} style={{ cursor: 'pointer', fontSize: 22, color: '#888', lineHeight: 1 }}>×</span>
            </div>

            {consultSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: 48, marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontWeight: 700, fontSize: 20, color: '#27ae60', marginBottom: '0.5rem' }}>Consultation Booked!</h3>
                <p style={{ color: '#666', fontSize: 14 }}>We'll get in touch with you shortly.</p>
                <button onClick={() => { setShowConsultForm(false); setConsultSuccess(false); setConsultForm({ name: '', phone: '', email: '', date: '', problem: '' }); }} style={{ marginTop: '1.5rem', background: '#1a5fa8', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={async e => {
                e.preventDefault();
                try {
                  const Consultation = Parse.Object.extend("Consultation");
                  const obj = new Consultation();
                  obj.set("name",    consultForm.name.trim());
                  obj.set("phone",   consultForm.phone.trim());
                  obj.set("email",   consultForm.email.trim());
                  obj.set("date",    consultForm.date);
                  obj.set("problem", consultForm.problem.trim());
                  obj.set("status",  "Pending");
                  await obj.save();
                } catch(err) { console.error(err); }
                setConsultSuccess(true);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text" placeholder="Full Name *" required
                  value={consultForm.name} onChange={e => setConsultForm(p => ({ ...p, name: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #d6e6f7', fontSize: 14, outline: 'none' }}
                />
                <input
                  type="tel" placeholder="Phone Number *" required
                  value={consultForm.phone} onChange={e => setConsultForm(p => ({ ...p, phone: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #d6e6f7', fontSize: 14, outline: 'none' }}
                />
                <input
                  type="email" placeholder="Email Address *" required
                  value={consultForm.email} onChange={e => setConsultForm(p => ({ ...p, email: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #d6e6f7', fontSize: 14, outline: 'none' }}
                />
                <input
                  type="date" required
                  value={consultForm.date} onChange={e => setConsultForm(p => ({ ...p, date: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #d6e6f7', fontSize: 14, outline: 'none', color: consultForm.date ? '#222' : '#999' }}
                />
                <textarea
                  placeholder="Describe your problem *" required rows={4}
                  value={consultForm.problem} onChange={e => setConsultForm(p => ({ ...p, problem: e.target.value }))}
                  style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid #d6e6f7', fontSize: 14, outline: 'none', resize: 'vertical' }}
                />
                <button type="submit" style={{ background: '#1a5fa8', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
