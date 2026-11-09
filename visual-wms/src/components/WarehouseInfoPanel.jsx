
export default function WarehouseInfoPanel({
  location,
  onClose,
}) {
  if (!location) return null;

  // ตรวจสอบว่าเป็น Rack หรือ Location
  const isRack = typeof location === "string";

  // ข้อมูล Location
  const data = isRack ? null : location;

  // แยกข้อมูล Rack
  const rackId = isRack ? location : data.rack;
  const locationCode = isRack ? location : data.id;

  // แปลง Shelf ให้เป็น MaruA - MaruZ
  const formatShelf = (shelf) => {
    if (!shelf) return "-";

    const shelfLetter = String(shelf)
      .replace(/^Maru/i, "")
      .trim();

    return `Maru${shelfLetter}`;
  };

  const statusLabels = {
    Occupied: "Occupied",
    Available: "Available",
    Reserved: "Reserved",
    Blocked: "Blocked",
  };

  const statusColors = {
    Occupied: "#2563eb",
    Available: "#16a34a",
    Reserved: "#d97706",
    Blocked: "#dc2626",
  };

  const status = data?.status || "-";

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        width: "280px",
        color: "#0f172a",
        boxShadow: "0 8px 25px #0002",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <strong style={{ fontSize: "17px" }}>
          {isRack
            ? "Rack Information"
            : "Location Information"}
        </strong>

        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Location Code */}
      <div style={{ marginBottom: "15px" }}>
        <small style={{ color: "#64748b" }}>
          {isRack ? "Rack Code" : "Location Code"}
        </small>

        <h2
          style={{
            margin: "5px 0",
            fontSize: "19px",
            overflowWrap: "anywhere",
          }}
        >
          {locationCode}
        </h2>

        {!isRack && (
          <span
            style={{
              display: "inline-block",
              padding: "5px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              color: statusColors[status] || "#64748b",
              background: "#f1f5f9",
            }}
          >
            {statusLabels[status] || status}
          </span>
        )}
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e2e8f0",
        }}
      />

      {/* Rack Information */}
      <div
        style={{
          display: "grid",
          gap: "12px",
          marginTop: "15px",
        }}
      >
        <Info
          label="Zone"
          value={data?.zone || "-"}
        />

        <Info
          label="Rack"
          value={rackId || "-"}
        />

        {!isRack && (
          <>
            <Info
              label="Shelf"
              value={formatShelf(data.shelf)}
            />

            <Info
              label="Level"
              value={data.locationNo || "-"}
            />

            <hr
              style={{
                border: "none",
                borderTop: "1px solid #e2e8f0",
              }}
            />

            {/* Inventory Information */}
            <strong style={{ fontSize: "14px" }}>
              Inventory Information
            </strong>

            <Info
              label="Part No."
              value={data.productCode || "-"}
            />

            <Info
              label="Part Name"
              value={data.productName || "-"}
            />

            <Info
              label="Quantity"
              value={`${data.quantity || 0} / ${data.maxCapacity || 200} PCS`}
            />

            <Info
              label="Capacity Usage"
              value={`${Math.round(
                ((data.quantity || 0) /
                  (data.maxCapacity || 200)) * 100
              )}%`}
            />
          </>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "10px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}

// Information Row
function Info({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        fontSize: "13px",
      }}
    >
      <span style={{ color: "#64748b" }}>
        {label}
      </span>

      <strong
        style={{
          color: color || "#0f172a",
          textAlign: "right",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </strong>
    </div>
  );
}
