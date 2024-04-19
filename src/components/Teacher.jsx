import {useRef,useState,useEffect} from  'react';
import { useAITeacher } from "@/hooks/useAITeacher";
import { useGLTF,useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

export const teachers = ["Nanami","Naoki","Octopus","Totoro","Biomech","Claudia"];

export const Teacher = ({teacher,animationIndex,changeAnimation, ...props}) =>{
    const group = useRef();
    const  [animaciones,setAnimaciones] = useState([]);
    //const [animationIndex,setAnimationIndex]  = useState(0);
    const {scene,animations} = useGLTF(`/models/Teacher_${teacher}.glb`);
    const {actions,names} = useAnimations(animations,group);
    //const {scene} = useGLTF(`/models/Octopus.glb`);
    const currentMessage = useAITeacher((state) => state.currentMessage);
    const loading = useAITeacher((state) => state.loading);

    const lerpMorphTarget = (target,value,speed=0.01)=>{
        scene.traverse((child) => {
            if(child.isSkinnedMesh && child.morphTargetDictionary){
                const index =child.morphTargetDictionary[target];
                if(
                    index === undefined ||
                    child.morphTargetInfluences[index] === undefined
                ){
                    return;
                }
                child.morphTargetInfluences[index] = MathUtils.lerp(
                    child.morphTargetInfluences[index],
                    value,
                    speed
                );
            }
        });
    };

    useFrame(() =>{
        for(let i = 0;i<=21; i++){
            lerpMorphTarget(i,0,0.1);//reset morph targets
        }
        if(currentMessage && currentMessage.visemes && currentMessage.audioPlayer){
            for(let i = currentMessage.visemes.length - 1;i>=0;i--){
                const viseme = currentMessage.visemes[i];
                if(currentMessage.audioPlayer.currentTime * 1000 >= viseme[0]){
                    lerpMorphTarget(viseme[1],1,0.2);
                    break;
                };
            };
        }
    });
      

    useEffect(() => {
        setAnimaciones(names);
    }, [names]);
    
    /*useEffect(() => {
    actions[names[animationIndex]].reset().fadeIn(0.5).play();
    return () => {
        actions[names[animationIndex]].fadeOut(0.5);
    };
    }, [animationIndex]);*/
    useEffect(() => {
        if (names.length > 0 && animationIndex >= 0 && animationIndex < names.length) {
            actions[names[animationIndex]].reset().fadeIn(0.5).play();
            return () => {
                actions[names[animationIndex]].fadeOut(0.5);
            };
        }
    }, [animationIndex, actions, names]);


    
    useEffect(() => {
        if (loading) {
            changeAnimation(4);
            console.log("pensando");
        } else if (currentMessage) {
            changeAnimation(3);
            console.log("hablar")
          //setAnimation(randInt(0, 1) ? "Talking" : "Talking2");
        } /*else {
            console.log("nose");
          //setAnimation("Idle");
        }*/
    }, [currentMessage, loading]);

    useEffect(() => {
        if (!currentMessage && !loading) {
            changeAnimation(4);
            console.log("Terminó de hablar");
        }
    }, [currentMessage, loading]);
    

    console.log(names);
    return  (
        <group ref={group} {...props}>
            <primitive object={scene}/>
        </group>
    );
};

teachers.forEach((teacher) => {
    useGLTF.preload(`/models/Teacher_${teacher}.glb`);
});