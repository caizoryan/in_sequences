import * as THREE from "three";
import { data } from "./data.js";

import {
  render,
  sig,
  div,
  monke_slider,
  p,
} from "./solid_monke/solid_monke.js";

let mouse = { x: 0, y: 0 };
let scene, camera, renderer;

// Create a scene

function map_values(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function initialize() {
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
}

initialize();

let loader = new THREE.TextureLoader();

let image_seed = (src) => {
  let texture, plane, material, mesh;

  texture = loader.load(src, (tex) => {
    let a = tex.image.width / tex.image.height;
    mesh.scale.y = 5;
    mesh.scale.x = 5 * a;
  });

  plane = new THREE.PlaneGeometry(1, 1);

  material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
  });

  mesh = new THREE.Mesh(plane, material);
  return mesh;
};

let image_manager = (folder) => {
  let images = folder.content.map((file, i) => {
    if (i > 9) return;
    let path = "./assets/" + folder.folder + "/" + file;
    let unit = image_seed(path);

    unit.position.x = i * 1.5 - folder.content.length / 2;
    scene.add(unit);

    return unit;
  });

  images = images.slice(0, 10);

  return images;
};

let series = new Array(12).fill(0).map((_, i) => {
  let images = image_manager(data[i]);
  return images;
});

camera.position.z = 90;
camera.position.x = 10;
camera.position.y = 40;

let range = sig(2);
let diff = sig(Math.PI * 8);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  series.forEach((image_series, y) => {
    image_series.forEach((image, i) => {
      image.position.y = y * 5;
      image.rotation.y = map_values(
        mouse.x,
        0,
        window.innerWidth,
        (i + 0.2) * -diff.is(),
        (i + 0.2) * diff.is(),
      );
    });
  });
}

animate();

let App = () => {
  return div(
    {
      style: {
        position: "absolute",
        top: "0",
        left: "0",
      },
    },
    p("hello"),
    monke_slider(range, [0.02, 4], { step: 0.01 }),
    monke_slider(diff, [0.02, 4], { step: 0.01 }),
  );
};

render(App, document.body);
