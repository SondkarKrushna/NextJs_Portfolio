"use client";

import dynamic from "next/dynamic";

const Interactive3DModel = dynamic(
  () => import("@/components/contact/interactive-3d-model"),
  { ssr: false }
);

export default function Interactive3DModelWrapper() {
  return <Interactive3DModel />;
}
