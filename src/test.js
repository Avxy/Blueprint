//===================================================== add Scene
var scene = new THREE.Scene();
//scene.background = new THREE.Color(0x0000ff);
//===================================================== add Camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);    
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 275;
//===================================================== add front & back lighting
var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
light.position.set(1, 3, 2).normalize();
scene.add(light);

var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
light.position.set(-1, -3, -2).normalize();
scene.add(light);
//===================================================== add Grid
/*  var plane = new THREE.GridHelper(5000, 10);
  plane.material.color = new THREE.Color( 'white');
  scene.add(plane);*/

//===================================================== add canvas
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.LinearToneMapping;
document.body.appendChild(renderer.domElement);

//===================================================== add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//===================================================== add GLow