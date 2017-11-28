<template>
  <div id="app">
    <router-view style="-webkit-app-region: no-drag;" />
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
div#app { -webkit-app-region: drag; overflow: hidden; height: 100%; position: relative; width: 100vw; }
</style>

<script>
export default {
  name: 'app'
}
</script>

