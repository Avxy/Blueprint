var mesh;

function fJenga() {
  const height = 1;
  const geometry = new THREE.BoxGeometry(3, height, 0.9);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("skyblue")
  });
  const mesh = new THREE.Mesh(geometry, material);

  //scene.add(mesh);

  for (let row = 0; row < 20; row++) {
    let yPos = row * (height + 0.05);
    let offset = -1;
    for (let count = 0; count < 3; count++) {
      const block = mesh.clone();
      if (row % 2) {
        block.rotation.y = Math.PI / 2;
        block.position.set(offset, yPos, 0);
      } else {
        block.position.set(0, yPos, offset);
      }
      scene.add(block);
      offset++;
    }
  }
}
