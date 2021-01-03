var scene, camera, renderer, container, box;

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

  window.addEventListener("resize", onResize, false);

  const light = new THREE.DirectionalLight();
  light.position.set(0, 1, 2);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 4, 0);
  controls.update();



  //=====load
  const texture = new THREE.TextureLoader().load( 'textures/land_ocean_ice_cloud_2048.jpg' );

  // immediately use the texture for material creation
  const material = new THREE.MeshBasicMaterial( { map: texture } );
  scene.add(material);
  var boxGeometry = new THREE.BoxGeometry(1,1,1);
  var boxMaterial = new THREE.MeshBasicMaterial();
  var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(boxMesh);







  update();
}

function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
  //mesh.rotation.y += 0.01;
  //box2.rotation.y -= 0.01;
  //box3.rotation.y -= 0.01;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
