"use client";
import { CameraControls, Environment, Gltf, OrbitControls,Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Teacher } from "./Teacher";
import { degToRad } from "three/src/math/MathUtils";
import { TypingBox } from "./TypingBox";
import { MessagesList } from "./MessagesList";
import React, { useState } from "react";


export const Experience = () => {
    const [typingBoxVisible, setTypingBoxVisible] = useState(true);
    
    const hideTypingBox = () => {
        setTypingBoxVisible(false);
    };
    const visibleTypingBox = () => {
        setTypingBoxVisible(true);
    };
    return (
        <>
            {typingBoxVisible && (
            <div className="z-10 md:justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
                <TypingBox hideTypingBox={hideTypingBox} visibleTypingBox={visibleTypingBox} />
            </div>
            )}
            <Canvas
                camera={{
                    position:[0,0,0.0001],
                }}  
            >
                <CameraManager/>
                <Environment preset="sunset" />
                <ambientLight intensity={0.8} color="pink" />
                {/*posicion del mensaje
                <Html position={[0.22,0.192,-3]} transform>
                    <MessagesList/>
                </Html>*/}
                <Html position={[0.22,0.192,-3]} transform distanceFactor={0.5}>
                    <MessagesList visibleTypingBox={visibleTypingBox} />
                </Html>
                <Teacher 
                    teacher={"Nanami"} 
                    position={[-1,-1.7,-3]} 
                    scale={1.5} 
                    rotation-y={degToRad(20)}
                />
                <Gltf src="/models/classroom_default.glb" position={[0.2,-1.7,-2]}/>
            </Canvas>
        </>
    );
};

const CameraManager = () =>{
    return (
        <CameraControls
            minZoom={1}
            maxZoom={3}
            polarRotateSpeed={-0.3} //reverse for natural effect
            azimuthRotateSpeed={-0.3} //reverse for natural effect
            mouseButtons={{
                left:1, //action rotate
                wheel:16, // action zoom
            }}
            touches={{
                one:32, //action touch rotate 
                two:512, //action touch zoom
            }}
        />
    );
};