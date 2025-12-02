import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function New() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Form data
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState("");

  function handleSubmit() {
    // Check validity of values
    setLoading(true);
    if (!name || !rating || !location) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5");
      setLoading(false);
      return;
    }

    // Submit form data
    api
      .post("/api/restaurants", { name, rating, location })
      .then(() => {
        alert("Restaurant created successfully");
        navigate("/restaurant");
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to create restaurant");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getRole(role_str) {
    switch (role_str) {
      case "ROLE_ADMIN":
        return "Admin";
      case "ROLE_USER":
        return "User";
      default:
        return "Unknown";
    }
  }

  function getButtons(role) {
    let components = [
      <button key="logout" onClick={handleLogout}>
        Logout
      </button>,
    ];
    if (role === "ROLE_ADMIN") {
      components.push(
        <button key="restaurant" onClick={() => navigate("/restaurant")}>
          Back to Restaurants
        </button>,
      );
    }
    return components;
  }

  useEffect(() => {
    async function init() {
      try {
        // Fetch user data
        const me = await api.get("/api/auth/me");

        if (me.data.role != "ROLE_ADMIN") {
          navigate("/restaurant"); // User is not an admin, redirect to restaurant page
        }
        setUser(me.data);
      } catch (error) {
        console.error(error);
        navigate("/login"); // if not authenticated, go to login
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [navigate]);

  async function handleLogout() {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error(error);
    }
    navigate("/login");
  }
  
  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>New Restaurant</h1>
      <p>
        Welcome, <strong>{user.username}</strong>
      </p>
      <p
        style={{
          fontSize: "0.75rem",
          width: "fit-content",
          padding: "5px 20px",
          borderRadius: "9999px",
          textTransform: "uppercase",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
      >
        {getRole(user.role)}
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexFlow: "row wrap",
          maxWidth: "80vw",
        }}
      >
        {getButtons(user.role)}
      </div>
      <form>
        <p>
          Name <span style={{ color: "red" }}>*</span>:
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter restaurant name"
          required
        />
        <p>
          Rating <span style={{ color: "red" }}>*</span>:
        </p>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Enter rating"
          min="1"
          max="5"
          required
        />
        <p>
          Location <span style={{ color: "red" }}>*</span>:
        </p>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </form>
      <button
        style={{ margin: "1rem 0" }}
        onClick={() => handleSubmit()}
        disabled={loading}
      >
        Submit
      </button>
    </div>
  );
}
