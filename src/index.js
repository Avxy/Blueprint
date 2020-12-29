var scene, camera, renderer;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  //camera.position.z = 2;
  camera.position.set(0, 3, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //boxFunction();
  fJenga();

  window.addEventListener("resize", onResize, false);

  const light = new THREE.DirectionalLight();
  light.position.set(0, 1, 2);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 4, 0);
  controls.update();

  update();
}

function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
  mesh.rotation.y += 0.01;
  //box2.rotation.y -= 0.01;
  //box3.rotation.y -= 0.01;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
