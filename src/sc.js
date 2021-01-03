var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(5, 7, 10);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var boxGeom = new THREE.BoxBufferGeometry(7, 7, 7, 10, 10, 10);

// this is the shortened part from the official example to create the sphere morph targets
var pos = boxGeom.attributes.position;
boxGeom.morphAttributes.position = [];
var spherePositions = [];
var v3 = new THREE.Vector3();
for (var i = 0; i < pos.count; i++) {
  v3.fromBufferAttribute(pos, i).setLength((3.5 * Math.sqrt(3) + 3.5) * 0.5);
  spherePositions.push(v3.x, v3.y, v3.z);
}
boxGeom.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

var boxMat = new THREE.MeshBasicMaterial({
  color: "aqua",
  wireframe: true,
  morphTargets: true
});
var box = new THREE.Mesh(boxGeom, boxMat);
scene.add(box);

// user's custom properties and methods
box.userData.isHovering = false;
box.userData.currentAction = null;
box.userData.toSphere = () => {
  action(1);
}
box.userData.toBox = () => {
  action(0);
}

// tweening function
function action(influence) {

  if (box.userData.currentAction) box.userData.currentAction.stop();
  
  box.userData.currentAction = new TWEEN.Tween(box.morphTargetInfluences).to({
    "0": influence
  }, 1000).start();
  
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersects = [];

window.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  
  intersects = raycaster.intersectObject(box);
  
  if (intersects.length > 0) {
  
    if (!box.userData.isHovering) {
    
      box.userData.toSphere();
      box.userData.isHovering = true;
      
    };
  } else {
  
    if (box.userData.isHovering) {
    
      box.userData.toBox();
      box.userData.isHovering = false;
      
    }
  }
}

renderer.setAnimationLoop(() => {

  TWEEN.update();
  renderer.render(scene, camera)
  
});