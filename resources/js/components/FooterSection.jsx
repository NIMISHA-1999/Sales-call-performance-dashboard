import React from "react";
import "./footer.css"; // create this CSS file for styling

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <img src="/images/scalex-logo.png" alt="scalex logo" className="footer-logo" />
        <span>Powered by scalex</span>
      </div>
      <div className="footer-center">
        © 2025 scalex IT Solutions. All Rights Reserved.
      </div>
      <div className="footer-right">
        <a href="/privacy">Privacy</a> | <a href="/terms">Terms & Conditions</a>
      </div>
    </footer>
  );
}
