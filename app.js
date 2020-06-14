

import * as THREE from './three.js-master/build/three.module.js';
import {OrbitControls} from './three.js-master/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from './three.js-master/examples/jsm/loaders/OBJLoader2.js';
//import {GLTFLoader} from './three.js-master/examples/jsm/loaders/GLTFLoader.js';

function main() {
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-10, 8, 10);

var listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
var sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load( './three.js-master/examples/sounds/358232_j_s_song.ogg', function( buffer ) {
sound.setBuffer( buffer );
sound.setLoop( true );
sound.setVolume( 0.2 );
sound.play();
});

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

const scene = new THREE.Scene();
scene.background = new THREE.Color('#71AFE5');

{
const planeSize = 30;

const loaderHead = new THREE.TextureLoader();
const loader = new THREE.TextureLoader();
const texture = loader.load('./three.js-master/examples/textures/terrain/grasslight-big.jpg');

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);
}

{
const skyColor = 0xB1E1FF;
const groundColor = 0xB97A20;
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);
}

{
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 8, 10);
light.target.position.set(5, -5, 0);
scene.add(light);
scene.add(light.target);
}

{

/*head*/
var headId = 1 //Paul
//var headId = 2 //Tchang

var textureLoaderHead = new THREE.TextureLoader();
var mapHead = textureLoaderHead.load('./three.js-master/examples/models/obj/pixowl/head/avatar-head'+headId+'.png');
var materialHead = new THREE.MeshPhongMaterial({map: mapHead});
var loaderHead = new OBJLoader2();
loaderHead.load( './three.js-master/examples/models/obj/pixowl/head/avatar-head'+headId+'.obj', function ( head ) {

  head.traverse( function ( node ) {
  if ( node.isMesh ) node.material = materialHead;
  } );
  head.name = "head";
  scene.add( head );
} );


/*body*/
var bodyId = 1 //Paul
//var bodyId = 2 //Tchang

var textureLoader = new THREE.TextureLoader();
var map = textureLoader.load('./three.js-master/examples/models/obj/pixowl/body/avatar-body'+bodyId+'.png');
var material = new THREE.MeshPhongMaterial({map: map});
var loader = new OBJLoader2();
loader.load( './three.js-master/examples/models/obj/pixowl/body/avatar-body'+bodyId+'.obj', function ( object ) {

  object.traverse( function ( node ) {
  if ( node.isMesh ) node.material = material;
  } );
  object.name = "body";

  scene.add( object );
} );










}

function resizeRendererToDisplaySize(renderer) {
const canvas = renderer.domElement;
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const needResize = canvas.width !== width/2 || canvas.height !== height;
if (needResize) {
  renderer.setSize(width, height, false);
}
return needResize;
}

function render() {

if (resizeRendererToDisplaySize(renderer)) {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

renderer.render(scene, camera);

requestAnimationFrame(render);
}

requestAnimationFrame(render);




var el = document.getElementsByClassName('item');

for(let i = 0; i < el.length; i++) {
  el[i].addEventListener("click", function() {


    console.log("addElement index: " + i);
    console.log("elemt idx: " + el[i].dataset.itemuid);
    console.log("elemt type: " + el[i].dataset.itemtype);

    var itemuid = el[i].dataset.itemuid;
    var itemtype = el[i].dataset.itemtype;


    var selectedObject = scene.getObjectByName(itemtype);
    console.log(selectedObject);
    // voir si on peut mettre une transition / naimation de loading
    // Effet de clignotement de la partie à changer - A AMELIORER
    setInterval(function() {
      if(selectedObject.visible)
        selectedObject.visible = false;
      else
        selectedObject.visible = true;
    }, 150);


    var textureLoaderElt = new THREE.TextureLoader();
    var mapElt = textureLoaderElt.load('./three.js-master/examples/models/obj/pixowl/'+itemtype+'/avatar-'+itemtype+itemuid+'.png');
    var materialElt = new THREE.MeshPhongMaterial({map: mapElt});
    var loaderElt = new OBJLoader2();

    loaderElt.load(
    './three.js-master/examples/models/obj/pixowl/'+itemtype+'/avatar-'+itemtype+itemuid+'.obj',
    // onLoad callback
    function ( obj ) {
    // sur le loaderHead.load - voir si on peut greffer une fonction bidon qui fera genre d'appler une api est de renvoyer un json

      scene.remove( selectedObject );
      obj.traverse( function ( node ) {
        if ( node.isMesh ) node.material = materialElt;
      } );
        obj.name = itemtype;
      scene.add( obj );
    },

    // onProgress callback
    function ( xhr ) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // onError callback
    function ( err ) {
      console.log( 'An error happened' );
    });

  })
}



}


main();


function changePage(page){
  for(let i = 0; i < el.length; i++) {
    if(i+1 != current_page)
      el[i].style.display = "none";
    else {
      el[i].style.display = "block";
      document.getElementById('menu-title').innerHTML = el[i].dataset.type;
    }
  }
}

var el = document.getElementsByClassName('menu');
var nbEl = el.length;
console.log(nbEl);
var current_page = 1;

document.getElementById('previous').addEventListener("click", function() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
});

document.getElementById('next').addEventListener("click", function() {
  if (current_page < nbEl) {
    current_page++;
    changePage(current_page);
  }
});
