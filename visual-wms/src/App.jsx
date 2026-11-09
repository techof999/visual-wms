import { useState } from "react";
import {
  LayoutDashboard,
  ScanLine,
  Package,
  Warehouse,
  History,
  Bell,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  AlertTriangle,
} from "lucide-react";

import "./styles/global.css";
import WarehousePage from "./pages/Warehouse";


function App() {
  const [activePage, setActivePage] = useState("Warehouse");
  console.log("Current Page:", activePage);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Receiving", icon: ScanLine },
    { name: "Inventory", icon: Package },
    { name: "Warehouse", icon: Warehouse },
    { name: "Traceability", icon: History },
  ];
  
  const pageInfo = {
    Receiving: {
      title: "Material Receiving",
      eyebrow: "INBOUND OPERATIONS",
      description: "Manage incoming materials and put-away operations.",
    },
    Inventory: {
      title: "Inventory Control",
      eyebrow: "STOCK MANAGEMENT",
      description: "Monitor material quantities and stock balances.",
    },
    Warehouse: {
      title: "Warehouse Visualization",
      eyebrow: "WAREHOUSE MANAGEMENT",
      description: "View warehouse zones, racks, shelves and locations.",
    },
    Traceability: {
      title: "Material Traceability",
      eyebrow: "MOVEMENT HISTORY",
      description: "Track material movements and transaction history.",
    },
  };
if (activePage === "Warehouse") {
  return <WarehousePage onBack={() => setActivePage("Dashboard")} />;
}

  if (activePage !== "Dashboard") {
    const page = pageInfo[activePage];

    return (
      <div className="app-container">
        <header className="header">
          <div className="brand">
            <div className="brand-mark">W</div>
            <div>
              <h1>VISUAL WMS</h1>
              <p>WAREHOUSE MANAGEMENT SYSTEM</p>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">{page.eyebrow}</p>
              <h2>{page.title}</h2>
              <p className="subtitle">{page.description}</p>
            </div>
          </div>

          <section className="section">
            <div className="activity-card">
              <div className="activity-info">
                <strong>{page.title}</strong>
                <p>This module is under development.</p>
              </div>
            </div>
          </section>

          <button
            className="action-card"
            onClick={() => setActivePage("Dashboard")}
          >
            Back to Dashboard
          </button>
        </main>

        <nav className="bottom-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => {
  console.log("Clicked:", item.name);
  setActivePage(item.name);
}}
              >
                <Icon size={21} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }


  return (
    <div className="app-container">

      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-mark">W</div>
          <div>
            <h1>VISUAL WMS</h1>
            <p>WAREHOUSE MANAGEMENT SYSTEM</p>
          </div>
        </div>

        <button className="notification-button">
          <Bell size={21} />
          <span className="notification-dot"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">

        <div className="page-heading">
          <div>
            <p className="eyebrow">WAREHOUSE OPERATIONS</p>
            <h2>Operations Overview</h2>
            <p className="subtitle">Material management and visibility</p>
          </div>
        </div>

        {/* Search */}
        <div className="search-box">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search Part No. / Material..."
          />
        </div>

        {/* KPI Cards */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <span>Total Materials</span>
            <strong>1,280</strong>
            <small>Registered items</small>
          </div>

          <div className="kpi-card">
            <span>Storage Locations</span>
            <strong>156</strong>
            <small>Registered locations</small>
          </div>

          <div className="kpi-card">
            <span>Receiving Today</span>
            <strong>42</strong>
            <small>Transactions</small>
          </div>

          <div className="kpi-card">
            <span>Abnormalities</span>
            <strong className="alert-number">03</strong>
            <small>Require attention</small>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="section">
          <div className="section-heading">
            <h3>Operations</h3>
            <span>Quick Access</span>
          </div>

          <div className="action-grid">
        <button
  className="action-card"
  onClick={() => setActivePage("Receiving")}
>
  <ArrowDownToLine />
  <span>Receiving</span>
</button>
            <button className="action-card">
              <ArrowUpFromLine />
              <span>Issuing</span>
            </button>

            <button className="action-card">
              <ArrowLeftRight />
              <span>Stock Transfer</span>
            </button>

        <button
  className="action-card"
  onClick={() => setActivePage("Warehouse")}
>
  <Warehouse />
  <span>Warehouse 3D</span>
</button>
          </div>
        </section>

        {/* Andon */}
        <section className="andon-card">
          <div className="andon-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h3>Andon Alert</h3>
            <p>3 abnormalities require attention.</p>
          </div>

          <span className="andon-count">03</span>
        </section>

        {/* Recent Activity */}
        <section className="section">
          <div className="section-heading">
            <h3>Recent Activities</h3>
            <span>View All</span>
          </div>

          <div className="activity-card">
            <div className="activity-icon">
              <ArrowDownToLine />
            </div>
            <div className="activity-info">
              <strong>Material Receiving</strong>
              <p>Part No. ABC-001 · Location A01</p>
            </div>
            <span className="status success">Done</span>
          </div>

          <div className="activity-card">
            <div className="activity-icon">
              <ArrowLeftRight />
            </div>
            <div className="activity-info">
              <strong>Stock Transfer</strong>
              <p>Part No. DEF-002 · A02 → B01</p>
            </div>
            <span className="status success">Done</span>
          </div>
        </section>

      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.name;

          return (
            <button
              key={item.name}
              className={`nav-item ${isActive ? "active" : ""}`}
             onClick={() => {
  console.log("Clicked:", item.name);
  setActivePage(item.name);
}}
            >
              <Icon size={21} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

export default App;
