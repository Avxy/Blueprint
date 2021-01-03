var scene, camera, renderer, clock, binormal, normal, tube;

  // var scene = new THREE.Scene();
  // var renderer = new THREE.WebGLRenderer();
  // var camera = new THREE.PerspectiveCamera();
  var cube = null
  var container = document.querySelector('.webgl');
  var startTime	= Date.now();
  var scrollY = 0;
  var _event = {
    y: 0,
    deltaY: 0
  };
  var timeline = null
  var percentage = 0
  
  var divContainer = document.querySelector('.container')
  var maxHeight = (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight
  


init();

function init(){
  const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";
  
  clock = new THREE.Clock();
  
  scene = new THREE.Scene();
  const envMap = new THREE.CubeTextureLoader()
    .setPath(`${assetPath}skybox1_`)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
 	scene.background = envMap;
	
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0, 4, 57);//wide position
  camera.lookAt(0,1.5,0);
  
  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set( 1, 10, 6);
  scene.add(light);
  
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  //document.body.appendChild( renderer.domElement );
  container.appendChild(renderer.domElement);

  //Add meshes here
  const curve = new THREE.Curves.TrefoilKnot();
  const geometry = new THREE.TubeBufferGeometry( curve, 100, 2, 8, true );
  const material = new THREE.MeshBasicMaterial({ wireframe:true, color: 0xffffff, side: THREE.DoubleSide });
  tube = new THREE.Mesh( geometry, material );
  scene.add(tube);
  
  binormal = new THREE.Vector3();
  normal = new THREE.Vector3();
  
  window.addEventListener( 'resize', resize, false);
  




  // function initThree () {
  //   renderer.setPixelRatio(window.devicePixelRatio || 1);
  //   renderer.setClearColor(0x161216)
  //   camera.position.y = 10;
  //   camera.position.z = 100;
  //   resize()
  //   container.appendChild(renderer.domElement);
  //   addCube()
  // }
  
  //function addCube () {
      cube = new THREE.Mesh( new THREE.CubeGeometry( 50, 50, 50 ), new THREE.MeshNormalMaterial() );
      cube.position.y = 5
      cube.position.z = -100
      scene.add(cube);
  //}
  
//  function initTimeline() {
    timeline = anime.timeline({
      autoplay: false,
      duration: 4500,
      easing: 'easeOutSine'
    });
    timeline.add({
      targets: cube.position,
      x: 100,
      y: 25,
      z: -50,
      duration: 2250,
      update: camera.updateProjectionMatrix()
    })
    timeline.add({
      targets: cube.position,
      x: 0,
      y: 0,
      z: 50,
      duration: 2250,
      update: camera.updateProjectionMatrix()
    })
    var value = new THREE.Color(0xFFFCFC)
    var initial = new THREE.Color(0x161216)
    timeline.add({
      targets: initial,
      r: [initial.r, value.r],
      g: [initial.g, value.g],
      b: [initial.b, value.b],
      duration: 4500,
      update: () => {
        renderer.setClearColor(initial);
      }
    }, 0);
 // }
   
  
  function onWheel (e) {
      // for embedded demo
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
  
      var evt = _event;
      evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
      // reduce by half the delta amount otherwise it scroll too fast
      evt.deltaY *= 0.5;
  
      scroll(e);
  };
  
  function scroll (e) {
    var evt = _event;
    // limit scroll top
    if ((evt.y + evt.deltaY) > 0 ) {
      evt.y = 0;
    // limit scroll bottom
    } else if ((-(evt.y + evt.deltaY)) >= maxHeight) {
      evt.y = -maxHeight;
    } else {
        evt.y += evt.deltaY;
    }
    scrollY = -evt.y
  }
  
  //init()



  update();
}

function updateCamera(){
  const time = clock.getElapsedTime();
  const looptime = 200;
	const t = ( time % looptime ) / looptime;
  const t2 = ( (time + 0.1) % looptime) / looptime
	
  const pos = tube.geometry.parameters.path.getPointAt( t );
  const pos2 = tube.geometry.parameters.path.getPointAt( t2 );
	
  camera.position.copy(pos);
  camera.lookAt(pos2);
}

function update(){
  requestAnimationFrame( update );
  updateCamera();
	renderer.render( scene, camera );  
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}




function update1() {
  // render the 3D scene
  render();
  // relaunch the 'timer' 
  requestAnimationFrame( animate );
}

function render() {
  var dtime	= Date.now() - startTime;
  // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
  percentage = lerp(percentage, scrollY, .08);
  timeline.seek(percentage * (4500 / maxHeight))
  // animate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.0125;
  cube.rotation.z += 0.012;
  renderer.render( scene, camera );
}
// linear interpolation function
function lerp(a, b, t) {
  return ((1 - t) * a + t * b);
}

// function init () {
//   initThree()
//   initTimeline()
//   window.addEventListener('resize', resize, { passive: true
//   })
//   divContainer.addEventListener('wheel', onWheel, { passive: false });
//   animate()
// }

function resize () {
  // cointainer height - window height to limit the scroll at the top of the screen when we are at the bottom of the container
  maxHeight = (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight
  renderer.width = container.clientWidth;
  renderer.height = container.clientHeight;
  renderer.setSize(renderer.width, renderer.height);
  camera.aspect = renderer.width / renderer.height;
  camera.updateProjectionMatrix();
}



