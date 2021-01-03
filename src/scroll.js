function addModelToBG() {
  //Variables for setup

  let container;
  let camera;
  let renderer;
  let scene;
  let box;

  function init() {
    container = document.querySelector(".scene.one");

    //Create scene
    scene = new THREE.Scene();

    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.9;
    const far = 1000;

    //Camera setup
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    //Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    function render() {
      renderer.render(scene, camera);
    }

    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshNormalMaterial();
    var box = new THREE.Mesh(geometry, material);
    box.scale.set(1.0, 1.0, 1.0);
    box.position.set(0.0, 0.0, 0.0);
    scene.add(box);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  init();

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", onWindowResize);

  gsap.registerPlugin(ScrollTrigger);

  scene.rotation.set(0, 1.88, 0);
  camera.position.set(2, 0, 5);

  ScrollTrigger.defaults({
    immediateRender: false,
    ease: "power1.inOut"
  });

  let car_anim_tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-two",
      start: "top top",
      endTrigger: ".section-five",
      end: "bottom bottom",
      scrub: 1
    }
  });

  car_anim_tl
    .to(scene.rotation, { y: 4.79 })
    .to(camera.position, { x: -0.1 })
    .to(scene.rotation, { z: 1.6 })
    .to(scene.rotation, { z: 0.02, y: 3.1 }, "simultaneously")
    .to(camera.position, { x: 0.16 }, "simultaneously")
    .to(".scene.one", { opacity: 0, scale: 0 }, "simultaneously");
}
addModelToBG();

var colorChanged = false;

$(".button").on("click", changeBG);

function changeBG() {
  if (!colorChanged) {
    gsap.to("section", { backgroundColor: "white" });
    colorChanged = true;
  } else {
    gsap.to("section", { backgroundColor: "" });
    colorChanged = false;
  }
}
