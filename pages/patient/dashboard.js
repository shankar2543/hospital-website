import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiLogOut, FiCalendar, FiUser, FiFileText, FiHome, FiActivity, FiMenu, FiX } from "react-icons/fi";
import Parse from '@/lib/parseConfig';
import styles from '@/styles/patientDashboard.module.css';

function NavItem({ label, icon, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.75rem 2rem", cursor: "pointer", fontWeight: 500, fontSize: 16,
        display: "flex", alignItems: "center", gap: 10,
        borderLeft: active ? "4px solid #fff" : "4px solid transparent",
        background: active || hovered ? "rgba(255,255,255,0.18)" : "none",
        transition: "background 0.2s",
      }}
    >
      {icon} {label}
    </div>
  );
}

const EMPTY_FORM = { doctor: "", name: "", age: "", gender: "", date: "", time: "", reason: "" };

const DOCTORS = [
  "Dr. Manohar — Psychiatrist",
  "Dr. Priya Sharma — Neurologist",
  "Dr. Samuel Carter — Orthopedic Surgeon",
  "Dr. Aisha Khan — Pediatrician",
  "Dr. Ravi Verma — Dermatologist",
  "Dr. Emily Watson — Gynecologist",
  "Dr. James Patel — Ophthalmologist",
  "Dr. Nadia Torres — Psychiatrist",
  "Dr. Chen Wei — Radiologist",
  "Dr. Fatima Malik — General Surgeon",
];

function ProfileSection({ name, email, phone, setEmail, setPhone }) {
  const [editing, setEditing]       = useState(false);
  const [tempEmail, setTempEmail]   = useState(email);
  const [tempPhone, setTempPhone]   = useState(phone);
  const [saved, setSaved]           = useState(false);

  const handleSave = () => {
    setEmail(tempEmail);
    setPhone(tempPhone);
    localStorage.setItem("email", tempEmail);
    localStorage.setItem("phone", tempPhone);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setTempEmail(email);
    setTempPhone(phone);
    setEditing(false);
  };

  const rowStyle  = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 0", borderBottom: "1px solid #f0f4f8", gap: "0.5rem", flexWrap: "wrap" };
  const inputStyle = { padding: "0.5rem 0.8rem", borderRadius: 8, border: "1px solid #1a5fa8", fontSize: 14, outline: "none", width: "min(220px, 100%)" };

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", padding: "2rem", maxWidth: 500, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>My Profile</h2>
        {!editing
          ? <button onClick={() => { setTempEmail(email); setTempPhone(phone); setEditing(true); }}
              style={{ background: "#d6e6f7", color: "#1a5fa8", border: "none", borderRadius: 8, padding: "0.4rem 1rem", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Edit
            </button>
          : <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleSave}
                style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.4rem 1rem", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Save
              </button>
              <button onClick={handleCancel}
                style={{ background: "#fdecea", color: "#e74c3c", border: "none", borderRadius: 8, padding: "0.4rem 1rem", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
        }
      </div>

      {saved && <div style={{ background: "#e6f9f0", color: "#27ae60", borderRadius: 8, padding: "0.6rem 1rem", fontSize: 13, fontWeight: 600, marginBottom: "1rem" }}>Profile updated successfully.</div>}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={rowStyle}>
          <span style={{ color: "#888", fontSize: 14 }}>Name</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{name}</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: "#888", fontSize: 14 }}>Email</span>
          {editing
            ? <input value={tempEmail} onChange={e => setTempEmail(e.target.value)} style={inputStyle} />
            : <span style={{ fontWeight: 600, fontSize: 14 }}>{email}</span>}
        </div>
        <div style={rowStyle}>
          <span style={{ color: "#888", fontSize: 14 }}>Phone</span>
          {editing
            ? <input value={tempPhone} onChange={e => setTempPhone(e.target.value)} style={inputStyle} />
            : <span style={{ fontWeight: 600, fontSize: 14 }}>{phone}</span>}
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <span style={{ color: "#888", fontSize: 14 }}>Role</span>
          <span style={{ background: "#d6e6f7", color: "#1a5fa8", fontSize: 13, fontWeight: 600, padding: "3px 12px", borderRadius: 20 }}>Patient</span>
        </div>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav]       = useState("Dashboard");
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formError, setFormError]       = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [labSubmitting, setLabSubmitting] = useState(false);
  const [labSuccess, setLabSuccess]       = useState(false);
  const [apptSuccess, setApptSuccess]     = useState(false);
  const [reports, setReports]             = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [expandedReports, setExpandedReports] = useState({});

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "patient") { router.push("/"); return; }
    setName(localStorage.getItem("name") || "Patient");
    setEmail(localStorage.getItem("email") || "");
    setPhone(localStorage.getItem("phone") || "");
    fetchAppointments();
    fetchReports();
    const interval = setInterval(() => {
      fetchAppointments();
      fetchReports();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const email = localStorage.getItem("email") || "";
      const query = new Parse.Query("LabReport");
      query.equalTo("patientEmail", email);
      query.descending("createdAt");
      query.limit(1000);
      const results = await query.find();
      setReports(results.map(r => ({
        id:          r.id,
        patientName: r.get("patientName")  || "",
        reportDate:  r.get("reportDate")   || "",
        tests:       JSON.parse(r.get("tests") || "[]"),
      })));
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) return;
      const query = new Parse.Query("Appointment");
      query.equalTo("patientId", currentUser.id);
      query.descending("createdAt");
      const results = await query.find();
      setAppointments(results.map(r => ({
        id:          r.id,
        doctor:      r.get("doctor"),
        date:        r.get("date"),
        time:        r.get("time"),
        patientName: r.get("patientName") || "",
        status:      r.get("status"),
      })));
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push("/"); };

  const toggleTest = (test) => {
    setSelectedTests(prev => {
      const exists = prev.find(t => t.name === test.name);
      return exists ? prev.filter(t => t.name !== test.name) : [...prev, test];
    });
  };

  const handleLabSubmit = async () => {
    if (selectedTests.length === 0) return;
    setLabSubmitting(true);
    try {
      const LabRequest = Parse.Object.extend("LabRequest");
      const req = new LabRequest();
      req.set("patientName",  localStorage.getItem("name")  || "");
      req.set("patientEmail", localStorage.getItem("email") || "");
      req.set("patientPhone", localStorage.getItem("phone") || "");
      req.set("tests",        JSON.stringify(selectedTests));
      req.set("totalAmount",  selectedTests.reduce((sum, t) => sum + t.price, 0));
      req.set("status",       "Pending");
      await req.save();
      setSelectedTests([]);
      setLabSuccess(true);
      setTimeout(() => setLabSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to submit lab request:", err);
    } finally {
      setLabSubmitting(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.doctor || !form.age || !form.gender || !form.date || !form.time) { setFormError("Please fill in all required fields."); return; }
    try {
      const currentUser = Parse.User.current();
      const Appointment = Parse.Object.extend("Appointment");
      const appt = new Appointment();
      appt.set("doctor",      form.doctor);
      appt.set("age",         form.age);
      appt.set("gender",      form.gender);
      appt.set("date",        form.date);
      appt.set("time",        form.time);
      appt.set("status",      "Pending");
      appt.set("patientId",   currentUser ? currentUser.id : "");
      appt.set("patientName", form.name.trim() || localStorage.getItem("name") || "");
      appt.set("patientEmail",localStorage.getItem("email") || "");
      await appt.save();
      setForm(EMPTY_FORM);
      setFormError("");
      setShowForm(false);
      setActiveNav("Appointments");
      await fetchAppointments();
      setApptSuccess(true);
      setTimeout(() => setApptSuccess(false), 2000);
    } catch (err) {
      setFormError("Failed to book appointment. Please try again.");
      console.error(err);
    }
  };

  const upcoming  = appointments.filter(a => a.status === "Pending").length;
  const confirmed = appointments.filter(a => a.status === "Confirmed").length;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>

      {/* Overlay for mobile sidebar */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div style={{ marginBottom: 32, width: "100%", padding: "0.5rem 1.5rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiUser size={24} color="#1a5fa8" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>{name || "Patient"}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>Patient</div>
            </div>
          </div>
        </div>

        <nav style={{ width: "100%", flex: 1 }}>
          <NavItem label="Dashboard"        icon={<FiHome size={16} />}     active={activeNav === "Dashboard"}        onClick={() => { setActiveNav("Dashboard"); setSidebarOpen(false); }} />
          <NavItem label="Appointments"    icon={<FiCalendar size={16} />} active={activeNav === "Appointments"}    onClick={() => { setActiveNav("Appointments"); setSidebarOpen(false); }} />
          <NavItem label="Lab & Diagnostics" icon={<FiActivity size={16} />} active={activeNav === "Lab & Diagnostics"} onClick={() => { setActiveNav("Lab & Diagnostics"); setSidebarOpen(false); }} />
          <NavItem label="Medical Records" icon={<FiFileText size={16} />} active={activeNav === "Medical Records"} onClick={() => { setActiveNav("Medical Records"); setSidebarOpen(false); }} />
          <NavItem label="Profile"         icon={<FiUser size={16} />}     active={activeNav === "Profile"}         onClick={() => { setActiveNav("Profile"); setSidebarOpen(false); }} />
        </nav>

        <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "1rem" }}>
          <div
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            style={{ padding: "0.75rem 2rem", cursor: "pointer", fontWeight: 500, fontSize: 16, display: "flex", alignItems: "center", gap: 10, color: "#ffd6d6", transition: "background 0.2s" }}
          >
            <FiLogOut size={18} /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>

        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", paddingTop: "1rem", borderBottom: "1px solid #d6e6f7", gap: "0.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Hamburger — visible on mobile */}
            <button
              className={styles.hamburger}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
            <img src="/logo.png" alt="Medicover Logo" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <div style={{ fontWeight: 800, fontSize: "clamp(18px, 4vw, 28px)", color: "#1a5fa8" }}>Patient Portal</div>
          </div>
          {activeNav !== "Lab & Diagnostics" && (
            <button onClick={() => setShowForm(true)} style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontSize: "clamp(12px, 3vw, 14px)" }}>
              + Book Appointment
            </button>
          )}
        </header>

        {/* Dashboard */}
        {activeNav === "Dashboard" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8" }}>Welcome, {name} </div>
              <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>{email}</div>
            </div>
            <section className={styles.statsRow}>
              <div onClick={() => setActiveNav("Appointments")} className={styles.statCard}>
                Total Appointments<br /><span style={{ fontSize: 28, fontWeight: 700 }}>{appointments.length}</span>
              </div>
              <div className={styles.statCard}>
                Pending<br /><span style={{ fontSize: 28, fontWeight: 700 }}>{upcoming}</span>
              </div>
              <div className={styles.statCard}>
                Confirmed<br /><span style={{ fontSize: 28, fontWeight: 700 }}>{confirmed}</span>
              </div>
            </section>

            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.2rem", fontWeight: 700, fontSize: 16, color: "#1a5fa8", borderBottom: "1px solid #f0f4f8" }}>Recent Appointments</div>
              {appointments.length === 0 ? (
                <div style={{ textAlign: "center", color: "#aaa", padding: "3rem", fontSize: 15 }}>No appointments yet. Click "+ Book Appointment" to get started.</div>
              ) : (
                <div className={styles.tableWrap}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#d6e6f7" }}>
                        {["#", "Doctor", "Date", "Time", "Status"].map(h => (
                          <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map((a, i) => (
                        <tr key={a.id} style={{ borderTop: "1px solid #f0f4f8" }}>
                          <td style={{ padding: "0.8rem 1rem", color: "#888", fontSize: 14 }}>{i + 1}</td>
                          <td style={{ padding: "0.8rem 1rem", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{a.doctor}</td>
                          <td style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>{a.date}</td>
                          <td style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>{a.time}</td>
                          <td style={{ padding: "0.8rem 1rem" }}>
                            <span style={{
                              fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20,
                              background: a.status === "Accepted" ? "#27ae60" : a.status === "Denied" ? "#e74c3c" : "#fff4e5",
                              color:      a.status === "Accepted" ? "#fff"     : a.status === "Denied" ? "#fff"     : "#e67e22",
                              whiteSpace: "nowrap",
                            }}>{a.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Appointments */}
        {activeNav === "Appointments" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>My Appointments ({appointments.length})</h2>
              <button onClick={() => setShowForm(true)} style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontWeight: 600, cursor: "pointer" }}>+ New Appointment</button>
            </div>
            {appointments.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "5rem", color: "#aaa", fontSize: 18 }}>No appointments yet.</div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
                <div className={styles.tableWrap}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#d6e6f7" }}>
                        {["#", "Doctor", "Patient Name", "Date", "Time", "Status"].map(h => (
                          <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a, i) => (
                        <tr key={a.id} style={{ borderTop: "1px solid #f0f4f8" }}>
                          <td style={{ padding: "0.8rem 1rem", color: "#888", fontSize: 14 }}>{i + 1}</td>
                          <td style={{ padding: "0.8rem 1rem", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{a.doctor}</td>
                          <td style={{ padding: "0.8rem 1rem", fontSize: 14 }}>{a.patientName || "—"}</td>
                          <td style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>{a.date}</td>
                          <td style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>{a.time}</td>
                          <td style={{ padding: "0.8rem 1rem" }}>
                            <span style={{
                              fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20,
                              background: a.status === "Accepted" ? "#27ae60" : a.status === "Denied" ? "#e74c3c" : "#fff4e5",
                              color:      a.status === "Accepted" ? "#fff"     : a.status === "Denied" ? "#fff"     : "#e67e22",
                              whiteSpace: "nowrap",
                            }}>{a.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Lab & Diagnostics */}
        {activeNav === "Lab & Diagnostics" && (() => {
          const LAB_CATEGORIES = [
            {
              title: "Pathology", color: "#1a5fa8", light: "#d6e6f7",
              tests: [
                { name: "Complete Blood Count (CBC)",       price: 250 },
                { name: "Blood Sugar – Fasting / PP",       price: 80  },
                { name: "Urine Routine & Microscopy",       price: 100 },
                { name: "Stool Routine Examination",        price: 120 },
                { name: "ESR",                              price: 60  },
                { name: "Blood Grouping & Rh Typing",       price: 80  },
              ],
            },
            {
              title: "Radiology", color: "#8e44ad", light: "#f3e8fd",
              tests: [
                { name: "X-Ray – Chest",                   price: 200  },
                { name: "X-Ray – Other Parts",             price: 250  },
                { name: "CT Scan – Head",                  price: 3500 },
                { name: "CT Scan – Chest / Abdomen",       price: 5000 },
                { name: "MRI – Brain",                     price: 6000 },
                { name: "MRI – Spine",                     price: 7000 },
                { name: "Ultrasound – Abdomen",            price: 800  },
                { name: "Ultrasound – Pelvis",             price: 900  },
              ],
            },
            {
              title: "Microbiology", color: "#e67e22", light: "#fef3e2",
              tests: [
                { name: "Blood Culture & Sensitivity",     price: 600 },
                { name: "Urine Culture & Sensitivity",     price: 500 },
                { name: "Throat Swab Culture",             price: 450 },
                { name: "Stool Culture",                   price: 500 },
                { name: "Sputum Culture & Sensitivity",    price: 550 },
              ],
            },
            {
              title: "Biochemistry", color: "#16a085", light: "#e0f5f1",
              tests: [
                { name: "Liver Function Test (LFT)",       price: 700 },
                { name: "Kidney Function Test (KFT)",      price: 650 },
                { name: "Thyroid Profile – T3, T4, TSH",  price: 800 },
                { name: "Lipid Profile",                   price: 600 },
                { name: "Blood Glucose (Random)",          price: 70  },
                { name: "HbA1c",                           price: 500 },
              ],
            },
            {
              title: "Cardiology", color: "#e74c3c", light: "#fdecea",
              tests: [
                { name: "ECG – 12 Lead",                   price: 200  },
                { name: "Echocardiography (Echo)",         price: 2500 },
                { name: "Holter Monitoring (24 hr)",       price: 3000 },
                { name: "Stress Test (TMT)",               price: 1500 },
              ],
            },
            {
              title: "Histopathology", color: "#2c3e50", light: "#eaecee",
              tests: [
                { name: "Biopsy – Small Specimen",         price: 1500 },
                { name: "Biopsy – Large Specimen",         price: 2500 },
                { name: "FNAC",                            price: 800  },
                { name: "Frozen Section",                  price: 3000 },
                { name: "Immunohistochemistry (IHC)",      price: 3500 },
              ],
            },
          ];
          const total = selectedTests.reduce((s, t) => s + t.price, 0);
          return (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>Lab & Diagnostics</h2>
                  <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Click on any test to select it, then submit your request</p>
                </div>
                {selectedTests.length > 0 && (
                  <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(26,95,168,0.12)", padding: "1rem 1.2rem", minWidth: 260 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a5fa8", marginBottom: "0.5rem" }}>Selected ({selectedTests.length})</div>
                    {selectedTests.map(t => (
                      <div key={t.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#444", marginBottom: 4 }}>
                        <span>{t.name}</span>
                        <span style={{ fontWeight: 600 }}>₹{t.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #f0f4f8", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14 }}>
                      <span>Total</span><span style={{ color: "#1a5fa8" }}>₹{total.toLocaleString()}</span>
                    </div>
                    {labSuccess && <div style={{ background: "#e6f9f0", color: "#27ae60", borderRadius: 8, padding: "0.4rem 0.8rem", fontSize: 12, fontWeight: 600, marginTop: "0.6rem" }}>Request sent successfully!</div>}
                    <button
                      onClick={handleLabSubmit}
                      disabled={labSubmitting}
                      style={{ width: "100%", marginTop: "0.75rem", background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.6rem", fontWeight: 700, fontSize: 14, cursor: labSubmitting ? "not-allowed" : "pointer", opacity: labSubmitting ? 0.7 : 1 }}
                    >
                      {labSubmitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.labGrid}>
                {LAB_CATEGORIES.map(cat => (
                  <div key={cat.title} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
                    <div style={{ background: cat.color, padding: "0.9rem 1.2rem" }}>
                      <h3 style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 15 }}>{cat.title}</h3>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: cat.light }}>
                          <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: 12, fontWeight: 700, color: cat.color }}>Test Name</th>
                          <th style={{ padding: "0.6rem 1rem", textAlign: "right", fontSize: 12, fontWeight: 700, color: cat.color }}>Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.tests.map((t, i) => {
                          const isSelected = !!selectedTests.find(s => s.name === t.name);
                          return (
                            <tr
                              key={t.name}
                              onClick={() => toggleTest(t)}
                              style={{
                                borderTop: "1px solid #f0f4f8",
                                background: isSelected ? cat.light : i % 2 === 0 ? "#fff" : "#fafcff",
                                cursor: "pointer",
                                transition: "background 0.15s",
                              }}
                            >
                              <td style={{ padding: "0.65rem 1rem", fontSize: 13, color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{
                                  width: 16, height: 16, borderRadius: 4, border: `2px solid ${cat.color}`,
                                  background: isSelected ? cat.color : "transparent",
                                  display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                }}>
                                  {isSelected && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
                                </span>
                                {t.name}
                              </td>
                              <td style={{ padding: "0.65rem 1rem", fontSize: 13, fontWeight: 700, color: cat.color, textAlign: "right" }}>₹{t.price.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </>
          );
        })()}

        {/* Medical Records */}
        {activeNav === "Medical Records" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>
                Medical Records
                <span style={{ fontSize: 13, color: "#888", fontWeight: 400, marginLeft: 12 }}>Lab reports generated after test acceptance</span>
              </h2>
            </div>
            {reportsLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading...</div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 16 }}>No reports yet. Submit a lab request and wait for admin approval.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reports.map(rep => {
                  const expanded = !!expandedReports[rep.id];
                  return (
                    <div key={rep.id} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
                      {/* Summary row — click to expand */}
                      <div
                        onClick={() => setExpandedReports(prev => ({ ...prev, [rep.id]: !prev[rep.id] }))}
                        style={{ padding: "1rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: expanded ? "#1a5fa8" : "#fff", transition: "background 0.2s" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: expanded ? "#fff" : "#1a5fa8" }}>{rep.patientName}</div>
                            <div style={{ fontSize: 12, color: expanded ? "#c8dff5" : "#888", marginTop: 2 }}>Date: {rep.reportDate}</div>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                            {rep.tests.map((t, ti) => (
                              <span key={ti} style={{
                                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                                background: expanded ? "rgba(255,255,255,0.18)" : "#d6e6f7",
                                color: expanded ? "#fff" : "#1a5fa8",
                              }}>{t.name}</span>
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: 16, color: expanded ? "#fff" : "#1a5fa8", fontWeight: 700, flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
                      </div>

                      {/* Expanded detail */}
                      {expanded && (
                        <div style={{ borderTop: "1px solid #d6e6f7" }}>
                          {rep.tests.map((t, ti) => (
                            <div key={ti} style={{ borderTop: ti > 0 ? "2px solid #f0f4f8" : "none" }}>
                              <div style={{ background: "#f4f8fc", padding: "0.6rem 1.4rem", fontWeight: 700, fontSize: 13, color: "#1a5fa8" }}>
                                {t.name} <span style={{ fontWeight: 400, color: "#888", fontSize: 12 }}>— ₹{t.price?.toLocaleString()}</span>
                              </div>
                              <div className={styles.tableWrap}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                  <thead>
                                    <tr style={{ background: "#d6e6f7" }}>
                                      {["Parameter", "Result", "Reference Range", "Status"].map(h => (
                                        <th key={h} style={{ padding: "0.5rem 1.2rem", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#1a5fa8", whiteSpace: "nowrap" }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {t.results.map((row, ri) => (
                                      <tr key={ri} style={{ borderTop: "1px solid #f0f4f8", background: ri % 2 === 0 ? "#fff" : "#fafcff" }}>
                                        <td style={{ padding: "0.6rem 1.2rem", fontSize: 13, fontWeight: 600 }}>{row.param}</td>
                                        <td style={{ padding: "0.6rem 1.2rem", fontSize: 13 }}>{row.value}</td>
                                        <td style={{ padding: "0.6rem 1.2rem", fontSize: 13, color: "#888" }}>{row.range}</td>
                                        <td style={{ padding: "0.6rem 1.2rem" }}>
                                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: row.status === "Normal" ? "#e6f9f0" : "#fdecea", color: row.status === "Normal" ? "#27ae60" : "#e74c3c", whiteSpace: "nowrap" }}>
                                            {row.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Profile */}
        {activeNav === "Profile" && (
          <ProfileSection name={name} email={email} phone={phone} setEmail={setEmail} setPhone={setPhone} />
        )}
      </main>

      {/* Toast Popups */}
      {(labSuccess || apptSuccess) && (
        <div style={{ position: "fixed", top: "2rem", left: "50%", transform: "translateX(-50%)", background: "#1a5fa8", color: "#fff", padding: "1rem 2rem", borderRadius: 14, boxShadow: "0 8px 32px rgba(26,95,168,0.25)", fontSize: 16, fontWeight: 700, zIndex: 2000, pointerEvents: "none", whiteSpace: "nowrap" }}>
          🎉 Thanks for submitting!!
        </div>
      )}

      {/* Book Appointment Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className={styles.modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: "#1a5fa8", margin: 0 }}>Book Appointment</h3>
              <span style={{ cursor: "pointer", color: "#888", fontSize: 22, lineHeight: 1 }} onClick={() => { setShowForm(false); setFormError(""); setForm(EMPTY_FORM); }}>×</span>
            </div>
            <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {formError && <p style={{ color: "#e74c3c", fontSize: 13, margin: 0 }}>{formError}</p>}
              <select value={form.doctor} onChange={e => setForm(p => ({ ...p, doctor: e.target.value }))}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", background: "#fff", color: form.doctor ? "#222" : "#aaa" }}>
                <option value="" disabled>Select Doctor</option>
                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="text" placeholder="Name (optional)" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <input type="number" min="0" placeholder="Age" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                  style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
                <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                  style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", background: "#fff", color: form.gender ? "#222" : "#aaa" }}>
                  <option value="" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
                <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
              </div>
              <button type="submit" style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.75rem", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
