console.log(
  "touchscreen is",
  VirtualJoystick.touchScreenAvailable() ? "available" : "not available"
);

var joystick = new VirtualJoystick({
  container: document.getElementById("container"),
  mouseSupport: true
});
joystick.addEventListener("touchStart", function () {
  console.log("down");
});
joystick.addEventListener("touchEnd", function () {
  console.log("up");
});

setInterval(function () {
  var outputEl = document.getElementById("result");
  outputEl.innerHTML =
    "<b>Result:</b> " +
    " dx:" +
    joystick.deltaX() +
    " dy:" +
    joystick.deltaY() +
    (joystick.right() ? " right" : "") +
    (joystick.up() ? " up" : "") +
    (joystick.left() ? " left" : "") +
    (joystick.down() ? " down" : "");
}, (1 / 30) * 1000);

cameras = [];

for (let x = 0; x < 2; x++) {
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 150);
  if (x == 0) {
    camera.position.set(0, 0, 15);
    helper = new THREE.CameraHelper(camera);
    scene.add(helper);
    helper.visible = false;
  } else {
    camera.position.set(-48, 0, 8);
    camera.lookAt(-25, 0, -25);
  }

  cameras.push(camera);
}

camera = cameras[0];

const controls0 = new THREE.OrbitControls(cameras[0], renderer.domElement);

const controls1 = new THREE.OrbitControls(cameras[1], renderer.domElement);
controls1.target.set(0, 0, 5);
controls1.update();
controls1.enabled = false;

const gui = new dat.GUI();
const params = {
  camera: "main camera",
  fov: 75,
  near: 0.1,
  far: 100
};
gui
  .add(params, "camera", ["main camera", "helper view"])
  .onChange((value) => {
    if (value === "main camera") {
      camera = cameras[0];
      controls0.enabled = true;
      controls1.enabled = false;
      helper.visible = false;
      controls0.update();
    } else {
      camera = cameras[1];
      controls0.enabled = false;
      controls1.enabled = true;
      helper.visible = true;
      controls1.update();
    }
  });
gui
  .add(params, "fov")
  .min(20)
  .max(80)
  .step(1)
  .onChange((value) => {
    cameras[0].fov = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });
gui
  .add(params, "near")
  .min(0.1)
  .max(20)
  .step(0.1)
  .onChange((value) => {
    cameras[0].near = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });
gui
  .add(params, "far")
  .min(5)
  .max(100)
  .step(1)
  .onChange((value) => {
    cameras[0].far = value;
    cameras[0].updateProjectionMatrix();
    helper.update();
  });

window.addEventListener("resize", resize, false);

update();

function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
  cameras.forEach((subcamera) => subcamera.rotation.copy(camera.rotation));
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}