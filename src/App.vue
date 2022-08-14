<template>
  <div id="app">
    <router-view style="-webkit-app-region: no-drag;" />
  </div>
</template>

<style>
* {
  user-select:none;
}
/* global style */
div#app { -webkit-app-region: drag; overflow: hidden; height: 100%; position: relative; width: 100vw; }
div#app .form-control { border-radius: 0; }
div#app .btn { border-radius: 0; }
div#app .input-group-addon { border-radius: 0; }
div#app .list-group-item { border-radius: 0; }
div#app .list-group-item a { border-radius: 0; }
div#app .navbar { font-size: 16px; -webkit-app-region: drag; height: 50px; margin-bottom: 0px; 
  background-color: #337ab7; width: 100%; border-width: 0px; border-radius: 0; }
</style>

<script>
export default {
  name: 'app'
}
</script>

