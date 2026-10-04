import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BedDouble, ClipboardList, Utensils,
  LogOut, RefreshCw, Pencil, Trash2, Plus
} from "lucide-react";
import api from "../Services/api";
import {
  getRooms, addRoom, updateRoom, deleteRoom
} from "../Services/roomService";
import {
  getEnquiries, updateEnquiryStatus, deleteEnquiry
} from "../Services/enquiryService";
import {
  getFoodTrials, updateFoodTrialStatus, deleteFoodTrial
} from "../Services/foodTrialService";

const blankRoom = {
  roomNo: "",
  roomType: "Single Sharing",
  capacity: 1,
  availableBeds: 1,
  rent: "",
  facilities: "",
  imageUrl: "",
  available: true
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [rooms, setRooms] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [trials, setTrials] = useState([]);
  const [form, setForm] = useState(blankRoom);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const logout = async () => {
    try {
      await api.post("/admin/logout");
    } catch {
      // Clear the local session even if the backend is unavailable.
    }
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    navigate("/admin-login", { replace: true });
  };


const loadData = async () => {
  if (!sessionStorage.getItem("adminToken")) {
    navigate("/admin-login", { replace: true });
    return;
  }

  setLoading(true);
  setError("");

  try {
    const results = await Promise.allSettled([
      getRooms(),
      getEnquiries(),
      getFoodTrials()
    ]);

    const [roomsResult, enquiriesResult, trialsResult] = results;

    // Check for expired or invalid admin login
    if (
      results.some(
        result =>
          result.status === "rejected" &&
          result.reason?.response?.status === 401
      )
    ) {
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUsername");
      navigate("/admin-login", { replace: true });
      return;
    }

    // Load rooms (getRooms returns data directly)
    if (roomsResult.status === "fulfilled") {
      const data = roomsResult.value;
      setRooms(
        Array.isArray(data) ? data :
        Array.isArray(data?.data) ? data.data : []
      );
    } else {
      console.error("Rooms API error:", roomsResult.reason);
      setRooms([]);
    }

    // Load enquiries
    if (enquiriesResult.status === "fulfilled") {
      const data = enquiriesResult.value;
      setEnquiries(
        Array.isArray(data) ? data :
        Array.isArray(data?.data) ? data.data : []
      );
    } else {
      console.error("Enquiries API error:", enquiriesResult.reason);
      setEnquiries([]);
    }

    // Load food trials
    if (trialsResult.status === "fulfilled") {
      const data = trialsResult.value;
      setTrials(
        Array.isArray(data) ? data :
        Array.isArray(data?.data) ? data.data : []
      );
    } else {
      console.error("Food Trials API error:", trialsResult.reason);
      setTrials([]);
    }

    if (results.some(result => result.status === "rejected")) {
      setError("Some dashboard data could not be loaded. Check the console.");
    }

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  const saveRoom = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      availableBeds: Number(form.availableBeds),
      rent: Number(form.rent)
    };

    if (
      payload.capacity < 1 ||
      payload.availableBeds < 0 ||
      payload.availableBeds > payload.capacity ||
      payload.rent <= 0
    ) {
      setError("Check the room capacity, available beds and rent.");
      return;
    }

    try {
      if (editingId) {
        await updateRoom(editingId, payload);
        setNotice("Room updated successfully.");
      } else {
        await addRoom(payload);
        setNotice("Room added successfully.");
      }

      setForm(blankRoom);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save room.");
    }
  };

  const editRoom = (room) => {
    setEditingId(room.id);
    setForm({
      roomNo: room.roomNo,
      roomType: room.roomType,
      capacity: room.capacity,
      availableBeds: room.availableBeds,
      rent: room.rent,
      facilities: room.facilities || "",
      imageUrl: room.imageUrl || "",
      available: room.available
    });
    setTab("rooms");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await deleteRoom(id);
      setNotice("Room deleted successfully.");
      await loadData();
    } catch {
      setError("Unable to delete room.");
    }
  };

  const changeEnquiry = async (id, status) => {
    try {
      await updateEnquiryStatus(id, status);
      setNotice("Enquiry status updated.");
      await loadData();
    } catch {
      setError("Unable to update enquiry.");
    }
  };

  const removeEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;

    try {
      await deleteEnquiry(id);
      await loadData();
    } catch {
      setError("Unable to delete enquiry.");
    }
  };

 const changeTrial = async (id, status) => {
try {
await updateFoodTrialStatus(id, status);
setNotice("Food trial status updated.");
setError("");
await loadData();
} catch (err) {
console.error("Food trial update error:", err.response?.data || err);
setError(
err.response?.data?.message ||
err.response?.data ||
"Unable to update food trial."
);
}
};


  const removeTrial = async (id) => {
    if (!window.confirm("Delete this food trial request?")) return;

    try {
      await deleteFoodTrial(id);
      await loadData();
    } catch {
      setError("Unable to delete food trial.");
    }
  };

  const tabs = [
    ["overview", "Overview", <LayoutDashboard size={18} />],
    ["rooms", "Manage Rooms", <BedDouble size={18} />],
    ["enquiries", "Enquiries", <ClipboardList size={18} />],
    ["trials", "Food Trials", <Utensils size={18} />]
  ];

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">StayNest <span>Admin</span></div>

        <div className="admin-user">
          <div className="admin-avatar">A</div>
          <div>
            <strong>{sessionStorage.getItem("adminUsername") || "Admin"}</strong>
            <small>Administrator</small>
          </div>
        </div>

        <nav className="admin-nav">
          {tabs.map(([id, label, icon]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => {
                setTab(id);
                setError("");
                setNotice("");
              }}
            >
              {icon} {label}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">CONTROL PANEL</span>
            <h1>{tabs.find(([id]) => id === tab)?.[1]}</h1>
          </div>
          <button className="btn btn-outline" onClick={loadData}>
            <RefreshCw size={17} /> Refresh
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {notice && <div className="notice">{notice}</div>}
        {loading && <p>Loading data...</p>}

        {tab === "overview" && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <BedDouble />
                <span>Total Rooms</span>
                <strong>{rooms.length}</strong>
              </div>
              <div className="stat-card">
                <BedDouble />
                <span>Available Beds</span>
                <strong>{rooms.reduce(
      (total, room) => total + (Number(room.availableBeds) || 0),
      0
    )}</strong> 
              </div>
              <div className="stat-card">
                <ClipboardList />
                <span>Enquiries</span>
                <strong>{(enquiries || []).length}</strong>
              </div>
              <div className="stat-card">
                <Utensils />
                <span>Food Trials</span>
                <strong>{trials.length}</strong>
              </div>
            </div>

            <div className="dashboard-panel">
              <h2>Recent Enquiries</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Room</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.slice(0, 5).map(e => (
                      <tr key={e.id}>
                        <td>{e.name}</td>
                        <td>{e.phone}</td>
                        <td>{e.preferredRoom || "Any"}</td>
                        <td><span className="status-pill">{e.status}</span></td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr><td colSpan="4">No enquiries yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "rooms" && (
          <>
            <div className="dashboard-panel">
              <h2>{editingId ? "Edit Room" : "Add New Room"}</h2>

              <form className="form-grid" onSubmit={saveRoom}>
                <label>
                  Room Number
                  <input
                    value={form.roomNo}
                    onChange={e => setForm({ ...form, roomNo: e.target.value })}
                    required
                    maxLength={20}
                  />
                </label>

                <label>
                  Room Type
                  <select
                    value={form.roomType}
                    onChange={e => setForm({ ...form, roomType: e.target.value })}
                  >
                    <option>Single Sharing</option>
                    <option>Double Sharing</option>
                    <option>Triple Sharing</option>
                    <option>Four Sharing</option>
                  </select>
                </label>

                <label>
                  Capacity
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Available Beds
                  <input
                    type="number"
                    min="0"
                    value={form.availableBeds}
                    onChange={e => setForm({ ...form, availableBeds: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Monthly Rent (₹)
                  <input
                    type="number"
                    min="1"
                    value={form.rent}
                    onChange={e => setForm({ ...form, rent: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Image URL
                  <input
                    value={form.imageUrl}
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </label>

                <label className="full-field">
                  Facilities
                  <textarea
                    rows="2"
                    value={form.facilities}
                    onChange={e => setForm({ ...form, facilities: e.target.value })}
                  />
                </label>

                <label className="checkbox-label full-field">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={e => setForm({ ...form, available: e.target.checked })}
                  />
                  Room available
                </label>

                <div className="full-field form-actions">
                  <button className="btn btn-primary">
                    <Plus size={17} />
                    {editingId ? "Update Room" : "Add Room"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditingId(null);
                        setForm(blankRoom);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="dashboard-panel">
              <h2>All Rooms</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Type</th>
                      <th>Rent</th>
                      <th>Beds</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(r => (
                      <tr key={r.id}>
                        <td>{r.roomNo}</td>
                        <td>{r.roomType}</td>
                        <td>₹{Number(r.rent).toLocaleString("en-IN")}</td>
                        <td>{r.availableBeds}/{r.capacity}</td>
                        <td>{r.available ? "Yes" : "No"}</td>
                        <td className="action-cell">
                          <button className="icon-button" onClick={() => editRoom(r)} aria-label="Edit room">
                            <Pencil size={17} />
                          </button>
                          <button className="icon-button danger" onClick={() => removeRoom(r.id)} aria-label="Delete room">
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {rooms.length === 0 && (
                      <tr><td colSpan="6">No rooms found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "enquiries" && (
          <div className="dashboard-panel">
            <h2>Manage Enquiries</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Profession</th>
                    <th>Room</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(e => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.phone}<br />{e.email}</td>
                      <td>{e.profession}</td>
                      <td>{e.preferredRoom}</td>
                      <td>{e.message}</td>
                      <td>
                        <select
                          value={e.status}
                          onChange={event => changeEnquiry(e.id, event.target.value)}
                        >
                          {["PENDING", "CONTACTED", "APPROVED", "REJECTED"].map(s => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="icon-button danger"
                          onClick={() => removeEnquiry(e.id)}
                          aria-label="Delete enquiry"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {enquiries.length === 0 && (
                    <tr><td colSpan="7">No enquiries found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "trials" && (
          <div className="dashboard-panel">
            <h2>Manage Food Trials</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Preference</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trials.map(t => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.phone}<br />{t.email}</td>
                      <td>{t.foodPreference}</td>
                      <td>{t.address}</td>
                      <td>{t.trialDate}</td>
                      <td>
                        <select
                          value={t.status}
                          onChange={event => changeTrial(t.id, event.target.value)}
                        >
                          {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(s => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="icon-button danger"
                          onClick={() => removeTrial(t.id)}
                          aria-label="Delete food trial"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {trials.length === 0 && (
                    <tr><td colSpan="7">No food trials found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}