"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/routes-history")
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 40 }}>Loading history...</p>;

  if (!routes.length)
    return <p style={{ padding: 40 }}>No route history found.</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>🕘 Route History</h2>

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>AQI Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r._id}>
              <td>{r.from}</td>
              <td>{r.to}</td>
              <td>{r.aqiScore ?? "—"}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
