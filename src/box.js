var box;

function boxFunction() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("skyblue")
  });
  box = new THREE.Mesh(geometry, material);
  scene.add(box);
}
