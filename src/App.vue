<template>
  <div id="app">
    <div class="logo">
      <img src="./assets/logo.png" />
      <span>深圳市民治中学</span>
    </div>
    <!-- <a href="https://github.com/drawcall/threejs-mesh-modifiers" target="_blank">
      <img class="logo" src="./assets/logo.png">
    </a> -->
    <!-- <Btns/> -->
    <World />
  </div>
</template>

<script>
import xEmiiter from "xemitterjs";
// import Btns from "./components/Btns";
import World from "./components/World";

export default {
  name: "App",
  components: {
    // Btns,
    World,
  },
  methods: {
    click: function (type) {
      xEmiiter.emit("MENU_CLICK", type);
    },
  },
};
</script>

<style>
body {
  background-color: #ffffff;
  margin: 0;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  user-select: none;
}

.logo {
  position: absolute;
  z-index: 999;
  display: flex;
  align-items: center;
  top: 1rem;
  left: 1rem;
}

.logo span {
  color: #fff;
  margin: 0 0.5rem;
  font-size: 1rem;
}

.logo img {
  width: 2.5rem;
}
</style>
