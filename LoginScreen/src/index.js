import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Form from './Form.jsx';
import { Canvas } from 'react-three-fiber';
import './Index.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Form/> */}
    <Canvas
    flat
    gl={{ antialias: true }}
    camera={
      {
        fov:45,
        near:0.1,
        far:200,
        position:[1,2,6]

      }
    }
    >
     <App />
    </Canvas>
  </React.StrictMode>
);


