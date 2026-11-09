
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Warehouse,
  Boxes,
  Layers,
  MapPin,
  ArrowLeft,
  Plus,
} from "lucide-react";

function WarehousePage({ onBack }) {
  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem("visual-wms-locations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState("master");

  const [zone, setZone] = useState("Z01");
  const [rack, setRack] = useState("R01");
  const [shelf, setShelf] = useState("S01");
  const [locationNo, setLocationNo] = useState("L01");

  const [selectedZone, setSelectedZone] = useState("Z01");
  const [selectedRack, setSelectedRack] = useState("R01");
  const [selectedShelf, setSelectedShelf] = useState("S01");

  useEffect(() => {
    localStorage.setItem(
      "visual-wms-locations",
      JSON.stringify(locations)
    );
  }, [locations]);

  // Warehouse data
  const zones = [...new Set(locations.map((item) => item.zone))].sort();

  const currentZone = zones.includes(selectedZone)
    ? selectedZone
    : zones[0];

  const racks = [...new Set(
    locations
      .filter((item) => item.zone === currentZone)
      .map((item) => item.rack)
  )].sort();

  const currentRack = racks.includes(selectedRack)
    ? selectedRack
    : racks[0];

  const shelves = [...new Set(
    locations
      .filter(
        (item) =>
          item.zone === currentZone &&
          item.rack === currentRack
      )
      .map((item) => item.shelf)
  )].sort();

  const currentShelf = shelves.includes(selectedShelf)
    ? selectedShelf
    : shelves[0];

  const shelfLocations = locations.filter(
    (item) =>
      item.zone === currentZone &&
      item.rack === currentRack &&
      item.shelf === currentShelf
  );

  const locationId =
    `WH01-${zone}-${rack}-${shelf}-${locationNo}`;

  // Add location
  function addLocation(event) {
    event.preventDefault();

    const newLocation = {
      id: locationId,
      zone,
      rack,
      shelf,
      locationNo,
      status: "Available",
    };

    if (locations.some((item) => item.id === locationId)) {
      alert("This Location ID already exists.");
      return;
    }

    setLocations((current) => [...current, newLocation]);
    setLocationNo("L01");
  }

  // Delete location
  function deleteLocation(id) {
    if (!window.confirm(`Delete location ${id}?`)) return;

    setLocations((current) =>
      current.filter((item) => item.id !== id)
    );
  }

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
      </header>

      <main className="main-content">

        {/* Heading */}
        <div className="page-heading">
          <div>
            <p className="eyebrow">WAREHOUSE MANAGEMENT</p>
            <h2>Warehouse Management</h2>
            <p className="subtitle">
              Manage and visualize warehouse locations.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "10px",
          background: "#fff",
          padding: "6px",
          borderRadius: "12px",
          marginBottom: "22px",
          border: "1px solid #eee",
        }}>
          <button
            style={tabStyle(activeTab === "master")}
            onClick={() => setActiveTab("master")}
          >
            <Boxes size={17} style={{ verticalAlign: "middle" }} />
            {" "}Location Master
          </button>

          <button
            style={tabStyle(activeTab === "3d")}
            onClick={() => setActiveTab("3d")}
          >
            <Layers size={17} style={{ verticalAlign: "middle" }} />
            {" "}Warehouse 3D
          </button>
        </div>

        {/* LOCATION MASTER */}
        {activeTab === "master" && (
          <>
            <section className="kpi-grid">
              <div className="kpi-card">
                <span>Total Locations</span>
                <strong>{locations.length}</strong>
                <small>Registered locations</small>
              </div>

              <div className="kpi-card">
                <span>Available</span>
                <strong>
                  {locations.filter(
                    (item) => item.status === "Available"
                  ).length}
                </strong>
                <small>Ready for storage</small>
              </div>
            </section>

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
                      onChange={(e) =>
                        setter(e.target.value.toUpperCase())
                      }
                      placeholder={`Example: ${placeholder}`}
                      required
                    />
                  </div>
                ))}

                <div style={{
                  background: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "8px",
                }}>
                  <small style={{ color: "#666" }}>
                    Generated Location ID
                  </small>
                  <strong style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#D71920",
                    overflowWrap: "anywhere",
                  }}>
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
                  <Plus size={18} /> Add Location
                </button>
              </form>
            </section>

            <section className="section">
              <div className="section-heading">
                <h3>Storage Locations</h3>
                <span>{locations.length} Records</span>
              </div>

              {locations.length === 0 ? (
                <div className="activity-card">
                  <div className="activity-info">
                    <strong>No locations found</strong>
                    <p>Add your first storage location above.</p>
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
                      <p>Zone {item.zone} · Rack {item.rack}</p>
                      <p>Shelf {item.shelf} · {item.locationNo}</p>
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
                      Delete
                    </button>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {/* WAREHOUSE 3D */}
        {activeTab === "3d" && (
          <section className="section">

            <div className="section-heading">
              <h3>Warehouse 3D View</h3>
              <span>Live Location Data</span>
            </div>

            {/* Summary */}
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
                <span>Locations</span>
                <strong>{locations.length}</strong>
              </div>
            </div>

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
                {/* Zone Selector */}
                <div style={{ marginTop: "20px" }}>
                  <label>Select Zone</label>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "10px",
                  }}>
                    {zones.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedZone(item);
                          setSelectedRack("");
                          setSelectedShelf("");
                        }}
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

                {/* 3D Rack Visualization */}
                <div style={{
                  marginTop: "25px",
                  padding: "20px 12px",
                  background: "#edf1f5",
                  borderRadius: "14px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    textAlign: "center",
                    marginBottom: "25px",
                  }}>
                    <span style={{
                      fontSize: "12px",
                      color: "#667085",
                      letterSpacing: "2px",
                    }}>
                      WAREHOUSE FLOOR
                    </span>
                    <h3 style={{ margin: "6px 0" }}>
                      {currentZone}
                    </h3>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(125px, 1fr))",
                    gap: "24px 15px",
                    perspective: "900px",
                  }}>
                    {racks.map((rackId) => {
                      const rackShelves = [...new Set(
                        locations
                          .filter(
                            (item) =>
                              item.zone === currentZone &&
                              item.rack === rackId
                          )
                          .map((item) => item.shelf)
                      )].sort();

                      const rackLocationCount = locations.filter(
                        (item) =>
                          item.zone === currentZone &&
                          item.rack === rackId
                      ).length;

                      const selected = currentRack === rackId;

                      return (
                        <button
                          key={rackId}
                          onClick={() => {
                            setSelectedRack(rackId);
                            setSelectedShelf("");
                          }}
                          style={{
                            border: selected
                              ? "2px solid #D71920"
                              : "1px solid #cbd2dc",
                            borderRadius: "8px",
                            padding: "10px 8px",
                            background: selected ? "#fff5f5" : "#fff",
                            cursor: "pointer",
                            transform: "rotateY(-8deg)",
                            boxShadow: "5px 7px 0 #c5cdd6",
                            minHeight: "145px",
                          }}
                        >
                          <Warehouse
                            size={28}
                            color={selected ? "#D71920" : "#526477"}
                          />

                          <strong style={{
                            display: "block",
                            margin: "8px 0",
                            color: "#263445",
                          }}>
                            {rackId}
                          </strong>

                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}>
                            {rackShelves.map((shelfId) => (
                              <div
                                key={shelfId}
                                style={{
                                  height: "8px",
                                  background: "#aab9c9",
                                  borderRadius: "2px",
                                  boxShadow: "0 2px 0 #78899c",
                                }}
                              />
                            ))}
                          </div>

                          <small style={{
                            display: "block",
                            marginTop: "8px",
                            color: "#667085",
                          }}>
                            {rackShelves.length} Shelves
                            <br />
                            {rackLocationCount} Locations
                          </small>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Shelf Selector */}
                {racks.length > 0 && (
                  <div style={{ marginTop: "25px" }}>
                    <div className="section-heading">
                      <h3>Shelf Selection</h3>
                      <span>{currentRack}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}>
                      {shelves.map((item) => (
                        <button
                          key={item}
                          onClick={() => setSelectedShelf(item)}
                          style={{
                            padding: "12px 18px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            background:
                              currentShelf === item ? "#D71920" : "#fff",
                            color:
                              currentShelf === item ? "#fff" : "#333",
                            cursor: "pointer",
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Details */}
                {currentShelf && (
                  <div style={{ marginTop: "25px" }}>
                    <div className="section-heading">
                      <h3>Location Details</h3>
                      <span>
                        {currentRack} / {currentShelf}
                      </span>
                    </div>

                    {shelfLocations.map((item) => (
                      <div
                        key={item.id}
                        className="activity-card"
                        style={{ marginBottom: "10px" }}
                      >
                        <div className="activity-icon">
                          <MapPin size={20} />
                        </div>

                        <div className="activity-info">
                          <strong>{item.locationNo}</strong>
                          <p>{item.id}</p>
                          <span className="status success">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}

                    {shelfLocations.length === 0 && (
                      <p>No locations in this shelf.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        <button
          className="action-card"
          onClick={onBack}
          style={{ justifyContent: "center" }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

      </main>

      <nav className="bottom-nav">
        <button className="nav-item" onClick={onBack}>
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
