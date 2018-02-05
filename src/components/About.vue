<template>
  <div class="about">
    <navibar ref="nav" :navtitle="$t('ui.about')" :email="$root.email" :uname="$root.uname">
      <a slot="header" class="navbar-brand navbar-menu" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
    </navibar>
    <div class="container-fluid" style="margin-top: 20px; overflow-y:auto;">
      <div class="row">
        <div class="col-md-12">
          <h4>{{ $t('message.description') }}</h4>
          <p class="lead">
            A todo list application with share function accross email address.
          </p>
          <h4>{{ $t('message.author') }}</h4>
          <strong>antipro</strong><br/>
          <a href="mailto:antipro@163.com">antipro@163.com</a><br/>
          <a href="https://gitee.com/antipro" target="_blank">https://gitee.com/antipro</a>
          <h4>{{ $t('message.software_license') }}</h4>
          <p><a href="http://www.apache.org/licenses/LICENSE-2.0.txt" target="_blank">Apache License(Ver.2)</a></p>
          <h4>{{ $t('message.shortcut') }}</h4>
          <ul>
            <li>{{ $t('message.common_tip_01') }}</li>
            <li>{{ $t('message.common_tip_02') }}</li>
            <li>{{ $t('message.common_tip_03') }}</li>
            <li>{{ $t('message.common_tip_04') }}</li>
            <li>{{ $t('message.common_tip_05') }}</li>
            <li>{{ $t('message.common_tip_06') }}</li>
            <li>{{ $t('message.common_tip_07') }}</li>
            <template v-if="$root.runtime === 'cordova'" >
              <li>{{ $t('message.cordova_tip_01') }}</li>
            </template>
            <template v-else>
              <li>{{ $t('message._cordova_tip_01') }}</li>
              <li>{{ $t('message._cordova_tip_02') }}</li>
              <li>{{ $t('message._cordova_tip_03') }}</li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.about { position: relative; height: 100%; width: 100%; overflow-y: auto; }
@media screen and (min-width: 800px) {
  .about { margin-left: 250px; width: calc(100% - 250px); }
}
</style>


<script>
import Navibar from '@/components/Navibar'

export default {
  name: 'about',
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
  components: {
    Navibar
  }
}
</script>

