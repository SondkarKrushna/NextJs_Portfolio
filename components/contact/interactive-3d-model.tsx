"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

/* ─── Theme colour palettes ─── */
const THEME_PALETTES: Record<
  string,
  {
    primary: string;
    secondary: string;
    accent: string;
    particleColor: string;
    bgGradient: string;
    roughness: number;
    metalness: number;
    distort: number;
  }
> = {
  light: {
    primary: "#4f46e5",
    secondary: "#818cf8",
    accent: "#c7d2fe",
    particleColor: "#6366f1",
    bgGradient: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
    roughness: 0.3,
    metalness: 0.6,
    distort: 0.35,
  },
  dark: {
    primary: "#6366f1",
    secondary: "#818cf8",
    accent: "#4f46e5",
    particleColor: "#a5b4fc",
    bgGradient: "linear-gradient(180deg, #020617 0%, #0f172a 100%)",
    roughness: 0.2,
    metalness: 0.85,
    distort: 0.3,
  },
  retro: {
    primary: "#d97706",
    secondary: "#f59e0b",
    accent: "#92400e",
    particleColor: "#fbbf24",
    bgGradient: "linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)",
    roughness: 0.5,
    metalness: 0.4,
    distort: 0.4,
  },
  cyberpunk: {
    primary: "#ec4899",
    secondary: "#06b6d4",
    accent: "#facc15",
    particleColor: "#f472b6",
    bgGradient: "linear-gradient(180deg, #0c0a3e 0%, #1a0533 100%)",
    roughness: 0.1,
    metalness: 0.95,
    distort: 0.25,
  },
  paper: {
    primary: "#b45309",
    secondary: "#d97706",
    accent: "#78350f",
    particleColor: "#ca8a04",
    bgGradient: "linear-gradient(180deg, #fef9ef 0%, #fdf2e9 100%)",
    roughness: 0.6,
    metalness: 0.3,
    distort: 0.45,
  },
  aurora: {
    primary: "#10b981",
    secondary: "#a855f7",
    accent: "#ec4899",
    particleColor: "#34d399",
    bgGradient: "linear-gradient(180deg, #0f1729 0%, #1a1040 100%)",
    roughness: 0.15,
    metalness: 0.9,
    distort: 0.3,
  },
  synthwave: {
    primary: "#e040fb",
    secondary: "#00e5ff",
    accent: "#ffea00",
    particleColor: "#f06292",
    bgGradient: "linear-gradient(180deg, #1a1033 0%, #2d1b69 100%)",
    roughness: 0.1,
    metalness: 0.95,
    distort: 0.28,
  },
};

function getPalette(theme: string | undefined) {
  return THEME_PALETTES[theme ?? "dark"] ?? THEME_PALETTES.dark;
}

/* ─── Central Torus Knot ─── */
function CoreShape({ palette }: { palette: (typeof THEME_PALETTES)[string] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.15}>
        <torusKnotGeometry args={[0.8, 0.3, 128, 32]} />
        <MeshDistortMaterial
          color={palette.primary}
          roughness={palette.roughness}
          metalness={palette.metalness}
          distort={palette.distort}
          speed={2.5}
        />
      </mesh>
    </Float>
  );
}

/* ─── Orbiting Ring ─── */
function OrbitRing({
  color,
  radius,
  tilt,
  speed,
}: {
  color: string;
  radius: number;
  tilt: number;
  speed: number;
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
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.55}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

/* ─── Floating Particles ─── */
function Particles({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.0 + Math.random() * 1.5;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.08;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Scene ─── */
function Scene({ theme }: { theme: string | undefined }) {
  const palette = getPalette(theme);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <pointLight position={[-4, 3, -3]} intensity={0.5} color={palette.secondary} />
      <pointLight position={[4, -3, 3]} intensity={0.35} color={palette.accent} />

      <CoreShape palette={palette} />

      {/* Three orbiting rings at different tilts */}
      <OrbitRing color={palette.secondary} radius={1.9} tilt={0.3} speed={0.25} />
      <OrbitRing color={palette.accent} radius={2.2} tilt={-0.6} speed={-0.18} />
      <OrbitRing color={palette.primary} radius={2.5} tilt={1.1} speed={0.12} />

      <Particles color={palette.particleColor} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Interactive3DModel() {
  const { resolvedTheme } = useTheme();

  const palette = getPalette(resolvedTheme);

  return (
    <div
      className="w-full h-[350px] lg:h-[420px] mt-5 rounded-xl overflow-hidden border border-border/50"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
        style={{ background: palette.bgGradient }}
      >
        <Scene theme={resolvedTheme} />
      </Canvas>
    </div>
  );
}
