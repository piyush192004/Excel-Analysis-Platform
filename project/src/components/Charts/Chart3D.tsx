import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Chart3DProps {
  data: { x: number; y: number; z: number; label?: string }[];
  type: '3d-bar' | '3d-scatter' | '3d-surface';
  title: string;
  colors?: string[];
}

const Bar3D: React.FC<{ position: [number, number, number]; height: number; color: string }> = ({ 
  position, 
  height, 
  color 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Scatter3D: React.FC<{ position: [number, number, number]; color: string }> = ({ 
  position, 
  color 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Chart3D: React.FC<Chart3DProps> = ({ data, type, title, colors = ['#3B82F6'] }) => {
  const normalizedData = useMemo(() => {
    if (data.length === 0) return [];

    const maxX = Math.max(...data.map(d => d.x));
    const maxY = Math.max(...data.map(d => d.y));
    const maxZ = Math.max(...data.map(d => d.z));

    return data.map((d, index) => ({
      ...d,
      normalizedX: (d.x / maxX) * 10 - 5,
      normalizedY: (d.y / maxY) * 5,
      normalizedZ: (d.z / maxZ) * 10 - 5,
      color: colors[index % colors.length],
    }));
  }, [data, colors]);

  return (
    <div className="h-96 w-full bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Title */}
        <Text
          position={[0, 8, 0]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>

        {/* Data Points */}
        {normalizedData.map((point, index) => {
          const position: [number, number, number] = [
            point.normalizedX,
            point.normalizedY,
            point.normalizedZ,
          ];

          if (type === '3d-bar') {
            return (
              <Bar3D
                key={index}
                position={[position[0], position[1] / 2, position[2]]}
                height={position[1]}
                color={point.color}
              />
            );
          } else if (type === '3d-scatter') {
            return (
              <Scatter3D
                key={index}
                position={position}
                color={point.color}
              />
            );
          }
          return null;
        })}

        {/* Axes */}
        <group>
          {/* X Axis */}
          <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 10]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <Text position={[6, -0.5, 0]} fontSize={0.5} color="red">
            X
          </Text>

          {/* Y Axis */}
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 5]} />
            <meshStandardMaterial color="green" />
          </mesh>
          <Text position={[0, 6, 0]} fontSize={0.5} color="green">
            Y
          </Text>

          {/* Z Axis */}
          <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 10]} />
            <meshStandardMaterial color="blue" />
          </mesh>
          <Text position={[0, -0.5, 6]} fontSize={0.5} color="blue">
            Z
          </Text>
        </group>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default Chart3D;