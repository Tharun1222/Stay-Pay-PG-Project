import { useState } from "react";
import { Utensils } from "lucide-react";
import { submitFoodTrial } from "../Services/foodTrialService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  foodPreference: "Vegetarian",
  address: "",
  trialDate: ""
};

export default function FoodTrial() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setLoading(true);
      await submitFoodTrial(form);
      setSuccess("Food trial request submitted. Please wait for confirmation.");
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit food trial request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">A UNIQUE PG EXPERIENCE</span>
        <h1>Food Trial</h1>
        <p>Try the food before deciding to join the PG.</p>
      </div>

      <div className="food-trial-layout">
        <div className="food-trial-image">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900"
            alt="Freshly prepared meal"
          />
          <h2>Experience the Menu</h2>
          <p>
            Submit a trial request with your preferred date and address.
            The admin will review and confirm the available trial arrangements.
          </p>
        </div>

        <div className="form-card">
          <div className="form-title">
            <Utensils size={25} />
            <h2>Book Your Food Trial</h2>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="notice">{success}</div>}

          <form className="form-grid single-column" onSubmit={submit}>
            <label>
              Full Name
              <input name="name" value={form.name} onChange={change} required maxLength={100} />
            </label>

            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={change} required maxLength={150} />
            </label>

            <label>
              Phone Number
              <input name="phone" type="tel" value={form.phone} onChange={change} required maxLength={10} />
            </label>

            <label>
              Food Preference
              <select name="foodPreference" value={form.foodPreference} onChange={change}>
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Vegan</option>
              </select>
            </label>

            <label>
              Trial Date
              <input
                type="date"
                name="trialDate"
                value={form.trialDate}
                onChange={change}
                min={new Date().toLocaleDateString("en-CA")}
                required
              />
            </label>

            <label>
              Delivery / Trial Address
              <textarea name="address" rows="3" value={form.address} onChange={change} required maxLength={500} />
            </label>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Request Food Trial"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}