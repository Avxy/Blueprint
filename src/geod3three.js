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
    

    var RADIUS = 140;
    //var sphereGeometry = new THREE.IcosahedronGeometry(RADIUS, 2);
    var sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);
    // var sphereMaterial = new THREE.MeshPhongMaterial({
    //   map: mapTexture,
    //   transparent: false,
    //   opacity: 1,
    //   color: new THREE.Color("white")
    // });
    // var sphereMaterial = new THREE.MeshPhongMaterial({
    //   envMap: envMap,
    //   transparent: false,
    //   opacity: 1,
    //   color: new THREE.Color("white")
    // });
    var sphereMaterial = new THREE.MeshPhongMaterial({
      color: "rgb(9,55,108)",
      side: THREE.DoubleSide
    });

    // var sphereMaterial = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   wireframe: true,
    //   side: THREE.DoubleSide

    //});

    // var grid = new THREE.Mesh( sphereGeometry, sphereMaterial );
    // var gridEdge = new THREE.EdgesHelper(grid, 0xffffff);
    // gridEdge.material.linewidth = 0.01;
    // gridEdge.rotateX(1/2*Math.PI);
    // group.add(grid);
    // group.add(gridEdge);

    earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = "earth";
    // earthMesh02 = earthMesh.clone();
    // earthMesh02.position.x = 800;
    // earthMesh02.scale.set(0.3, 0.3, 0.3);
    // group.add(earthMesh02);
    group.add(earthMesh);
    group.rotateX(Math.PI / 8);
    //===================================================== add glow effect to globe
    // var customMaterial = new THREE.ShaderMaterial({
    //   uniforms: {},
    //   vertexShader: document.getElementById("vertexShader").textContent,
    //   fragmentShader: document.getElementById("fragmentShader").textContent,
    //   side: THREE.BackSide,
    //   blending: THREE.AdditiveBlending,
    //   transparent: true
    // });

    // var ballGeometry = new THREE.SphereGeometry(160, 60, 60);
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
        var pointGeom = new THREE.SphereGeometry(10, 10, 10);
        point = new THREE.Mesh(
          pointGeom,
          new THREE.MeshBasicMaterial({ color: new THREE.Color("white") })
        );
        point2 = new THREE.Mesh(
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
          //   color: new THREE.Color(
          //     "hsl(" + Math.floor(Math.random() * 360) + ",50%,50%)"
          //   )
          // });
          color: new THREE.Color("rgb(0,144,255))")
        });
        var curveObject = new THREE.Mesh(g, m);
        group.add(curveObject);

        
      });
    } //end Destination()

    Destination(our_data);