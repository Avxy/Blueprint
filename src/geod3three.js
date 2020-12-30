var cube, tetrahedron, octahedron, dodecahedron, icosahedron, particle;

//===================================================== add Scene
var scene = new THREE.Scene();
//scene.background = new THREE.Color(0x0000ff);
//===================================================== add Camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  50,
  10000
);
camera.position.x = 0;
camera.position.y = 2000;
camera.position.z = 0;
//===================================================== add front & back lighting
// var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
// light.position.set(1, 3, 2).normalize();
// scene.add(light);

// var light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
// light.position.set(-1, -3, -2).normalize();
// scene.add(light);

const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(0, 2, 1);
scene.add(light);
//===================================================== add Grid
/*  var plane = new THREE.GridHelper(5000, 10);
  plane.material.color = new THREE.Color( 'white');
  scene.add(plane);*/

//===================================================== add canvas
// var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.toneMapping = THREE.LinearToneMapping;
// document.body.appendChild(renderer.domElement);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//===================================================== add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);

//===================================================== add cubemap
const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";

const cubemap = new THREE.CubeTextureLoader()
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

//===================================================== resize
const btn = document.getElementById('camera-btn');
//btn.addEventListener('click', changeCamera);

window.addEventListener("resize", function () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

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

    for (var i = 0; i < 1000; i++) {
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
    var group = new THREE.Group();
    scene.add(group);
    group.rotateX(Math.PI / 8);

    var RADIUS = 140;
    var cRADIUS = RADIUS * 4;
    var tRADIUS = RADIUS * 4;
    var oRADIUS = RADIUS * 4;
    var dRADIUS = RADIUS * 2;
    var iRADIUS = RADIUS * 4;

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

    var metatron = new THREE.Object3D();

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

    var cubeGeometry = new THREE.BoxGeometry(cRADIUS, cRADIUS, cRADIUS);
    var tetrahedronGeometry = new THREE.TetrahedronGeometry(tRADIUS, 0);
    var octahedronGeometry = new THREE.OctahedronGeometry(oRADIUS, 0);
    var dodecahedronGeometry = new THREE.DodecahedronGeometry(dRADIUS, 0);
    var icosahedronGeometry = new THREE.IcosahedronGeometry(iRADIUS, 0);

    var metaMaterial = new THREE.MeshPhongMaterial({ wireframe: true });

    cube = new THREE.Mesh(cubeGeometry, metaMaterial);
    tetrahedron = new THREE.Mesh(tetrahedronGeometry, metaMaterial);
    octahedron = new THREE.Mesh(octahedronGeometry, metaMaterial);
    dodecahedron = new THREE.Mesh(dodecahedronGeometry, metaMaterial);
    icosahedron = new THREE.Mesh(icosahedronGeometry, metaMaterial);

    // scene.add(cube);
    // scene.add(tetrahedron);
    // scene.add(octahedron);
    // scene.add(dodecahedron);
    scene.add(icosahedron);

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
    function update() {
      requestAnimationFrame(update);
      renderer.render(scene, camera);

      composer.render();
      icosahedron.rotate.y += 0.05;
      particle.rotation.x += 0.0;
      particle.rotation.y -= 0.004;
    }
    update();
  }
); //end d3.json
