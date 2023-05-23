import {useRef,useEffect,useState} from 'react';
import { EffectComposer, Bloom, RenderPass } from '@react-three/postprocessing';
import { TextureLoader, UniformsUtils } from 'three';
import * as THREE from 'three'
import { extend,useFrame,useLoader,useThree} from '@react-three/fiber'
import { OrbitControls, useGLTF,useTexture,Center, shaderMaterial,Environment,} from '@react-three/drei';
import portalVertexShader from './Shaders/portal/vertex.js'
import portalFragmentShader from './Shaders/portal/fragment.js'
import fireVertexShader from './Shaders/fire/vertex.js'
import fireFragmentShader from './Shaders/fire/fragment.js'

const PortalMaterial = shaderMaterial(
  {
    uTime:0,
    uColorStart: new THREE.Color('#1eff00'),
    uColorEnd: new THREE.Color('#108a00')
  },
  portalVertexShader,
  portalFragmentShader,
  (material) => {
    material.defines = { ...material.defines, BLOOM: true };
  }
);
extend({PortalMaterial})

const FireMaterial = shaderMaterial(
  { time: 0, noiseTexture: null, alphaTexture: null, gradientTexture: null },
  fireVertexShader,
  fireFragmentShader,
  (material) => {
    material.transparent = true;
    material.defines = { ...material.defines, BLOOM: true };
  }
);



extend({ FireMaterial })

console.log(portalVertexShader)

function App() {


  function DarkPortal(){
    const { nodes } = useGLTF('./model/darkportal4.glb')
  
    const bakedTexture = useTexture('./model/baked_lighting.jpg')
    bakedTexture.flipY = false
  
    const portalMaterial = useRef()
  
    const [eye1Color, setEye1Color] = useState("#f4ff26")
    const [eye2Color, setEye2Color] = useState("#f4ff26")
    const [eye3Color, setEye3Color] = useState("#f4ff26")
    const [eye4Color, setEye4Color] = useState("#f4ff26")
  
    // Blink function
    const blink = (setColor, initialDelay, blinkInterval) => {
      setTimeout(() => {
        setColor("black");
        setTimeout(() => {
          setColor("#f4ff26");
        }, 200);
      }, initialDelay);
      setInterval(() => {
        setColor("black");
        setTimeout(() => {
          setColor("#f4ff26");
        }, 200);
      }, blinkInterval);
    };
  
    // Eye1 and Eye2 blink
    useEffect(() => {
      blink(setEye1Color, 8000, 8025);
      blink(setEye2Color, 8000, 8025);
    }, []);
  
    // Eye3 and Eye4 blink
    useEffect(() => {
      blink(setEye3Color, 9000, 9025);
      blink(setEye4Color, 9000, 9025);
    }, []);
  
    useFrame((state, delta) => {
      portalMaterial.current.uTime += delta
    })
  
    return(
      <>
        <mesh geometry={nodes.baked_object.geometry}>
          <meshBasicMaterial map={bakedTexture}> 
          </meshBasicMaterial>
        </mesh>
        <mesh 
          geometry={nodes.eye1.geometry}
          position={nodes.eye1.position}
        >
          <meshBasicMaterial color={eye1Color}></meshBasicMaterial>
        </mesh>
        <mesh 
          geometry={nodes.eye2.geometry}
          position={nodes.eye2.position}
        >
          <meshBasicMaterial color={eye2Color}></meshBasicMaterial>
        </mesh>
        <mesh 
          geometry={nodes.eye3.geometry}
          position={nodes.eye3.position}
        >
          <meshBasicMaterial color={eye3Color}></meshBasicMaterial>
        </mesh>
        <mesh 
          geometry={nodes.eye4.geometry}
          position={nodes.eye4.position}
        >
          <meshBasicMaterial color={eye4Color}></meshBasicMaterial>
        </mesh>
        <mesh 
          geometry={nodes.portal.geometry}
          position={nodes.portal.position}
          rotation={nodes.portal.rotation}
        >
          <portalMaterial ref={portalMaterial} stencilWrite mask></portalMaterial> 
        </mesh>
      </>
    )
  }
 
 
  function BigRock(){
    const { nodes } = useGLTF('./model/bigrock2.glb')

    const bakedTexture = useTexture('./model/baked_rock.jpg')
    bakedTexture.flipY = false


    console.log('rock node',nodes)

    return(
      <>
          <mesh geometry={nodes.baked_rock.geometry}>
            <meshBasicMaterial map={bakedTexture}> 
            </meshBasicMaterial>
          </mesh>
      </>
    )

  }

  function Frag(){
    const { nodes } = useGLTF('./model/frags.glb')
  
    const bakedTexture = useTexture('./model/frag.jpg')
    bakedTexture.flipY = false
  
    // Refs for the mesh so we can update them on each frame
    const fragRefs = [useRef(), useRef(), useRef(), useRef(), useRef()]
  
    // The useFrame hook will be called on each frame
    useFrame((state, delta) => {
      fragRefs.forEach((ref, i) => {
        if (ref.current) {
          // Change the y position based on time to create a floating effect
          ref.current.position.y = Math.sin(state.clock.elapsedTime + i) * 0.7
        }
      })
    })
  
    console.log('frag',nodes)
  
    return(
      <>
          {fragRefs.map((ref, i) => (
            <mesh ref={ref} geometry={nodes[`frag${i+1}`].geometry} key={i}>
              <meshBasicMaterial map={bakedTexture} />
            </mesh>
          ))}
      </>
    )
  
  }

  function Fire(){
    const { nodes } = useGLTF('./model/fire.glb')
    const noiseTexture = useLoader(TextureLoader, './model/fire_noise.jpg');
    const alphaTexture = useLoader(TextureLoader, './model/fire_alpha.jpg');
    const gradientTexture = useLoader(TextureLoader, './model/fire_gradient.jpg'); // Load gradient texture
    

    const fireMaterial1 = useRef();
    const fireMaterial2 = useRef();
    const fireMaterial3 = useRef();

    useFrame((state) => {
      fireMaterial1.current.uniforms.time.value = state.clock.getElapsedTime();
      fireMaterial1.current.uniforms.noiseTexture.value = noiseTexture;
      fireMaterial1.current.uniforms.alphaTexture.value = alphaTexture;
      fireMaterial1.current.uniforms.gradientTexture.value = gradientTexture;

      fireMaterial2.current.uniforms.time.value = state.clock.getElapsedTime();
      fireMaterial2.current.uniforms.noiseTexture.value = noiseTexture;
      fireMaterial2.current.uniforms.alphaTexture.value = alphaTexture;
      fireMaterial2.current.uniforms.gradientTexture.value = gradientTexture;

      fireMaterial3.current.uniforms.time.value = state.clock.getElapsedTime();
      fireMaterial3.current.uniforms.noiseTexture.value = noiseTexture;
      fireMaterial3.current.uniforms.alphaTexture.value = alphaTexture;
      fireMaterial3.current.uniforms.gradientTexture.value = gradientTexture;
    });

    return(
      <>
          <mesh geometry={nodes.fire1.geometry}>
            <primitive attach="material" object={new FireMaterial({ noiseTexture: noiseTexture, alphaTexture: alphaTexture,gradientTexture:gradientTexture })} ref={fireMaterial1} stencilWrite mask />
          </mesh>
          <mesh geometry={nodes.fire2.geometry}>
            <primitive attach="material" object={new FireMaterial({ noiseTexture: noiseTexture, alphaTexture: alphaTexture,gradientTexture:gradientTexture })} ref={fireMaterial2} stencilWrite mask />
          </mesh>
          <mesh geometry={nodes.fire3.geometry}>
            <primitive attach="material" object={new FireMaterial({ noiseTexture: noiseTexture, alphaTexture: alphaTexture,gradientTexture:gradientTexture })} ref={fireMaterial3} stencilWrite mask />
          </mesh>
      </>
    )

  }



  return (
    <>      
      <Environment files="./model/background.hdr" background blur={0.05} />
      <OrbitControls />
      <EffectComposer>
        <Bloom luminanceThreshold={0.01} luminanceSmoothing={0.2} height={300} />
      </EffectComposer>
        <Center>
          <DarkPortal></DarkPortal>
          <BigRock></BigRock>
          <Frag></Frag>
          {/* <Fire></Fire> */}
        </Center>
    </>

  );
}
export default App;
