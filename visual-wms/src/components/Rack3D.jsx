
export default function Rack3D({
  position = [0, 0, 0],
  rackId = "A01",
  levels = 3,
  color = "#f97316",
  onClick,
}) {
  const rackWidth = 5;
  const rackHeight = 3.6;
  const rackDepth = 2;

  const levelHeight = rackHeight / levels;

  return (
    <group position={position}>
      {/* Rack Frame - เสาตั้ง */}
      {[-rackWidth / 2, rackWidth / 2].map((x) => (
        <mesh
          key={x}
          position={[x, rackHeight / 2, 0]}
          castShadow
        >
          <boxGeometry args={[0.12, rackHeight, 0.12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      ))}

      {/* Rack Shelves - คานชั้นวาง */}
      {Array.from({ length: levels }).map((_, index) => {
        const y = (index + 1) * levelHeight;

        return (
          <group key={index}>
            {/* คานหน้า */}
            <mesh position={[0, y, rackDepth / 2]} castShadow>
              <boxGeometry args={[rackWidth, 0.12, 0.12]} />
              <meshStandardMaterial color={color} />
            </mesh>

            {/* คานหลัง */}
            <mesh position={[0, y, -rackDepth / 2]} castShadow>
              <boxGeometry args={[rackWidth, 0.12, 0.12]} />
              <meshStandardMaterial color={color} />
            </mesh>

            {/* แผ่นรองสินค้า */}
            <mesh position={[0, y - 0.08, 0]} receiveShadow>
              <boxGeometry args={[rackWidth, 0.08, rackDepth]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        );
      })}

      {/* พื้นที่คลิก Rack */}
      <mesh
        position={[0, rackHeight / 2, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(rackId);
        }}
      >
        <boxGeometry args={[rackWidth, rackHeight, rackDepth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
