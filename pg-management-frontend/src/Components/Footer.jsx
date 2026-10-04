import { Link } from "react-router-dom";
import { House, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h2><House size={23} /> Stay&Pay</h2>
          <p>
            Find comfortable PG accommodation, explore facilities,
            enquire about rooms and try our food before you join.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/facilities">Facilities</Link>
          <Link to="/enquiry">Enquiry</Link>
          <Link to="/food-trial">Food Trial</Link>
        </div>

        <div>
          <h3>Contact</h3>
          <p><MapPin size={15} /> HeadOffice, Chennai, Tamil Nadu</p>
          <p><Phone size={15} /> Contact through enquiry</p>
          <p><Mail size={15} /> support@stay&paysample.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Stay&Pay PG Management. All rights reserved.
      </div>
    </footer>
  );
}