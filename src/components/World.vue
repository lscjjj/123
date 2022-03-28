<template>
  <div class="world" ref="container"></div>
</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import RAFManager from "raf-manager";
import Rocks from "./Rocks";
import Album from "./Album";
import Mouse from "./Mouse";
import FollowEffect from "./FollowEffect";
import texture from "../assets/dot.png";

// import Plane from "../assets/Plane.obj";
// import Planeimg from "../assets/Jet_BaseColor.png";

export default {
  name: "World",
  mounted() {
    this.initThree();
    this.addLight();
    this.addBackRocks();
    this.addAlbum();
    this.addMouseAndEffect();
    this.addModels();
    this.render = this.render.bind(this);
    RAFManager.add(this.render);
  },
  destroyed() {
    RAFManager.remove(this.render);
  },

  methods: {
    initThree: function () {
      const container = this.$refs.container;
      const camera = new THREE.PerspectiveCamera(
        45,
        container.offsetWidth / container.offsetHeight,
        1,
        10000
      );

      camera.position.set(0, 0, 500);

      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);
      renderer.setClearColor(0x000000, 0);
      const clock = new THREE.Clock();

      var geometry = new THREE.SphereBufferGeometry(10000, 60, 1200);
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(-1, -1, -1);
      //加载全景图片资源
      var texture = new THREE.TextureLoader().load("../assets/360_world.jpg");
      texture.minFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      var material = new THREE.MeshBasicMaterial();
      material.map = texture;
      var meshB = new THREE.Mesh(geometry, material);
      scene.add(meshB);

      const controls = new TrackballControls(camera, renderer.domElement); //
      // // 使动画循环使用时阻尼或自转 意思是否有惯性
      controls.rotateSpeed = 0.1; // 旋转速度
      controls.zoomSpeed = 0.1; // 缩放速度
      controls.minDistance = 200; //缩放的最近距离
      controls.maxDistance = 10000; //缩放的最远距离
      controls.panSpeed = 0.1; // 平controls

      this.controls = controls;
      this.clock = clock;
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;
    },

    addLight: function () {
      const { scene } = this;

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
      hemiLight.position.set(0, 1000, 0);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(-3000, 1000, -1000);
      scene.add(dirLight);
    },

    addBackRocks: function () {
      const { scene } = this;
      const rocks = new Rocks();
      rocks.addToScene(scene);
      this.rocks = rocks;
    },

    addModels: function () {
      let { scene } = this;
      //导入obj模型
      var objLoader = new OBJLoader();
      objLoader.load("../models/Satellite.obj", function (object) {
        console.log(object);
        //设置模型缩放比例
        object.scale.set(25, 25, 25);
        //设置模型的坐标
        object.position.set(0, 400, -1000);
        object.rotation.set(0, -Math.PI * 0.6, 0);

        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            //设置模型皮肤
            child.material.map = THREE.ImageUtils.loadTexture(
              "../models/satellite_Satélite_Metallic.jpg"
            );
          }
        });
        //将模型添加到场景中
        scene.add(object);
      });
    },

    addAlbum: function () {
      const { scene, camera, renderer } = this;
      const album = new Album({ camera, renderer });
      album.addToScene(scene);
      this.album = album;
    },

    addMouseAndEffect: function () {
      const { scene, renderer, camera, album } = this;
      const follow = new FollowEffect({
        texture,
        renderer,
        camera,
        scene,
      });

      new Mouse({ display: album.display, camera, renderer });

      this.follow = follow;
    },

    render: function () {
      const { renderer, camera, scene, rocks, clock, follow, controls } = this; //

      controls.update();
      follow.render();
      rocks.render(clock);
      renderer.render(scene, camera);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.world {
  position: absolute;
  bottom: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #161616;
  background-image: radial-gradient(#161616, #000);
}
</style>
