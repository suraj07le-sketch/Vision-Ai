"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const AIEye = () => {
    const eyeRef = useRef<THREE.Group>(null);
    const irisRef = useRef<THREE.Mesh>(null);
    const hudRef = useRef<THREE.Group>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!eyeRef.current) return;
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;
            const targetRotationX = y * 0.4;
            const targetRotationY = x * 0.6;
            eyeRef.current.rotation.x += (targetRotationX - eyeRef.current.rotation.x) * 0.05;
            eyeRef.current.rotation.y += (targetRotationY - eyeRef.current.rotation.y) * 0.05;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (eyeRef.current) {
            eyeRef.current.position.y = Math.sin(t * 0.5) * 0.1;
        }
        if (irisRef.current) {
            const pulse = 1 + Math.sin(t * 2) * 0.02;
            irisRef.current.scale.set(pulse, pulse, pulse);
        }
        if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.2;
        if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.3;
        if (hudRef.current) {
            hudRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
            hudRef.current.rotation.x = Math.cos(t * 0.5) * 0.1;
        }
    });

    return (
        <group ref={eyeRef}>
            {/* Sclera (White part) */}
            <mesh>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshPhysicalMaterial
                    color="#0a0a0a"
                    emissive="#111111"
                    roughness={0.05}
                    metalness={0.9}
                    clearcoat={1}
                />
            </mesh>

            {/* Sub-surface Glow */}
            <mesh scale={1.01}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshPhongMaterial
                    color="#ff00ff"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Iris */}
            <mesh ref={irisRef} position={[0, 0, 1.2]}>
                <sphereGeometry args={[0.9, 64, 64, 0, Math.PI * 2, 0, Math.PI / 4]} />
                <meshPhysicalMaterial
                    color="#ff00ff"
                    emissive="#ff00ff"
                    emissiveIntensity={2}
                    roughness={0}
                    metalness={1}
                />
            </mesh>

            {/* Pupil (Lens style) */}
            <mesh position={[0, 0, 1.4]}>
                <sphereGeometry args={[0.45, 64, 64, 0, Math.PI * 2, 0, Math.PI / 6]} />
                <meshPhysicalMaterial
                    color="#000000"
                    roughness={0}
                    metalness={1}
                    clearcoat={1}
                />
            </mesh>

            {/* Cornea (Outer Glass Layer) */}
            <mesh position={[0, 0, 0.15]} scale={1.05}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshPhysicalMaterial
                    transparent
                    opacity={0.3}
                    roughness={0}
                    metalness={0.1}
                    clearcoat={1}
                    transmission={0.9}
                    thickness={1}
                    ior={1.5}
                />
            </mesh>

            {/* HUD Elements */}
            <group ref={hudRef}>
                <mesh ref={ring1Ref} position={[0, 0, 1.65]}>
                    <torusGeometry args={[1.05, 0.012, 16, 100]} />
                    <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
                </mesh>
                <mesh ref={ring2Ref} position={[0, 0, 1.72]}>
                    <torusGeometry args={[1.2, 0.004, 16, 100]} />
                    <meshBasicMaterial color="#ff00ff" transparent opacity={0.4} />
                </mesh>
            </group>

            {/* Internal Glow Light */}
            <pointLight position={[0, 0, 0.75]} intensity={3} distance={4} color="#ff00ff" />
        </group>
    );
};
