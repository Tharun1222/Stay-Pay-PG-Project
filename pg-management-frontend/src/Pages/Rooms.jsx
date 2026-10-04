
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Users,
  IndianRupee,
  RefreshCw,
  Wifi,
  Search,
} from "lucide-react";
import { getRooms } from "../Services/roomService";
import "./Rooms.css";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

const loadRooms = async () => {
  setLoading(true);
  setError("");

  try {
    const data = await getRooms(true);

    console.log("Rooms data:", data);

    if (!Array.isArray(data)) {
      throw new Error("API response is not an array");
    }

    setRooms(data);
  } catch (err) {
    console.error("Error loading rooms:", err);
    setError(err.message || "Unable to load rooms.");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    loadRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const query = search.toLowerCase();
    return (
      String(room.roomNo ?? "").toLowerCase().includes(query) ||
      String(room.roomType ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="rooms-page">
      <section className="rooms-hero">
        <div className="rooms-hero-content">
          <span className="rooms-tag">STAY NEST</span>
          <h1>Find Your Perfect Room</h1>
          <p>
            Comfortable living, modern facilities, and a place to feel at home.
          </p>
        </div>
      </section>

      <section className="rooms-container">
        <div className="rooms-heading">
          <div>
            <h2>Available PG Rooms</h2>
            <p>Explore rooms and choose one that suits your needs.</p>
          </div>

          <button
            className="refresh-btn"
            onClick={loadRooms}
            disabled={loading}
            type="button"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="rooms-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search by room number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <div className="rooms-message">
            <p>Loading rooms...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rooms-error">
            <p>{error}</p>
            <button onClick={loadRooms} type="button">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredRooms.length === 0 && (
          <div className="rooms-message">
            <BedDouble size={40} />
            <h3>No rooms found</h3>
            <p>
              {rooms.length === 0
                ? "No rooms have been added yet."
                : "Try another room number or room type."}
            </p>
          </div>
        )}

        {!loading && !error && filteredRooms.length > 0 && (
          <div className="rooms-grid">
            {filteredRooms.map((room) => (
              <article className="room-card" key={room.id}>
                <div className="room-image">
                  {room.imageUrl ? (
                    <img src={room.imageUrl} alt={`Room ${room.roomNo}`} />
                  ) : (
                    <div className="room-image-placeholder">
                      <BedDouble size={54} />
                      <span>Stay Nest</span>
                    </div>
                  )}

                  <span
                    className={`room-status ${
                      room.available && room.availableBeds > 0
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    {room.available && room.availableBeds > 0
                      ? "Available"
                      : "Not Available"}
                  </span>
                </div>

                <div className="room-card-content">
                  <div className="room-title">
                    <div>
                      <h3>{room.roomType}</h3>
                      <p>Room No: {room.roomNo}</p>
                    </div>
                  </div>

                  <div className="room-info">
                    <div>
                      <Users size={18} />
                      <span>{room.capacity} Person(s)</span>
                    </div>
                    <div>
                      <BedDouble size={18} />
                      <span>{room.availableBeds} Beds Available</span>
                    </div>
                  </div>

                  <div className="room-facilities">
                    <h4>Facilities</h4>
                    <p>
                      {room.facilities || "Facilities details not provided"}
                    </p>
                  </div>

                  <div className="room-card-footer">
                    <div className="room-rent">
                      <span>Monthly Rent</span>
                      <strong>
                        <IndianRupee size={18} />
                        {Number(room.rent).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    {room.available && room.availableBeds > 0 ? (
                      <Link
                        to={`/enquiry?roomId=${room.id}`}
                        className="enquire-btn"
                      >
                        Enquire Now
                      </Link>
                    ) : (
                      <button className="enquire-btn disabled" disabled>
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
