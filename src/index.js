var scene, camera, renderer, box;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("skyblue")
  });
  box = new THREE.Mesh(geometry, material);
  scene.add(box);

  const light = new THREE.DirectionalLight();
  light.position.set(0, 1, 2);
  scene.add(light);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onResize, false);

  update();
}

function update() {
  requestAnimationFrame(update);
  box.rotation.y += 0.01;
  //box2.rotation.y -= 0.01;
  //box3.rotation.y -= 0.01;
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
