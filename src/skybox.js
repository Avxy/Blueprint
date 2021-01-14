//The future of education starts with your experimentation. explore your world though different dimensions. connect your information, build knolegde and share your experience


var scene, camera, renderer, box;
var clock, binormal, normal, tube, player, particle;
var envMap;
var startTime = Date.now();
var scrollY = 0;
var _event = {
  y: 0,
  deltaY: 0
};
var timeline = null;
var percentage = 0;
var point;
var point2;
var cube;
var sphere;
var group;
var iGroup;
var iMesh;
var bPlane;
var bBox01;
var createText;
var maxHeight = 7199;
var cameras;
var cameraIndex;
var controls;
var playerPos;
var t_mes;
var text;

init();

function init() {
  const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";
  scene = new THREE.Scene();
  envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox1_`)
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
  //scene.background = envMap;
  //scene.background = new THREE.Color(0xaaaaaa);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 250;
  camera.lookAt(0, 1.5, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 140, 200);
  scene.add(light);

  const light00 = new THREE.DirectionalLight(0xffffff, 1);
  light00.position.set(0, 0, 0);
  scene.add(light00);

  clock = new THREE.Clock();

  //controls = new THREE.OrbitControls(camera, renderer.domElement);

  geod3();
  objMesh();
  metaMesh();
  tubeMesh();
  playerCam();
  initTimeline();
  loadFont();
  //textFF();
  // preload();
  // setupP5();
  console.log();

  window.addEventListener("resize", resize, false);
  //window.addEventListener("resize", resize, { passive: false });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", touch, {passive: false} );

  update();
}

function loadFont() {
  var loader = new THREE.FontLoader();
  loader.load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/254249/helvetiker_regular.typeface.json",
    function (res) {
      textMesh(res);
    }
  );
}
function textMesh(font) {
  const textGeo = new THREE.TextGeometry("Blueprint", {
    font: font,
    size: 10,
    height: 0.5,
    curveSegments: 1,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0.3,
    bevelOffset: 0,
    bevelSegments: 5
  });
  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();
  var cubeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  text = new THREE.Mesh(textGeo, cubeMat);
  text.position.set(0, 250, -50);
  text.castShadow = true;
  text.scale.set(5, 3, 1);
  scene.add(text);
}

function initTimeline() {
  var options = {
    opacityIn: [0, 1],
    scaleIn: [0.2, 1],
    scaleOut: 3,
    durationIn: 800,
    durationOut: 600,
    delay: 500,
    easing: "easeInExpo"
  };
  //timeline = anime.timeline({ loop: true });
  timeline = anime.timeline({
    autoplay: false,
    duration: 64000,
    easing: "easeOutSine"
  });

  timeline.add({
    targets: ".text-animation .one",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .one",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });
  timeline.add({
    targets: ".text-animation .two",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .two",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });
  timeline.add({
    targets: ".text-animation .three",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .three",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  timeline.add({
    targets: player.position,
    x: 0,
    y: 0,
    z: 300,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: bPlane.scale,
    x: 10,
    y: 10,
    z: 10,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: iMesh.scale,
    x: 0.07,
    y: 0.07,
    z: 0.07,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: iMesh.rotation,
    x: Math.PI / 2,
    y: Math.PI,
    z: (Math.PI * 3) / 2,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: bBox01.position,
    x: 0,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: bBox01.rotation,
    x: 0,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: ".text-animation .four",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .four",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  timeline.add({
    targets: bBox01.rotation,
    x: 0,
    y: Math.PI / 2,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: ".text-animation .five",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .five",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  timeline.add({
    targets: bBox01.rotation,
    x: 0,
    y: Math.PI,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: ".text-animation .six",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .six",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  timeline.add({
    targets: bBox01.rotation,
    x: 0,
    y: (Math.PI * 3) / 2,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: ".text-animation .seven",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .seven",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  timeline.add({
    targets: bBox01.rotation,
    x: 0,
    y: Math.PI * 2,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: ".text-animation .eight",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .eight",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });
    timeline.add({
    targets: bBox01.position,
    x: 0,
    y: -5000,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  // timeline.add({
  //   targets: camera.position,
  //   x: 0,
  //   y: 300,
  //   z: -100,
  //   duration: 1000,
  //   update: camera.updateProjectionMatrix()
  // });

  timeline.add({
    targets: player.position,
    x: 0,
    y: 300,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: player.rotation,
    x: Math.PI/4*-1,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: player.position,
    x: 0,
    y: 0,
    z: -140,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });
  timeline.add({
    targets: iMesh.scale,
    x: 1,
    y: 1,
    z: 1,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: player.position,
    x: 0,
    y: -100,
    z: -150,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  // timeline.add({
  //   targets: player.rotation,
  //   x: 0,
  //   y: 0,
  //   z: Math.PI/2,
  //   duration: 1000,
  //   update: camera.updateProjectionMatrix()
  // });

  timeline.add({
    targets: ".text-animation .nine",
    opacity: options.opacityIn,
    scale: options.scaleIn,
    duration: options.durationIn
  });
  timeline.add({
    targets: ".text-animation .nine",
    opacity: 0,
    scale: options.scaleOut,
    easing: options.easing,
    duration: options.durationOut,
    delay: options.delay
  });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: Math.PI / 2,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: Math.PI,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: (Math.PI * 3) / 2,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });

  //   timeline.add({
  //     targets: cube.rotation,
  //     x: Math.PI * 2,
  //     y: 0,
  //     z: 0,
  //     duration: 4000,
  //     update: camera.updateProjectionMatrix()
  //   });
}

function onWheel(e) {
  // for embedded demo
  e.stopImmediatePropagation();
  e.preventDefault();
  e.stopPropagation();

  var evt = _event;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast
  evt.deltaY *= 5;

  scroll(e);
}

function touch(e) {
  // for embedded demo
  e.stopImmediatePropagation();
  e.preventDefault();
  e.stopPropagation();

  var evt = _event;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast
  evt.deltaY *= 5;

  scroll(e);
}

function scroll(e) {
  var evt = _event;
  // limit scroll top
  if (evt.y + evt.deltaY > 0) {
    evt.y = 0;
    // limit scroll bottom
  } else if (-(evt.y + evt.deltaY) >= maxHeight) {
    evt.y = -maxHeight;
  } else {
    evt.y += evt.deltaY;
  }
  scrollY = -evt.y;
}



function tubeMesh() {
  //Add meshes here
  const curve = new THREE.Curves.TrefoilKnot(30);
  const geometry = new THREE.TubeBufferGeometry(curve, 100, 2, 8, true);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffffff,
    side: THREE.DoubleSide,
    visible: false
  });
  tube = new THREE.Mesh(geometry, material);
  scene.add(tube);

  binormal = new THREE.Vector3();
  normal = new THREE.Vector3();
}

function objMesh() {
  cube = new THREE.Mesh(
    new THREE.CubeGeometry(0.1, 0.1, 0.1),
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
  );
  cube.position.x = 0;
  cube.position.y = 140;
  cube.position.z = 0;
  scene.add(cube);

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 20, 15),
    new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
  );
  sphere.position.x = 0;
  sphere.position.y = 140;
  sphere.position.z = 0;
  scene.add(sphere);

  bBox01 = new THREE.Mesh(
    new THREE.CubeGeometry(500, 500, 500),
    new THREE.MeshLambertMaterial({
      color: "rgb(9,55,89)",
      side: THREE.DoubleSide
    })
  );
  bBox01.rotation.x = 0.5;
  bBox01.rotation.y = 0.78;
  bBox01.position.x = 0;
  bBox01.position.y = -1000;
  bBox01.position.z = 0;
  scene.add(bBox01);

  bPlane = new THREE.GridHelper(5000, 37);
  bPlane.material.color = new THREE.Color("white");
  bPlane.rotateX(Math.PI / 2);
  bPlane.position.set(0, 0, -200);
  scene.add(bPlane);

  particle = new THREE.Object3D();
  scene.add(particle);
  var geometry = new THREE.TetrahedronGeometry(2, 0);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });
  for (var i = 0; i < 500; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    mesh.position.multiplyScalar(90 + Math.random() * 700);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }
}

function metaMesh() {
  class StarShape extends THREE.Shape {
    constructor(sides, innerRadius, outerRadius) {
      super();
      let theta = 0;
      const inc = ((2 * Math.PI) / sides) * 0.5;

      this.moveTo(Math.cos(theta) * outerRadius, Math.sin(theta) * outerRadius);

      for (let i = 0; i < sides; i++) {
        theta += inc;
        this.lineTo(
          Math.cos(theta) * innerRadius,
          Math.sin(theta) * innerRadius
        );
        theta += inc;
        this.lineTo(
          Math.cos(theta) * outerRadius,
          Math.sin(theta) * outerRadius
        );
      }
    }
  }

  const extrudeSettings = {
    depth: 6,
    bevelEnabled: false
  };
  const shape = new StarShape(5, 5, 12);
  const heartGeometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
  const ballGeometry = new THREE.SphereBufferGeometry(10, 30, 30);
  iGroup = new THREE.Group();
  scene.add(iGroup);
  const geometry = new THREE.IcosahedronBufferGeometry(2010, 1);
  const mat = new THREE.MeshBasicMaterial({ wireframe: true });
  iMesh = new THREE.Mesh(geometry, mat);
  scene.add(iMesh);
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  for (let i = 0; i < position.array.length; i += 3) {
    const color = new THREE.Color("blue");
    const material = new THREE.MeshStandardMaterial({ color: color });
    const iBall = new THREE.Mesh(ballGeometry, material);
    const pos = new THREE.Vector3(
      position.array[i],
      position.array[i + 1],
      position.array[i + 2]
    );
    const norm = new THREE.Vector3(
      normal.array[i],
      normal.array[i + 1],
      normal.array[i + 2]
    );
    iBall.position.copy(pos);
    const target = pos.clone().add(norm.multiplyScalar(10.0));
    iBall.lookAt(target);
    //iGroup.add(iBall);
  }
}

function geod3() {
  //===================================================== add canvas
  // var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.toneMapping = THREE.LinearToneMapping;
  // document.body.appendChild(renderer.domElement);

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

  //===================================================== resize
  // window.addEventListener("resize", function() {
  //   let width = window.innerWidth;
  //   let height = window.innerHeight;
  //   renderer.setSize(width, height);
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  // });

  //===================================================== data
  const our_data = [
    {
      origin: { name: "a", latitude: 10, longitude: -90 },
      destination: { name: "a", latitude: 10, longitude: -90 }
    },
    {
      origin: { name: "a", latitude: 10, longitude: -90 },
      destination: { name: "a", latitude: 20, longitude: -100 }
    },
    {
      origin: { name: "a", latitude: 20, longitude: -100 },
      destination: { name: "a", latitude: 30, longitude: -80 }
    },
    {
      origin: { name: "a", latitude: 30, longitude: -80 },
      destination: { name: "a", latitude: 40, longitude: -80 }
    },
    {
      origin: { name: "a", latitude: 40, longitude: -80 },
      destination: { name: "a", latitude: 40, longitude: -90 }
    },
    {
      origin: { name: "a", latitude: 40, longitude: -90 },
      destination: { name: "a", latitude: 50, longitude: -100 }
    },
    {
      origin: { name: "a", latitude: 40, longitude: -90 },
      destination: { name: "a", latitude: 50, longitude: -70 }
    },
    {
      origin: { name: "a", latitude: 50, longitude: -70 },
      destination: { name: "a", latitude: 60, longitude: -60 }
    },
    {
      origin: { name: "a", latitude: 50, longitude: -70 },
      destination: { name: "a", latitude: 60, longitude: -90 }
    },
    {
      origin: { name: "a", latitude: 60, longitude: -90 },
      destination: { name: "a", latitude: 70, longitude: -100 }
    },
    {
      origin: { name: "a", latitude: 70, longitude: -100 },
      destination: { name: "a", latitude: 70, longitude: -120 }
    },
    {
      origin: { name: "a", latitude: 70, longitude: -100 },
      destination: { name: "a", latitude: 90, longitude: -110 }
    },
    {
      origin: { name: "a", latitude: 70, longitude: -100 },
      destination: { name: "a", latitude: 80, longitude: -90 }
    },
    {
      origin: { name: "a", latitude: 80, longitude: -90 },
      destination: { name: "a", latitude: 100, longitude: -100 }
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
      var projection = d3.geo
        .equirectangular()
        .translate([1024, 512])
        .scale(326);

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

      //===================================================== add globe
      group = new THREE.Group();
      scene.add(group);
      group.rotateZ(Math.PI );

      var RADIUS = 140;

      var sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);
      var sphereMaterial = new THREE.MeshPhongMaterial({
        //  map: mapTexture,
        transparent: true,
        opacity: 0.8,
        color: "rgb(9,55,89)",
        side: THREE.DoubleSide
        // color: new THREE.Color({color:"rgb(9,108,144)"})
      });
      var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      earthMesh.name = "earth";
      group.add(earthMesh);

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
          var pointGeom = new THREE.SphereGeometry(8, 15, 15);
          point = new THREE.Mesh(
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
          const CURVE_MAX_ALTITUDE = 10;
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
          var curveObject = new THREE.Mesh(g, m);
          group.add(curveObject);


          //https://medium.com/@xiaoyangzhao/drawing-curves-on-webgl-globe-using-three-js-and-d3-draft-7e782ffd7ab
          const CURVE_MIN_ALTITUDE00 = -5;
          const CURVE_MAX_ALTITUDE00 = -10;
          const altitude00 = clamp(
            start.distanceTo(end) * 0.75,
            CURVE_MIN_ALTITUDE00,
            CURVE_MAX_ALTITUDE00
          );

          //get the middle position of each location
          // var lat = [startLng, startLat];
          // var lng = [endLng, endLat];
          // var geoInterpolator = d3.geoInterpolate(lat, lng);

          // const midCoord1 = geoInterpolator(0.25);
          // const midCoord2 = geoInterpolator(0.75);

          const mid100 = coordinateToPosition(
            midCoord1[1],
            midCoord1[0],
            RADIUS + altitude00
          );
          const mid200 = coordinateToPosition(
            midCoord2[1],
            midCoord2[0],
            RADIUS + altitude00
          );

          //create bezier curve from the lng & lat positions
          var curve00 = new THREE.CubicBezierCurve3(start, mid100, mid200, end);
          var g00 = new THREE.TubeGeometry(curve00, 100, 0.35, 10, false);
          var m00 = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
              "hsl(" + Math.floor(Math.random() * 360) + ",50%,50%)"
            )
          });
          var curveObject00 = new THREE.Mesh(g00, m00);
          group.add(curveObject00);


        });
      } //end Destination()

      Destination(our_data);

      // //===================================================== add Animation
    }
  ); //end d3.json
}

function playerCam() {
  //Add meshes here
  player = new THREE.Group();
  player.position.set(140, 140, 0);
  scene.add(player);

  // const bodyGeometry = new THREE.CylinderBufferGeometry(0.5, 0.3, 1.6, 20);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  // const body = new THREE.Mesh(bodyGeometry, material);
  // body.position.y = 0.8;
  // body.scale.z = 0.5;
  // player.add(body);
  const headGeometry = new THREE.SphereBufferGeometry(0.3, 20, 15);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.set = (0, 0, 0);
  player.add(head);

  cameras = [];
  cameraIndex = 0;

  const followCam = new THREE.Object3D();
  followCam.position.copy(camera.position);
  player.add(followCam);
  cameras.push(followCam);

  const frontCam = new THREE.Object3D();
  frontCam.position.set(0, 0, -8);
  player.add(frontCam);
  cameras.push(frontCam);

  // const overheadCam = new THREE.Object3D();
  // overheadCam.position.set(0, 20, 0);
  // cameras.push(overheadCam);

  addKeyboardControl();

  const btn = document.getElementById("camera-btn");
  btn.addEventListener("click", changeCamera);
}

function changeCamera() {
  cameraIndex++;
  if (cameraIndex >= cameras.length) cameraIndex = 0;
}

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

// linear interpolation function
function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

// function init() {
//   initThree();
//   initTimeline();
//   window.addEventListener("resize", resize, { passive: false });
//   //divContainer.addEventListener("wheel", onWheel, { passive: false });
//   window.addEventListener("wheel", onWheel, { passive: false });
//   window.addEventListener("touchstart", touch, {passive: false} );

//   animate();
// }

// function animate() {
//   requestAnimationFrame(animate);
//   render();

//   const dt = clock.getDelta();

//   if (player.userData !== undefined && player.userData.move !== undefined) {
//     player.translateZ(player.userData.move.forward * dt * 5);
//     player.rotateY(player.userData.move.turn * dt);
//   }

//   camera.position.lerp(
//     cameras[cameraIndex].getWorldPosition(new THREE.Vector3()),
//     0.05
//   );
//   const pos = player.position.clone();
//   pos.y += 3;
//   camera.lookAt(pos);

//   //controls.update();
// }

// function render() {
//   var dtime = Date.now() - startTime;
//   // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
//   percentage = lerp(percentage, scrollY, 0.08);
//   timeline.seek(percentage * (64000 / maxHeight));

//   // animate the cube
//   //cube.rotation.x += 0.01;
//   //cube.rotation.y += 0.0125;
//   //group.rotateX(Math.PI/3600);
//   particle.rotation.y += 0.001;
//   iMesh.rotation.y += 0.001;
//   //particle.rotation.y += 0.001;

//   renderer.render(scene, camera);
// }

// function resize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

function update() {
  const game = this;
  //requestAnimationFrame(function(){game.animate();})
  requestAnimationFrame(update);
  renderer.render(scene, camera);
  particle.rotation.y += 0.001;
  group.rotation.x += 0.005;

  render();
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  const dt = clock.getDelta();

  if (player.userData !== undefined && player.userData.move !== undefined) {
    player.translateZ(player.userData.move.forward * dt * 5);
    player.rotateY(player.userData.move.turn * dt);
  }

  camera.position.lerp(
    cameras[cameraIndex].getWorldPosition(new THREE.Vector3()),
    0.05
  );
  const pos = player.position.clone();
  pos.y += 3;
  camera.lookAt(pos);
  //anime
  var dtime = Date.now() - startTime;
  // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
  percentage = lerp(percentage, scrollY, 0.08);
  timeline.seek(percentage * (64000 / maxHeight));
  //tube
}
