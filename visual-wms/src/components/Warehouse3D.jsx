
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Environment,
  Line,
  Html,
} from "@react-three/drei";

import { useState, useRef, useEffect, useMemo } from "react";

import Rack3D from "./Rack3D";
import Shelf3D from "./Shelf3D";
import WarehouseInfoPanel from "./WarehouseInfoPanel";

// Demo Products
const demoProducts = [
  { code: "ABC-001", name: "Engine Control Unit", quantity: 120 },
  { code: "ABC-002", name: "Electronic Sensor", quantity: 85 },
  { code: "DEF-001", name: "Brake Assembly", quantity: 64 },
  { code: "DEF-002", name: "Brake Pad Set", quantity: 150 },
  { code: "GHI-001", name: "Wire Harness", quantity: 90 },
  { code: "GHI-002", name: "Connector Set", quantity: 200 },
  { code: "JKL-001", name: "Fuel Pump", quantity: 45 },
  { code: "JKL-002", name: "Oil Filter", quantity: 180 },
  { code: "MNO-001", name: "Air Cleaner", quantity: 72 },
  { code: "MNO-002", name: "Cooling Fan", quantity: 55 },
  { code: "PQR-001", name: "Relay Module", quantity: 110 },
  { code: "PQR-002", name: "Switch Assembly", quantity: 95 },
];

// Demo Racks
const demoRacks = ["A01", "A02", "A03", "B01", "B02", "B03"];

// Shelf Assignments
const shelfAssignments = {
  A01: ["A", "G", "M", "S", "Y"],
  A02: ["B", "H", "N", "T", "Z"],
  A03: ["C", "I", "O", "U"],
  B01: ["D", "J", "P", "V"],
  B02: ["E", "K", "Q", "W"],
  B03: ["F", "L", "R", "X"],
};

// Generate 3 Levels x 2 Positions per Shelf
const demoLocations = demoRacks.flatMap((rack) =>
  shelfAssignments[rack].flatMap((letter, shelfIndex) =>
    Array.from({ length: 6 }, (_, index) => {
      const level = Math.floor(index / 2) + 1;
      const slot = (index % 2) + 1;

      const shelf = `Maru${letter}`;

      const productIndex =
        (shelfIndex * 6 + index) % demoProducts.length;

      let status = "Occupied";

      if (index === 5) status = "Available";
      if (index === 4) status = "Reserved";

      if (rack === "B03" && letter === "F" && index === 3) {
        status = "Blocked";
      }

      const product =
        status === "Occupied" ? demoProducts[productIndex] : null;

      return {
        id: `Z01-${rack}-${shelf}-L${String(level).padStart(2, "0")}-P${String(slot).padStart(2, "0")}`,
        zone: "Z01",
        rack,
        shelf,
        shelfIndex,
        locationNo: `L${String(level).padStart(2, "0")}`,
        slotNo: slot,
        status,
        productCode: product?.code || "",
        productName: product?.name || "",
        quantity: product?.quantity || 0,
        maxCapacity: 200,
      };
    })
  )
);

// Camera Navigation
function CameraNavigator({ targetPosition, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!targetPosition || !controlsRef.current) return;

    const [x, y, z] = targetPosition;

    controlsRef.current.target.set(x, y, z);
    camera.position.set(x + 6, y + 4, z + 6);
    controlsRef.current.update();
  }, [
    targetPosition?.[0],
    targetPosition?.[1],
    targetPosition?.[2],
    camera,
    controlsRef,
  ]);

  return null;
}

// 3D Warehouse Scene
function WarehouseScene({
  onSelectLocation,
  locations,
  zone,
  highlightedLocationId,
  routePoints,
}) {
  // Merge Demo and User Locations
  const locationMap = new Map(
    demoLocations.map((item) => [item.id, item])
  );

  locations.forEach((item) => {
    locationMap.set(item.id, item);
  });

  const allLocations = Array.from(locationMap.values());

  const zoneLocations = allLocations.filter(
    (item) => item.zone === zone
  );

  // Sort Rack IDs
  const rackIds = [
    ...new Set(zoneLocations.map((item) => item.rack)),
  ].sort();

  const racks = rackIds.map((id, index) => ({
    id,
    position: [
      (index % 3 - 1) * 5,
      0,
      Math.floor(index / 3) * 6 - 3,
    ],
  }));

  const statusMap = {
    Occupied: "occupied",
    Available: "empty",
    Reserved: "reserved",
    Blocked: "blocked",
  };

  return (
    <>
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 12, 8]}
        intensity={2}
        castShadow
      />

      {/* Warehouse Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 22]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      <Grid
        position={[0, 0, 0]}
        args={[30, 22]}
        cellSize={1}
        cellColor="#cbd5e1"
        sectionSize={5}
        sectionColor="#94a3b8"
        fadeDistance={35}
        infiniteGrid={false}
      />

      {/* Picking Route */}
      {routePoints && (
        <Line
          points={routePoints}
          color="#f97316"
          lineWidth={4}
        />
      )}

      {/* Warehouse Racks */}
      {racks.map((rack) => {
        const rackLocations = zoneLocations.filter(
          (item) => item.rack === rack.id
        );

        // Sort Shelves
        const shelfIds = [
          ...new Set(rackLocations.map((item) => item.shelf)),
        ].sort();

        return (
          <group key={rack.id}>
            {/* Rack Name Label */}
            <Html
              position={[
                rack.position[0],
                4.8,
                rack.position[2],
              ]}
              center
              distanceFactor={12}
              occlude={false}
            >
              <div
                style={{
                  background: "#1e293b",
                  color: "#ffffff",
                  padding: "5px 14px",
                  borderRadius: "5px",
                  fontSize: "13px",
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                {rack.id}
              </div>
            </Html>

            <Rack3D
              position={rack.position}
              rackId={rack.id}
              levels={3}
              onClick={() => {
                if (rackLocations.length > 0) {
                  onSelectLocation(rackLocations[0]);
                }
              }}
            />

            {/* Storage Shelves */}
            {shelfIds.map((shelf, shelfIndex) => {
              const shelfX =
                rack.position[0] +
                (shelfIndex - (shelfIds.length - 1) / 2) * 0.95;

              const shelfLocations = rackLocations
                .filter((item) => item.shelf === shelf)
                .sort((a, b) => {
                  const levelA = Number(
                    String(a.locationNo || "L01").replace("L", "")
                  );

                  const levelB = Number(
                    String(b.locationNo || "L01").replace("L", "")
                  );

                  if (levelA !== levelB) {
                    return levelA - levelB;
                  }

                  return Number(a.slotNo || 1) - Number(b.slotNo || 1);
                });

              return (
                <group key={`${rack.id}-${shelf}`}>
                  {/* Shelf Name Label */}
                  <Html
                    position={[
                      shelfX,
                      4.05,
                      rack.position[2] + 0.6,
                    ]}
                    center
                    distanceFactor={12}
                    occlude={false}
                  >
                    <div
                      style={{
                        background: "#2563eb",
                        color: "#ffffff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                      }}
                    >
                      {shelf}
                    </div>
                  </Html>

                  {/* Locations within Shelf */}
                  {shelfLocations.map((item) => {
                    const level = Number(
                      String(item.locationNo || "L01").replace("L", "")
                    );

                    const slot = Number(item.slotNo || 1);

                    const shelfY = level * 1.2;

                    const shelfZ =
                      rack.position[2] +
                      (slot === 1 ? -0.48 : 0.48);

                    const isHighlighted =
                      item.id === highlightedLocationId;

                    return (
                      <group key={item.id}>
                        <Shelf3D
                          position={[
                            shelfX,
                            shelfY,
                            shelfZ,
                          ]}
                          shelfId={item.shelf}
                          status={
                            statusMap[item.status] || "empty"
                          }
                          highlighted={isHighlighted}
                          onClick={() => onSelectLocation(item)}
                        />

                        {/* Location Label */}
                        <Html
                          position={[
                            shelfX,
                            shelfY + 0.65,
                            shelfZ,
                          ]}
                          center
                          distanceFactor={12}
                          occlude={false}
                        >
                          <div
                            style={{
                              background: isHighlighted
                                ? "#facc15"
                                : "rgba(255,255,255,0.95)",
                              color: "#1e293b",
                              padding: "3px 6px",
                              borderRadius: "4px",
                              fontSize: "9px",
                              fontWeight: "600",
                              whiteSpace: "nowrap",
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            {item.locationNo}-P{slot}
                          </div>
                        </Html>
                      </group>
                    );
                  })}
                </group>
              );
            })}
          </group>
        );
      })}

      <Environment preset="warehouse" />
    </>
  );
}

// Main Warehouse Component
export default function Warehouse3D({
  locations = [],
  zone = "Z01",
}) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedLocationId, setHighlightedLocationId] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const controlsRef = useRef();

  // Combine Demo and User Locations
  const allLocations = useMemo(() => {
    return Array.from(
      new Map(
        [...demoLocations, ...locations].map((item) => [
          item.id,
          item,
        ])
      ).values()
    ).filter((item) => item.zone === zone);
  }, [locations, zone]);

  // Select Search Result
  const handleSelectResult = (location) => {
    setSelectedLocation(location);
    setHighlightedLocationId(location.id);
    setSearchTerm(location.shelf);
    setSearchMessage(`Selected: ${location.shelf} / ${location.locationNo}-P${location.slotNo}`);
    setShowSearchDropdown(false);
  };

  // Search Shelf Code
  const handleSearch = () => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      setSearchMessage("กรุณากรอก Shelf Code เช่น MaruA");
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const results = allLocations.filter((item) =>
      item.shelf?.toLowerCase().includes(keyword)
    );

    setSearchResults(results);
    setShowSearchDropdown(true);

    if (results.length === 0) {
      setSelectedLocation(null);
      setHighlightedLocationId(null);
      setSearchMessage("ไม่พบ Shelf ที่ค้นหา");
      return;
    }

    // Exact Shelf Code First
    const exactMatch = results.find(
      (item) => item.shelf?.toLowerCase() === keyword
    );

    const selected = exactMatch || results[0];

    setSelectedLocation(selected);
    setHighlightedLocationId(selected.id);

    setSearchMessage(
      `Found ${results.length} locations in ${selected.shelf}`
    );
  };

  // Calculate Target Location Coordinates
  const targetPosition = useMemo(() => {
    if (!selectedLocation) {
      return null;
    }

    const rackIds = [
      ...new Set(allLocations.map((item) => item.rack)),
    ].sort();

    const rackIndex = rackIds.indexOf(selectedLocation.rack);

    if (rackIndex === -1) return null;

    const rackLocations = allLocations.filter(
      (item) => item.rack === selectedLocation.rack
    );

    const shelfIds = [
      ...new Set(rackLocations.map((item) => item.shelf)),
    ].sort();

    const shelfIndex = shelfIds.indexOf(selectedLocation.shelf);

    if (shelfIndex === -1) return null;

    const rackX = (rackIndex % 3 - 1) * 5;
    const rackZ = Math.floor(rackIndex / 3) * 6 - 3;

    const shelfX =
      rackX +
      (shelfIndex - (shelfIds.length - 1) / 2) * 0.95;

    const level = Number(
      String(selectedLocation.locationNo || "L01").replace("L", "")
    );

    const slot = Number(selectedLocation.slotNo || 1);

    const shelfY = level * 1.2 + 0.25;

    const shelfZ =
      rackZ + (slot === 1 ? -0.48 : 0.48);

    return [shelfX, shelfY, shelfZ];
  }, [selectedLocation, allLocations]);

  // Simulated Picking Route
  const routePoints = targetPosition
    ? [
        [0, 0.08, 8],
        [targetPosition[0], 0.08, 8],
        [targetPosition[0], 0.08, targetPosition[2] + 1.5],
        [targetPosition[0], 0.08, targetPosition[2]],
      ]
    : null;

  // Clear Search
  const handleClear = () => {
    setSearchTerm("");
    setSearchMessage("");
    setSearchResults([]);
    setSelectedLocation(null);
    setHighlightedLocationId(null);
    setShowSearchDropdown(false);
  };

  // Select Location from 3D Scene
  const handleSceneSelect = (location) => {
    if (!location || typeof location !== "object") return;

    setSelectedLocation(location);
    setHighlightedLocationId(location.id);
    setSearchMessage("");
  };

  return (
    <div style={{ width: "100%" }}>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "14px",
          padding: "12px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ position: "relative", width: "300px" }}>
          <input
            type="text"
            placeholder="Search Shelf เช่น MaruA"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;

              setSearchTerm(value);

              if (!value.trim()) {
                setSearchResults([]);
                setShowSearchDropdown(false);
                setSearchMessage("");
                return;
              }

              const keyword = value.trim().toLowerCase();

              const results = allLocations.filter((item) =>
                item.shelf?.toLowerCase().includes(keyword)
              );

              setSearchResults(results);
              setShowSearchDropdown(true);

              setSearchMessage(
                results.length > 0
                  ? `Found ${results.length} locations`
                  : "No matching Shelf"
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
              if (e.key === "Escape") setShowSearchDropdown(false);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "7px",
              fontSize: "14px",
            }}
          />

          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                left: 0,
                width: "100%",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                zIndex: 100,
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #f1f5f9",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#1e293b",
                      }}
                    >
                      {item.shelf} - {item.locationNo}-P{item.slotNo}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "3px",
                      }}
                    >
                      {item.productCode || "No Part No."} -{" "}
                      {item.productName || "No product name"}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "7px",
                        fontSize: "11px",
                      }}
                    >
                      <span
                        style={{
                          color: "#2563eb",
                          fontWeight: 600,
                        }}
                      >
                        Rack {item.rack}
                      </span>

                      <span
                        style={{
                          color:
                            item.status === "Occupied"
                              ? "#2563eb"
                              : item.status === "Available"
                              ? "#16a34a"
                              : item.status === "Reserved"
                              ? "#d97706"
                              : "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "16px",
                    fontSize: "13px",
                    color: "#64748b",
                    textAlign: "center",
                  }}
                >
                  No matching Shelf found
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          style={{
            padding: "11px 20px",
            border: "none",
            borderRadius: "7px",
            background: "#2563eb",
            color: "#ffffff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Search
        </button>

        {searchMessage && (
          <span
            style={{
              fontSize: "13px",
              color: "#475569",
              paddingTop: "10px",
            }}
          >
            {searchMessage}
          </span>
        )}

        {(highlightedLocationId || showSearchDropdown || searchTerm) && (
          <button
            onClick={handleClear}
            style={{
              padding: "10px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "7px",
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Status Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "center",
          padding: "12px 16px",
          marginBottom: "12px",
          background: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
        }}
      >
        <strong style={{ fontSize: "13px" }}>
          Location Status:
        </strong>

        {[
          { label: "Occupied", color: "#2563eb" },
          { label: "Available", color: "#22c55e" },
          { label: "Reserved", color: "#f59e0b" },
          { label: "Blocked", color: "#ef4444" },
          { label: "Selected", color: "#facc15" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#475569",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                background: item.color,
              }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* Warehouse Layout */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {/* 3D View */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: "600px",
            background: "#f1f5f9",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Canvas
            shadows
            camera={{
              position: [13, 11, 17],
              fov: 45,
            }}
          >
            <WarehouseScene
              locations={locations}
              zone={zone}
              onSelectLocation={handleSceneSelect}
              highlightedLocationId={highlightedLocationId}
              routePoints={routePoints}
            />

            <CameraNavigator
              targetPosition={targetPosition}
              controlsRef={controlsRef}
            />

            <OrbitControls
              ref={controlsRef}
              makeDefault
              target={[0, 1.2, 0]}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2.1}
              minDistance={7}
              maxDistance={30}
            />
          </Canvas>
        </div>

        {/* Information Panel */}
        {selectedLocation && (
          <div style={{ width: "290px", flexShrink: 0 }}>
            <WarehouseInfoPanel
              location={selectedLocation}
              onClose={() => {
                setSelectedLocation(null);
                setHighlightedLocationId(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
