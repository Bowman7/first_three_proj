import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { BoxGeometry } from 'three';

import hut from '../img/hut.jpeg';
import nebula from '../img/nebula.jpg';
import star from '../img/star.jpg';

const renderer=new THREE.WebGL1Renderer();

renderer.shadowMap.enabled=true;
renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene =new THREE.Scene();

const camera =new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);

const axedHelper=new THREE.AxesHelper(5);
scene.add(axedHelper);

const orbit=new OrbitControls(camera,renderer.domElement);

camera.position.set(-10,30,30);

orbit.update();

//box
const boxGeometry=new  THREE.BoxGeometry();
const boxMaterial= new THREE.MeshBasicMaterial({color: 0x00FF00});
const box=new THREE.Mesh(boxGeometry,boxMaterial);
scene.add(box);

//plane

const planeGeometry= new THREE.PlaneGeometry(30,30);
const planeMaterial= new THREE.MeshStandardMaterial({color: 0xFFFFFF,side: THREE.DoubleSide});
const plane=new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane)
plane.rotation.x=-0.5 *Math.PI;
plane.receiveShadow=true;

//grid helper

const gridHelper= new THREE.GridHelper(30);
scene.add(gridHelper);

//sphere1
const sphereGeometry= new THREE.SphereGeometry(4,50,50);
const sphereMaterial=new THREE.MeshStandardMaterial({ 
    color: 0x0000FF,
    wireframe: false});
const sphere=new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);

//triangle2
const coneGeometry=new THREE.ConeGeometry(5,10,10);
const coneMaterial=new THREE.MeshStandardMaterial({color:0x0000FF,wireframe:false});
const cone=new THREE.Mesh(coneGeometry,coneMaterial);
scene.add(cone);

cone.position.set(+10,10,0);


//position

sphere.position.set(-10,10,0);
sphere.castShadow=true;


//ambient light

const ambientLight=new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//directional light

// const directionalLight=new THREE.DirectionalLight(0xFFFFFF,0.8);
// directionalLight.position.set(-30,50,0);
// directionalLight.castShadow=true;
// directionalLight.shadow.camera.bottom=-12;

// scene.add(directionalLight);
// //directional light helper

// const dLightHelper=new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dLightHelper);

// //dlight shadoe helper
// const dLightShadowHelper=new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

//spot light

const spotLight=new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);

spotLight.position.set(-100,100,0);
spotLight.castShadow=true;
spotLight.angle=0.2;

//spot light helper
const sLightHelper=new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//fog1

//scene.fog=new THREE.Fog(0xFFFFFF,0,200);

//fog2
scene.fog=new THREE.FogExp2(0xFFFFFF,0.01);

//change background
//renderer.setClearColor(0xFFEA00);
//texture loader

const textureLoader=new THREE.TextureLoader();
scene.background=textureLoader.load(star);

//cube background
const cubeTextureLoader=new THREE.CubeTextureLoader();
scene.background=cubeTextureLoader.load([
   nebula,
   nebula,
   star,
   star,
   star,
   star
    ]);
//setting up a cube and setting background to its faces

const box2Geometry=new THREE.BoxGeometry(4,4,4);
const box2Material=new THREE.MeshBasicMaterial({
    //color:0x00FF00,
    //map:textureLoader.load(nebula)

});
const box2MultiMaterial=[
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),

]
const box2=new THREE.Mesh(box2Geometry,box2MultiMaterial);
scene.add(box2);
//box2.material.map=textureLoader.load(nebula);

box2.position.set(0,15,10);

//change the shape of the mesh using mouse by creating a 10x10 plane
const plane2Geometry=new THREE.PlaneGeometry(10,10,10,10);
const plane2Material= new THREE.MeshBasicMaterial({color:0xFFFFFF,wireframe: true});
const plane2=new THREE.Mesh(plane2Geometry,plane2Material);
scene.add(plane2);
plane2.position.set(10,15,10);
//inorder to change the positions of these points we can use vertex shader or simply use js ,we use js
//position of all the points that form the geomtery of a mesh are located in an array in geo attribute property each set of three elements in a n array represent the
//x,y and z axis values of a point, to change the first vertex of a plane we need to change the first three values
plane2.geometry.attributes.position.array[0]-=10*Math.random();
plane2.geometry.attributes.position.array[1]-=10*Math.random();
plane2.geometry.attributes.position.array[2]-=10*Math.random();

//to change the z vertex of last element  we need to change the last vertex of the array
const lastPointZ=plane2.geometry.attributes.position.array.length-1;
plane2.geometry.attributes.position.array[lastPointZ]-=10*Math.random();

//sphere geometry using shader material class
//vShader is a string that contains the vertex shader code
const vShader=`
    void main()
    {
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);

    }
`;
//FShader is also a string that contains the fragment shader code

const FShader=`
    void main()
    {
        gl_FragColor=vec4();

    }
`;
const sphere2Geometry=new THREE.SphereGeometry(4);
const sphere2Material=new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: FShader
});

const sphere2=new THREE.Mesh(sphereGeometry,sphere2Material);
scene.add(sphere2);
sphere2.position.set(15,10,10);
//gui

const gui=new dat.GUI();

const options={
    sphereColor: '#ffea00',
    wireframe:false,
    speed:0.01,
    angle :0.2,
    penumbra:0,
    intensity: 1
};
//change color
gui.addColor(options,'sphereColor').onChange(function(e)
{
    sphere.material.color.set(e);

})
//wireframe on or off for sphere
gui.add(options,'wireframe').onChange(function(e)
{
    sphere.material.wireframe=e;

})
//box wireframe
gui.add(options,'wireframe').onChange(function(e)
{
    box.material.wireframe=e;

})
//bounce control gui

gui.add(options,'speed',0,0.1);

//gui for spotlight 
gui.add(options,'angle',0,1);
gui.add(options,'penumbra',0,1);
gui.add(options,'intensity',0,1);

//bounce the sphere

let step=0;

//get and catch mouse position

const mousePosition=new THREE.Vector2();

window.addEventListener('mousemove',function(e){
    mousePosition.x=(e.clientX/this.window.innerWidth)*2-1;
    mousePosition.y=(e.clientY/this.window.innerHeight)*2-1;

});
//instance of raycaster class
const rayCaster=new THREE.Raycaster();

//three provides an element id to each mesh 
const sphereId=sphere.id;
//using name and add a condition within the loop based on the name of the box
box2.name='thebox';
function animate(time )
{
    box.rotation.x=time/1000;
    box.rotation.y=time/1000;
    cone.rotation.y=time/1000;

    //bounce animation
    step+=options.speed;
    sphere.position.y=10* Math.abs(Math.sin(step));

    //spotlight gui
    spotLight.angle=options.angle;
    spotLight.penumbra=options.penumbra;
    spotLight.intensity=options.intensity;
    sLightHelper.update();
    //setting two ends of the ray which is camera and mouse position
    rayCaster.setFromCamera(mousePosition,camera);
    //contains any element from the scene that intersects with the ray
    const intersects=rayCaster.intersectObjects(scene.children);
    console.log(intersects);
    //change the color of sphere to red when it intersects with mouse
    for(let i=0;i<intersects.length;i++)
    {
        if(intersects[i].object.id===sphereId)
        {
            intersects[i].object.material.color.set(0xFF0000);

        }
        if(intersects[i].object.name==='thebox')
        {
            intersects[i].object.rotation.x=time/1000;
            intersects[i].object.rotation.y=time/1000;

        }

    }
    renderer.render(scene,camera);
    //plane vertext changes
    plane2.geometry.attributes.position.array[0]=10*Math.random();
    plane2.geometry.attributes.position.array[1]=10*Math.random();
    plane2.geometry.attributes.position.array[2]=10*Math.random();
    plane2.geometry.attributes.position.array[lastPointZ]=10*Math.random();
    plane2.geometry.attributes.position.needsUpdate=true;
    
}
renderer.setAnimationLoop(animate);
renderer.render(scene,camera);