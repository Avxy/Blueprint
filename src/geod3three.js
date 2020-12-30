var scene,
  camera,
  cameras,
  cameraIndex,
  renderer,
  // cube,
  // tetrahedron,
  // octahedron,
  // dodecahedron,
  icosahedron,
  particle,
  group,
  player,
  clock,
  cubemap,
  moon;

init();

function init() {
  clock = new THREE.Clock();
  //===================================================== add Scene
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x0000ff);
  //===================================================== add Camera
  // camera = new THREE.PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   50,
  //   10000
  // );
  // camera.position.x = 0;
  // camera.position.y = 2000;
  // camera.position.z = 0;

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    50,
    10000
  );
  camera.position.set(0, 1000, 0);
  camera.lookAt(0, 1.5, 0);
  //===================================================== add front & back lighting
  var light = new THREE.DirectionalLight(new THREE.Color("white"), 3);
  light.position.set(1, 3, 2).normalize();
  scene.add(light);

  // var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
  // light.position.set(-1, -3, -2).normalize();
  // scene.add(light);

  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);

  const ballLight = new THREE.DirectionalLight(0xffffff, 3);
  ballLight.position.set(0, 2, 1);
  ballLight.target = moon;
  scene.add(ballLight.target);
  //===================================================== add Grid
  /*  var plane = new THREE.GridHelper(5000, 10);
  plane.material.color = new THREE.Color( 'white');
  scene.add(plane);*/

  //===================================================== add canvas
  // renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.toneMapping = THREE.LinearToneMapping;
  // document.body.appendChild(renderer.domElement);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //===================================================== add controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  //===================================================== add cubemap
  const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";

  cubemap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox1_`)
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

  scene.background = cubemap;
  //===================================================== add GLow
  // var renderScene = new THREE.RenderPass(scene, camera);
  // var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  // effectFXAA.uniforms["resolution"].value.set(
  //   1 / window.innerWidth,
  //   1 / window.innerHeight
  // );
  // var copyShader = new THREE.ShaderPass(THREE.CopyShader);
  // copyShader.renderToScreen = true;

  // var bloomStrength = 1;
  // var bloomRadius = 0;
  // var bloomThreshold = 0.5;
  // var bloomPass = new THREE.UnrealBloomPass(
  //   new THREE.Vector2(window.innerWidth, window.innerHeight),
  //   bloomStrength,
  //   bloomRadius,
  //   bloomThreshold
  // );

  // var composer = new THREE.EffectComposer(renderer);
  // composer.setSize(window.innerWidth, window.innerHeight);
  // composer.addPass(renderScene);
  // composer.addPass(effectFXAA);
  // composer.addPass(bloomPass);
  // composer.addPass(copyShader);
  //===================================================== player
  //Add meshes here
  player = new THREE.Group();
  scene.add(player);

  // const bodyGeometry = new THREE.CylinderBufferGeometry(10, 0.3, 1.6, 20);
  // const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  // const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  // bodyMesh.position.y = 140;
  // bodyMesh.scale.z = 0.5;
  // player.add(bodyMesh);
  const headGeometry = new THREE.SphereBufferGeometry(10, 20, 15);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
  });
  const headMesh = new THREE.Mesh(headGeometry, headMaterial);
  headMesh.position.y = 140;
  player.add(headMesh);
  //===================================================== camera
  cameras = [];
  cameraIndex = 0;

  const scrollCam = camera;
  scrollCam.position.copy(camera.position);
  player.add(scrollCam);
  cameras.push(scrollCam);

  const followCam = new THREE.Object3D();
  followCam.position.copy(camera.position);
  player.add(followCam);
  cameras.push(followCam);

  const frontCam = new THREE.Object3D();
  frontCam.position.set(0, 200, -120);
  player.add(frontCam);
  cameras.push(frontCam);

  const overheadCam = new THREE.Object3D();
  overheadCam.position.set(0, 200, 120);
  cameras.push(overheadCam);

  addKeyboardControl();

  const btn = document.getElementById("camera-btn");
  btn.addEventListener("click", changeCamera);

  //player control

  function addKeyboardControl() {
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
  }

  function keyDown(evt) {
    let forward =
      player.userData !== undefined && player.userData.move !== undefined
        ? player.userData.move.forward
        : 0;
    let turn =
      player.userData != undefined && player.userData.move !== undefined
        ? player.userData.move.turn
        : 0;

    switch (evt.keyCode) {
      case 87: //W
        forward = -1;
        break;
      case 83: //S
        forward = 1;
        break;
      case 65: //A
        turn = 1;
        break;
      case 68: //D
        turn = -1;
        break;
    }

    playerControl(forward, turn);
  }

  function keyUp(evt) {
    let forward =
      player.userData !== undefined && player.userData.move !== undefined
        ? player.userData.move.forward
        : 0;
    let turn =
      player.move != undefined && player.userData.move !== undefined
        ? player.userData.move.turn
        : 0;

    switch (evt.keyCode) {
      case 87: //W
        forward = 0;
        break;
      case 83: //S
        forward = 0;
        break;
      case 65: //A
        turn = 0;
        break;
      case 68: //D
        turn = 0;
        break;
    }

    playerControl(forward, turn);
  }

  function playerControl(forward, turn) {
    if (forward == 0 && turn == 0) {
      delete player.userData.move;
    } else {
      if (player.userData === undefined) player.userData = {};
      this.player.userData.move = { forward, turn };
    }
  }
  //===================================================== resize

  window.addEventListener("resize", resize, false);

  // update();
}
//===================================================== change camera
function changeCamera() {
  cameraIndex++;
  if (cameraIndex >= cameras.length) cameraIndex = 0;
}
//===================================================== data
const our_data = [
  {
    origin: { name: "Bogotá", latitude: 4.624335, longitude: -74.063644 },
    destination: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 }
  },
  {
    origin: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 },
    destination: { name: "Miami", latitude: 25.761681, longitude: -80.191788 }
  },
  {
    origin: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 },
    destination: { name: "New York", latitude: 40.73061, longitude: -73.935242 }
  },
  {
    origin: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 },
    destination: { name: "Britain", latitude: 51.509865, longitude: -0.118092 }
  },
  {
    origin: { name: "New York", latitude: 40.73061, longitude: -73.935242 },
    destination: { name: "Britain", latitude: 51.509865, longitude: -0.118092 }
  }
];

//===================================================== helper functions
const clamp = (num, min, max) => (num <= min ? min : num >= max ? max : num);

const DEGREE_TO_RADIAN = Math.PI / 180;

function coordinateToPosition(lat, lng, radius) {
  const phi = (90 - lat) * DEGREE_TO_RADIAN;
  const theta = (lng + 180) * DEGREE_TO_RADIAN;

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

//===================================================== d3.json
d3.json(
  "https://raw.githubusercontent.com/baronwatts/data/master/world.json",
  function (err, data) {
    //===================================================== crate canvas texturefor the globe
    var projection = d3.geo.equirectangular().translate([1024, 512]).scale(326);

    var countries = topojson.feature(data, data.objects.countries);

    var canvas = d3
      .select("body")
      .append("canvas")
      .style("display", "none")
      .attr("width", "2048px")
      .attr("height", "1024px");

    var context = canvas.node().getContext("2d");

    var path = d3.geo.path().projection(projection).context(context);

    context.strokeStyle = "white";
    context.lineWidth = 0.25;
    context.fillStyle = "#000";

    context.beginPath();

    path(countries);

    context.fill();
    context.stroke();

    var mapTexture = new THREE.Texture(canvas.node());
    mapTexture.needsUpdate = true;

    particle = new THREE.Object3D();
    scene.add(particle);

    var particleGeometry = new THREE.TetrahedronGeometry(2, 0);
    var particleMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    });

    for (var i = 0; i < 500; i++) {
      var particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
      particleMesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      particleMesh.position.multiplyScalar(90 + Math.random() * 700);
      particleMesh.rotation.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      );
      particle.add(particleMesh);
    }
    //===================================================== add globe
    group = new THREE.Group();
    scene.add(group);
    group.rotateX(Math.PI / 8);

    var RADIUS = 140;
    // var cRADIUS = RADIUS * 4;
    // var tRADIUS = RADIUS * 4;
    // var oRADIUS = RADIUS * 4;
    // var dRADIUS = RADIUS * 2;
    var iRADIUS = RADIUS * 12;

    var sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);
    var sphereMaterial = new THREE.MeshPhongMaterial({
      map: mapTexture,
      transparent: false,
      opacity: 1,
      color: new THREE.Color("white")
    });
    // var sphereMaterial = new THREE.MeshPhongMaterial({
    //   wireframe: false,
    //   cubemap: cubemap
    // });
    var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = "earth";
    group.add(earthMesh);

    //var metatron = new THREE.Object3D();

    // cube = new THREE.Object3D();
    // tetrahedron = new THREE.Object3D();
    // octahedron = new THREE.Object3D();
    // dodecahedron = new THREE.Object3D();
    // icosahedron = new THREE.Object3D();

    // scene.add(cube);
    // scene.add(tetrahedron);
    // scene.add(octahedron);
    // scene.add(dodecahedron);
    // scene.add(icosahedron);

    // var cubeGeometry = new THREE.BoxGeometry(cRADIUS, cRADIUS, cRADIUS);
    // var tetrahedronGeometry = new THREE.TetrahedronGeometry(tRADIUS, 0);
    // var octahedronGeometry = new THREE.OctahedronGeometry(oRADIUS, 0);
    // var dodecahedronGeometry = new THREE.DodecahedronGeometry(dRADIUS, 0);
    var icosahedronGeometry = new THREE.IcosahedronGeometry(iRADIUS, 0);

    var metaMaterial = new THREE.MeshPhongMaterial({ wireframe: true });

    // cube = new THREE.Mesh(cubeGeometry, metaMaterial);
    // tetrahedron = new THREE.Mesh(tetrahedronGeometry, metaMaterial);
    // octahedron = new THREE.Mesh(octahedronGeometry, metaMaterial);
    // dodecahedron = new THREE.Mesh(dodecahedronGeometry, metaMaterial);
    icosahedron = new THREE.Mesh(icosahedronGeometry, metaMaterial);

    // scene.add(cube);
    // scene.add(tetrahedron);
    // scene.add(octahedron);
    // scene.add(dodecahedron);
    scene.add(icosahedron);

    const ballGeometry = new THREE.SphereGeometry(72, 20, 15);
    // const material = new THREE.MeshStandardMaterial();
    const ballMaterial = new THREE.MeshLambertMaterial({
      wireframe: false,
      cubemap: cubemap
    });
    const sphere = new THREE.Mesh(ballGeometry, ballMaterial);

    //let ball;

    // for(let x=-2; x<=2; x+=200){
    //   for(let y=-2; y<=2; y+=200){
    //     for(let z=-2; z<=2; z+=200){
    moon = sphere.clone();
    // ball.position.set(x,y,z);
    moon.position.set(800, 0, 0);
    scene.add(moon);
    //     }
    //   }
    // }

    //scene.fog = new THREE.Fog( 0x605050, 10, 5000 );

    //===================================================== add glow effect to globe
    // var customMaterial = new THREE.ShaderMaterial({
    //   uniforms: {},
    //   vertexShader: document.getElementById("vertexShader").textContent,
    //   fragmentShader: document.getElementById("fragmentShader").textContent,
    //   side: THREE.BackSide,
    //   blending: THREE.AdditiveBlending,
    //   transparent: true
    // });

    // var ballGeometry = new THREE.SphereGeometry(170, 60, 60);
    // var ball = new THREE.Mesh(ballGeometry, customMaterial);
    // scene.add(ball);

    //===================================================== lng & lat
    function Destination(array) {
      array.map((d, i) => {
        //convert lng & lat coordinates to 3d space
        var startLat = d.origin.latitude;
        var startLng = d.origin.longitude;

        var endLat = d.destination.latitude;
        var endLng = d.destination.longitude;

        var x = -(
          RADIUS *
          Math.sin((90 - startLat) * (Math.PI / 180)) *
          Math.cos((startLng + 180) * (Math.PI / 180))
        );
        var z =
          RADIUS *
          Math.sin((90 - startLat) * (Math.PI / 180)) *
          Math.sin((startLng + 180) * (Math.PI / 180));
        var y = RADIUS * Math.cos((90 - startLat) * (Math.PI / 180));

        var x2 = -(
          RADIUS *
          Math.sin((90 - endLat) * (Math.PI / 180)) *
          Math.cos((endLng + 180) * (Math.PI / 180))
        );
        var z2 =
          RADIUS *
          Math.sin((90 - endLat) * (Math.PI / 180)) *
          Math.sin((endLng + 180) * (Math.PI / 180));
        var y2 = RADIUS * Math.cos((90 - endLat) * (Math.PI / 180));

        //store the starting and ending positions of each location
        var start = new THREE.Vector3(x, y, z);
        var end = new THREE.Vector3(x2, y2, z2);

        //points
        var pointGeom = new THREE.SphereGeometry(1, 10, 10);
        var point = new THREE.Mesh(
          pointGeom,
          new THREE.MeshBasicMaterial({ color: new THREE.Color("white") })
        );
        var point2 = new THREE.Mesh(
          pointGeom,
          new THREE.MeshBasicMaterial({ color: new THREE.Color("white") })
        );

        //spaces out the points
        point.position.set(x, y, z);
        point2.position.set(x2, y2, z2);
        point.lookAt(new THREE.Vector3(0, 0, 0));
        point2.lookAt(new THREE.Vector3(0, 0, 0));
        group.add(point);
        group.add(point2);

        //https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
        const CURVE_MIN_ALTITUDE = 5;
        const CURVE_MAX_ALTITUDE = 25;
        const altitude = clamp(
          start.distanceTo(end) * 0.75,
          CURVE_MIN_ALTITUDE,
          CURVE_MAX_ALTITUDE
        );

        //get the middle position of each location
        var lat = [startLng, startLat];
        var lng = [endLng, endLat];
        var geoInterpolator = d3.geoInterpolate(lat, lng);

        const midCoord1 = geoInterpolator(0.25);
        const midCoord2 = geoInterpolator(0.75);

        const mid1 = coordinateToPosition(
          midCoord1[1],
          midCoord1[0],
          RADIUS + altitude
        );
        const mid2 = coordinateToPosition(
          midCoord2[1],
          midCoord2[0],
          RADIUS + altitude
        );

        //create bezier curve from the lng & lat positions
        var curve = new THREE.CubicBezierCurve3(start, mid1, mid2, end);
        var g = new THREE.TubeGeometry(curve, 100, 0.35, 10, false);
        var m = new THREE.MeshBasicMaterial({
          color: new THREE.Color(
            "hsl(" + Math.floor(Math.random() * 360) + ",50%,50%)"
          )
        });
        curveObject = new THREE.Mesh(g, m);
        group.add(curveObject);
      });
    } //end Destination()

    Destination(our_data);

    //===================================================== add Animation

    update();
  }
); //end d3.json

function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);

  // composer.render();
  icosahedron.rotation.x += 0.001;
  icosahedron.rotation.y += 0.0001;
  particle.rotation.x += 0.0;
  particle.rotation.y -= 0.0002;

  const dt = clock.getDelta();

  if (player.userData !== undefined && player.userData.move !== undefined) {
    player.translateZ(player.userData.move.forward * dt * 25);
    player.rotateY(player.userData.move.turn * dt);
  }

  camera.position.lerp(
    cameras[cameraIndex].getWorldPosition(new THREE.Vector3()),
    0.05
  );
  const pos = player.position.clone();
  pos.y += 3;
  camera.lookAt(pos);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}