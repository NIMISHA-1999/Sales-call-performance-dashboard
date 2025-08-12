import React from "react";

export default function HeaderSection() {
  return (
    <header className="dashboard-header">
      <div className="logo">
        <img src="/images/scalex-logo.png" alt="Scalex Logo" />
        <span>Dashboard Pro</span>
      </div>
      <div className="user-info">
        <span className="notification">🔔</span>
        <span className="user-name">Antonio John</span>
      </div>
    </header>
  );
}
