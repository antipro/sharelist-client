<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
* {
  -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
div#app {
  overflow: hidden;
  height: 100%;
}
div#app { position: relative; height: 100%; width: 100vw; }
</style>

<script>
export default {
  name: 'app'
}
</script>

