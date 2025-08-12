import React from "react";
import "./dashboard.css";

import HeaderSection from "./HeaderSection";
import DashboardSummary from "./DashboardSummary";
import AgentPerformanceSection from "./AgentPerformanceSection";
import FooterSection from "./FooterSection";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <HeaderSection />
      <DashboardSummary />
      <AgentPerformanceSection />
      <FooterSection />
    </div>
  );
}
