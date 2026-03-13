import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRouter } from "next/router";
import { FiSettings, FiLogOut, FiEdit2, FiCheck, FiX, FiTrash2, FiMenu, FiChevronDown, FiChevronUp, FiHome, FiUsers, FiClock, FiGrid, FiActivity, FiCalendar, FiCreditCard, FiFileText, FiLayers, FiMessageSquare } from "react-icons/fi";
import Parse from '@/lib/parseConfig';
import styles from '@/styles/patientDashboard.module.css';

const INITIAL_DOCTORS = [
  { id: 1,  name: "Dr. Manohar",         specialty: "Psychiatrist",        img: "https://randomuser.me/api/portraits/men/11.jpg",   exp: "12 yrs", status: "Available" },
  { id: 2,  name: "Dr. Priya Sharma",   specialty: "Neurologist",         img: "https://randomuser.me/api/portraits/women/21.jpg", exp: "9 yrs",  status: "Available" },
  { id: 3,  name: "Dr. Samuel Carter",  specialty: "Orthopedic Surgeon",  img: "https://randomuser.me/api/portraits/men/32.jpg",   exp: "15 yrs", status: "Busy" },
  { id: 4,  name: "Dr. Aisha Khan",     specialty: "Pediatrician",        img: "https://randomuser.me/api/portraits/women/44.jpg", exp: "7 yrs",  status: "Available" },
  { id: 5,  name: "Dr. Ravi Verma",     specialty: "Dermatologist",       img: "https://randomuser.me/api/portraits/men/55.jpg",   exp: "10 yrs", status: "On Leave" },
  { id: 6,  name: "Dr. Emily Watson",   specialty: "Gynecologist",        img: "https://randomuser.me/api/portraits/women/63.jpg", exp: "11 yrs", status: "Available" },
  { id: 7,  name: "Dr. James Patel",    specialty: "Ophthalmologist",     img: "https://randomuser.me/api/portraits/men/76.jpg",   exp: "8 yrs",  status: "Busy" },
  { id: 8,  name: "Dr. Nadia Torres",   specialty: "Psychiatrist",        img: "https://randomuser.me/api/portraits/women/85.jpg", exp: "13 yrs", status: "Available" },
  { id: 9,  name: "Dr. Chen Wei",       specialty: "Radiologist",         img: "https://randomuser.me/api/portraits/men/91.jpg",   exp: "6 yrs",  status: "Available" },
  { id: 10, name: "Dr. Fatima Malik",   specialty: "General Surgeon",     img: "https://randomuser.me/api/portraits/women/95.jpg", exp: "14 yrs", status: "On Leave" },
];

const STATUS_COLORS = {
  "Available": { bg: "#e6f9f0", color: "#27ae60" },
  "Busy":      { bg: "#fff4e5", color: "#e67e22" },
  "On Leave":  { bg: "#fdecea", color: "#e74c3c" },
};

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
      {icon}{label}
    </div>
  );
}

function BottomItem({ icon, label, onClick, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.75rem 2rem", cursor: "pointer", fontWeight: 500, fontSize: 16,
        display: "flex", alignItems: "center", gap: 10,
        color: color || "#fff",
        background: hovered ? "rgba(255,255,255,0.18)" : "none",
        transition: "background 0.2s",
      }}
    >
      {icon} {label}
    </div>
  );
}

function DoctorCard({ doctor, onNameChange, onImageChange }) {
  const [editing, setEditing]   = useState(false);
  const [tempName, setTempName] = useState(doctor.name);
  const [hoverImg, setHoverImg] = useState(false);
  const [hoverCard, setHoverCard] = useState(false);
  const fileRef = useRef();

  const confirmName = () => {
    if (tempName.trim()) onNameChange(doctor.id, tempName.trim());
    setEditing(false);
  };

  const cancelName = () => {
    setTempName(doctor.name);
    setEditing(false);
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onImageChange(doctor.id, url);
  };

  return (
    <div
      onMouseEnter={() => setHoverCard(true)}
      onMouseLeave={() => setHoverCard(false)}
      style={{ background: "#fff", borderRadius: 16, padding: "1.5rem 1rem", boxShadow: hoverCard ? "0 4px 18px rgba(26,95,168,0.18)" : "0 2px 8px rgba(26,95,168,0.08)", textAlign: "center", border: hoverCard ? "1.5px solid #b0c8e8" : "1px solid #e0e0e0", transition: "box-shadow 0.2s, border-color 0.2s" }}>

      {/* Editable Image */}
      <div
        style={{ position: "relative", width: 80, height: 80, margin: "0 auto 0.75rem auto", cursor: "pointer" }}
        onMouseEnter={() => setHoverImg(true)}
        onMouseLeave={() => setHoverImg(false)}
        onClick={() => fileRef.current.click()}
      >
        <img
          src={doctor.img}
          alt={doctor.name}
          style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #d6e6f7", display: "block" }}
        />
        {hoverImg && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,0,0,0.45)", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600,
          }}>
            📷 Change
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFile} />
      </div>

      {/* Editable Name */}
      {editing ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 4 }}>
          <input
            autoFocus
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") confirmName(); if (e.key === "Escape") cancelName(); }}
            style={{ fontSize: 14, fontWeight: 700, border: "1px solid #1a5fa8", borderRadius: 6, padding: "2px 6px", width: 130, textAlign: "center", outline: "none" }}
          />
          <FiCheck size={16} color="#27ae60" style={{ cursor: "pointer" }} onClick={confirmName} />
          <FiX    size={16} color="#e74c3c" style={{ cursor: "pointer" }} onClick={cancelName} />
        </div>
      ) : (
        <div
          style={{ fontWeight: 700, fontSize: 15, color: "#2c3e50", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
          onClick={() => { setTempName(doctor.name); setEditing(true); }}
        >
          {doctor.name}
          <FiEdit2 size={13} color="#1a5fa8" />
        </div>
      )}

      <div style={{ fontSize: 13, color: "#1a5fa8", fontWeight: 600, marginBottom: 4 }}>{doctor.specialty}</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Experience: {doctor.exp}</div>
      <span style={{
        fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20,
        background: STATUS_COLORS[doctor.status].bg,
        color: STATUS_COLORS[doctor.status].color,
      }}>
        {doctor.status}
      </span>
    </div>
  );
}

const EMPTY_FORM = { name: "", age: "", gender: "", reason: "", date: "", time: "" };

function shortDate(d) {
  if (!d) return "";
  const parts = String(d).split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`;
  return d;
}

const STATUS_PATIENT_COLORS = {
  "Admitted":      { bg: "#27ae60", color: "#fff" },
  "Discharged":    { bg: "#e74c3c", color: "#fff" },
  "Observation":   { bg: "#f97316", color: "#fff" },
};

function PatientRow({ patient, index, onDelete, onRoomClick, onEdit }) {
  const [hoverEdit,   setHoverEdit]   = useState(false);
  const [hoverDelete, setHoverDelete] = useState(false);

  const sc = STATUS_PATIENT_COLORS[patient.status] || STATUS_PATIENT_COLORS["Admitted"];

  return (
    <tr style={{ borderTop: "1px solid #f0f4f8" }}>
      <td className={styles.patientIdx} style={{ padding: "0.8rem 1rem", color: "#888", fontSize: 14 }}>{index + 1}</td>

      <td data-label="Name" style={{ padding: "0.8rem 1rem", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span className={styles.mobileIdx}>{index + 1}.</span>
        <span style={{ fontWeight: 600 }}>{patient.name}</span>
      </td>

      <td data-label="Room" style={{ padding: "0.8rem 1rem", fontSize: 14, whiteSpace: "nowrap" }}>
        <span className={styles.roomBadge} style={{ background: "#d6e6f7", color: "#1a5fa8", padding: "2px 10px", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          onClick={() => onRoomClick(patient.room)}>{patient.room.replace("Room ", "")}</span>
      </td>

      <td data-label="Admitted" style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>{shortDate(patient.admitDate)}</td>

      <td data-label="Status" style={{ padding: "0.8rem 1rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 600, padding: "3px 0", borderRadius: 20, display: "inline-block", minWidth: 130, textAlign: "center" }}>
            {patient.status}
          </span>
          {/* Mobile only — edit/delete inside Status cell */}
          <div className={styles.actionsInStatus} style={{ alignItems: "center", gap: 10 }}>
            <div style={{ width: 1, height: 22, background: "#dde3ea", borderRadius: 2, flexShrink: 0 }} />
            <button onClick={() => onEdit(patient)} title="Edit"
              onMouseEnter={() => setHoverEdit(true)} onMouseLeave={() => setHoverEdit(false)}
              style={{ background: hoverEdit ? "#e8fdf0" : "#f4f6f8", border: "none", cursor: "pointer", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: hoverEdit ? "#27ae60" : "#9aa5b4", transition: "all 0.18s ease" }}>
              <FiEdit2 size={15} />
            </button>
            <button onClick={() => onDelete(patient.id)} title="Delete"
              onMouseEnter={() => setHoverDelete(true)} onMouseLeave={() => setHoverDelete(false)}
              style={{ background: hoverDelete ? "#fff0f0" : "#f4f6f8", border: "none", cursor: "pointer", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: hoverDelete ? "#e74c3c" : "#9aa5b4", transition: "all 0.18s ease" }}>
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
      </td>

      {/* Desktop only — Actions column on the far right */}
      <td className={styles.actionsDesktop}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => onEdit(patient)} title="Edit"
            onMouseEnter={() => setHoverEdit(true)} onMouseLeave={() => setHoverEdit(false)}
            style={{ background: hoverEdit ? "#e8fdf0" : "#f4f6f8", border: "none", cursor: "pointer", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: hoverEdit ? "#27ae60" : "#9aa5b4", boxShadow: hoverEdit ? "0 0 0 3px #b6f0ce, 0 2px 8px rgba(39,174,96,0.25)" : "none", transition: "all 0.18s ease" }}>
            <FiEdit2 size={15} />
          </button>
          <button onClick={() => onDelete(patient.id)} title="Delete"
            onMouseEnter={() => setHoverDelete(true)} onMouseLeave={() => setHoverDelete(false)}
            style={{ background: hoverDelete ? "#fff0f0" : "#f4f6f8", border: "none", cursor: "pointer", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: hoverDelete ? "#e74c3c" : "#9aa5b4", boxShadow: hoverDelete ? "0 0 0 3px #ffc2c2, 0 2px 8px rgba(231,76,60,0.25)" : "none", transition: "all 0.18s ease" }}>
            <FiTrash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function AppointmentRow({ apt, i, onStatusChange, styles }) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle =
    apt.status === "Accepted" ? { background: "#27ae60", color: "#fff" } :
    apt.status === "Denied"   ? { background: "#e74c3c", color: "#fff" } :
                                { background: "#fff4e5", color: "#e67e22" };
  return (
    <tr key={apt.id} className={styles.dataRow} style={{ borderTop: "1px solid #f0f4f8" }}>
      <td style={{ padding: "0.8rem 1rem", color: "#888", fontSize: 14 }}>{i + 1}</td>
      <td data-label="Name" style={{ padding: "0.8rem 1rem", fontWeight: 600, fontSize: 14 }}>{apt.name}</td>
      <td data-label="Status" style={{ padding: "0.8rem 1rem" }}>
        <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 0", borderRadius: 20, display: "inline-block", minWidth: 72, textAlign: "center", ...statusStyle }}>{apt.status}</span>
      </td>
      <td data-label="Age"    className={`${styles.aptExtra} ${expanded ? styles.aptExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14 }}>{apt.age}</td>
      <td data-label="Gender" className={`${styles.aptExtra} ${expanded ? styles.aptExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14 }}>{apt.gender}</td>
      <td data-label="Doctor" className={`${styles.aptExtra} ${expanded ? styles.aptExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14 }}>{apt.doctor}</td>
      <td data-label="Date"   className={`${styles.aptExtra} ${expanded ? styles.aptExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#888" }}>{apt.date}</td>
      <td data-label="Time"   className={`${styles.aptExtra} ${expanded ? styles.aptExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#888" }}>{apt.time}</td>
      <td data-label="Action" className={`${styles.aptExtra} ${expanded ? styles.aptExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", whiteSpace: "nowrap" }}>
        {apt.status === "Pending" && (
          <>
            <button onClick={() => onStatusChange(apt.id, "Accepted")}
              style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginRight: 6 }}>
              Accept
            </button>
            <button onClick={() => onStatusChange(apt.id, "Denied")}
              style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Deny
            </button>
          </>
        )}
        {apt.status !== "Pending" && (
          <button onClick={() => onStatusChange(apt.id, "Pending")}
            style={{ background: "#d6e6f7", color: "#1a5fa8", border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Reset
          </button>
        )}
      </td>
      <td className={styles.aptExpandBtn}>
        <button onClick={() => setExpanded(!expanded)} style={{
          background: expanded ? "#d6e6f7" : "#f4f6f8", border: "none", borderRadius: 20,
          padding: "4px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          fontSize: 12, fontWeight: 600, color: "#1a5fa8",
        }}>
          {expanded ? <><FiChevronUp size={13} /> Less</> : <><FiChevronDown size={13} /> More</>}
        </button>
      </td>
    </tr>
  );
}

function HistoryRow({ h, i, styles }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <tr style={{ borderTop: "1px solid #f0f4f8" }}>
      <td className={styles.historyIdx} style={{ padding: "0.8rem 1rem", color: "#888", fontSize: 14 }}>{i + 1}</td>
      <td data-label="Name" style={{ padding: "0.8rem 1rem", fontWeight: 600, fontSize: 14 }}>{h.name}</td>
      <td data-label="Room" style={{ padding: "0.8rem 1rem", fontSize: 14 }}>
        <span style={{ background: "#d6e6f7", color: "#1a5fa8", padding: "2px 10px", borderRadius: 12, fontWeight: 600, fontSize: 13 }}>{h.room}</span>
      </td>
      <td data-label="Admitted" className={`${styles.historyExtra} ${expanded ? styles.historyExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#555" }}>{h.admitDate}</td>
      <td data-label="Discharged" className={`${styles.historyExtra} ${expanded ? styles.historyExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14, color: "#555" }}>{h.dischargeDate}</td>
      <td data-label="Time" className={`${styles.historyExtra} ${expanded ? styles.historyExtraVisible : ""}`} style={{ padding: "0.8rem 1rem", fontSize: 14 }}>
        <span style={{ background: "#e6f9f0", color: "#27ae60", padding: "2px 10px", borderRadius: 12, fontWeight: 600, fontSize: 13 }}>{h.dischargeTime}</span>
      </td>
      <td className={styles.historyExpandBtn}>
        <button onClick={() => setExpanded(!expanded)} style={{
          background: expanded ? "#d6e6f7" : "#f4f6f8", border: "none", borderRadius: 20,
          padding: "4px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          fontSize: 12, fontWeight: 600, color: "#1a5fa8",
        }}>
          {expanded ? <><FiChevronUp size={13} /> Less</> : <><FiChevronDown size={13} /> More</>}
        </button>
      </td>
    </tr>
  );
}

function PatientSection({ patients, onAdd, onUpdate, onDelete, onRefresh, loading, error, labRequests, onBack }) {
  const roomCounts = patients.reduce((acc, p) => { acc[p.room] = (acc[p.room] || 0) + 1; return acc; }, {});
  const occupiedBeds = patients.length;
  const freeRooms = ALL_ROOMS.filter(r => !roomCounts[r]).length;
  const [showAdd, setShowAdd]       = useState(false);
  const [newName, setNewName]       = useState("");
  const [newRoom, setNewRoom]       = useState("");
  const [addError, setAddError]     = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [saving, setSaving]         = useState(false);

  const [editPatient, setEditPatient]   = useState(null);
  const [editName, setEditName]         = useState("");
  const [editRoom, setEditRoom]         = useState("");
  const [editStatus, setEditStatus]     = useState("");
  const [editError, setEditError]       = useState("");
  const [editSaving, setEditSaving]     = useState(false);

  const openEdit = (patient) => {
    setEditPatient(patient);
    setEditName(patient.name);
    setEditRoom(patient.room);
    setEditStatus(patient.status);
    setEditError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editRoom) { setEditError("Please fill in all fields."); return; }
    const targetRoomCount = roomCounts[editRoom] || 0;
    const isRoomChange = editRoom !== editPatient.room;
    if (isRoomChange && targetRoomCount >= 2) { setEditError("This room is already full (2 patients)."); return; }
    setEditSaving(true);
    try {
      await onUpdate(editPatient.id, { name: editName.trim(), room: editRoom, status: editStatus });
      setEditPatient(null);
    } catch {
      setEditError("Failed to save. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newRoom) { setAddError("Please fill in all fields."); return; }
    if ((roomCounts[newRoom] || 0) >= 2) { setAddError("This room is already full (2 patients)."); return; }
    setSaving(true);
    try {
      await onAdd(newName.trim(), newRoom);
      setNewName(""); setNewRoom(""); setAddError(""); setShowAdd(false);
    } catch {
      setAddError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {/* Title + subtitle */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: "0 0 4px 0" }}>Admitted Patients</h2>
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Click Edit to modify name, room or status</p>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#1a5fa8", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>‹ Back</button>
        </div>

        {/* Stats + Add button — pushed to right on desktop, wraps below on mobile */}
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ background: "#d6e6f7", borderRadius: 8, padding: "0.4rem 0.9rem", fontWeight: 600, color: "#1a5fa8", fontSize: "clamp(11px, 2.5vw, 14px)", whiteSpace: "nowrap" }}>
            Beds: {occupiedBeds} / 40
          </div>
          <div style={{ background: "#e6f9f0", borderRadius: 8, padding: "0.4rem 0.9rem", fontWeight: 600, color: "#27ae60", fontSize: "clamp(11px, 2.5vw, 14px)", whiteSpace: "nowrap" }}>
            Free Rooms: {freeRooms}
          </div>
          <button onClick={() => setShowAdd(true)} style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.4rem 0.9rem", fontWeight: 600, cursor: "pointer", fontSize: "clamp(11px, 2.5vw, 14px)", whiteSpace: "nowrap" }}>
            + Add Patient
          </button>
        </div>
      </div>

      {editPatient && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", width: 380, maxWidth: "calc(100vw - 2rem)", boxShadow: "0 8px 32px rgba(26,95,168,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "#1a5fa8", margin: 0 }}>Edit Patient</h3>
              <FiX size={20} style={{ cursor: "pointer", color: "#888" }} onClick={() => setEditPatient(null)} />
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {editError && <p style={{ color: "#e74c3c", fontSize: 13, margin: 0 }}>{editError}</p>}
              <input placeholder="Patient Name" value={editName} onChange={e => setEditName(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
              <select value={editRoom} onChange={e => setEditRoom(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", background: "#fff" }}>
                <option value="" disabled>Select Room</option>
                {ALL_ROOMS.map(r => (
                  <option key={r} value={r} disabled={(roomCounts[r] || 0) >= 2 && r !== editPatient.room}>
                    {r}{(roomCounts[r] || 0) >= 2 && r !== editPatient.room ? " (Full)" : (roomCounts[r] === 1 && r !== editPatient.room ? " (1/2)" : "")}
                  </option>
                ))}
              </select>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", background: "#fff" }}>
                <option value="Admitted">Admitted</option>
                <option value="Observation">Observation</option>
                <option value="Discharged">Discharged</option>
              </select>
              <button type="submit" disabled={editSaving} style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.75rem", fontWeight: 700, fontSize: 15, cursor: editSaving ? "not-allowed" : "pointer", opacity: editSaving ? 0.7 : 1 }}>
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", width: 380, maxWidth: "calc(100vw - 2rem)", boxShadow: "0 8px 32px rgba(26,95,168,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "#1a5fa8", margin: 0 }}>Add New Patient</h3>
              <FiX size={20} style={{ cursor: "pointer", color: "#888" }} onClick={() => { setShowAdd(false); setAddError(""); setNewName(""); setNewRoom(""); }} />
            </div>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {addError && <p style={{ color: "#e74c3c", fontSize: 13, margin: 0 }}>{addError}</p>}
              <input placeholder="Patient Name" value={newName} onChange={e => setNewName(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
              <select value={newRoom} onChange={e => setNewRoom(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", background: "#fff", color: newRoom ? "#222" : "#aaa" }}>
                <option value="" disabled>Select Room</option>
                {ALL_ROOMS.map(r => (
                  <option key={r} value={r} disabled={(roomCounts[r] || 0) >= 2}>
                    {r}{(roomCounts[r] || 0) >= 2 ? " (Full)" : (roomCounts[r] === 1 ? " (1/2)" : "")}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={saving} style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.75rem", fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Admit Patient"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedRoom && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", width: 340, maxWidth: "calc(100vw - 2rem)", boxShadow: "0 8px 32px rgba(26,95,168,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "#1a5fa8", margin: 0 }}>{selectedRoom}</h3>
              <FiX size={20} style={{ cursor: "pointer", color: "#888" }} onClick={() => setSelectedRoom(null)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(() => {
                const roomPatients = patients.filter(p => p.room === selectedRoom);
                return [0, 1].map(bedIdx => {
                  const p = roomPatients[bedIdx];
                  return (
                    <div key={bedIdx} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: p ? "#d6e6f7" : "#e6f9f0",
                      borderRadius: 10, padding: "0.85rem 1rem"
                    }}>
                      <span style={{ fontWeight: 700, color: "#1a5fa8", fontSize: 13, minWidth: 46 }}>Bed {bedIdx + 1}</span>
                      <span style={{ fontWeight: p ? 600 : 400, color: p ? "#222" : "#27ae60", fontSize: 14 }}>
                        {p ? p.name : "Available"}
                      </span>
                      {p && (
                        <span style={{ marginLeft: "auto", background: "#1a5fa8", color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>
                          {p.status}
                        </span>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "#ffeaea", border: "1px solid #e74c3c", borderRadius: 10, padding: "1rem 1.2rem", marginBottom: "1rem", color: "#c0392b", fontSize: 13 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
        <table className={styles.patientTable} style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "#d6e6f7" }}>
              <th style={{ padding: "0.9rem 1rem", textAlign: "center", fontWeight: 700, color: "#1a5fa8", fontSize: 14, width: "5%" }}>#</th>
              <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14, width: "28%" }}>Name</th>
              <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14, width: "15%" }}>Room</th>
              <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14, width: "18%" }}>Admitted</th>
              <th style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14, width: "22%" }}>Status</th>
              <th style={{ padding: "0.9rem 1rem", textAlign: "right", fontWeight: 700, color: "#1a5fa8", fontSize: 14, width: "12%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#e74c3c" }}>Could not load data. See error above.</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>No admitted patients. Click "+ Add Patient" to admit one.</td></tr>
            ) : (
              [...patients].sort((a, b) => parseInt(a.room.replace("Room ", "")) - parseInt(b.room.replace("Room ", ""))).map((p, i) => (
                <PatientRow key={p.id} index={i} patient={p} onDelete={onDelete} roomCounts={roomCounts} onRoomClick={setSelectedRoom} onEdit={openEdit} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const ALL_ROOMS = Array.from({ length: 20 }, (_, i) => `Room ${i + 1}`);

const DUMMY_RESULTS = {
  "Complete Blood Count (CBC)":      [{ param:"WBC",          value:"7.2 x10³/µL",  range:"4.5–11.0",   status:"Normal" },{ param:"RBC",          value:"4.8 x10⁶/µL",  range:"4.2–5.4",    status:"Normal" },{ param:"Haemoglobin",  value:"14.2 g/dL",     range:"12.0–17.5",  status:"Normal" },{ param:"Platelets",    value:"225 x10³/µL",   range:"150–400",    status:"Normal" }],
  "Blood Sugar – Fasting / PP":      [{ param:"Fasting",       value:"92 mg/dL",      range:"<100",       status:"Normal" },{ param:"Post-Prandial", value:"128 mg/dL",    range:"<140",       status:"Normal" }],
  "Urine Routine & Microscopy":      [{ param:"Colour",        value:"Pale Yellow",   range:"Normal",     status:"Normal" },{ param:"Protein",       value:"Negative",      range:"Negative",   status:"Normal" },{ param:"Glucose",       value:"Negative",      range:"Negative",   status:"Normal" },{ param:"WBC",           value:"2–4/hpf",       range:"0–5",        status:"Normal" }],
  "Stool Routine Examination":       [{ param:"Colour",        value:"Brown",         range:"Normal",     status:"Normal" },{ param:"Consistency",   value:"Formed",        range:"Normal",     status:"Normal" },{ param:"Occult Blood",  value:"Negative",      range:"Negative",   status:"Normal" }],
  "ESR":                             [{ param:"ESR",           value:"12 mm/hr",      range:"<20",        status:"Normal" }],
  "Blood Grouping & Rh Typing":      [{ param:"Blood Group",   value:"B+",            range:"—",          status:"Normal" }],
  "X-Ray – Chest":                   [{ param:"Lungs",         value:"Clear",         range:"Normal",     status:"Normal" },{ param:"Heart size",    value:"Normal",        range:"Normal",     status:"Normal" },{ param:"Impression",    value:"No acute cardiopulmonary abnormality detected", range:"—", status:"Normal" }],
  "X-Ray – Other Parts":             [{ param:"Bones",         value:"Intact",        range:"Normal",     status:"Normal" },{ param:"Soft Tissue",   value:"Normal",        range:"Normal",     status:"Normal" }],
  "CT Scan – Head":                  [{ param:"Brain parenchyma", value:"Normal",     range:"Normal",     status:"Normal" },{ param:"Ventricles",    value:"Normal size",   range:"Normal",     status:"Normal" },{ param:"Impression",    value:"No intracranial pathology detected", range:"—", status:"Normal" }],
  "CT Scan – Chest / Abdomen":       [{ param:"Lungs",         value:"Clear fields",  range:"Normal",     status:"Normal" },{ param:"Liver",         value:"Normal size",   range:"Normal",     status:"Normal" },{ param:"Impression",    value:"No significant abnormality detected", range:"—", status:"Normal" }],
  "MRI – Brain":                     [{ param:"White matter",  value:"Normal",        range:"Normal",     status:"Normal" },{ param:"Cerebellum",    value:"Normal",        range:"Normal",     status:"Normal" },{ param:"Impression",    value:"No intracranial lesion identified",  range:"—", status:"Normal" }],
  "MRI – Spine":                     [{ param:"Vertebrae",     value:"Aligned",       range:"Normal",     status:"Normal" },{ param:"Discs",         value:"Normal height", range:"Normal",     status:"Normal" },{ param:"Impression",    value:"No disc herniation or cord compression", range:"—", status:"Normal" }],
  "Ultrasound – Abdomen":            [{ param:"Liver",         value:"Normal — 14 cm",range:"<15 cm",     status:"Normal" },{ param:"Spleen",        value:"Normal — 10 cm",range:"<12 cm",     status:"Normal" },{ param:"Kidneys",       value:"Normal bilaterally", range:"Normal",    status:"Normal" }],
  "Ultrasound – Pelvis":             [{ param:"Uterus",        value:"Normal size",   range:"Normal",     status:"Normal" },{ param:"Ovaries",       value:"Normal bilaterally", range:"Normal",    status:"Normal" }],
  "Blood Culture & Sensitivity":     [{ param:"Growth",        value:"No growth after 48 hrs", range:"Negative", status:"Normal" }],
  "Urine Culture & Sensitivity":     [{ param:"Colony count",  value:"<10,000 CFU/mL",range:"<10,000",    status:"Normal" }],
  "Throat Swab Culture":             [{ param:"Growth",        value:"Normal flora only", range:"Normal",  status:"Normal" }],
  "Stool Culture":                   [{ param:"Pathogens",     value:"Not isolated",  range:"None",       status:"Normal" }],
  "Sputum Culture & Sensitivity":    [{ param:"AFB smear",     value:"Negative",      range:"Negative",   status:"Normal" },{ param:"Growth",        value:"Commensals only", range:"Normal",    status:"Normal" }],
  "Liver Function Test (LFT)":       [{ param:"Total Bilirubin", value:"0.8 mg/dL",   range:"0.2–1.2",    status:"Normal" },{ param:"SGPT (ALT)",    value:"32 U/L",        range:"7–56",       status:"Normal" },{ param:"SGOT (AST)",    value:"28 U/L",        range:"10–40",      status:"Normal" },{ param:"Albumin",       value:"4.2 g/dL",      range:"3.5–5.0",    status:"Normal" }],
  "Kidney Function Test (KFT)":      [{ param:"Creatinine",    value:"0.9 mg/dL",     range:"0.6–1.2",    status:"Normal" },{ param:"BUN",           value:"14 mg/dL",      range:"7–20",       status:"Normal" },{ param:"Uric Acid",     value:"5.2 mg/dL",     range:"3.5–7.2",    status:"Normal" }],
  "Thyroid Profile – T3, T4, TSH":   [{ param:"T3",            value:"1.2 ng/mL",     range:"0.8–2.0",    status:"Normal" },{ param:"T4",            value:"8.4 µg/dL",     range:"5.1–14.1",   status:"Normal" },{ param:"TSH",           value:"2.1 mIU/L",     range:"0.4–4.0",    status:"Normal" }],
  "Lipid Profile":                   [{ param:"Total Cholesterol", value:"178 mg/dL",  range:"<200",       status:"Normal" },{ param:"LDL",           value:"102 mg/dL",     range:"<130",       status:"Normal" },{ param:"HDL",           value:"52 mg/dL",      range:">40",        status:"Normal" },{ param:"Triglycerides", value:"130 mg/dL",     range:"<150",       status:"Normal" }],
  "Blood Glucose (Random)":          [{ param:"Random Glucose", value:"105 mg/dL",    range:"<140",       status:"Normal" }],
  "HbA1c":                           [{ param:"HbA1c",          value:"5.4%",          range:"<5.7%",      status:"Normal" }],
  "ECG – 12 Lead":                   [{ param:"Rhythm",         value:"Sinus rhythm",  range:"Normal",     status:"Normal" },{ param:"Rate",          value:"76 bpm",        range:"60–100",     status:"Normal" },{ param:"Impression",    value:"Normal ECG",    range:"—",          status:"Normal" }],
  "Echocardiography (Echo)":         [{ param:"EF (Ejection Fraction)", value:"62%",   range:"55–70%",     status:"Normal" },{ param:"LV function",   value:"Normal",        range:"Normal",     status:"Normal" },{ param:"Valves",        value:"No significant regurgitation", range:"Normal", status:"Normal" }],
  "Holter Monitoring (24 hr)":       [{ param:"Rhythm",         value:"Sinus throughout", range:"Normal",  status:"Normal" },{ param:"Ectopics",      value:"Rare isolated PVCs", range:"<100/day", status:"Normal" }],
  "Stress Test (TMT)":               [{ param:"Result",         value:"Negative for ischaemia", range:"Negative", status:"Normal" },{ param:"Max HR achieved", value:"158 bpm",    range:">85% predicted", status:"Normal" }],
  "Biopsy – Small Specimen":         [{ param:"Histology",      value:"No malignancy identified", range:"—", status:"Normal" },{ param:"Impression",    value:"Benign tissue, reactive changes", range:"—", status:"Normal" }],
  "Biopsy – Large Specimen":         [{ param:"Histology",      value:"No evidence of malignancy", range:"—", status:"Normal" },{ param:"Impression",    value:"Chronic inflammatory changes only", range:"—", status:"Normal" }],
  "FNAC":                            [{ param:"Cytology",       value:"Benign cellular pattern", range:"—",  status:"Normal" },{ param:"Impression",    value:"No atypical or malignant cells seen", range:"—", status:"Normal" }],
  "Frozen Section":                  [{ param:"Intraoperative", value:"Negative margins", range:"—",        status:"Normal" }],
  "Immunohistochemistry (IHC)":      [{ param:"ER",             value:"Positive",      range:"—",          status:"Normal" },{ param:"PR",            value:"Positive",      range:"—",          status:"Normal" },{ param:"HER2",          value:"Negative",      range:"—",          status:"Normal" }],
};

const HOMETOWNS = ["Chennai","Mumbai","Delhi","Kolkata","Bangalore","Hyderabad","Pune","Jaipur","Lucknow","Ahmedabad","Surat","Kochi","Chandigarh","Indore","Bhopal","Nagpur","Vadodara","Coimbatore","Visakhapatnam","Patna"];
const INITIAL_NURSES = [
  { id:1,  name:"Ananya Rao",       contact:"9876543210", hometown:"Chennai"       },
  { id:2,  name:"Meena Pillai",     contact:"9865432109", hometown:"Kochi"         },
  { id:3,  name:"Ritu Sharma",      contact:"9754321098", hometown:"Delhi"         },
  { id:4,  name:"Lakshmi Devi",     contact:"9643210987", hometown:"Bangalore"     },
  { id:5,  name:"Sushma Patel",     contact:"9532109876", hometown:"Ahmedabad"     },
  { id:6,  name:"Preethi Nair",     contact:"9421098765", hometown:"Kochi"         },
  { id:7,  name:"Kavitha Menon",    contact:"9310987654", hometown:"Coimbatore"    },
  { id:8,  name:"Nithya Kumar",     contact:"9209876543", hometown:"Chennai"       },
  { id:9,  name:"Saranya Rajan",    contact:"9108765432", hometown:"Pune"          },
  { id:10, name:"Deepa Iyer",       contact:"9007654321", hometown:"Hyderabad"     },
  { id:11, name:"Usha Bhatt",       contact:"9876012345", hometown:"Jaipur"        },
  { id:12, name:"Radha Krishnan",   contact:"9765012345", hometown:"Mumbai"        },
  { id:13, name:"Sindhu Varma",     contact:"9654012345", hometown:"Visakhapatnam" },
  { id:14, name:"Gayathri Das",     contact:"9543012345", hometown:"Kolkata"       },
  { id:15, name:"Hema Latha",       contact:"9432012345", hometown:"Indore"        },
  { id:16, name:"Jyothi Reddy",     contact:"9321012345", hometown:"Hyderabad"     },
  { id:17, name:"Kamala Srinivas",  contact:"9210012345", hometown:"Bangalore"     },
  { id:18, name:"Nalini Mohan",     contact:"9109012345", hometown:"Chennai"       },
  { id:19, name:"Padma Suresh",     contact:"9008012345", hometown:"Patna"         },
  { id:20, name:"Rekha Gopal",      contact:"9876501234", hometown:"Bhopal"        },
  { id:21, name:"Savitha Prasad",   contact:"9765501234", hometown:"Vadodara"      },
  { id:22, name:"Tara Nambiar",     contact:"9654501234", hometown:"Kochi"         },
  { id:23, name:"Vimala Rajesh",    contact:"9543501234", hometown:"Surat"         },
  { id:24, name:"Yamini Chandra",   contact:"9432501234", hometown:"Lucknow"       },
  { id:25, name:"Ambika Shetty",    contact:"9321501234", hometown:"Mumbai"        },
  { id:26, name:"Bhavani Pillai",   contact:"9210501234", hometown:"Chandigarh"    },
  { id:27, name:"Chitra Venkat",    contact:"9109501234", hometown:"Nagpur"        },
  { id:28, name:"Durga Murugan",    contact:"9008501234", hometown:"Coimbatore"    },
  { id:29, name:"Indira Ravi",      contact:"9876540123", hometown:"Delhi"         },
  { id:30, name:"Janaki Balaji",    contact:"9765540123", hometown:"Jaipur"        },
];

const INITIAL_PHARMACISTS = [
  { id:1, name:"Ramesh Kulkarni",  contact:"9654540123", hometown:"Pune"      },
  { id:2, name:"Suresh Agarwal",   contact:"9543540123", hometown:"Lucknow"   },
  { id:3, name:"Manish Tiwari",    contact:"9432540123", hometown:"Bhopal"    },
  { id:4, name:"Harish Chaudhary", contact:"9321540123", hometown:"Jaipur"    },
];

function StaffRow({ member, index, onUpdate, onRemove }) {
  const [editing,  setEditing]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [temp, setTemp]         = useState({ name: member.name, contact: member.contact, hometown: member.hometown });

  const save   = () => { if (temp.name.trim()) { onUpdate(member.id, temp); setEditing(false); } };
  const cancel = () => { setTemp({ name: member.name, contact: member.contact, hometown: member.hometown }); setEditing(false); };

  const cellStyle  = { padding: "0.8rem 1rem", fontSize: 14 };
  const inputStyle = { fontSize: 14, border: "1px solid #1a5fa8", borderRadius: 6, padding: "3px 8px", outline: "none", width: "100%" };

  return (
    <tr className={styles.dataRow} style={{ borderTop: "1px solid #f0f4f8", background: editing ? "#f7faff" : "transparent" }}>
      <td style={{ ...cellStyle, color: "#888" }}>{index + 1}</td>
      <td style={cellStyle}>
        {editing ? <input value={temp.name} onChange={e => setTemp(p => ({ ...p, name: e.target.value }))} style={inputStyle} /> :
          <span style={{ fontWeight: 600 }}>{member.name}</span>}
      </td>
      <td style={cellStyle}>
        {editing ? <input value={temp.contact} onChange={e => setTemp(p => ({ ...p, contact: e.target.value }))} style={inputStyle} /> :
          member.contact}
      </td>
      <td style={cellStyle}>
        {editing ? <input value={temp.hometown} onChange={e => setTemp(p => ({ ...p, hometown: e.target.value }))} style={inputStyle} /> :
          member.hometown}
      </td>
      <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
        {editing ? (
          <>
            <FiCheck size={16} color="#27ae60" style={{ cursor: "pointer", marginRight: 10 }} onClick={save} />
            <FiX    size={16} color="#e74c3c" style={{ cursor: "pointer" }} onClick={cancel} />
          </>
        ) : (
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => setMenuOpen(p => !p)}
              style={{ background: "#f0f4f8", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 700, fontSize: 16, color: "#555", letterSpacing: 2 }}
            >⋮</button>
            {menuOpen && (
              <div
                style={{ position: "absolute", right: 0, top: "110%", background: "#fff", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 100, minWidth: 120, overflow: "hidden" }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div
                  style={{ padding: "0.6rem 1rem", cursor: "pointer", fontSize: 14, color: "#1a5fa8", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f4f8"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => { setTemp({ name: member.name, contact: member.contact, hometown: member.hometown }); setEditing(true); setMenuOpen(false); }}
                >
                  <FiEdit2 size={13} /> Edit
                </div>
                <div
                  style={{ padding: "0.6rem 1rem", cursor: "pointer", fontSize: 14, color: "#e74c3c", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => { onRemove(member.id); setMenuOpen(false); }}
                >
                  <FiX size={13} /> Remove
                </div>
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

function StaffSection({ title, staff, setStaff, onBack }) {
  const [showAdd,    setShowAdd]    = useState(false);
  const [newName,    setNewName]    = useState("");
  const [newPhone,   setNewPhone]   = useState("");
  const [newTown,    setNewTown]    = useState("");
  const [addError,   setAddError]   = useState("");
  const [isMobile,   setIsMobile]   = useState(false);
  const [expanded,   setExpanded]   = useState({});

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleAdd    = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newTown.trim()) { setAddError("Please fill in all fields."); return; }
    setStaff(prev => [...prev, { id: Date.now(), name: newName.trim(), contact: newPhone.trim(), hometown: newTown.trim() }]);
    setNewName(""); setNewPhone(""); setNewTown(""); setAddError(""); setShowAdd(false);
  };
  const handleUpdate = (id, fields) => setStaff(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s));
  const handleRemove = (id) => setStaff(prev => prev.filter(s => s.id !== id));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>{title}</h2>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#1a5fa8", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>‹ Back</button>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>+ Add Member</button>
      </div>

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", width: 380, maxWidth: "calc(100vw - 2rem)", boxShadow: "0 8px 32px rgba(26,95,168,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "#1a5fa8", margin: 0 }}>Add New Member</h3>
              <FiX size={20} style={{ cursor: "pointer", color: "#888" }} onClick={() => { setShowAdd(false); setAddError(""); setNewName(""); setNewPhone(""); setNewTown(""); }} />
            </div>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {addError && <p style={{ color: "#e74c3c", fontSize: 13, margin: 0 }}>{addError}</p>}
              <input placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
              <input placeholder="Contact Number" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
              <input placeholder="Hometown" value={newTown} onChange={e => setNewTown(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }} />
              <button type="submit" style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.75rem", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Add Member
              </button>
            </form>
          </div>
        </div>
      )}

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {staff.map((s, i) => (
            <div key={s.id} style={{ background: "#fff", borderRadius: 12, padding: "0.9rem 1rem", border: "1px solid #e0e0e0", boxShadow: "0 2px 6px rgba(26,95,168,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a5fa8" }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>📞 {s.contact}</div>
                </div>
                <button onClick={() => setExpanded(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#1a5fa8", fontSize: 18, padding: 0 }}>
                  {expanded[s.id] ? "▲" : "▼"}
                </button>
              </div>
              {expanded[s.id] && (
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #f0f4f8" }}>
                  <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>🏠 {s.hometown}</div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => { const name = prompt("Edit name:", s.name); if (name?.trim()) handleUpdate(s.id, { ...s, name: name.trim() }); }} style={{ flex: 1, background: "#f4f8fc", color: "#1a5fa8", border: "1px solid #d6e6f7", borderRadius: 7, padding: "5px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Edit
                    </button>
                    <button onClick={() => handleRemove(s.id)} style={{ flex: 1, background: "#fdecea", color: "#e74c3c", border: "none", borderRadius: 7, padding: "5px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#d6e6f7" }}>
                {["#", "Name", "Contact Number", "Hometown", "Actions"].map(h => (
                  <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((s, i) => (
                <StaffRow key={s.id} index={i} member={s} onUpdate={handleUpdate} onRemove={handleRemove} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}


const LAB_CATEGORIES = [
  {
    title: "Pathology",
    color: "#1a5fa8", light: "#d6e6f7",
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
    title: "Radiology",
    color: "#8e44ad", light: "#f3e8fd",
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
    title: "Microbiology",
    color: "#e67e22", light: "#fef3e2",
    tests: [
      { name: "Blood Culture & Sensitivity",     price: 600 },
      { name: "Urine Culture & Sensitivity",     price: 500 },
      { name: "Throat Swab Culture",             price: 450 },
      { name: "Stool Culture",                   price: 500 },
      { name: "Sputum Culture & Sensitivity",    price: 550 },
    ],
  },
  {
    title: "Biochemistry",
    color: "#16a085", light: "#e0f5f1",
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
    title: "Cardiology",
    color: "#e74c3c", light: "#fdecea",
    tests: [
      { name: "ECG – 12 Lead",                   price: 200  },
      { name: "Echocardiography (Echo)",         price: 2500 },
      { name: "Holter Monitoring (24 hr)",       price: 3000 },
      { name: "Stress Test (TMT)",               price: 1500 },
    ],
  },
  {
    title: "Histopathology",
    color: "#2c3e50", light: "#eaecee",
    tests: [
      { name: "Biopsy – Small Specimen",         price: 1500 },
      { name: "Biopsy – Large Specimen",         price: 2500 },
      { name: "FNAC",                            price: 800  },
      { name: "Frozen Section",                  price: 3000 },
      { name: "Immunohistochemistry (IHC)",      price: 3500 },
    ],
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav]       = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [isMobile, setIsMobile]         = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [doctors, setDoctors]           = useState(INITIAL_DOCTORS);
  const [appointments, setAppointments]   = useState([]);
  const [patients, setPatients]           = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [history, setHistory]             = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [labRequests, setLabRequests]     = useState([]);
  const [labRequestsLoading, setLabRequestsLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [consultLoading, setConsultLoading] = useState(false);
  const [reports, setReports]             = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [expandedReports, setExpandedReports] = useState({});
  const [expandedSlots,   setExpandedSlots]   = useState({});
  const [reportSearch, setReportSearch]       = useState("");
  const [slotsSearch, setSlotsSearch]         = useState("");
  const [adminSelectedTests, setAdminSelectedTests] = useState([]);
  const [adminLabName, setAdminLabName]       = useState("");
  const [adminLabPhone, setAdminLabPhone]     = useState("");
  const [adminLabSubmitting, setAdminLabSubmitting] = useState(false);
  const [adminLabSuccess, setAdminLabSuccess] = useState(false);
  const [showAdminLabMobileForm, setShowAdminLabMobileForm] = useState(false);
  const [showAdminAddMoreTests, setShowAdminAddMoreTests] = useState(false);
  const [nurses, setNurses]               = useState(INITIAL_NURSES);
  const [pharmacists, setPharmacists]     = useState(INITIAL_PHARMACISTS);
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formError, setFormError]       = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("adminActiveNav");
    if (saved) setActiveNav(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("adminActiveNav", activeNav);
  }, [activeNav]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) router.push("/");

    // Initial load
    fetchAppointments();
    fetchAdmittedPatients();
    fetchPatientHistory();
    fetchLabRequests();
    fetchReports();
    fetchConsultations();

    // LiveQuery — only re-fetch when Back4App actually has new/changed data
    let apptSub, labSub, admittedSub;

    (async () => {
      try {
        // New or updated appointments (patients booking via portal)
        apptSub = await new Parse.Query("Appointment").subscribe();
        apptSub.on("create", () => fetchAppointments());
        apptSub.on("update", () => fetchAppointments());

        // New lab requests from patients
        labSub = await new Parse.Query("LabRequest").subscribe();
        labSub.on("create", () => fetchLabRequests());
        labSub.on("update", () => { fetchLabRequests(); fetchReports(); });

        // New admitted patients
        admittedSub = await new Parse.Query("AdmittedPatient").subscribe();
        admittedSub.on("create", () => fetchAdmittedPatients());
        admittedSub.on("update", () => { fetchAdmittedPatients(); fetchPatientHistory(); });
        admittedSub.on("delete", () => { fetchAdmittedPatients(); fetchPatientHistory(); });
      } catch (err) {
        console.warn("LiveQuery unavailable, falling back to 60s poll:", err.message);
        // Fallback: longer interval only if LiveQuery fails
        const fallback = setInterval(() => {
          fetchAppointments();
          fetchLabRequests();
        }, 60000);
        return () => clearInterval(fallback);
      }
    })();

    return () => {
      apptSub?.unsubscribe();
      labSub?.unsubscribe();
      admittedSub?.unsubscribe();
    };
  }, []);

  const parsePatientRow = (r) => ({
    id:        r.id,
    name:      r.get("name")      || "",
    room:      r.get("room")      || "",
    admitDate: r.get("admitDate") || "",
    status:    r.get("status")    || "Admitted",
  });

  const fetchAdmittedPatients = async () => {
    setPatientsLoading(true);
    setPatientsError("");
    try {
      const query = new Parse.Query("AdmittedPatient");
      query.ascending("room");
      query.limit(1000);
      const results = await query.find();
      console.log("AdmittedPatient fetch:", results.length, "records");
      setPatients(results.map(parsePatientRow));
    } catch (err) {
      console.error("Failed to fetch admitted patients:", err);
      setPatientsError(`Error: ${err.message || err}`);
    } finally {
      setPatientsLoading(false);
    }
  };


  const fetchPatientHistory = async () => {
    setHistoryLoading(true);
    try {
      const query = new Parse.Query("PatientHistory");
      query.descending("createdAt");
      query.limit(1000);
      const results = await query.find();
      setHistory(results.map(r => ({
        id:            r.id,
        name:          r.get("name")          || "",
        room:          r.get("room")          || "",
        admitDate:     r.get("admitDate")     || "",
        dischargeDate: r.get("dischargeDate") || "",
        dischargeTime: r.get("dischargeTime") || "",
      })));
    } catch (err) {
      console.error("Failed to fetch patient history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchLabRequests = async () => {
    setLabRequestsLoading(true);
    try {
      const query = new Parse.Query("LabRequest");
      query.descending("createdAt");
      query.limit(1000);
      const results = await query.find();
      setLabRequests(results.map(r => ({
        id:           r.id,
        patientName:  r.get("patientName")  || "",
        patientEmail: r.get("patientEmail") || "",
        patientPhone: r.get("patientPhone") || "",
        tests:        JSON.parse(r.get("tests") || "[]"),
        totalAmount:  r.get("totalAmount")  || 0,
        status:       r.get("status")       || "Pending",
      })));
    } catch (err) {
      console.error("Failed to fetch lab requests:", err);
    } finally {
      setLabRequestsLoading(false);
    }
  };

  const fetchConsultations = async () => {
    setConsultLoading(true);
    try {
      const query = new Parse.Query("Consultation");
      query.descending("createdAt");
      query.limit(1000);
      const results = await query.find();
      setConsultations(results.map(r => ({
        id:      r.id,
        name:    r.get("name")    || "",
        phone:   r.get("phone")   || "",
        email:   r.get("email")   || "",
        date:    r.get("date")    || "",
        problem: r.get("problem") || "",
        status:  r.get("status")  || "Pending",
      })));
    } catch (err) {
      console.error("Failed to fetch consultations:", err);
    } finally {
      setConsultLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const query = new Parse.Query("LabReport");
      query.descending("createdAt");
      query.limit(1000);
      const results = await query.find();
      setReports(results.map(r => ({
        id:          r.id,
        patientName: r.get("patientName")  || "",
        patientEmail:r.get("patientEmail") || "",
        reportDate:  r.get("reportDate")   || "",
        tests:       JSON.parse(r.get("tests") || "[]"),
      })));
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleAdminLabSubmit = async () => {
    if (!adminLabName.trim() || !adminLabPhone.trim() || adminSelectedTests.length === 0) return;
    setAdminLabSubmitting(true);
    try {
      const totalAmount = adminSelectedTests.reduce((s, t) => s + t.price, 0);
      // Save as LabRequest
      const LabRequest = Parse.Object.extend("LabRequest");
      const req = new LabRequest();
      req.set("patientName",  adminLabName.trim());
      req.set("patientEmail", "");
      req.set("patientPhone", adminLabPhone.trim());
      req.set("tests",        JSON.stringify(adminSelectedTests));
      req.set("totalAmount",  totalAmount);
      req.set("status",       "Pending");
      const saved = await req.save();
      // Auto-accept: generate report
      const reportTests = adminSelectedTests.map(t => ({
        name:    t.name,
        price:   t.price,
        results: DUMMY_RESULTS[t.name] || [{ param: "Result", value: "Within normal limits", range: "—", status: "Normal" }],
      }));
      saved.set("status", "Accepted");
      await saved.save();
      const LabReport = Parse.Object.extend("LabReport");
      const report = new LabReport();
      report.set("patientName",  adminLabName.trim());
      report.set("patientEmail", "");
      report.set("reportDate",   new Date().toISOString().slice(0, 10));
      report.set("tests",        JSON.stringify(reportTests));
      await report.save();
      // Refresh lists
      await Promise.all([fetchLabRequests(), fetchReports()]);
      // Reset form
      setAdminSelectedTests([]);
      setAdminLabName("");
      setAdminLabPhone("");
      setAdminLabSuccess(true);
      setTimeout(() => setAdminLabSuccess(false), 3000);
    } catch (err) {
      console.error("Admin lab submit failed:", err);
    } finally {
      setAdminLabSubmitting(false);
    }
  };

  const acceptLabRequest = async (id) => {
    try {
      const req = labRequests.find(r => r.id === id);
      // Update LabRequest status
      const LabRequest = Parse.Object.extend("LabRequest");
      const obj = new LabRequest();
      obj.id = id;
      obj.set("status", "Accepted");
      await obj.save();
      // Generate and save dummy report
      const reportTests = req.tests.map(t => ({
        name:    t.name,
        price:   t.price,
        results: DUMMY_RESULTS[t.name] || [{ param: "Result", value: "Within normal limits", range: "—", status: "Normal" }],
      }));
      const LabReport = Parse.Object.extend("LabReport");
      const report = new LabReport();
      report.set("patientName",  req.patientName);
      report.set("patientEmail", req.patientEmail);
      report.set("reportDate",   new Date().toISOString().slice(0, 10));
      report.set("tests",        JSON.stringify(reportTests));
      await report.save();
      setLabRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Accepted" } : r));
      fetchReports();
    } catch (err) {
      console.error("Failed to accept lab request:", err);
    }
  };

  const denyLabRequest = async (id) => {
    try {
      const LabRequest = Parse.Object.extend("LabRequest");
      const obj = new LabRequest();
      obj.id = id;
      obj.set("status", "Denied");
      await obj.save();
      setLabRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Denied" } : r));
    } catch (err) {
      console.error("Failed to deny lab request:", err);
    }
  };

  const addAdmittedPatient = async (name, room) => {
    const AdmittedPatient = Parse.Object.extend("AdmittedPatient");
    const obj = new AdmittedPatient();
    obj.set("name",      name);
    obj.set("room",      room);
    obj.set("admitDate", new Date().toISOString().slice(0, 10));
    obj.set("status",    "Admitted");
    await obj.save();
    await fetchAdmittedPatients();
  };

  const updateAdmittedPatient = async (id, fields) => {
    try {
      const AdmittedPatient = Parse.Object.extend("AdmittedPatient");
      const obj = new AdmittedPatient();
      obj.id = id;

      if (fields.status === "Discharged") {
        const patient = patients.find(p => p.id === id);
        const now = new Date();
        const PatientHistory = Parse.Object.extend("PatientHistory");
        const hist = new PatientHistory();
        hist.set("name",          patient.name);
        hist.set("room",          patient.room);
        hist.set("admitDate",     patient.admitDate);
        hist.set("dischargeDate", now.toISOString().slice(0, 10));
        hist.set("dischargeTime", now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
        await hist.save();
        await obj.destroy();
        setPatients(prev => prev.filter(p => p.id !== id));
        fetchPatientHistory();
      } else {
        Object.entries(fields).forEach(([k, v]) => obj.set(k, v));
        await obj.save();
        setPatients(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p));
      }
    } catch (err) {
      console.error("Failed to update admitted patient:", err);
    }
  };

  const deleteAdmittedPatient = async (id) => {
    try {
      const AdmittedPatient = Parse.Object.extend("AdmittedPatient");
      const obj = new AdmittedPatient();
      obj.id = id;
      await obj.destroy();
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete admitted patient:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const query = new Parse.Query("Appointment");
      query.descending("createdAt");
      const results = await query.find();
      setAppointments(results.map(r => ({
        id:           r.id,
        name:         r.get("patientName") || r.get("name") || "—",
        age:          r.get("age") || "—",
        gender:       r.get("gender") || "—",
        doctor:       r.get("doctor") || "—",
        reason:       r.get("reason") || "",
        date:         r.get("date") || "",
        time:         r.get("time") || "",
        status:       r.get("status") || "Pending",
        patientEmail: r.get("patientEmail") || "",
      })));
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => { localStorage.clear(); setShowLogoutConfirm(false); setLoggedOut(true); };

  const handleNameChange  = (id, name) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, name } : d));
  const handleImageChange = (id, img)  => setDoctors(prev => prev.map(d => d.id === id ? { ...d, img }  : d));

  const handleStatusChange = async (id, newStatus) => {
    try {
      const query = new Parse.Query("Appointment");
      const appt  = await query.get(id);
      appt.set("status", newStatus);
      await appt.save();
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.date || !form.time) {
      setFormError("Please fill in all fields.");
      return;
    }
    try {
      const Appointment = Parse.Object.extend("Appointment");
      const appt = new Appointment();
      appt.set("name",        form.name);
      appt.set("patientName", form.name);
      appt.set("age",         form.age);
      appt.set("gender",      form.gender);
      appt.set("reason",      form.reason || "");
      appt.set("date",        form.date);
      appt.set("time",        form.time);
      appt.set("status",      "Pending");
      appt.set("bookedBy",    "admin");
      await appt.save();
      setForm(EMPTY_FORM);
      setFormError("");
      setShowForm(false);
      setActiveNav("Appointments");
      await fetchAppointments();
    } catch (err) {
      setFormError("Failed to save appointment. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className={styles.layout}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Overlay for mobile sidebar */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div style={{ marginBottom: 32, width: "100%", padding: "0.5rem 1.5rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #e8f2fd, #b3d1f5)",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.5)",
              fontSize: 20, fontWeight: 800, color: "#1a5fa8", letterSpacing: 1,
              userSelect: "none"
            }}>DU</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>DUkEY</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>Admin</div>
            </div>
            {/* X close button — mobile only */}
            <button className={styles.sidebarCloseBtn} onClick={() => setSidebarOpen(false)} aria-label="Close menu">‹</button>
          </div>
        </div>
        <nav style={{ width: "100%", flex: 1 }}>
          {[
            { label: 'Dashboard',        icon: <FiHome size={16} /> },
            { label: 'Patient',          icon: <FiUsers size={16} /> },
            { label: 'Patient History',  icon: <FiClock size={16} /> },
            { label: 'Department',       icon: <FiLayers size={16} /> },
            { label: 'Lab & Diagnostics',icon: <FiActivity size={16} /> },
            { label: 'Slots',            icon: <FiGrid size={16} /> },
            { label: 'Appointments',     icon: <FiCalendar size={16} /> },
            { label: 'Consultations',     icon: <FiMessageSquare size={16} /> },
            { label: 'Payment',          icon: <FiCreditCard size={16} /> },
            { label: 'Reports',          icon: <FiFileText size={16} /> },
          ].map(({ label, icon }) => (
            <NavItem key={label} label={label} icon={icon} active={activeNav === label} onClick={() => { setActiveNav(label); setSidebarOpen(false); }} />
          ))}
        </nav>
        <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "1rem" }}>
          <BottomItem icon={<FiSettings size={18} />} label="Settings" onClick={() => alert('Settings clicked!')} />
          <BottomItem icon={<FiLogOut size={18} />}   label="Logout"   onClick={handleLogout} color="#e74c3c" />
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
            <button
              className={styles.hamburger}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
            <img src="/Logo-medicover.png" alt="Medicover Logo" className={styles.topbarLogo} style={{ width: 53, height: 53, objectFit: "contain", flexShrink: 0 }} />
            <div style={{ fontWeight: 800, fontSize: "clamp(13px, 3vw, 24px)", color: "#1a5fa8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>Medicover Management</div>
          </div>
          {!["Slots", "Lab & Diagnostics", "Patient", "Patient History", "Payment", "Reports", "Appointments", "Consultations"].includes(activeNav) && (
            <button onClick={() => setShowForm(true)} className={styles.topbarBtn}>
              Make an appointment
            </button>
          )}
        </header>

        {/* Dashboard */}
        {activeNav === "Dashboard" && (
          <>
            <section className={styles.statsRow}>
              <div className={styles.statCard} onClick={() => setActiveNav("Doctor")}>Doctors<br /><span style={{ fontSize: 20, fontWeight: 700 }}>10</span></div>
              <div className={styles.statCard} onClick={() => setActiveNav("Nurses")}>Nurses<br /><span style={{ fontSize: 20, fontWeight: 700 }}>{nurses.length}</span></div>
              <div className={styles.statCard} onClick={() => setActiveNav("Patient")}>Patients<br /><span style={{ fontSize: 20, fontWeight: 700 }}>{patients.length}</span></div>
              <div className={styles.statCard} onClick={() => setActiveNav("Pharmacists")}>Pharmacists<br /><span style={{ fontSize: 20, fontWeight: 700 }}>{pharmacists.length}</span></div>
            </section>
            <section className={styles.dashSecondGrid}>
              <div onClick={() => setActiveNav("Appointments")} className={styles.dashCard}>Appointments<br /><span style={{ fontSize: 20, fontWeight: 700 }}>{appointments.length}</span></div>
              <div onClick={() => setActiveNav("Consultations")} className={styles.dashCard}>Consultations<br /><span style={{ fontSize: 20, fontWeight: 700 }}>{consultations.length}</span></div>
              <div onClick={() => setActiveNav("Patient History")} className={styles.dashCard}>Patient History<br /><span style={{ fontSize: 20, fontWeight: 700 }}>{history.length}</span></div>
              <div onClick={() => setActiveNav("Slots")} className={styles.dashCard}>
                Slots<br />
                <span style={{ fontSize: 20, fontWeight: 700 }}>{labRequests.length}</span>
                <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>({labRequests.filter(r => r.status === "Pending").length} pending)</span>
              </div>
            </section>

            {/* Last 6 Days Patient Stats Bar Chart */}
            {(() => {
              const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
              const today = new Date();

              // Build rolling 6-day window: 5 days ago → today
              const last6 = Array.from({ length: 6 }, (_, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() - (5 - i));
                return d.toISOString().slice(0, 10);
              });

              const barData = last6.map(dateStr => {
                const d = new Date(dateStr);
                const label = `${DAY_NAMES[d.getDay()]} ${d.getDate()}`;
                const admitted  = patients.filter(p => p.admitDate === dateStr).length;
                const discharged = history.filter(h => h.dischargeDate === dateStr).length;
                return { day: label, Admitted: admitted, Discharged: discharged };
              });

              return (
                <section style={{ background: "#fff", borderRadius: 16, padding: "1.5rem 2rem", boxShadow: "0 2px 8px rgba(26,95,168,0.08)" }}>
                  <h3 style={{ fontWeight: 700, fontSize: 17, color: "#1a5fa8", marginBottom: "1.5rem", marginTop: 0 }}>
                    Daily Patient Activity
                    <span style={{ fontSize: 13, color: "#888", fontWeight: 400, marginLeft: 10 }}>Last 6 days</span>
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData} barCategoryGap="30%" barGap={4} margin={{ left: isMobile ? -28 : 0, right: 0, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: isMobile ? 11 : 13, fill: "#555" }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: isMobile ? 11 : 13, fill: "#888" }} axisLine={false} tickLine={false} width={isMobile ? 28 : 40} />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, border: "1px solid #d6e6f7", fontSize: 13 }}
                        formatter={(value, name) => [`${value} patient${value !== 1 ? "s" : ""}`, name]}
                        allowEscapeViewBox={{ x: false, y: false }}
                        position={{ y: 0 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
                      <Bar dataKey="Admitted"   fill="#1a5fa8" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Discharged" fill="#27ae60" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </section>
              );
            })()}

            {/* ── Quick Overview Cards ── */}
            <section className={styles.quickStats}>
              {[
                { label: "OPD Today",          value: 42,      sub: "+8 from yesterday",    color: "#1a5fa8" },
                { label: "ICU Occupied",        value: "6/8",   sub: "2 beds available",     color: "#e74c3c" },
                { label: "Surgeries",           value: 5,       sub: "Next at 10:30 AM",     color: "#8e44ad" },
                { label: "Revenue Today",       value: "₹1.2L", sub: "vs ₹98K yesterday",   color: "#27ae60" },
              ].map(c => (
                <div key={c.label} className={styles.overviewCard} style={{
                  background: "#fff", borderRadius: 14,
                  padding: "1.1rem 1.2rem",
                  boxShadow: "0 2px 8px rgba(26,95,168,0.07)",
                  boxSizing: "border-box"
                }}>
                  <div style={{ fontSize: 12, color: "#888", fontWeight: 500, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>{c.sub}</div>
                </div>
              ))}
            </section>

            {/* ── Recent Activity Feed ── */}
            <section style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(26,95,168,0.08)", marginTop: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1a5fa8", margin: "0 0 1.1rem 0" }}>
                Recent Activity
                <span style={{ fontSize: 12, color: "#aaa", fontWeight: 400, marginLeft: 10 }}>Live hospital feed</span>
              </h3>
              {[
                { time: "09:14 AM", icon: "🛏️",  text: "Patient Ramesh Kumar admitted — Room 204",        color: "#1a5fa8" },
                { time: "09:02 AM", icon: "✅",  text: "Lab report for Priya Sharma marked Normal",        color: "#27ae60" },
                { time: "08:51 AM", icon: "🔬",  text: "CBC & LFT tests requested by Dr. Aisha Khan",     color: "#8e44ad" },
                { time: "08:40 AM", icon: "🚑",  text: "Emergency admission — Arjun Mehta, Cardiology",   color: "#e74c3c" },
                { time: "08:22 AM", icon: "💊",  text: "Prescription issued for patient in Room 101",     color: "#e67e22" },
                { time: "08:05 AM", icon: "🏥",  text: "Dr. Emily Watson marked Available for OPD",       color: "#16a085" },
              ].map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem", padding: "0.7rem 0", borderBottom: i < 5 ? "1px solid #f0f4f8" : "none" }}>
                  <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.4 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{a.time}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0, marginTop: 6 }} />
                </div>
              ))}
            </section>

            {/* ── Department Load ── */}
            <section style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(26,95,168,0.08)", marginTop: "1.5rem", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1a5fa8", margin: "0 0 1.1rem 0" }}>Department Load Today</h3>
              {[
                { dept: "Cardiology",    load: 88, color: "#e74c3c" },
                { dept: "Orthopedics",   load: 65, color: "#1a5fa8" },
                { dept: "Neurology",     load: 72, color: "#8e44ad" },
                { dept: "Pediatrics",    load: 50, color: "#27ae60" },
                { dept: "Dermatology",   load: 40, color: "#e67e22" },
                { dept: "Gynecology",    load: 78, color: "#16a085" },
              ].map(d => (
                <div key={d.dept} style={{ marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, color: "#444", marginBottom: 5 }}>
                    <span>{d.dept}</span><span style={{ color: d.color, fontWeight: 700 }}>{d.load}%</span>
                  </div>
                  <div style={{ background: "#f0f4f8", borderRadius: 99, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${d.load}%`, height: "100%", background: d.color, borderRadius: 99, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Doctors */}
        {activeNav === "Doctor" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>Our Doctors</h2>
              <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Click a name to edit · Click photo to change image</p>
              <button onClick={() => setActiveNav("Dashboard")} style={{ background: "none", border: "none", color: "#1a5fa8", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>‹ Back</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
              {doctors.map(doc => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onNameChange={handleNameChange}
                  onImageChange={handleImageChange}
                />
              ))}
            </div>
          </>
        )}

        {/* Patients */}
        {activeNav === "Patient" && (
          <PatientSection
            patients={patients}
            onAdd={addAdmittedPatient}
            onUpdate={updateAdmittedPatient}
            onDelete={deleteAdmittedPatient}
            onRefresh={fetchAdmittedPatients}
            loading={patientsLoading}
            error={patientsError}
            labRequests={labRequests}
            onBack={() => setActiveNav("Dashboard")}
          />
        )}

        {/* Appointments */}
        {activeNav === "Appointments" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>Appointments</h2>
                <button onClick={() => setActiveNav("Dashboard")} style={{ background: "none", border: "none", color: "#1a5fa8", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>‹ Back</button>
              </div>
              <button onClick={() => setShowForm(true)} style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontWeight: 600, cursor: "pointer" }}>+ New Appointment</button>
            </div>
            {appointments.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "5rem", color: "#aaa", fontSize: 18 }}>No appointments yet. Click "Make an appointment" to add one.</div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
                <div className={styles.tableWrap}>
                <table className={styles.appointmentTable} style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#d6e6f7" }}>
                      {["#", "Patient Name", "Status", "Age", "Gender", "Doctor", "Date", "Time", "Action"].map(h => (
                        <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                      <th className={styles.aptExpandBtn} />
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt, i) => (
                      <AppointmentRow key={apt.id} apt={apt} i={i} onStatusChange={handleStatusChange} styles={styles} />
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Nurses */}
        {activeNav === "Nurses" && (
          <StaffSection title="Our Nurses" staff={nurses} setStaff={setNurses} onBack={() => setActiveNav("Dashboard")} />
        )}

        {/* Pharmacists */}
        {activeNav === "Pharmacists" && (
          <StaffSection title="Our Pharmacists" staff={pharmacists} setStaff={setPharmacists} onBack={() => setActiveNav("Dashboard")} />
        )}

        {/* Patient History */}
        {activeNav === "Patient History" && (
          <>
            <div className={styles.historyHeader}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: "0 0 2px 0" }}>Patient History</h2>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Patients automatically move here when discharged</p>
                <button onClick={() => setActiveNav("Dashboard")} style={{ background: "none", border: "none", color: "#1a5fa8", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>‹ Back</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <input
                  placeholder="Search by name..."
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", width: 200 }}
                />
                <div style={{ background: "#d6e6f7", borderRadius: 10, padding: "0.5rem 1.2rem", fontWeight: 600, color: "#1a5fa8", fontSize: 14, whiteSpace: "nowrap" }}>
                  Total Discharged: {history.length}
                </div>
              </div>
            </div>
            {historyLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading...</div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 16 }}>No discharge records yet.</div>
            ) : (() => {
              const filtered = history.filter(h => h.name.toLowerCase().includes(historySearch.toLowerCase()));
              return filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 16 }}>No patient found matching "{historySearch}".</div>
              ) : (
                <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
                  <div className={styles.tableWrap}>
                  <table className={styles.historyTable} style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#d6e6f7" }}>
                        {["#", "Patient Name", "Room", "Admitted On", "Discharged On", "Discharge Time"].map(h => (
                          <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", fontWeight: 700, color: "#1a5fa8", fontSize: 14 }}>{h}</th>
                        ))}
                        <th className={styles.historyExpandBtn} />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((h, i) => (
                        <HistoryRow key={h.id} h={h} i={i} styles={styles} />
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* Lab & Diagnostics */}
        {activeNav === "Lab & Diagnostics" && (() => {
          return (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>Lab & Diagnostics</h2>
                <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Click tests to select, fill patient details, then submit</p>
              </div>

              {/* Summary panel */}
              {adminSelectedTests.length > 0 && !isMobile && (
                <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(26,95,168,0.12)", padding: "1.2rem 1.5rem", marginBottom: "1.5rem", border: "1.5px solid #1a5fa8" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1a5fa8", marginBottom: "0.75rem" }}>Selected Tests</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                    {adminSelectedTests.map(t => (
                      <span key={t.name} style={{ background: "#d6e6f7", color: "#1a5fa8", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, cursor: "pointer" }}
                        onClick={() => setAdminSelectedTests(prev => prev.filter(x => x.name !== t.name))}>
                        {t.name} — ₹{t.price.toLocaleString()} ✕
                      </span>
                    ))}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a5fa8", marginBottom: "0.75rem" }}>
                    Total: ₹{adminSelectedTests.reduce((s, t) => s + t.price, 0).toLocaleString()}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    <input
                      type="text" placeholder="Patient Name"
                      value={adminLabName} onChange={e => setAdminLabName(e.target.value)}
                      style={{ flex: 1, minWidth: 160, padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 13, outline: "none" }}
                    />
                    <input
                      type="text" placeholder="Phone Number"
                      value={adminLabPhone} onChange={e => setAdminLabPhone(e.target.value)}
                      style={{ flex: 1, minWidth: 140, padding: "0.6rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 13, outline: "none" }}
                    />
                    <button
                      onClick={handleAdminLabSubmit}
                      disabled={adminLabSubmitting || !adminLabName.trim() || !adminLabPhone.trim()}
                      style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.6rem 1.4rem", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: adminLabSubmitting ? 0.7 : 1 }}>
                      {adminLabSubmitting ? "Submitting…" : "Submit"}
                    </button>
                  </div>
                  {adminLabSuccess && (
                    <div style={{ color: "#27ae60", fontWeight: 700, fontSize: 13 }}>✓ Submitted & Accepted — report generated</div>
                  )}
                </div>
              )}

              <div className={styles.labGrid}>
                {LAB_CATEGORIES.map(cat => (
                  <div key={cat.title} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden", border: `2px solid ${cat.color}` }}>
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
                          const selected = adminSelectedTests.some(x => x.name === t.name);
                          return (
                            <tr key={t.name}
                              onClick={() => {
                                setAdminSelectedTests(prev => {
                                  const next = selected ? prev.filter(x => x.name !== t.name) : [...prev, t];
                                  if (isMobile && next.length > 0) setShowAdminLabMobileForm(true);
                                  return next;
                                });
                              }}
                              style={{ borderTop: "1px solid #f0f4f8", background: selected ? cat.light : i % 2 === 0 ? "#fff" : "#fafcff", cursor: "pointer", transition: "background 0.15s" }}>
                              <td style={{ padding: "0.65rem 1rem", fontSize: 13, color: selected ? cat.color : "#333", fontWeight: selected ? 700 : 400, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ width: 14, height: 14, borderRadius: 4, border: `2px solid ${cat.color}`, background: selected ? cat.color : "transparent", display: "inline-block", flexShrink: 0 }} />
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

        {/* Slots */}
        {activeNav === "Slots" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>Slots</h2>
                <span className={styles.slotsSubText}>Lab & diagnostic test requests from patients</span>
                <button onClick={() => setActiveNav("Dashboard")} style={{ background: "none", border: "none", color: "#1a5fa8", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>‹ Back</button>
              </div>
              <input
                type="text"
                placeholder="Search by name or phone…"
                value={slotsSearch}
                onChange={e => setSlotsSearch(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 13, outline: "none", width: 220, maxWidth: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Pending",  color: "#e67e22", bg: "#fff4e5", count: labRequests.filter(r => r.status === "Pending").length  },
                { label: "Accepted", color: "#27ae60", bg: "#e6f9f0", count: labRequests.filter(r => r.status === "Accepted").length },
                { label: "Denied",   color: "#e74c3c", bg: "#fdecea", count: labRequests.filter(r => r.status === "Denied").length   },
                { label: "Total",    color: "#1a5fa8", bg: "#d6e6f7", count: labRequests.length },
              ].map(({ label, color, bg, count }) => (
                <div key={label} style={{ background: bg, borderRadius: 10, padding: "0.5rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 700, fontSize: 20, color }}>{count}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color }}>{label}</span>
                </div>
              ))}
            </div>
            {labRequestsLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading...</div>
            ) : labRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 16 }}>No lab requests yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {labRequests.filter(r =>
                  r.patientName.toLowerCase().includes(slotsSearch.toLowerCase()) ||
                  r.patientPhone.toLowerCase().includes(slotsSearch.toLowerCase())
                ).map((req) => (
                  <div key={req.id} className={styles.slotCard} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", padding: "1.2rem 1.5rem" }}>
                    {isMobile ? (
                      /* ── Mobile: name/email/phone + status + expand ── */
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a5fa8" }}>{req.patientName}</div>
                            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{req.patientEmail}</div>
                            {req.patientPhone && <div style={{ fontSize: 13, color: "#888", marginTop: 1 }}>📞 {req.patientPhone}</div>}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, background: req.status === "Accepted" ? "#27ae60" : req.status === "Denied" ? "#e74c3c" : "#fff4e5", color: req.status === "Accepted" || req.status === "Denied" ? "#fff" : "#e67e22" }}>{req.status}</span>
                            <button onClick={() => setExpandedSlots(prev => ({ ...prev, [req.id]: !prev[req.id] }))}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#1a5fa8", fontSize: 18, padding: 0 }}>
                              {expandedSlots[req.id] ? "▲" : "▼"}
                            </button>
                          </div>
                        </div>
                        {expandedSlots[req.id] && (
                          <div style={{ marginTop: "0.75rem" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                              {req.tests.map(t => (
                                <span key={t.name} style={{ background: "#d6e6f7", color: "#1a5fa8", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{t.name} — ₹{t.price.toLocaleString()}</span>
                              ))}
                            </div>
                            <div style={{ marginTop: "0.5rem", fontWeight: 700, fontSize: 14, color: "#1a5fa8" }}>Total: ₹{req.totalAmount.toLocaleString()}</div>
                            {req.status === "Pending" && (
                              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                                <button onClick={() => acceptLabRequest(req.id)} style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Accept</button>
                                <button onClick={() => denyLabRequest(req.id)} style={{ background: "#fdecea", color: "#e74c3c", border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Deny</button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      /* ── Desktop: original full layout ── */
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#1a5fa8" }}>{req.patientName}</div>
                          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{req.patientEmail}</div>
                          {req.patientPhone && <div style={{ fontSize: 13, color: "#888", marginTop: 1 }}>📞 {req.patientPhone}</div>}
                          <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {req.tests.map(t => (
                              <span key={t.name} style={{ background: "#d6e6f7", color: "#1a5fa8", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{t.name} — ₹{t.price.toLocaleString()}</span>
                            ))}
                          </div>
                          <div style={{ marginTop: "0.5rem", fontWeight: 700, fontSize: 14, color: "#1a5fa8" }}>Total: ₹{req.totalAmount.toLocaleString()}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, background: req.status === "Accepted" ? "#27ae60" : req.status === "Denied" ? "#e74c3c" : "#fff4e5", color: req.status === "Accepted" || req.status === "Denied" ? "#fff" : "#e67e22" }}>{req.status}</span>
                          <div style={{ display: "flex", gap: "0.5rem", marginTop: 4 }}>
                            {req.status === "Pending" && (
                              <button onClick={() => acceptLabRequest(req.id)} style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Accept</button>
                            )}
                            {req.status === "Pending" && (
                              <button onClick={() => denyLabRequest(req.id)} style={{ background: "#fdecea", color: "#e74c3c", border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Deny</button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeNav === "Reports" && (
          <>
            {isMobile ? (
              /* ── Mobile: title + search on one line, total below ── */
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a5fa8", margin: 0, whiteSpace: "nowrap" }}>Lab Reports</h2>
                  <input
                    type="text"
                    placeholder="Search…"
                    value={reportSearch}
                    onChange={e => setReportSearch(e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 13, outline: "none", flex: 1, minWidth: 0, maxWidth: 160 }}
                  />
                </div>
                <span style={{ display: "inline-block", marginTop: 8, background: "#d6e6f7", color: "#1a5fa8", fontWeight: 700, fontSize: 13, padding: "4px 14px", borderRadius: 20 }}>
                  Total: {reports.length}
                </span>
              </div>
            ) : (
              /* ── Desktop: original layout ── */
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a5fa8", margin: 0 }}>Lab Reports</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="Search by name…"
                    value={reportSearch}
                    onChange={e => setReportSearch(e.target.value)}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 13, outline: "none", width: 180 }}
                  />
                  <span style={{ background: "#d6e6f7", color: "#1a5fa8", fontWeight: 700, fontSize: 13, padding: "4px 14px", borderRadius: 20 }}>
                    Total: {reports.length}
                  </span>
                </div>
              </div>
            )}
            {reportsLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>Loading reports…</div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 16 }}>No reports yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reports.filter(r => r.patientName.toLowerCase().includes(reportSearch.toLowerCase())).map((rep) => {
                  const expanded = !!expandedReports[rep.id];
                  return (
                    <div key={rep.id} className={styles.reportCard} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", overflow: "hidden" }}>
                      {/* Summary row — always visible, click to expand */}
                      <div
                        onClick={() => setExpandedReports(prev => ({ ...prev, [rep.id]: !prev[rep.id] }))}
                        className={!expanded ? styles.reportSummaryRow : ""}
                        style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: expanded ? "#1a5fa8" : "#fff", transition: "background 0.2s" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: expanded ? "#fff" : "#1a5fa8" }}>{rep.patientName}</div>
                            <div style={{ fontSize: 12, color: expanded ? "#c8dff5" : "#888", marginTop: 2 }}>{rep.patientEmail}</div>
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
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                          <span style={{ fontSize: 12, color: expanded ? "#c8dff5" : "#aaa" }}>📅 {rep.reportDate}</span>
                          <span style={{ fontSize: 16, color: expanded ? "#fff" : "#1a5fa8", fontWeight: 700 }}>{expanded ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {/* Expanded detail — parameter tables */}
                      {expanded && (
                        <div style={{ padding: "1rem 1.5rem 1.5rem", borderTop: "1px solid #d6e6f7" }}>
                          {rep.tests.map((t, ti) => (
                            <div key={ti} style={{ marginBottom: "1.4rem" }}>
                              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a5fa8", marginBottom: "0.5rem" }}>
                                {t.name} <span style={{ fontWeight: 400, color: "#888", fontSize: 12 }}>— ₹{t.price?.toLocaleString()}</span>
                              </div>
                              <div className={styles.tableWrap}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                  <tr style={{ background: "#f0f6ff" }}>
                                    {["Parameter", "Result", "Reference Range", "Status"].map(h => (
                                      <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, color: "#1a5fa8", border: "1px solid #e0e9f7", whiteSpace: "nowrap" }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {t.results.map((row, ri) => (
                                    <tr key={ri} className={styles.dataRow} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                      <td style={{ padding: "6px 10px", border: "1px solid #f0f0f0", fontWeight: 600 }}>{row.param}</td>
                                      <td style={{ padding: "6px 10px", border: "1px solid #f0f0f0" }}>{row.value}</td>
                                      <td style={{ padding: "6px 10px", border: "1px solid #f0f0f0", color: "#888" }}>{row.range}</td>
                                      <td style={{ padding: "6px 10px", border: "1px solid #f0f0f0" }}>
                                        <span style={{
                                          fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20,
                                          background: row.status === "Normal" ? "#e6f9f0" : "#fdecea",
                                          color:      row.status === "Normal" ? "#27ae60" : "#e74c3c",
                                        }}>{row.status}</span>
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

        {/* Consultation */}
        {activeNav === "Consultations" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 22, color: "#1a5fa8", margin: 0 }}>Consultations</h2>
                <button onClick={() => setActiveNav("Dashboard")} style={{ background: "none", border: "none", color: "#1a5fa8", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>‹ Back</button>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { label: "Pending",   color: "#e67e22", bg: "#fff4e5", count: consultations.filter(c => c.status === "Pending").length   },
                  { label: "Confirmed", color: "#27ae60", bg: "#e6f9f0", count: consultations.filter(c => c.status === "Confirmed").length },
                  { label: "Denied",    color: "#e74c3c", bg: "#fdecea", count: consultations.filter(c => c.status === "Denied").length    },
                  { label: "Total",     color: "#1a5fa8", bg: "#d6e6f7", count: consultations.length },
                ].map(({ label, color, bg, count }) => (
                  <div key={label} style={{ background: bg, borderRadius: 10, padding: "0.4rem 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontWeight: 700, fontSize: 18, color }}>{count}</span>
                    <span style={{ fontWeight: 600, fontSize: 12, color }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {consultLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading...</div>
            ) : consultations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#aaa", fontSize: 16 }}>No consultations yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {consultations.map(c => (
                  <div key={c.id} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(26,95,168,0.08)", padding: "1.2rem 1.5rem", border: "1px solid #e0e0e0", transition: "box-shadow 0.2s, border-color 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(26,95,168,0.18)"; e.currentTarget.style.borderColor = "#b0c8e8"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,95,168,0.08)"; e.currentTarget.style.borderColor = "#e0e0e0"; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a5fa8" }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{c.email}</div>
                        {c.phone && <div style={{ fontSize: 13, color: "#888", marginTop: 1 }}>📞 {c.phone}</div>}
                        {c.date  && <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>📅 {c.date}</div>}
                        {c.problem && <div style={{ fontSize: 13, color: "#444", marginTop: 6, background: "#f4f8fc", borderRadius: 8, padding: "0.5rem 0.75rem" }}>{c.problem}</div>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 0", borderRadius: 20, width: 80, textAlign: "center", display: "inline-block",
                          background: c.status === "Confirmed" ? "#27ae60" : c.status === "Denied" ? "#e74c3c" : "#fff4e5",
                          color:      c.status === "Confirmed" || c.status === "Denied" ? "#fff" : "#e67e22" }}>
                          {c.status}
                        </span>
                        {c.status === "Pending" && (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={async () => {
                              const obj = new (Parse.Object.extend("Consultation"))();
                              obj.id = c.id; obj.set("status", "Confirmed"); await obj.save();
                              setConsultations(prev => prev.map(x => x.id === c.id ? { ...x, status: "Confirmed" } : x));
                            }} style={{ background: "#27ae60", color: "#fff", border: "none", borderRadius: 7, padding: "5px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", width: 80, textAlign: "center" }}>
                              Confirm
                            </button>
                            <button onClick={async () => {
                              const obj = new (Parse.Object.extend("Consultation"))();
                              obj.id = c.id; obj.set("status", "Denied"); await obj.save();
                              setConsultations(prev => prev.map(x => x.id === c.id ? { ...x, status: "Denied" } : x));
                            }} style={{ background: "#fdecea", color: "#e74c3c", border: "none", borderRadius: 7, padding: "5px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", width: 80, textAlign: "center" }}>
                              Deny
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!["Dashboard", "Patient", "Patient History", "Appointments", "Nurses", "Pharmacists", "Lab & Diagnostics", "Slots", "Reports", "Consultations"].includes(activeNav) && (
          <div style={{ textAlign: "center", marginTop: "5rem", color: "#aaa", fontSize: 22 }}>
            📋 {activeNav} — Coming Soon
          </div>
        )}
      </main>

      {/* Appointment Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className={styles.modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: "#1a5fa8", margin: 0 }}>New Appointment</h3>
              <FiX size={22} style={{ cursor: "pointer", color: "#888" }} onClick={() => { setShowForm(false); setFormError(""); setForm(EMPTY_FORM); }} />
            </div>
            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {formError && <p style={{ color: "#e74c3c", fontSize: 13, margin: 0 }}>{formError}</p>}
              <input
                placeholder="Patient Name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }}
              />
              <input
                placeholder="Age"
                type="number"
                min="0"
                value={form.age}
                onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }}
              />
              <select
                value={form.gender}
                onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", color: form.gender ? "#222" : "#aaa", background: "#fff" }}
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                placeholder="Problem / Reason"
                value={form.reason}
                onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                rows={3}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none", resize: "none" }}
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }}
                />
                <input
                  type="time"
                  value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  style={{ flex: 1, padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }}
                />
              </div>
              <button type="submit" style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 8, padding: "0.75rem", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Lab Request Form */}
      {showAdminLabMobileForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "#fff", borderRadius: "18px 18px 0 0", padding: "1.5rem", width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 -8px 32px rgba(26,95,168,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "#1a5fa8", margin: 0 }}>Submit Lab Request</h3>
              <span onClick={() => { setShowAdminLabMobileForm(false); setShowAdminAddMoreTests(false); }} style={{ cursor: "pointer", fontSize: 22, color: "#888", lineHeight: 1 }}>×</span>
            </div>

            {/* Selected tests summary */}
            <div style={{ background: "#f4f8fc", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1a5fa8" }}>Selected Tests ({adminSelectedTests.length})</div>
                <button
                  onClick={() => setShowAdminAddMoreTests(v => !v)}
                  style={{ width: 24, height: 24, borderRadius: 6, border: "1.5px solid #1a5fa8", background: showAdminAddMoreTests ? "#1a5fa8" : "#fff", color: showAdminAddMoreTests ? "#fff" : "#1a5fa8", fontWeight: 700, fontSize: 18, lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}
                >+</button>
              </div>
              {adminSelectedTests.map(t => (
                <div key={t.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#444", marginBottom: 3 }}>
                  <span>{t.name}</span>
                  <span style={{ fontWeight: 600 }}>₹{t.price.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #d6e6f7", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, color: "#1a5fa8" }}>
                <span>Total</span>
                <span>₹{adminSelectedTests.reduce((s, t) => s + t.price, 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Inline test picker — shown when "+" is tapped */}
            {showAdminAddMoreTests && (
              <div style={{ marginBottom: "1rem", borderRadius: 10, border: "1px solid #d6e6f7", overflow: "hidden" }}>
                {LAB_CATEGORIES.map(cat => (
                  <div key={cat.title}>
                    <div style={{ background: cat.color, padding: "0.4rem 0.8rem", fontWeight: 700, fontSize: 12, color: "#fff" }}>{cat.title}</div>
                    {cat.tests.map(t => {
                      const sel = adminSelectedTests.some(x => x.name === t.name);
                      return (
                        <div key={t.name}
                          onClick={() => { setAdminSelectedTests(prev => sel ? prev.filter(x => x.name !== t.name) : [...prev, t]); setShowAdminAddMoreTests(false); }}
                          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.8rem", background: sel ? cat.light : "#fff", borderTop: "1px solid #f0f4f8", cursor: "pointer" }}>
                          <span style={{ width: 12, height: 12, borderRadius: 3, border: `2px solid ${cat.color}`, background: sel ? cat.color : "transparent", flexShrink: 0, display: "inline-block" }} />
                          <span style={{ flex: 1, fontSize: 13, color: sel ? cat.color : "#333", fontWeight: sel ? 600 : 400 }}>{t.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>₹{t.price.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Name & Phone */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
              <input
                type="text" placeholder="Patient Name"
                value={adminLabName} onChange={e => setAdminLabName(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }}
              />
              <input
                type="tel" placeholder="Phone Number"
                value={adminLabPhone} onChange={e => setAdminLabPhone(e.target.value)}
                style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #d6e6f7", fontSize: 14, outline: "none" }}
              />
            </div>

            {adminLabSuccess && (
              <div style={{ color: "#27ae60", fontWeight: 700, fontSize: 13, marginBottom: "0.75rem" }}>✓ Submitted & Accepted — report generated</div>
            )}

            <button
              onClick={async () => { await handleAdminLabSubmit(); setShowAdminLabMobileForm(false); setShowAdminAddMoreTests(false); }}
              disabled={adminLabSubmitting || !adminLabName.trim() || !adminLabPhone.trim()}
              style={{ width: "100%", background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 10, padding: "0.85rem", fontWeight: 700, fontSize: 15, cursor: adminLabSubmitting ? "not-allowed" : "pointer", opacity: adminLabSubmitting ? 0.7 : 1 }}
            >
              {adminLabSubmitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: "1rem" }}>
          <div className={styles.logoutModal}>
            <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>🚪</div>
            <h3 style={{ fontWeight: 700, fontSize: 20, color: "#1a3a5c", margin: "0 0 0.5rem" }}>Confirm Logout</h3>
            <p style={{ color: "#666", fontSize: 14, margin: "0 0 1.75rem" }}>Are you sure you want to log out?</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, padding: "0.7rem", borderRadius: 10, border: "1.5px solid #d6e6f7", background: "#f4f8fc", color: "#1a5fa8", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={confirmLogout}
                style={{ flex: 1, padding: "0.7rem", borderRadius: 10, border: "none", background: "#e74c3c", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logged Out Success Screen */}
      {loggedOut && (
        <div style={{ position: "fixed", inset: 0, background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4000, flexDirection: "column", padding: "1rem" }}>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: "#1a3a5c", margin: "0 0 1.25rem" }}>Logged Out</h2>
          <div style={{ background: "#a8e6c1", borderRadius: 14, padding: "1.1rem 3rem", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(39,174,96,0.15)", marginBottom: "1.5rem" }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#1a5c35" }}>You have been successfully logged out.</p>
          </div>
          <button onClick={() => router.push("/")}
            style={{ background: "#1a5fa8", color: "#fff", border: "none", borderRadius: 12, padding: "0.85rem 2.5rem", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 16px rgba(26,95,168,0.2)" }}>
            ← Back to Main Menu
          </button>
        </div>
      )}
    </div>
  );
}
