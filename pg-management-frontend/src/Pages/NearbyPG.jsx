
import { useState } from "react";
import { MapPin, Navigation, Phone } from "lucide-react";
import { getNearbyFranchises } from "../Services/franchiseService";

export default function NearbyPG() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const detectLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(String(coords.latitude));
        setLongitude(String(coords.longitude));
      },
      () => {
        setError("Location permission denied or location unavailable.");
      }
    );
  };

  const search = async (e) => {
    e.preventDefault();
    setError("");
    setPlaces([]);

    if (
      !latitude ||
      !longitude ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      Math.abs(Number(latitude)) > 90 ||
      Math.abs(Number(longitude)) > 180
    ) {
      setError("Enter valid latitude and longitude.");
      return;
    }

    try {
      setLoading(true);

      const response = await getNearbyFranchises(
        Number(latitude),
        Number(longitude)
      );

      setPlaces(Array.isArray(response.data) ? response.data : []);
    } 
catch (err) {
  console.log("Status:", err.response?.status);
  console.log("Response data:", JSON.stringify(err.response?.data, null, 2));
  console.log("Request URL:", err.config?.url);
  console.log("Request params:", err.config?.params);

  setError(
    err.response?.data?.message ||
    (typeof err.response?.data === "string"
      ? err.response.data
      : "Unable to find nearby food franchises.")
  );
} finally {
  setLoading(false);
}
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">EXPLORE YOUR AREA</span>
        <h1>Find Nearby Food Partners</h1>
        <p>
          Locate nearby PG food franchises based on your location.
        </p>
      </div>

      <form className="location-form" onSubmit={search}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={detectLocation}
        >
          <Navigation size={17} /> Detect Location
        </button>

        <label>
          Latitude
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </label>

        <label>
          Longitude
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Nearby"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {!loading && places.length === 0 && !error && (
        <div className="center-message">
          Use your location to find nearby food partners.
        </div>
      )}

      <div className="feature-grid">
        {places.map((place) => (
          <article className="facility-card" key={place.id}>
            <div className="feature-icon">
              <MapPin />
            </div>
            <h3>{place.name}</h3>
            <p>{place.address}</p>
            <p>
              <strong>{place.distanceKm} km away</strong>
            </p>
            <p>{place.foodType}</p>
            <p>
              <Phone size={15} /> {place.phone}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}