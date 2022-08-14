<template>
  <div class="about">
    <navibar ref="nav" :navtitle="$t('ui.about')" :email="$root.email" :uname="$root.uname">
      <a slot="header" class="navbar-brand navbar-menu" href="#" @click="back">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
    </navibar>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <h4>{{ $t('message.description') }}</h4>
          <p class="lead">
            {{ $t('message.description2') }}
          </p>
          <h4>{{ $t('message.current_version') }}</h4>
          <p>{{ currentVersion }}</p>
          <h4>{{ $t('message.author') }}</h4>
          <strong>antipro</strong><br/>
          <a href="mailto:antipro@163.com">antipro@163.com</a><br/>
          <a v-if="$root.runtime==='electron'" href="javascript:void(0)" @click="openExternal('https://antipro.gitee.io/sharelist/')">https://antipro.gitee.io/sharelist/</a>
          <a v-else href="https://antipro.gitee.io/sharelist/" target="_blank">https://antipro.gitee.io/sharelist/</a>
          <h4>Android</h4>
          <p>
            <img src="http://qr.liantu.com/api.php?text=http://antipro.gitee.io/sharelist/releases/sharelist-release.apk" style="width: 200px; height: 200px;">
          </p>
          <h4>{{ $t('message.software_license') }}</h4>
          <p>
            <a v-if="$root.runtime==='electron'" href="javascript:void(0)" @click="openExternal('http://www.apache.org/licenses/LICENSE-2.0.txt')">Apache License(Ver.2)</a>
            <a v-else href="http://www.apache.org/licenses/LICENSE-2.0.txt" target="_blank">Apache License(Ver.2)</a>
          </p>
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
              <li>{{ $t('message._cordova_tip_04') }}</li>
              <li>{{ $t('message._cordova_tip_05') }}</li>
              <li>{{ $t('message._cordova_tip_06') }}</li>
              <li>{{ $t('message._cordova_tip_07') }}</li>
              <li>{{ $t('message._cordova_tip_08') }}</li>
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
.about .container-fluid { position: absolute; top: 50px; bottom: 0; left: 0px; width: 100%; padding-top: 20px; overflow-y: auto; }
</style>


<script>
/* global CURRENT_VERSION:true */
/* eslint-disable no-eval */
import Navibar from '@/components/Navibar'

export default {
  name: 'about',
  data () {
    return {
      currentVersion: CURRENT_VERSION
    }
  },
  created () {
    if (this.$root.token === '') {
      this.$router.replace('/login')
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    openExternal (url) {
      const shell = eval('require(\'electron\')').shell
      shell.openExternal(url)
    }
  },
  components: {
    Navibar
  }
}
</script>

