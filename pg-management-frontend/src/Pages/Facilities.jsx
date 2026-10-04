import {
  Wifi, Utensils, ShieldCheck, Droplets,
  WashingMachine, Camera, BedDouble, Zap
} from "lucide-react";

export default function Facilities() {
  const facilities = [
    { icon: <Wifi />, name: "High-Speed Wi-Fi", detail: "Internet access for work, study and entertainment." },
    { icon: <Utensils />, name: "Food Facility", detail: "Food options and food trial requests." },
    { icon: <ShieldCheck />, name: "Security", detail: "A security-focused living environment." },
    { icon: <Droplets />, name: "Drinking Water", detail: "Drinking water facility." },
    { icon: <WashingMachine />, name: "Laundry", detail: "Laundry facility for residents." },
    { icon: <Camera />, name: "CCTV", detail: "Security monitoring in designated common areas." },
    { icon: <BedDouble />, name: "Furnished Rooms", detail: "Comfortable furnished accommodation." },
    { icon: <Zap />, name: "Power Backup", detail: "Power backup facility where available." }
  ];

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">PG AMENITIES</span>
        <h1>Facilities We Offer</h1>
        <p>Explore the facilities available for residents. Confirm the specific facilities with the PG admin.</p>
      </div>

      <div className="feature-grid">
        {facilities.map((item) => (
          <article className="facility-card" key={item.name}>
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.name}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}