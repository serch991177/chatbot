import { useAITeacher } from "@/hooks/useAITeacher";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

export const teachers = ["Nanami","Naoki","Octopus","Totoro","Biomech","Claudia"];

export const Teacher = ({teacher, ...props}) =>{
    const {scene} = useGLTF(`/models/Teacher_${teacher}.glb`);
    //minute 35:05
    //const {scene} = useGLTF(`/models/Octopus.glb`);
    const currentMessage = useAITeacher((state) => state.currentMessage);

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

    return  (
        <group {...props}>
            <primitive object={scene}/>
        </group>
    );
};

teachers.forEach((teacher) => {
    useGLTF.preload(`/models/Teacher_${teacher}.glb`);
});