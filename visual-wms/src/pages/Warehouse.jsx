
import { useState, useEffect } from "react";
import Warehouse3D from "../components/Warehouse3D";

import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  Layers,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";

function WarehousePage({ onBack }) {
  // ==========================================
  // 1. LOCATION DATA
  // ==========================================

  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem("visual-wms-locations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "visual-wms-locations",
      JSON.stringify(locations)
    );
  }, [locations]);

  // ==========================================
  // 2. PAGE STATE
  // ==========================================

  const [activeTab, setActiveTab] = useState("3d");

  const [zone, setZone] = useState("Z01");
  const [rack, setRack] = useState("R01");
  const [shelf, setShelf] = useState("S01");
  const [locationNo, setLocationNo] = useState("L01");

  const [selectedZone, setSelectedZone] = useState("Z01");

  // ==========================================
  // 3. WAREHOUSE DATA
  // ==========================================

  const zones = [
    ...new Set(locations.map((item) => item.zone)),
  ].sort();

  const currentZone = zones.includes(selectedZone)
    ? selectedZone
    : zones[0] || "";

  const zoneLocations = locations.filter(
    (item) => item.zone === currentZone
  );

  const racks = [
    ...new Set(zoneLocations.map((item) => item.rack)),
  ].sort();

  const totalShelves = [
    ...new Set(
      zoneLocations.map(
        (item) => `${item.rack}-${item.shelf}`
      )
    ),
  ].length;

  const availableLocations = locations.filter(
    (item) => item.status === "Available"
  ).length;

  // ==========================================
  // 4. LOCATION ID
  // ==========================================

  const locationId =
    `WH01-${zone}-${rack}-${shelf}-${locationNo}`;

  // ==========================================
  // 5. ADD LOCATION
  // ==========================================

  function addLocation(event) {
    event.preventDefault();

    const newLocation = {
      id: locationId,
      zone,
      rack,
      shelf,
      locationNo,
      status: "Available",
      productCode: "",
      productName: "",
      quantity: 0,
      maxCapacity: 200,
    };

    const isDuplicate = locations.some(
      (item) => item.id === locationId
    );

    if (isDuplicate) {
      alert("This Location ID already exists.");
      return;
    }

    setLocations((current) => [
      ...current,
      newLocation,
    ]);

    setSelectedZone(zone);
    setLocationNo("L01");
  }

  // ==========================================
  // 6. DELETE LOCATION
  // ==========================================

  function deleteLocation(id) {
    if (!window.confirm(`Delete location ${id}?`)) {
      return;
    }

    setLocations((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  // ==========================================
  // 7. STYLES
  // ==========================================

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    background: active ? "#D71920" : "#f1f1f1",
    color: active ? "#fff" : "#555",
    fontWeight: 600,
  });

  // ==========================================
  // 8. WAREHOUSE PROJECT GALLERY
  // ==========================================

  const projectImages = [
  {
    src: "/images/warehouse-1.png",
    title: "Warehouse Layout",
  },
  {
    src: "/images/warehouse-2.png",
    title: "Storage System",
  },
  {
    src: "/images/warehouse-3.png",
    title: "Warehouse Improvement",
  },
  {
    src: "/images/warehouse-4.png",
    title: "Warehouse Operations",
  },
];

  // ==========================================
  // 9. MAIN PAGE
  // ==========================================

  return (
    <div className="app-container">

      {/* HEADER */}

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

        {/* PAGE HEADING */}

        <div className="page-heading">
          <div>
            <p className="eyebrow">
              WAREHOUSE MANAGEMENT
            </p>

            <h2>Warehouse Management</h2>

            <p className="subtitle">
              Manage and visualize warehouse locations.
            </p>
          </div>
        </div>

        {/* TABS */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            background: "#fff",
            padding: "6px",
            borderRadius: "12px",
            marginBottom: "22px",
            border: "1px solid #eee",
          }}
        >
          <button
            style={tabStyle(activeTab === "master")}
            onClick={() => setActiveTab("master")}
          >
            <Boxes
              size={17}
              style={{ verticalAlign: "middle" }}
            />
            {" "}Location Master
          </button>

          <button
            style={tabStyle(activeTab === "3d")}
            onClick={() => setActiveTab("3d")}
          >
            <Layers
              size={17}
              style={{ verticalAlign: "middle" }}
            />
            {" "}Warehouse 3D
          </button>
        </div>

        {/* ====================================== */}
        {/* LOCATION MASTER */}
        {/* ====================================== */}

        {activeTab === "master" && (
          <>

            {/* KPI */}

            <section className="kpi-grid">

              <div className="kpi-card">
                <span>Total Locations</span>
                <strong>{locations.length}</strong>
                <small>Registered locations</small>
              </div>

              <div className="kpi-card">
                <span>Available</span>
                <strong>{availableLocations}</strong>
                <small>Ready for storage</small>
              </div>

            </section>

            {/* ADD LOCATION */}

            <section className="section">

              <div className="section-heading">
                <h3>Add New Location</h3>
                <span>Location Master</span>
              </div>

              <form
                onSubmit={addLocation}
                style={{
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  display: "grid",
                  gap: "14px",
                }}
              >

                {[
                  ["Zone ID", zone, setZone, "Z01"],
                  ["Rack ID", rack, setRack, "R01"],
                  ["Shelf ID", shelf, setShelf, "S01"],
                  ["Location No.", locationNo, setLocationNo, "L01"],
                ].map(([label, value, setter, placeholder]) => (

                  <div key={label}>
                    <label>{label}</label>

                    <input
                      style={inputStyle}
                      value={value}
                      onChange={(event) =>
                        setter(event.target.value.toUpperCase())
                      }
                      placeholder={`Example: ${placeholder}`}
                      required
                    />
                  </div>

                ))}

                {/* GENERATED LOCATION ID */}

                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <small style={{ color: "#666" }}>
                    Generated Location ID
                  </small>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: "#D71920",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {locationId}
                  </strong>
                </div>

                <button
                  type="submit"
                  className="action-card"
                  style={{
                    background: "#D71920",
                    color: "#fff",
                    border: "none",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={18} />
                  Add Location
                </button>

              </form>
            </section>

            {/* LOCATION RECORDS */}

            <section className="section">

              <div className="section-heading">
                <h3>Storage Locations</h3>
                <span>{locations.length} Records</span>
              </div>

              {locations.length === 0 ? (

                <div className="activity-card">
                  <div className="activity-info">
                    <strong>No locations found</strong>
                    <p>
                      Add your first storage location above.
                    </p>
                  </div>
                </div>

              ) : (

                locations.map((item) => (

                  <div
                    className="activity-card"
                    key={item.id}
                    style={{ marginBottom: "10px" }}
                  >

                    <div className="activity-icon">
                      <Warehouse size={20} />
                    </div>

                    <div className="activity-info">
                      <strong>{item.id}</strong>

                      <p>
                        Zone {item.zone} · Rack {item.rack}
                      </p>

                      <p>
                        Shelf {item.shelf} · {item.locationNo}
                      </p>

                      <span className="status success">
                        {item.status}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteLocation(item.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#D71920",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                ))

              )}

            </section>

          </>
        )}

        {/* ====================================== */}
        {/* WAREHOUSE 3D */}
        {/* ====================================== */}

        {activeTab === "3d" && (

          <section className="section">

            <div className="section-heading">
              <h3>Warehouse 3D View</h3>
              <span>Visual Warehouse</span>
            </div>

            {/* SUMMARY */}

            <div className="kpi-grid">

              <div className="kpi-card">
                <span>Zones</span>
                <strong>{zones.length}</strong>
              </div>

              <div className="kpi-card">
                <span>Racks</span>
                <strong>{racks.length}</strong>
              </div>

              <div className="kpi-card">
                <span>Shelves</span>
                <strong>{totalShelves}</strong>
              </div>

              <div className="kpi-card">
                <span>Locations</span>
                <strong>{zoneLocations.length}</strong>
              </div>

            </div>

            {/* EMPTY STATE */}

            {locations.length === 0 ? (

              <div className="activity-card">
                <div className="activity-info">

                  <strong>Warehouse is empty</strong>

                  <p>
                    Please add locations in Location Master first.
                  </p>

                  <button
                    className="action-card"
                    style={{ marginTop: "12px" }}
                    onClick={() => setActiveTab("master")}
                  >
                    Go to Location Master
                  </button>

                </div>
              </div>

            ) : (

              <>

                {/* ZONE SELECTOR */}

                <div style={{ marginTop: "20px" }}>

                  <label>Select Zone</label>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "10px",
                    }}
                  >

                    {zones.map((item) => (

                      <button
                        key={item}
                        onClick={() => setSelectedZone(item)}
                        style={{
                          padding: "10px 18px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          background:
                            currentZone === item ? "#D71920" : "#fff",
                          color:
                            currentZone === item ? "#fff" : "#333",
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </button>

                    ))}

                  </div>
                </div>

                {/* 3D WAREHOUSE */}

                <div style={{ marginTop: "25px" }}>

                  <div className="section-heading">
                    <h3>3D Warehouse Layout</h3>
                    <span>{currentZone}</span>
                  </div>

                  <Warehouse3D
                    locations={locations}
                    zone={currentZone}
                  />

                </div>

              </>

            )}

            
{/* ====================================== */}
{/* WAREHOUSE PROJECT GALLERY */}
{/* ====================================== */}

<div
  style={{
    marginTop: "28px",
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #eee",
    boxSizing: "border-box",
  }}
>
  <div style={{ marginBottom: "22px" }}>
    <h3
      style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#1e293b",
        margin: 0,
      }}
    >
      Design.
    </h3>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "24px",
      width: "100%",
    }}
  >
    {projectImages.map((image) => (
      <div
        key={image.src}
        style={{
          width: "100%",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h4
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1e293b",
            margin: 0,
          }}
        >
          {image.title}
        </h4>

        <div
          style={{
            width: "100%",
            height: "450px",
            background: "#f1f5f9",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <img
            src={image.src}
            alt={image.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>


          </section>

        )}

        {/* BACK TO DASHBOARD */}

        <button
          className="action-card"
          onClick={onBack}
          style={{ justifyContent: "center" }}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

      </main>

      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-nav">

        <button
          className="nav-item"
          onClick={onBack}
        >
          <LayoutDashboard size={21} />
          <span>Dashboard</span>
        </button>

        <button
          className="nav-item active"
          onClick={() => setActiveTab("master")}
        >
          <Warehouse size={21} />
          <span>Warehouse</span>
        </button>

      </nav>

    </div>
  );
}

export default WarehousePage;
