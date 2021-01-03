var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera();
var clock, binormal, normal, tube;

var envMap;
var cube = null;
var sphere = null;

var container = document.querySelector(".webgl");
var startTime = Date.now();
var scrollY = 0;
var _event = {
  y: 0,
  deltaY: 0
};
var timeline = null;
var percentage = 0;

var divContainer = document.querySelector(".container");
var maxHeight =
  (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight;

var group;

function initThree() {
  const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";

  clock = new THREE.Clock();

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  scene = new THREE.Scene();
  envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox1_`)
    .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
  scene.background = envMap;

  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 10, 6);
  scene.add(light);

  //Add meshes here
  const curve = new THREE.Curves.TrefoilKnot();
  const geometry = new THREE.TubeBufferGeometry(curve, 100, 2, 8, true);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  tube = new THREE.Mesh(geometry, material);
  scene.add(tube);

  binormal = new THREE.Vector3();
  normal = new THREE.Vector3();

  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setClearColor(0x161216);
  camera.position.y = 10;
  camera.position.z = 1000;
  camera.lookAt(0, 0, 0);
  resize();
  container.appendChild(renderer.domElement);
  addGeometry();
  geoThree();
}

function addGeometry() {
  const loader = new THREE.TextureLoader();

  // load a resource
  loader.load(
    // resource URL
    "https://github.com/Avxy/hexion/blob/master/bb00.jpg",

    // onLoad callback
    function (texture) {
      // in this example we create the material when the texture is loaded
      const material = new THREE.MeshBasicMaterial({
        map: texture
      });
      const cubeGeometry = new THREE.BoxGeometry(200, 200, 200);
      const cubeMesh = new THREE.Mesh(cubeGeometry, material);

      scene.add(cubeMesh);
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function (err) {
      console.error("An error happened.");
    }
  );

  cube = new THREE.Mesh(
    new THREE.CubeGeometry(50, 50, 50),
    new THREE.MeshLambertMaterial({
      wireframe: false,
      envMap: envMap
    })
  );
  cube.position.x = 0;
  cube.position.y = 0;
  cube.position.z = 0;
  scene.add(cube);

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(50, 50, 50),
    new THREE.MeshLambertMaterial({
      wireframe: false,
      envMap: envMap
    })
  );
  sphere.position.x = 0;
  sphere.position.y = 0;
  sphere.position.z = 0;
  scene.add(sphere);
}

function initTimeline() {
  timeline = anime.timeline({
    autoplay: false,
    duration: 8000,
    easing: "easeOutSine"
  });

  timeline.add({
    targets: cube.position,
    x: 0,
    y: 0,
    z: 950,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: cube.rotation,
    x: Math.PI / 2,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: cube.rotation,
    x: Math.PI,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: cube.rotation,
    x: (Math.PI * 3) / 2,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });

  timeline.add({
    targets: cube.rotation,
    x: Math.PI * 2,
    y: 0,
    z: 0,
    duration: 1000,
    update: camera.updateProjectionMatrix()
  });
}

function onWheel(e) {
  // for embedded demo
  e.stopImmediatePropagation();
  e.preventDefault();
  e.stopPropagation();

  var evt = _event;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast
  evt.deltaY *= 50;

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

function init() {
  initThree();
  initTimeline();
  window.addEventListener("resize", resize, { passive: true });
  divContainer.addEventListener("wheel", onWheel, { passive: false });
  animate();
}

function animate() {
  // render the 3D scene
  render();
  // relaunch the 'timer'
  requestAnimationFrame(animate);
}

function render() {
  var dtime = Date.now() - startTime;
  // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
  percentage = lerp(percentage, scrollY, 0.08);
  timeline.seek(percentage * (4500 / maxHeight));
  // animate the cube
  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.0125;
  //cube.rotation.z += 0.012;
  //updateCamera();
  renderer.render(scene, camera);
}
// linear interpolation function
function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

function resize() {
  // cointainer height - window height to limit the scroll at the top of the screen when we are at the bottom of the container
  maxHeight =
    (divContainer.clientHeight || divContainer.offsetHeight) -
    window.innerHeight;
  renderer.width = container.clientWidth;
  renderer.height = container.clientHeight;
  renderer.setSize(renderer.width, renderer.height);
  camera.aspect = renderer.width / renderer.height;
  camera.updateProjectionMatrix();
}

function updateCamera() {
  const time = clock.getElapsedTime();
  const looptime = 200;
  const t = (time % looptime) / looptime;
  const t2 = ((time + 0.1) % looptime) / looptime;

  const pos = tube.geometry.parameters.path.getPointAt(t);
  const pos2 = tube.geometry.parameters.path.getPointAt(t2);

  camera.position.copy(pos);
  camera.lookAt(pos2);
}

function geoThree() {
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
      destination: {
        name: "New York",
        latitude: 40.73061,
        longitude: -73.935242
      }
    },
    {
      origin: { name: "Jamaica", latitude: 22.97917, longitude: -82.17028 },
      destination: {
        name: "Britain",
        latitude: 51.509865,
        longitude: -0.118092
      }
    },
    {
      origin: { name: "New York", latitude: 40.73061, longitude: -73.935242 },
      destination: {
        name: "Britain",
        latitude: 51.509865,
        longitude: -0.118092
      }
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
      var group = new THREE.Group();
      scene.add(group);
      group.rotateX(Math.PI / 8);

      var RADIUS = 140;

      var sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);
      var sphereMaterial = new THREE.MeshPhongMaterial({
        map: mapTexture,
        transparent: true,
        opacity: 1,
        color: new THREE.Color("white")
      });
      var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      earthMesh.name = "earth";
      group.add(earthMesh);

      //===================================================== add glow effect to globe
      var customMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      var ballGeometry = new THREE.SphereGeometry(170, 60, 60);
      var ball = new THREE.Mesh(ballGeometry, customMaterial);
      scene.add(ball);

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
          const CURVE_MIN_ALTITUDE = 20;
          const CURVE_MAX_ALTITUDE = 100;
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
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        composer.render();
      }
      animate();
    }
  ); //end d3.json
}

init();
