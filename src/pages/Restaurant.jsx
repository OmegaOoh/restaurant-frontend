import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    async function init() {
      try {
        // Fetch user data
        const me = await api.get("/api/auth/me");
        setUser(me.data);

        // Fetch restaurant data
        const res = await api.get("/api/restaurants");
        setRestaurants(res.data.content);
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
      <h1>Restaurant List</h1>
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
      <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>
        Logout
      </button>
      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: "1rem", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#aaa" }}>
            <th>Name</th>
            <th>Rating</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r, idx) => (
            <tr key={idx}>
              <td>{r.name}</td>
              <td>{r.rating}</td>
              <td>{r.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
