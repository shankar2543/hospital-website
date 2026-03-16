import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/LoginSignup.module.css';
import homeStyles from '../styles/home.module.css';
import Parse from '@/lib/parseConfig';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const TESTIMONIALS = [
  { img: 'https://randomuser.me/api/portraits/women/44.jpg', name: 'Priya Sharma',     location: 'Bangalore',     quote: 'The care I received at Medicover was outstanding. The doctors were thorough and genuinely cared about my recovery.' },
  { img: 'https://randomuser.me/api/portraits/men/32.jpg',   name: 'Samuel Okonkwo',  location: 'Mumbai',        quote: 'Booking was seamless and the treatment was world-class. I felt supported every step of the way.' },
  { img: 'https://randomuser.me/api/portraits/women/63.jpg', name: 'Meena Iyer',      location: 'Kochi',         quote: 'Transparent pricing and compassionate staff. Medicover is the only hospital I trust for my family.' },
  { img: 'https://randomuser.me/api/portraits/men/4.jpg',    name: 'Arjun Reddy',     location: 'Hyderabad',     quote: 'The neurology department at Medicover gave me my life back. Exceptional expertise and care throughout.' },
  { img: 'https://randomuser.me/api/portraits/women/17.jpg', name: 'Ananya Krishnan', location: 'Chennai',       quote: 'From emergency admission to full recovery, every single staff member was kind and professional.' },
  { img: 'https://randomuser.me/api/portraits/men/38.jpg',   name: 'Vikram Nair',     location: 'Pune',          quote: 'The cardiac team at Medicover performed my surgery flawlessly. I am grateful for their precision and skill.' },
  { img: 'https://randomuser.me/api/portraits/women/52.jpg', name: 'Divya Menon',     location: 'Trivandrum',    quote: 'Best maternity experience ever. The nurses were so attentive and the facilities were top-notch.' },
  { img: 'https://randomuser.me/api/portraits/men/61.jpg',   name: 'Rohit Gupta',     location: 'Delhi',         quote: 'I had a complicated spine surgery and the recovery was faster than expected. Truly world-class care.' },
  { img: 'https://randomuser.me/api/portraits/women/29.jpg', name: 'Sneha Patil',     location: 'Nagpur',        quote: 'The oncology team was compassionate and thorough. They explained every step and never made me feel alone.' },
  { img: 'https://randomuser.me/api/portraits/men/73.jpg',   name: 'Kiran Kumar',     location: 'Visakhapatnam', quote: 'Outstanding diagnostic facilities and the doctors took time to explain everything in detail. Highly recommend.' },
  { img: 'https://randomuser.me/api/portraits/women/8.jpg',  name: 'Pooja Singh',     location: 'Jaipur',        quote: 'The physiotherapy team helped me regain full movement after my accident. Incredible patience and dedication.' },
  { img: 'https://randomuser.me/api/portraits/men/47.jpg',   name: 'Aditya Rao',      location: 'Kolkata',       quote: 'Modern infrastructure, minimal waiting time, and brilliant specialists. Medicover sets the gold standard.' },
  { img: 'https://randomuser.me/api/portraits/women/36.jpg', name: 'Lakshmi Devi',    location: 'Coimbatore',    quote: "The 24/7 emergency team responded instantly and saved my husband's life. Forever grateful to Medicover." },
];

function TestimonialCarousel({ homeStyles }) {
  const PER_PAGE = 3;
  const total = Math.ceil(TESTIMONIALS.length / PER_PAGE);
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = (idx) => {
    setAnimating(true);
    setTimeout(() => { setSlide(idx); setAnimating(false); }, 350);
  };

  useEffect(() => {
    if (isMobile) return;
    const t = setInterval(() => goTo((slide + 1) % total), 4000);
    return () => clearInterval(t);
  }, [slide, total, isMobile]);

  const visible = TESTIMONIALS.slice(slide * PER_PAGE, slide * PER_PAGE + PER_PAGE);

  if (isMobile) return (
    <>
      <div className={homeStyles.storiesRow}>
        {TESTIMONIALS.map((t, i) => (
          <button key={i} className={homeStyles.storyBtn} onClick={() => setSelected(t)} aria-label={t.name}>
            <div className={homeStyles.storyRing}>
              <img src={t.img} alt={t.name} className={homeStyles.storyImg} />
            </div>
            <span className={homeStyles.storyName}>{t.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className={homeStyles.storyModal} onClick={() => setSelected(null)}>
          <div className={homeStyles.storyModalCard} onClick={e => e.stopPropagation()}>
            <img src={selected.img} alt={selected.name} className={homeStyles.storyModalImg} />
            <p className={homeStyles.storyModalQuote}>&ldquo;{selected.quote}&rdquo;</p>
            <p className={homeStyles.storyModalName}>{selected.name}</p>
            <p className={homeStyles.storyModalLocation}>{selected.location}</p>
            <button className={homeStyles.storyModalClose} onClick={() => setSelected(null)}>✕</button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={homeStyles.testimonialCarousel}>
      <div
        className={homeStyles.testimonialTrack}
        style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateX(30px)' : 'translateX(0)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
      >
        {visible.map((t, i) => (
          <div key={i} className={homeStyles.testimonialCard}>
            <p className={homeStyles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
            <div className={homeStyles.testimonialAuthor}>
              <img src={t.img} alt={t.name} className={homeStyles.testimonialAvatar} />
              <div>
                <p className={homeStyles.testimonialName}>{t.name}</p>
                <p className={homeStyles.testimonialLocation}>{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={homeStyles.testimonialControls}>
        <button className={homeStyles.testimonialArrow} onClick={() => goTo((slide - 1 + total) % total)} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className={homeStyles.testimonialDots}>
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} className={`${homeStyles.testimonialDot}${i === slide ? ' ' + homeStyles.testimonialDotActive : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <button className={homeStyles.testimonialArrow} onClick={() => goTo((slide + 1) % total)} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}

function HowStepsSection({ homeStyles }) {
  const steps = [
    { num: '01', title: 'Create an Account', desc: 'Sign up in minutes with your basic details to get started on your healthcare journey.' },
    { num: '02', title: 'Choose a Specialist', desc: 'Browse our expert doctors by speciality and pick the one that fits your needs.' },
    { num: '03', title: 'Book a Consultation', desc: 'Schedule an in-person or online appointment at your preferred date and time.' },
    { num: '04', title: 'Get Care & Follow-up', desc: 'Receive treatment, access your reports, and stay connected with your doctor.' },
  ];
  const refs = steps.map(() => useRef(null));
  const [visible, setVisible] = React.useState(steps.map(() => false));

  useEffect(() => {
    const observers = refs.map((ref, i) => {
      const obs = new IntersectionObserver(([entry]) => {
        setVisible(v => { const n = [...v]; n[i] = entry.isIntersecting; return n; });
      }, { threshold: 0.15 });
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className={homeStyles.howSteps}>
      {steps.map((step, i) => (
        <div
          key={i}
          ref={refs[i]}
          className={`${homeStyles.howStep} ${visible[i] ? homeStyles.howStepVisible : homeStyles.howStepHidden} ${i % 2 === 0 ? homeStyles.howStepFromRight : homeStyles.howStepFromLeft}`}
        >
          <div className={homeStyles.howNum}>{step.num}</div>
          <h3 className={homeStyles.howStepTitle}>{step.title}</h3>
          <p className={homeStyles.howStepDesc}>{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

function InfraCarousel({ services, perPage, totalSlides, homeStyles }) {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setSlide(s => (s + 1) % totalSlides);
        setAnimating(false);
      }, 400);
    }, 1000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const visible = services.slice(slide * perPage, slide * perPage + perPage);

  return (
    <div className={homeStyles.infraServicesStrip}>
      <div
        className={homeStyles.infraServicesTrack}
        style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}
      >
        {visible.map((s, i) => (
          <div key={i} className={homeStyles.infraServiceItem}>
            <span className={homeStyles.infraServiceIcon}>{s.icon}</span>
            <div>
              <div className={homeStyles.infraServiceLabel}>{s.label}</div>
              <div className={homeStyles.infraServiceDesc}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={homeStyles.infraServicesDots}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            className={`${homeStyles.infraServicesDot}${i === slide ? ' ' + homeStyles.infraServicesDotActive : ''}`}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

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

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [buildingKey, setBuildingKey] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min(scrollY / total, 1) : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Carousel
  const carouselRef = useRef(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const CARD_COUNT = 8;

  const [doctorIdx, setDoctorIdx] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const FAQ_ANSWERS = [
    'Our specialists use the latest technology to deliver accurate diagnoses and effective treatments tailored to each patient. We ensure every visit is comfortable, efficient, and results-driven.',
    'Medicover offers transparent pricing with flexible payment options and insurance tie-ups, making world-class healthcare accessible to every patient regardless of their financial background.',
    'We provide cardiology, neurology, orthopedics, oncology, ophthalmology, and general medicine services across our state-of-the-art facilities staffed by 500+ expert doctors.',
    'Our emergency units operate 24 hours a day, 7 days a week, with rapid-response teams trained to handle critical conditions with speed, precision, and the highest standard of care.',
    'Patients can securely access prescriptions, lab reports, and health records anytime through our digital portal, ensuring complete continuity of care between visits.',
    'Medicover follows strict NABH-accredited hygiene and infection-control protocols, ensuring every area of our facility maintains the highest standards of cleanliness and patient safety.',
  ];
  const FAQS = [
    'What services do multispeciality hospitals at Medicover offer?',
    'Is Medicover Hospital affordable for all patients?',
    'Which specialities and treatments are available at Medicover?',
    'Does Medicover provide 24/7 emergency care?',
    'Can I access my medical records and reports online?',
    'What hygiene and safety standards does Medicover follow?',
  ];
  const toggleFaq = (i) => setOpenFaq(prev => prev === i ? null : i);
  const DOCTORS = [
    { name: 'Dr. Dikkala Srikanth',     qual: 'MBBS, DrNB (Medical Oncology), DNB (Radiation Oncology)', spec: 'Medical Oncology',   img: 'https://service360.hcgel.com/uploads/7d385d66-26a2-4299-ac31-fdf9d6b1a663_210723113951/picture/_DSC8454.jpg'  },
    { name: 'Dr. Gunturu Indira',       qual: 'MBBS, DNB (Radiation Oncology)',                           spec: 'Radiation Oncology', img: 'https://service360.hcgel.com/uploads/7d385d66-26a2-4299-ac31-fdf9d6b1a663_210723113951/picture/_DSC8427.jpg' },
    { name: 'Dr. Harish Dara',          qual: 'MBBS, MS (General Surgery), DNB (Surgical Oncology), FMAS',spec: 'Surgical Oncology',  img: 'https://www.vaidam.com/sites/default/files/dr.harish_d.jpg'  },
    { name: 'Dr. Vijay Aditya Yadaraju',qual: 'MBBS, MD (Radiation Oncology)',                           spec: 'Radiation Oncology', img: 'https://service360.hcgel.com/uploads/7d385d66-26a2-4299-ac31-fdf9d6b1a663_210723113951/picture/_DSC8413.jpg'  },
    { name: 'Dr. Viswanth Kottakota',   qual: 'MBBS, MS (General Surgery), MCh (Surgical Oncology)',     spec: 'Surgical Oncology',  img: 'https://service360.hcgel.com/uploads/7d385d66-26a2-4299-ac31-fdf9d6b1a663_210723113951/picture/_DSC8596.jpg'  },
    { name: 'Dr. VVS Prabhakar Rao',    qual: 'MBBS, DNB (Nuclear Medicine), MD (Radiodiagnosis)',       spec: 'Nuclear Medicine',   img: 'https://service360.hcgel.com/uploads/7d385d66-26a2-4299-ac31-fdf9d6b1a663_210723113951/picture/Dr. V.V.S Prabhakar Rao.jpg'  },
  ];
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 700);
      setDoctorIdx(0);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const docsPerSlide = isMobile ? 1 : 3;
  const DOCTOR_SLIDES = Math.ceil(DOCTORS.length / docsPerSlide);

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

      {/* ===== NEW LANDING SECTION ===== */}
      <section className={homeStyles.landingSection}>
        {/* Navbar lives here so it overlays this section */}
        <nav className={`${styles.navbar}${scrolled ? ' ' + styles.navbarScrolled : ''}`}>
          <div className={styles.navBrand}>
            <img src="/medicover-mainlogo.png" alt="Medicover" className={styles.navLogo} />
            <img src="/medicover-moblogo.png" alt="Medicover" className={styles.navLogoMob} />
          </div>

          <div className={styles.navLinks}>
            <a href="#" className={styles.navLink}>Home</a>
            <a href="#about" className={styles.navLink}>About Us</a>
            <a href="#about" className={styles.navLink}>Services</a>
            <a href="#doctors" className={styles.navLink}>Doctors</a>
            <a href="#reviews" className={styles.navLink}>Reviews</a>
            <a href="#" className={styles.navLink}>Contact Us</a>
            <button className={styles.signInBtn} onClick={() => router.push('/login')}>Sign In</button>
          </div>

          {/* Mobile right — sign in + hamburger */}
          <div className={styles.mobileRight}>
            <button className={styles.signInBtn} onClick={() => router.push('/login')}>Sign In</button>
            <button className={styles.hamburger} onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <span /><span /><span />
            </button>
          </div>
        </nav>

        {/* Landing content */}
        <div className={homeStyles.landingInner}>

          {/* Left text */}
          <div className={homeStyles.landingLeft}>
            <div className={homeStyles.landingBadge}>
              <span className={homeStyles.landingBadgeDot} />
              Trusted by 100,000+ patients across India
            </div>
            <h1 className={homeStyles.landingTitle}>Welcome to Medicover</h1>
            <p className={homeStyles.landingSubtitle}>Your health, in expert hands.</p>
            <p className={homeStyles.landingDesc}>
              Medicover combines world-class specialists with AI-powered tools to give you seamless access to care — from booking to recovery, all in one place.
            </p>
            <a
              href="https://www.google.com/maps/search/Medicover+Hospital+Kakinada"
              target="_blank"
              rel="noopener noreferrer"
              className={homeStyles.locationRow}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#8b5cf6" style={{flexShrink:0}}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className={homeStyles.locationText}>Kakinada</span>
            </a>
            <div className={homeStyles.landingCtas}>
              <button className={homeStyles.bookBtn} onClick={() => setShowConsultForm(true)}>
                Book a Free Consultation
              </button>
              <div className={homeStyles.videoWrapper}>
                <button className={homeStyles.videoBtn}>
                  <span className={homeStyles.videoIcon}>&#9654;</span>
                </button>
                <span className={homeStyles.videoTooltip}>Play Video</span>
              </div>
            </div>
          </div>

          {/* Right — animated building */}
          <div className={homeStyles.landingRight}>
            <div className={homeStyles.buildingCircle} onMouseEnter={() => setBuildingKey(k => k + 1)}>
              <svg key={buildingKey} viewBox="0 0 480 400" className={homeStyles.buildingSvg} xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="368" x2="470" y2="368" className={homeStyles.bp} style={{animationDelay:'0s'}}/>
                <line x1="20" y1="368" x2="20" y2="168" className={homeStyles.bp} style={{animationDelay:'0.15s'}}/>
                <line x1="20" y1="168" x2="78" y2="168" className={homeStyles.bp} style={{animationDelay:'0.25s'}}/>
                <line x1="78" y1="168" x2="78" y2="58" className={homeStyles.bp} style={{animationDelay:'0.35s'}}/>
                <line x1="78" y1="368" x2="78" y2="58" className={homeStyles.bp} style={{animationDelay:'0.45s'}}/>
                <line x1="78" y1="58" x2="392" y2="58" className={homeStyles.bp} style={{animationDelay:'0.55s'}}/>
                <line x1="62" y1="46" x2="408" y2="46" className={homeStyles.bp} style={{animationDelay:'0.65s'}}/>
                <line x1="62" y1="46" x2="78" y2="58" className={homeStyles.bp} style={{animationDelay:'0.72s'}}/>
                <line x1="408" y1="46" x2="392" y2="58" className={homeStyles.bp} style={{animationDelay:'0.79s'}}/>
                <rect x="148" y="12" width="184" height="36" className={homeStyles.bp} style={{animationDelay:'0.9s'}}/>
                <line x1="148" y1="26" x2="332" y2="26" className={homeStyles.bp} style={{animationDelay:'1.0s'}}/>
                <text x="240" y="23" className={homeStyles.bpText} style={{animationDelay:'1.1s'}}>MEDICOVER</text>
                <text x="240" y="38" className={homeStyles.bpText} style={{animationDelay:'1.2s'}}>HOSPITAL</text>
                <line x1="184" y1="46" x2="170" y2="48" className={homeStyles.bp} style={{animationDelay:'1.3s'}}/>
                <line x1="296" y1="46" x2="310" y2="48" className={homeStyles.bp} style={{animationDelay:'1.3s'}}/>
                <line x1="392" y1="368" x2="392" y2="58" className={homeStyles.bp} style={{animationDelay:'1.35s'}}/>
                <line x1="392" y1="220" x2="440" y2="220" className={homeStyles.bp} style={{animationDelay:'1.45s'}}/>
                <line x1="440" y1="220" x2="440" y2="368" className={homeStyles.bp} style={{animationDelay:'1.55s'}}/>
                <line x1="78" y1="120" x2="392" y2="120" className={homeStyles.bp} style={{animationDelay:'1.65s'}}/>
                <line x1="78" y1="182" x2="392" y2="182" className={homeStyles.bp} style={{animationDelay:'1.75s'}}/>
                <line x1="78" y1="244" x2="392" y2="244" className={homeStyles.bp} style={{animationDelay:'1.85s'}}/>
                <line x1="78" y1="306" x2="392" y2="306" className={homeStyles.bp} style={{animationDelay:'1.95s'}}/>
                <line x1="157" y1="58" x2="157" y2="368" className={homeStyles.bp} style={{animationDelay:'2.05s'}}/>
                <line x1="235" y1="58" x2="235" y2="368" className={homeStyles.bp} style={{animationDelay:'2.12s'}}/>
                <line x1="313" y1="58" x2="313" y2="368" className={homeStyles.bp} style={{animationDelay:'2.19s'}}/>
                <rect x="90" y="66" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'2.3s'}}/>
                <line x1="116" y1="66" x2="116" y2="110" className={homeStyles.bp} style={{animationDelay:'2.35s'}}/>
                <line x1="90" y1="88" x2="143" y2="88" className={homeStyles.bp} style={{animationDelay:'2.38s'}}/>
                <rect x="168" y="66" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'2.42s'}}/>
                <line x1="194" y1="66" x2="194" y2="110" className={homeStyles.bp} style={{animationDelay:'2.46s'}}/>
                <line x1="168" y1="88" x2="221" y2="88" className={homeStyles.bp} style={{animationDelay:'2.49s'}}/>
                <rect x="246" y="66" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'2.53s'}}/>
                <line x1="272" y1="66" x2="272" y2="110" className={homeStyles.bp} style={{animationDelay:'2.56s'}}/>
                <line x1="246" y1="88" x2="299" y2="88" className={homeStyles.bp} style={{animationDelay:'2.59s'}}/>
                <rect x="324" y="66" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'2.63s'}}/>
                <line x1="350" y1="66" x2="350" y2="110" className={homeStyles.bp} style={{animationDelay:'2.66s'}}/>
                <line x1="324" y1="88" x2="377" y2="88" className={homeStyles.bp} style={{animationDelay:'2.69s'}}/>
                <rect x="90" y="128" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'2.8s'}}/>
                <line x1="116" y1="128" x2="116" y2="172" className={homeStyles.bp} style={{animationDelay:'2.84s'}}/>
                <line x1="90" y1="150" x2="143" y2="150" className={homeStyles.bp} style={{animationDelay:'2.87s'}}/>
                <rect x="168" y="128" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'2.91s'}}/>
                <line x1="194" y1="128" x2="194" y2="172" className={homeStyles.bp} style={{animationDelay:'2.94s'}}/>
                <line x1="168" y1="150" x2="221" y2="150" className={homeStyles.bp} style={{animationDelay:'2.97s'}}/>
                <rect x="246" y="128" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.0s'}}/>
                <line x1="272" y1="128" x2="272" y2="172" className={homeStyles.bp} style={{animationDelay:'3.03s'}}/>
                <line x1="246" y1="150" x2="299" y2="150" className={homeStyles.bp} style={{animationDelay:'3.06s'}}/>
                <rect x="324" y="128" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.09s'}}/>
                <line x1="350" y1="128" x2="350" y2="172" className={homeStyles.bp} style={{animationDelay:'3.12s'}}/>
                <line x1="324" y1="150" x2="377" y2="150" className={homeStyles.bp} style={{animationDelay:'3.15s'}}/>
                <rect x="90" y="190" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.25s'}}/>
                <line x1="116" y1="190" x2="116" y2="234" className={homeStyles.bp} style={{animationDelay:'3.28s'}}/>
                <line x1="90" y1="212" x2="143" y2="212" className={homeStyles.bp} style={{animationDelay:'3.31s'}}/>
                <rect x="168" y="190" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.34s'}}/>
                <line x1="194" y1="190" x2="194" y2="234" className={homeStyles.bp} style={{animationDelay:'3.37s'}}/>
                <line x1="168" y1="212" x2="221" y2="212" className={homeStyles.bp} style={{animationDelay:'3.40s'}}/>
                <rect x="246" y="190" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.43s'}}/>
                <line x1="272" y1="190" x2="272" y2="234" className={homeStyles.bp} style={{animationDelay:'3.46s'}}/>
                <line x1="246" y1="212" x2="299" y2="212" className={homeStyles.bp} style={{animationDelay:'3.49s'}}/>
                <rect x="324" y="190" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.52s'}}/>
                <line x1="350" y1="190" x2="350" y2="234" className={homeStyles.bp} style={{animationDelay:'3.55s'}}/>
                <line x1="324" y1="212" x2="377" y2="212" className={homeStyles.bp} style={{animationDelay:'3.58s'}}/>
                <rect x="90" y="252" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.68s'}}/>
                <line x1="116" y1="252" x2="116" y2="296" className={homeStyles.bp} style={{animationDelay:'3.71s'}}/>
                <line x1="90" y1="274" x2="143" y2="274" className={homeStyles.bp} style={{animationDelay:'3.74s'}}/>
                <rect x="168" y="252" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.77s'}}/>
                <line x1="194" y1="252" x2="194" y2="296" className={homeStyles.bp} style={{animationDelay:'3.80s'}}/>
                <line x1="168" y1="274" x2="221" y2="274" className={homeStyles.bp} style={{animationDelay:'3.83s'}}/>
                <rect x="246" y="252" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.86s'}}/>
                <line x1="272" y1="252" x2="272" y2="296" className={homeStyles.bp} style={{animationDelay:'3.89s'}}/>
                <line x1="246" y1="274" x2="299" y2="274" className={homeStyles.bp} style={{animationDelay:'3.92s'}}/>
                <rect x="324" y="252" width="53" height="44" className={homeStyles.bp} style={{animationDelay:'3.95s'}}/>
                <line x1="350" y1="252" x2="350" y2="296" className={homeStyles.bp} style={{animationDelay:'3.98s'}}/>
                <line x1="324" y1="274" x2="377" y2="274" className={homeStyles.bp} style={{animationDelay:'4.01s'}}/>
                <rect x="28" y="178" width="38" height="30" className={homeStyles.bp} style={{animationDelay:'4.1s'}}/>
                <rect x="28" y="238" width="38" height="30" className={homeStyles.bp} style={{animationDelay:'4.15s'}}/>
                <rect x="28" y="298" width="38" height="30" className={homeStyles.bp} style={{animationDelay:'4.2s'}}/>
                <rect x="398" y="230" width="34" height="28" className={homeStyles.bp} style={{animationDelay:'4.25s'}}/>
                <rect x="398" y="290" width="34" height="28" className={homeStyles.bp} style={{animationDelay:'4.3s'}}/>
                <path d="M188,368 L188,318 Q240,292 292,318 L292,368" className={homeStyles.bp} style={{animationDelay:'4.4s'}}/>
                <line x1="240" y1="300" x2="240" y2="368" className={homeStyles.bp} style={{animationDelay:'4.5s'}}/>
                <rect x="164" y="318" width="28" height="50" className={homeStyles.bp} style={{animationDelay:'4.55s'}}/>
                <rect x="288" y="318" width="28" height="50" className={homeStyles.bp} style={{animationDelay:'4.6s'}}/>
                <line x1="158" y1="372" x2="322" y2="372" className={homeStyles.bp} style={{animationDelay:'4.65s'}}/>
                <line x1="148" y1="378" x2="332" y2="378" className={homeStyles.bp} style={{animationDelay:'4.7s'}}/>
                <line x1="79" y1="72" x2="391" y2="72" className={homeStyles.bp} style={{animationDelay:'4.75s'}}/>
                <line x1="79" y1="85" x2="391" y2="85" className={homeStyles.bp} style={{animationDelay:'4.8s'}}/>
                <line x1="79" y1="98" x2="391" y2="98" className={homeStyles.bp} style={{animationDelay:'4.85s'}}/>
                <line x1="79" y1="110" x2="391" y2="110" className={homeStyles.bp} style={{animationDelay:'4.9s'}}/>
              </svg>
            </div>

            {/* Stats strip below animation */}
            <div className={homeStyles.rightStatsStrip}>

              {/* Circular progress stat */}
              <div className={homeStyles.rStatCircle}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="5"/>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#8b5cf6" strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * 0.01}`}
                    style={{transform:'rotate(-90deg)',transformOrigin:'center'}}
                  />
                  <text x="32" y="36" textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="800" fontFamily="inherit">99%</text>
                </svg>
                <span className={homeStyles.rStatCircleLabel}>Success Rate</span>
              </div>

              {/* Divider */}
              <div className={homeStyles.rStatDivider}/>

              {/* Icon + number stat */}
              <div className={homeStyles.rStatIcon}>
                <div className={homeStyles.rStatIconBox}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <div className={homeStyles.rStatNum}>500+</div>
                  <div className={homeStyles.rStatLabel}>Specialists</div>
                </div>
              </div>

              {/* Divider */}
              <div className={homeStyles.rStatDivider}/>

              {/* Badge stat */}
              <div className={homeStyles.rStatBadge}>
                <div className={homeStyles.rStatBadgePill}>24/7</div>
                <div className={homeStyles.rStatLabel}>Emergency</div>
              </div>

              {/* Divider */}
              <div className={homeStyles.rStatDivider}/>

              {/* Bar stat */}
              <div className={homeStyles.rStatBar}>
                <div className={homeStyles.rStatNum}>150+</div>
                <div className={homeStyles.rStatLabel}>Beds</div>
                <div className={homeStyles.rStatBarTrack}>
                  <div className={homeStyles.rStatBarFill}/>
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>


      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.mobileSidebar} onClick={e => e.stopPropagation()}>
            {/* Sidebar header */}
            <div className={styles.sidebarHeader}>
              <img src="/medicover-moblogo.png" alt="Medicover" className={styles.sidebarLogo} />
              <button className={styles.mobileSidebarClose} onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>

            {/* Nav links */}
            <nav className={styles.sidebarNav}>
              {[
                { icon: '🏠', label: 'Home',       href: '#' },
                { icon: '🩺', label: 'Services',   href: '#about' },
                { icon: 'ℹ️',  label: 'About Us',  href: '#about' },
                { icon: '👨‍⚕️', label: 'Doctors',   href: '#doctors' },
                { icon: '⭐', label: 'Reviews',    href: '#reviews' },
                { icon: '📞', label: 'Contact Us', href: '#' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className={styles.mobileSidebarLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={styles.sidebarLinkIcon}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Sidebar footer — Sign In */}
            <div className={styles.sidebarFooter}>
              <button
                className={styles.sidebarSignInBtn}
                onClick={() => { setMobileMenuOpen(false); setShowConsultForm(true); }}
              >
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      )}

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
            </div>

            <div className={homeStyles.aboutGrid} ref={carouselRef} onScroll={handleCarouselScroll}>
              {[
                { title: 'Expert Doctors',    desc: 'Our team consists of experienced specialists across multiple disciplines, dedicated to your health and well-being.',        bg: 'rgba(7,7,26,0.96)',  circuit: '#3b2a6e', accent: '#a78bfa', icon: '👨‍⚕️' },
                { title: 'Modern Facilities', desc: 'State-of-the-art medical equipment and technology for accurate diagnosis and effective treatment.',                         bg: 'rgba(4,18,14,0.96)', circuit: '#0f3d28', accent: '#34d399', icon: '🏥' },
                { title: '24/7 Support',      desc: 'Round-the-clock medical support and emergency services to ensure you\'re never alone in your healthcare journey.',          bg: 'rgba(18,10,4,0.96)', circuit: '#3d2000', accent: '#fb923c', icon: '🕐' },
                { title: 'Patient Care',      desc: 'Personalized treatment plans and compassionate care that puts your health and comfort first.',                              bg: 'rgba(18,5,5,0.96)',  circuit: '#3d0a0a', accent: '#f87171', icon: '❤️' },
                { title: 'Affordable Pricing',desc: 'Transparent and competitive pricing, making quality healthcare accessible to everyone.',                                   bg: 'rgba(10,7,22,0.96)', circuit: '#2d1a5e', accent: '#c084fc', icon: '💰' },
                { title: 'Cleanliness',       desc: 'Strict hygiene standards and infection control protocols to ensure a safe environment.',                                   bg: 'rgba(15,13,4,0.96)', circuit: '#3d3200', accent: '#fbbf24', icon: '✨' },
                { title: 'Digital Records',   desc: 'Seamless access to your medical history, prescriptions, and lab reports — all in one secure digital platform.',            bg: 'rgba(4,15,6,0.96)',  circuit: '#0a3316', accent: '#4ade80', icon: '📋' },
                { title: 'Emergency Care',    desc: 'Rapid-response emergency units equipped to handle critical conditions with speed, precision, and expert medical teams.',    bg: 'rgba(18,4,8,0.96)',  circuit: '#3d0a14', accent: '#fb7185', icon: '🚑' },
              ].map((card, i) => (
                <div key={i} className={homeStyles.carouselSlide}>
                  <div
                    className={homeStyles.featureCard}
                    style={{ '--card-bg': card.bg, '--card-color': card.circuit }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                    <h3 className={homeStyles.featureTitle} style={{ color: card.accent }}>{card.title}</h3>
                    <p className={homeStyles.featureDescription}>{card.desc}</p>
                  </div>
                </div>
              ))}
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

        {/* ===== OUR DOCTORS SECTION ===== */}
        <section id="doctors" className={homeStyles.doctorsSection}>
          <div className={homeStyles.doctorsContainer}>
            <p className={homeStyles.servicesEyebrow}>Meet The Team</p>
            <h2 className={homeStyles.doctorsTitle}>Our Doctors</h2>
            <p className={homeStyles.doctorsSubtitle}>
              At Medicover, you will have access to a team of the best specialists
              who excel at offering value-based and patient-centric care.
            </p>

            {/* Carousel */}
            <div className={homeStyles.doctorCarouselWrapper}>
              <div
                className={homeStyles.doctorCarousel}
                onTouchStart={e => { e.currentTarget._touchX = e.touches[0].clientX; }}
                onTouchEnd={e => {
                  const diff = e.currentTarget._touchX - e.changedTouches[0].clientX;
                  if (diff > 50 && doctorIdx < DOCTOR_SLIDES - 1) setDoctorIdx(i => i + 1);
                  if (diff < -50 && doctorIdx > 0) setDoctorIdx(i => i - 1);
                }}
                onMouseDown={e => { e.currentTarget._mouseX = e.clientX; }}
                onMouseUp={e => {
                  const diff = e.currentTarget._mouseX - e.clientX;
                  if (diff > 50 && doctorIdx < DOCTOR_SLIDES - 1) setDoctorIdx(i => i + 1);
                  if (diff < -50 && doctorIdx > 0) setDoctorIdx(i => i - 1);
                }}
              >
              <div
                className={homeStyles.doctorTrack}
                style={{ transform: `translateX(-${doctorIdx * 100}%)` }}
              >
                {Array.from({ length: DOCTOR_SLIDES }).map((_, slideIdx) => (
                  <div key={slideIdx} className={homeStyles.doctorSlide}>
                    {DOCTORS.slice(slideIdx * docsPerSlide, slideIdx * docsPerSlide + docsPerSlide).map((doc, i) => (
                      <div key={i} className={homeStyles.doctorCard} onClick={() => setSelectedDoctor(doc)} style={{ cursor: 'pointer' }}>
                        <div className={homeStyles.doctorImgWrap}>
                          <img src={doc.img} alt={doc.name} className={homeStyles.doctorImg} />
                        </div>
                        <h3 className={homeStyles.doctorName}>{doc.name}</h3>
                        <p className={homeStyles.doctorQual}>{doc.qual}</p>
                        <p className={homeStyles.doctorSpec}>{doc.spec}</p>
                        <p className={homeStyles.doctorViewProfile}>View Profile →</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* Dots */}
            <div className={homeStyles.doctorDots}>
              {Array.from({ length: DOCTOR_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  className={`${homeStyles.doctorDot}${doctorIdx === i ? ' ' + homeStyles.doctorDotActive : ''}`}
                  onClick={() => setDoctorIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ===== SERVICES SECTION ===== */}
        <section className={homeStyles.servicesSection}>
          <div className={homeStyles.servicesContainer}>
            <p className={homeStyles.servicesEyebrow}>What We Offer</p>
            <h2 className={homeStyles.servicesTitle}>Our Medical Specialities</h2>
            <p className={homeStyles.servicesSubtitle}>World-class care across a wide range of specialities</p>
            <div className={homeStyles.servicesGrid}>
              {[
                { icon: '❤️', title: 'Cardiology',       desc: 'Expert heart care from diagnosis to surgery and rehabilitation.',                      color: '#e74c3c' },
                { icon: '🧠', title: 'Neurology',        desc: 'Advanced treatment for brain, spine, and nervous system disorders.',                    color: '#8e44ad' },
                { icon: '🦴', title: 'Orthopedics',      desc: 'Comprehensive bone, joint, and muscle care including joint replacement.',               color: '#2980b9' },
                { icon: '👁️', title: 'Ophthalmology',    desc: 'Complete eye care, from routine exams to advanced retinal surgery.',                   color: '#27ae60' },
                { icon: '🩺', title: 'General Medicine', desc: 'Primary healthcare and management of chronic conditions.',                              color: '#e67e22' },
                { icon: '🧬', title: 'Oncology',         desc: 'Compassionate cancer care with the latest treatment protocols.',                        color: '#16a085' },
              ].map((s, i) => (
                <div key={i} className={homeStyles.serviceCard} style={{ '--card-color': s.color }}>
                  <div className={homeStyles.serviceIcon}>{s.icon}</div>
                  <h3 className={homeStyles.serviceCardTitle} style={{ color: s.color }}>{s.title}</h3>
                  <p className={homeStyles.serviceCardDesc}>{s.desc}</p>
                  <span className={homeStyles.serviceCardLink} style={{ color: s.color }}>Learn more →</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section className={homeStyles.howSection}>
          <div className={homeStyles.howContainer}>
            <p className={homeStyles.howEyebrow}>Simple Process</p>
            <h2 className={homeStyles.howTitle}>How Medicover Works</h2>
            <HowStepsSection homeStyles={homeStyles} />
          </div>
        </section>

        {/* ===== KEY INFRASTRUCTURE SECTION ===== */}
        <section className={homeStyles.infraSection}>
          <div className={homeStyles.infraContainer}>
            <h2 className={homeStyles.infraTitle}>Key Infrastructure and Facilities</h2>
            <div className={homeStyles.infraGrid}>
              {/* Card 1 */}
              <div className={homeStyles.infraCard}>
                <ul className={homeStyles.infraList}>
                  {['450 Beds','Advanced PET & CT Scan','Cath Labs','ECMO','CRRT','Bronchoscopies','Thermal Endometrial Ablation for Gynec Procedures','24/7 Emergency Care'].map((item, i) => (
                    <li key={i} className={homeStyles.infraItem}><span className={homeStyles.infraDot} />{item}</li>
                  ))}
                </ul>
              </div>

              {/* MRI images stacked */}
              <div className={homeStyles.infraImgStack}>
                <div className={homeStyles.infraImgWrap}>
                  <img src="/mri.jpg" alt="MRI Scanner" className={homeStyles.infraImg} />
                  <span className={homeStyles.infraImgLabel}>MRI Scanner</span>
                </div>
                <div className={homeStyles.infraImgWrap}>
                  <img src="/mri1.jpg" alt="MRI Facility" className={homeStyles.infraImg} />
                  <span className={homeStyles.infraImgLabel}>MRI Facility</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className={homeStyles.infraCard}>
                <ul className={homeStyles.infraList}>
                  {['Air Flow and HEPA Filters','MRIs','Neuro Navigation with CUSA','Neuro Microscope with Furmonoscope','4D Echo Machines','Ample Parking Space','Emergency Services','Ambulance Services'].map((item, i) => (
                    <li key={i} className={homeStyles.infraItem}><span className={homeStyles.infraDot} />{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services carousel below infra cards */}
            {(() => {
              const infraServices = [
                { icon: '🏥', label: 'Emergency Care',       desc: '24/7 critical & trauma care' },
                { icon: '🧬', label: 'Advanced Diagnostics', desc: 'PET, CT, MRI & 4D Echo' },
                { icon: '🫀', label: 'Cardiac Sciences',     desc: 'Cath labs & ECMO support' },
                { icon: '🧠', label: 'Neuro Surgery',        desc: 'Navigation-guided precision' },
                { icon: '🚑', label: 'Ambulance Services',   desc: 'Round-the-clock response' },
                { icon: '🩻', label: 'Radiology',            desc: 'HEPA-filtered imaging suites' },
                { icon: '🦷', label: 'Dental Care',          desc: 'Full oral & maxillofacial care' },
                { icon: '👁️', label: 'Ophthalmology',        desc: 'Laser & cataract surgeries' },
                { icon: '🤱', label: 'Maternity',            desc: 'High-risk & normal deliveries' },
                { icon: '🦴', label: 'Orthopaedics',         desc: 'Joint replacement & spine care' },
                { icon: '🩸', label: 'Blood Bank',           desc: '24/7 component therapy' },
                { icon: '🧪', label: 'Pathology Lab',        desc: 'NABL-accredited diagnostics' },
                { icon: '💊', label: 'Pharmacy',             desc: 'Round-the-clock dispensing' },
                { icon: '🫁', label: 'Pulmonology',          desc: 'Bronchoscopy & sleep studies' },
                { icon: '🧘', label: 'Rehabilitation',       desc: 'Physio & occupational therapy' },
                { icon: '🔬', label: 'Oncology',             desc: 'Chemo, radio & surgical oncology' },
                { icon: '🩺', label: 'General Medicine',     desc: 'Outpatient & preventive care' },
                { icon: '👶', label: 'Paediatrics',          desc: 'NICU & child wellness clinics' },
              ];
              const PER_PAGE = 6;
              const totalSlides = Math.ceil(infraServices.length / PER_PAGE);
              return (
                <InfraCarousel services={infraServices} perPage={PER_PAGE} totalSlides={totalSlides} homeStyles={homeStyles} />
              );
            })()}

          </div>
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        <section id="reviews" className={homeStyles.testimonialSection}>
          <div className={homeStyles.testimonialContainer}>
            <p className={homeStyles.servicesEyebrow}>Patient Stories</p>
            <h2 className={homeStyles.testimonialTitle}>What Our Patients Say</h2>
            <TestimonialCarousel homeStyles={homeStyles} />
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

        {/* ===== FAQ SECTION ===== */}
        <section className={homeStyles.faqSection}>
          <div className={homeStyles.faqContainer}>
            <h2 className={homeStyles.faqTitle}>Frequently Asked Questions</h2>
            <div className={homeStyles.faqList}>
              {FAQS.map((q, i) => (
                <div
                  key={i}
                  className={`${homeStyles.faqItem}${openFaq === i ? ' ' + homeStyles.faqItemOpen : ''}`}
                >
                  <button className={homeStyles.faqQuestion} onClick={() => toggleFaq(i)}>
                    <span>{q}</span>
                    <span className={`${homeStyles.faqIcon}${openFaq === i ? ' ' + homeStyles.faqIconOpen : ''}`}>
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className={homeStyles.faqAnswer}>{FAQ_ANSWERS[i]}</p>
                  )}
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

            {/* Also visit our */}
            <div className={homeStyles.footerVisit}>
              <p className={homeStyles.footerVisitLabel}>Also visit our</p>
              <div className={homeStyles.footerVisitIcons}>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className={homeStyles.footerVisitBtn} aria-label="Play Store">
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <polygon points="5,3 19,12 5,21" fill="#34a853" />
                  </svg>
                </a>
                <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className={homeStyles.footerVisitBtn} aria-label="App Store">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </a>
                <a href="https://www.medicover.in" target="_blank" rel="noopener noreferrer" className={homeStyles.footerVisitBtn} aria-label="Website">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className={homeStyles.footerBottom}>
              <p>&copy; 2026 Medicover Hospital. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            style={{ background: 'rgba(10,10,30,0.95)', backdropFilter: 'blur(28px)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 24, padding: '2.2rem 2.4rem', width: '100%', maxWidth: 460, boxShadow: '0 16px 60px rgba(124,58,237,0.25), 0 8px 32px rgba(0,0,0,0.5)', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedDoctor(null)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(240,244,255,0.7)', width: 32, height: 32, borderRadius: '50%', fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>

            {/* Doctor image */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <img
                src={selectedDoctor.img}
                alt={selectedDoctor.name}
                style={{ width: 110, height: 130, borderRadius: 14, objectFit: 'cover', objectPosition: 'top center', border: '2px solid rgba(124,58,237,0.4)', flexShrink: 0 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0f4ff', margin: 0, lineHeight: 1.2 }}>{selectedDoctor.name}</h2>
                <span style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd', fontSize: '0.78rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 20 }}>{selectedDoctor.spec}</span>
                <p style={{ fontSize: '0.82rem', color: 'rgba(240,244,255,0.50)', lineHeight: 1.5, margin: 0 }}>{selectedDoctor.qual}</p>
              </div>
            </div>

            {/* Info rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.8rem' }}>
              {[
                { label: 'Hospital',     value: 'Medicover Hospital' },
                { label: 'Availability', value: 'Mon – Sat, 9:00 AM – 5:00 PM' },
                { label: 'Consultation', value: '₹500 – ₹1,000' },
                { label: 'Languages',    value: 'English, Hindi, Telugu' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(240,244,255,0.40)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(240,244,255,0.82)', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Book CTA */}
            <button
              onClick={() => { setSelectedDoctor(null); setShowConsultForm(true); }}
              style={{ width: '100%', padding: '0.9rem', background: '#3d3d8f', color: '#fff', border: 'none', borderRadius: 12, fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit', transition: 'transform 0.2s, box-shadow 0.2s' }}
            >Book Appointment</button>
          </div>
        </div>
      )}

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
                <button type="submit" style={{ background: '#3d3d8f', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Scroll to top button */}
      {scrollProgress > 0.02 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(10,6,30,0.85)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(139,92,246,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.35)'; }}
          aria-label="Scroll to top"
        >
          {/* Circular progress ring */}
          <svg
            width="48" height="48"
            style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          >
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="2.5" />
            <circle
              cx="24" cy="24" r="21" fill="none"
              stroke="url(#scrollGrad)" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 21}`}
              strokeDashoffset={`${2 * Math.PI * 21 * (1 - scrollProgress)}`}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
            <defs>
              <linearGradient id="scrollGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
          </svg>
          {/* Up arrow */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{position:'relative',zIndex:1}}>
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  );
}
