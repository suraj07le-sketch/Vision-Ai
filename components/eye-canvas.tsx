"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Preload } from "@react-three/drei";
import { Suspense } from "react";
import { AIEye } from "./ai-eye";

export function EyeCanvas() {
    return (
        <div className="w-full h-full relative z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <Environment preset="night" />
                    <ambientLight intensity={0.2} />
                    <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
                    <directionalLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <AIEye />
                    </Float>
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.5}
                        minAzimuthAngle={-Math.PI / 4}
                        maxAzimuthAngle={Math.PI / 4}
                    />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
