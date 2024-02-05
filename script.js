import * as THREE from "three";
import { data } from "./data.js";

import {
  render,
  sig,
  div,
  monke_slider,
  p,
  eff,
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

  camera.position.z = 90;
  camera.position.x = 10;
  camera.position.y = 40;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  renderer.setClearColor(0xffffff, 1);
}

initialize();

let loader = new THREE.TextureLoader();

let image_seed = (src, size) => {
  let texture, plane, material, mesh;

  texture = loader.load(src, (tex) => {
    let a = tex.image.width / tex.image.height;

    let off = map_values(size, 0, 1, -2, 2.5);

    mesh.scale.y = 5 + off;
    mesh.scale.x = (5 + off) * a;
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
  let rr = Math.random();
  let images = folder.content.map((file, i) => {
    if (i > 9) return;
    let path = "./assets/" + folder.folder + "/" + file;
    let unit = image_seed(path, rr);

    let r = Math.random();
    unit.position.x = i + i * r * 2.5 - folder.content.length / 2;
    scene.add(unit);

    return unit;
  });

  images = images.slice(0, 10);
  return images;
};

let series = new Array(14).fill(0).map((_, i) => {
  let images = image_manager(data[i]);
  return images;
});
series = series.sort(() => (Math.random() > 0.5 ? 1 : -1));

let range = sig(2);
let diff = sig(0.3);
let camera_z = sig(90);
let camera_x = sig(10);
let camera_y = sig(40);
let offset = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  offset++;

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

      image.position.z = map_values(
        mouse.y,
        0,
        window.innerHeight,
        (i * 5 + 5) * -diff.is(),
        (i * 5 + 5) * diff.is(),
      );

      // image.rotation.y = (i * offset) / 1000;
    });
  });
}

animate();

const slide = (val, name, [min, max] = [-100, 100]) => {
  return div(
    { class: "slide" },
    p(name, val.is),
    monke_slider(val, [min, max], { step: 0.01 }),
  );
};

let App = () => {
  return div(
    {
      class: "ui",
    },

    slide(diff, "diff : ", [0.04, 5]),
    slide(camera_x, "camera x : "),
    slide(camera_y, "camera y : "),
    slide(camera_z, "camera z : "),
  );
};

eff(() => {
  camera.position.z = camera_z.is();
  camera.position.x = camera_x.is();
  camera.position.y = camera_y.is();
});

render(App, document.body);
