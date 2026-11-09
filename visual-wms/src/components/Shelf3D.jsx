
export default function Shelf3D({
  position = [0, 0, 0],
  shelfId = "MaruA",
  status = "occupied",
  highlighted = false,
  onClick,
}) {
  const statusColors = {
    occupied: "#2563eb",
    empty: "#22c55e",
    reserved: "#f59e0b",
    blocked: "#ef4444",
  };

  const color = highlighted
    ? "#facc15"
    : statusColors[status] || "#64748b";

  return (
    <group position={position} scale={highlighted ? 1.15 : 1}>
      {/* Shelf Box */}
      <mesh
        position={[0, 0.25, 0]}
        castShadow
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(shelfId);
        }}
      >
        <boxGeometry args={[0.9, 0.5, 0.9]} />
        <meshStandardMaterial
          color={color}
          emissive={highlighted ? "#facc15" : "#000000"}
          emissiveIntensity={highlighted ? 0.8 : 0}
        />
      </mesh>

      {/* Shelf Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#a16207" />
      </mesh>
    </group>
  );
}
