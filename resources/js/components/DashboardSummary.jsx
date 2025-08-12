import React, { useState, useEffect } from "react";
import "./dashboard.css";

export default function DashboardSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary("today"); // default to "today" on page load
  }, []);

  const fetchSummary = (filter) => {
    fetch(`http://127.0.0.1:8000/dashboard-summary?filter=${filter}`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error("Error fetching summary:", err));
  };

  if (!summary) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* Page Title */}
      <section className="agent-performance">
        <h2>Sales Call Performance Dashboard</h2>
        <p>Track daily team call metrics & view performance reports.</p>
        <p>
          Company: <a href="#">All Teams</a>
        </p>
        <div className="filter-buttons">
          <button onClick={() => fetchSummary("today")}>Today</button>
          <button onClick={() => fetchSummary("yesterday")}>Yesterday</button>
          <button onClick={() => fetchSummary("this_week")}>This Week</button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="dashboard-cards">
        <div className="card blue">
          <h3>Total Sales</h3>
          <p className="value">{summary.total_sales}</p>
          <span>Successful calls converted to sales</span>
        </div>
        <div className="card yellow">
          <h3>Total Talking Time</h3>
          <p className="value">{summary.total_talk_time} hrs</p>
          <span>Total combined talk time</span>
        </div>
        <div className="card green">
          <h3>Total Dialling</h3>
          <p className="value">{summary.total_calls}</p>
          <span>Number of calls handled</span>
        </div>
        <div className="card red">
          <h3>Top Connected</h3>
          <p className="value highlight">
            {summary.top_connected
              ? `${summary.top_connected.agent} (${summary.top_connected.total})`
              : "N/A"}
          </p>
        </div>
        <div className="card purple">
          <h3>Answered Calls</h3>
          <p className="value">{summary.answered_calls}</p>
        </div>
        <div className="card blue">
          <h3>Unanswered Calls</h3>
          <p className="value">{summary.unanswered_calls}</p>
        </div>
        <div className="card violet">
          <h3>Call Answer Rate (%)</h3>
          <p className="value">{summary.answer_rate}%</p>
        </div>
        <div className="card green">
          <h3>Top Sales</h3>
          <p className="value highlight">
            {summary.top_sales
              ? `${summary.top_sales.agent} (${summary.top_sales.total})`
              : "N/A"}
          </p>
        </div>
      </section>
    </>
  );
}
