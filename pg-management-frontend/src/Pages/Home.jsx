import { Link } from "react-router-dom";
import {
  ArrowRight, MapPin, BedDouble, Wifi, Utensils,
  ShieldCheck, ClipboardList, Coffee, CheckCircle
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <MapPin />,
      title: "Find Nearby PG",
      description: "Explore nearby food partners and accommodation information.",
      link: "/nearby"
    },
    {
      icon: <BedDouble />,
      title: "Comfortable Rooms",
      description: "Explore room types, prices and availability.",
      link: "/rooms"
    },
    {
      icon: <ShieldCheck />,
      title: "Modern Facilities",
      description: "View the amenities provided for comfortable living.",
      link: "/facilities"
    },
    {
      icon: <ClipboardList />,
      title: "Easy Enquiry",
      description: "Submit your requirements and get contacted by the admin.",
      link: "/enquiry"
    }
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">YOUR COMFORT, OUR PRIORITY</span>

          <h1>
            Find Your Perfect <span>PG Stay</span>
          </h1>

          <p>
            Discover comfortable rooms, explore facilities,
            enquire about accommodation and experience our
            food before making your final decision.
          </p>

          <div className="hero-actions">
            <Link to="/rooms" className="btn btn-primary">
              Explore Rooms <ArrowRight size={17} />
            </Link>

            <Link to="/enquiry" className="btn btn-outline">
              Make an Enquiry
            </Link>
          </div>

          <div className="hero-points">
            <span><CheckCircle size={16} /> Comfortable rooms</span>
            <span><CheckCircle size={16} /> Food trial</span>
            <span><CheckCircle size={16} /> Easy enquiry</span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000"
            alt="Comfortable accommodation room"
          />

          <div className="hero-badge">
            <BedDouble size={27} />
            <div>
              <strong>Your home away from home</strong>
              <small>Explore your next stay</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">OUR SERVICES</span>
          <h2>Everything You Need in One Place</h2>
          <p>Explore accommodation and food trial services.</p>
        </div>

        <div className="feature-grid">
          {features.map((item) => (
            <article className="feature-card" key={item.title}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link to={item.link} className="text-link">
                Explore <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="food-banner">
        <div>
          <span className="eyebrow">OUR SPECIAL FEATURE</span>
          <h2>Try the Food Before You Join</h2>
          <p>
            Happy with the room and facilities, but unsure about the food?
            Request a food trial and experience the menu before deciding.
          </p>
          <Link to="/food-trial" className="btn btn-light">
            Book a Food Trial <ArrowRight size={16} />
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900"
          alt="Prepared food"
        />
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>Simple Steps to Your New Stay</h2>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <span>01</span>
            <MapPin size={27} />
            <h3>Explore</h3>
            <p>View rooms, amenities and nearby options.</p>
          </article>

          <article className="step-card">
            <span>02</span>
            <ClipboardList size={27} />
            <h3>Enquire</h3>
            <p>Send your contact details and room preferences.</p>
          </article>

          <article className="step-card">
            <span>03</span>
            <Coffee size={27} />
            <h3>Try Food</h3>
            <p>Request a food trial to evaluate the menu.</p>
          </article>

          <article className="step-card">
            <span>04</span>
            <CheckCircle size={27} />
            <h3>Decide</h3>
            <p>Review the information and decide whether to join.</p>
          </article>
        </div>
      </section>
    </>
  );
}
