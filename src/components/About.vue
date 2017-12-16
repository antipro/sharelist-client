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
          <h4>Description</h4>
          <p class="lead">
            A todo list application with share function accross email address.
          </p>
          <h4>Author</h4>
          <strong>antipro</strong><br/>
          <strong>Mailbox</strong><br>
          <a href="mailto:antipro@163.com">antipro@163.com</a><br/>
          <strong>Homepage</strong><br>
          <a href="https://gitee.com/antipro">https://gitee.com/antipro</a>
          <h4>FAQ</h4>
          <dl>
            <dt>Software License</dt>
            <dd>These programs use Apache License(Ver.2).</dd>
            <dt>Security Problem</dt>
            <dd>I have no domain and certificate, These programs use http for data communication, so do not use it for important information.</dd>
            <dt>Why is there no iOS version?</dt>
            <dd>Theoretically cordova can be compiled and deployed in iOS platform, but I have no Mac computer and iOS development environment. 
              Maybe someone can help me to do this.</dd>
            <dt>Why is there no windows and osx version?</dt>
            <dd>Same above.</dd>
          </dl>
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

