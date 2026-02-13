"use client";

import { useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;

    setMessages((m) => [...m, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/fact-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "assistant", text: data.answer },
    ]);

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.msg,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#2563eb" : "#e5e7eb",
              color: m.role === "user" ? "#fff" : "#000",
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && <div style={styles.loading}>Checking facts…</div>}
      </div>

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a fact…"
          onKeyDown={(e) => e.key === "Enter" && send()}
          style={styles.input}
        />
        <button onClick={send} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
  },
  chat: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
  },
  msg: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 10,
    whiteSpace: "pre-wrap",
    fontSize: 14,
  },
  loading: {
    fontSize: 13,
    color: "#94a3b8",
  },
  inputBox: {
    display: "flex",
    padding: 12,
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  button: {
    marginLeft: 8,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
};
