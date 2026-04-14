"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

/* ─── Theme colour palettes ─── */
const THEME_PALETTES: Record<
  string,
  {
    wireframe: string;
    wireGlow: string;
    ring1: string;
    ring2: string;
    ring3: string;
    coreGlow: string;
    dataPoints: string;
    pulse: string;
    meridian: string;
    particleColor: string;
  }
> = {
  light: {
    wireframe: "#4338ca",
    wireGlow: "#6366f1",
    ring1: "#818cf8",
    ring2: "#a5b4fc",
    ring3: "#c7d2fe",
    coreGlow: "#4f46e5",
    dataPoints: "#6366f1",
    pulse: "#818cf8",
    meridian: "#4338ca",
    particleColor: "#818cf8",
  },
  dark: {
    wireframe: "#6366f1",
    wireGlow: "#818cf8",
    ring1: "#4f46e5",
    ring2: "#818cf8",
    ring3: "#a5b4fc",
    coreGlow: "#6366f1",
    dataPoints: "#a5b4fc",
    pulse: "#6366f1",
    meridian: "#818cf8",
    particleColor: "#a5b4fc",
  },
  retro: {
    wireframe: "#d97706",
    wireGlow: "#f59e0b",
    ring1: "#fbbf24",
    ring2: "#f59e0b",
    ring3: "#fde68a",
    coreGlow: "#d97706",
    dataPoints: "#fbbf24",
    pulse: "#f59e0b",
    meridian: "#d97706",
    particleColor: "#fbbf24",
  },
  cyberpunk: {
    wireframe: "#ec4899",
    wireGlow: "#f472b6",
    ring1: "#06b6d4",
    ring2: "#ec4899",
    ring3: "#facc15",
    coreGlow: "#ec4899",
    dataPoints: "#22d3ee",
    pulse: "#f472b6",
    meridian: "#06b6d4",
    particleColor: "#f472b6",
  },
  paper: {
    wireframe: "#b45309",
    wireGlow: "#d97706",
    ring1: "#ca8a04",
    ring2: "#d97706",
    ring3: "#fde68a",
    coreGlow: "#b45309",
    dataPoints: "#ca8a04",
    pulse: "#d97706",
    meridian: "#92400e",
    particleColor: "#ca8a04",
  },
  aurora: {
    wireframe: "#10b981",
    wireGlow: "#34d399",
    ring1: "#a855f7",
    ring2: "#10b981",
    ring3: "#ec4899",
    coreGlow: "#10b981",
    dataPoints: "#34d399",
    pulse: "#a855f7",
    meridian: "#10b981",
    particleColor: "#34d399",
  },
  synthwave: {
    wireframe: "#e040fb",
    wireGlow: "#f06292",
    ring1: "#00e5ff",
    ring2: "#e040fb",
    ring3: "#ffea00",
    coreGlow: "#e040fb",
    dataPoints: "#00e5ff",
    pulse: "#f06292",
    meridian: "#00e5ff",
    particleColor: "#f06292",
  },
};

function getPalette(theme: string | undefined) {
  return THEME_PALETTES[theme ?? "dark"] ?? THEME_PALETTES.dark;
}

/* ─── Cursor-following light ─── */
function CursorLight({ palette }: { palette: (typeof THEME_PALETTES)[string] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const { pointer, viewport } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;
      lightRef.current.position.x += (x - lightRef.current.position.x) * 0.06;
      lightRef.current.position.y += (y - lightRef.current.position.y) * 0.06;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 3]}
      intensity={0.6}
      color={palette.wireGlow}
      distance={8}
      decay={2}
    />
  );
}

/* ─── Wireframe Globe ─── */
function WireframeGlobe({
  palette,
  hovered,
}: {
  palette: (typeof THEME_PALETTES)[string];
  hovered: boolean;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * (hovered ? 0.25 : 0.12);
      globeRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={globeRef}>
        {/* Wireframe sphere */}
        <mesh>
          <sphereGeometry args={[1.0, 28, 20]} />
          <meshStandardMaterial
            color={palette.wireframe}
            wireframe
            emissive={palette.wireframe}
            emissiveIntensity={hovered ? 0.7 : 0.4}
            transparent
            opacity={hovered ? 0.9 : 0.7}
          />
        </mesh>

        {/* Inner solid core — faint glow */}
        <mesh ref={innerRef} scale={0.35}>
          <sphereGeometry args={[1.0, 24, 24]} />
          <meshStandardMaterial
            color={palette.coreGlow}
            emissive={palette.coreGlow}
            emissiveIntensity={hovered ? 0.9 : 0.5}
            transparent
            opacity={0.25}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Second wireframe layer — slightly larger, rotated */}
        <mesh rotation={[0.3, 0.8, 0.1]} scale={1.02}>
          <sphereGeometry args={[1.0, 14, 10]} />
          <meshStandardMaterial
            color={palette.wireGlow}
            wireframe
            emissive={palette.wireGlow}
            emissiveIntensity={0.2}
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Latitude rings (horizontal bands) */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => {
          const r = Math.sqrt(1 - y * y); // radius at this y
          return (
            <mesh key={`lat-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.004, 8, 80]} />
              <meshStandardMaterial
                color={palette.meridian}
                emissive={palette.meridian}
                emissiveIntensity={0.5}
                transparent
                opacity={0.4}
              />
            </mesh>
          );
        })}

        {/* Meridian lines (vertical bands) */}
        {[0, Math.PI / 3, (2 * Math.PI) / 3].map((angle, i) => (
          <mesh key={`mer-${i}`} rotation={[0, angle, 0]}>
            <torusGeometry args={[1.0, 0.004, 8, 80]} />
            <meshStandardMaterial
              color={palette.meridian}
              emissive={palette.meridian}
              emissiveIntensity={0.5}
              transparent
              opacity={0.35}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── Pulsing ring that expands outward ─── */
function PulseRing({ palette }: { palette: (typeof THEME_PALETTES)[string] }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      // Cycle: expand from 1 to 2, then reset
      scaleRef.current = 1 + (clock.elapsedTime * 0.3) % 1.0;
      ringRef.current.scale.setScalar(scaleRef.current);

      // Fade out as it expands
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.4 * (1 - (scaleRef.current - 1));
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.0, 0.008, 8, 100]} />
      <meshStandardMaterial
        color={palette.pulse}
        emissive={palette.pulse}
        emissiveIntensity={0.8}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

/* ─── Orbital Rings ─── */
function OrbitalRing({
  color,
  radius,
  tilt,
  speed,
  thickness,
  opacityVal,
}: {
  color: string;
  radius: number;
  tilt: number;
  speed: number;
  thickness: number;
  opacityVal: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = tilt;
      ref.current.rotation.y = clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, thickness, 16, 140]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={opacityVal}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

/* ─── Data points on globe surface ─── */
function DataPoints({
  palette,
  hovered,
}: {
  palette: (typeof THEME_PALETTES)[string];
  hovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 40;

  const points = useMemo(() => {
    const arr: { pos: [number, number, number]; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.02;
      arr.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        size: 0.01 + Math.random() * 0.02,
      });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <mesh key={i} position={p.pos as [number, number, number]}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshStandardMaterial
            color={palette.dataPoints}
            emissive={palette.dataPoints}
            emissiveIntensity={hovered ? 1.5 : 0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Floating particles ─── */
function Particles({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 100;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Scene ─── */
function Scene({
  theme,
  hovered,
}: {
  theme: string | undefined;
  hovered: boolean;
}) {
  const palette = getPalette(theme);

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color={palette.coreGlow} distance={5} />

      <CursorLight palette={palette} />

      <WireframeGlobe palette={palette} hovered={hovered} />
      <PulseRing palette={palette} />
      <DataPoints palette={palette} hovered={hovered} />

      {/* Orbital rings at various tilts */}
      <OrbitalRing color={palette.ring1} radius={1.5} tilt={1.2} speed={0.15} thickness={0.01} opacityVal={0.45} />
      <OrbitalRing color={palette.ring2} radius={1.75} tilt={0.5} speed={-0.1} thickness={0.008} opacityVal={0.3} />
      <OrbitalRing color={palette.ring3} radius={2.0} tilt={-0.8} speed={0.08} thickness={0.006} opacityVal={0.2} />

      <Particles color={palette.particleColor} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

/* ─── Main Export ─── */
export default function Interactive3DModel() {
  const { resolvedTheme } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[350px] lg:h-[420px] mt-5 rounded-xl overflow-hidden" />
    );
  }

  return (
    <div
      className="w-full h-[350px] lg:h-[420px] mt-5 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0.3, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene theme={resolvedTheme} hovered={hovered} />
      </Canvas>
    </div>
  );
}
