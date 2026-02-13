"use client";

import { useEffect, useState } from "react";
import "./accordion.css";

export default function UsersAccordion() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setUsers((prev) => prev.filter((u) => u._id !== id));
      setOpen(null);
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="accordion">
      {users.map((u, i) => (
        <div key={u._id} className="accordion-item">
          <button
            className={`accordion-button ${open === i ? "active" : ""}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{u.email}</span>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteUser(u._id);
              }}
              disabled={loadingId === u._id}
            >
              {loadingId === u._id ? "Deleting…" : "Delete"}
            </button>
          </button>

          {open === i && (
            <div className="accordion-content">
              <pre>{JSON.stringify(u, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
