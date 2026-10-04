import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { submitEnquiry } from "../Services/enquiryService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  profession: "Student",
  preferredRoom: "",
  message: ""
};

export default function Enquiry() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setLoading(true);
      await submitEnquiry(form);
      setSuccess("Your enquiry has been submitted successfully. The admin will contact you.");
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit your enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">GET IN TOUCH</span>
        <h1>PG Enquiry</h1>
        <p>Share your requirements to learn more about available accommodation.</p>
      </div>

      <div className="form-card">
        <div className="form-title">
          <ClipboardList size={25} />
          <h2>Enquiry Details</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="notice">{success}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Full Name
            <input name="name" value={form.name} onChange={handleChange} required maxLength={100} />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required maxLength={150} />
          </label>

          <label>
            Phone Number
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required maxLength={10} />
          </label>

          <label>
            Profession
            <select name="profession" value={form.profession} onChange={handleChange}>
              <option>Student</option>
              <option>Working Professional</option>
            </select>
          </label>

          <label className="full-field">
            Preferred Room
            <select name="preferredRoom" value={form.preferredRoom} onChange={handleChange} required>
              <option value="">Select room type</option>
              <option>Single Sharing</option>
              <option>Double Sharing</option>
              <option>Triple Sharing</option>
              <option>Any Available Room</option>
            </select>
          </label>

          <label className="full-field">
            Message
            <textarea name="message" value={form.message} onChange={handleChange} rows="4" maxLength={1000} placeholder="Tell us about your requirements" />
          </label>

          <div className="full-field">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}