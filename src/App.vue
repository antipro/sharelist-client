<template>
  <div id="app" style="background: #ffffff url('static/background.jpg')">
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
/* global style */
div#app { -webkit-app-region: drag; overflow: hidden; height: 100%; position: relative; width: 100vw; }
div#app .form-control { border-radius: 0; }
div#app .btn { border-radius: 0; }
div#app .input-group-addon { border-radius: 0; }
div#app .list-group-item { border-radius: 0; }
div#app .list-group-item a { border-radius: 0; }
</style>

<script>
export default {
  name: 'app'
}
</script>

