"use client";
import React, { useEffect,useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

const Claudia = (props) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('./models/Claudia.glb');
  const { setAnimations, animationIndex } = useCharacterAnimations();
  const { actions,names } = useAnimations(animations, group);
  console.log("actions=",actions);
  console.log("names=",names);

  useEffect(() => {
    setAnimations(names);
  }, [names]);

  useEffect(() => {
    actions[names[animationIndex]].reset().fadeIn(0.5).play();
    return () => {
      actions[names[animationIndex]].fadeOut(0.5);
    };
  }, [animationIndex]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature001" rotation={[Math.PI / 2, 0, 0]} scale={0.0001}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh name="rp_claudia_rigged_002_geo" geometry={nodes.rp_claudia_rigged_002_geo.geometry} material={materials['Material.001']} skeleton={nodes.rp_claudia_rigged_002_geo.skeleton} />
        </group>
      </group>
    </group>
  )
}
export default Claudia;
useGLTF.preload('./models/Claudia.glb');
