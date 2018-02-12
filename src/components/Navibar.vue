<template>
  <nav class="navbar navbar-default">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <slot name="header">
        <a class="navbar-brand navbar-menu" href="#" @click="open">
          <span class="glyphicon glyphicon-tasks"></span>
        </a>
      </slot>
      <div class="side-modal" @click="close">
        <div class="side-action" style="text-align: left;">
          <div style="margin-bottom: 50px; text-align: center; padding: 0 15px;">
            <img src="../assets/user.png" class="img-rounded img-responsive" style="width: 60%;margin: 0 auto;">
            <h3>{{ email }}<br><small>{{ uname }}</small></h3>
          </div>
          <div class="list-group">
            <router-link class="list-group-item" :to="{ name: 'projectlist' }" replace>
              <span class="glyphicon glyphicon-menu-hamburger"></span> {{ $t('ui.group_by_project') }} 
              <template v-if="$root.runtime !== 'cordova'">(<ins>P</ins>)</template>
            </router-link>
            <router-link class="list-group-item" :to="{ name: 'datelist' }" replace>
              <span class="glyphicon glyphicon-calendar"></span> {{ $t('ui.group_by_date') }} 
              <template v-if="$root.runtime !== 'cordova'">(<ins>D</ins>)</template>
            </router-link>
            <router-link class="list-group-item" :to="{ name: 'preference' }">
              <span class="glyphicon glyphicon-cog"></span> {{ $t('ui.preference') }} 
              <template v-if="$root.runtime !== 'cordova'">(<ins>R</ins>)</template>
            </router-link>
            <router-link class="list-group-item" :to="{ name: 'about' }">
              <span class="glyphicon glyphicon-info-sign"></span> {{ $t('ui.about') }} 
              <template v-if="$root.runtime !== 'cordova'">(<ins>A</ins>)</template>
            </router-link>
            <button type="button" class="list-group-item" @click="$root.logout">
              <span class="glyphicon glyphicon-log-out"></span> {{ $t('ui.logout') }} 
              <template v-if="$root.runtime !== 'cordova'">(<ins>Q</ins>)</template>
            </button>
            <button v-if="$root.runtime === 'cordova'" type="button" class="list-group-item" @click="$root.exit">
              <span class="glyphicon glyphicon-off"></span> {{ $t('ui.exit') }} 
              <template v-if="$root.runtime !== 'cordova'">(<ins>F4</ins>)</template>
            </button>
          </div>
        </div>
      </div>
    </div>
    <p class="navbar-text">{{ navtitle }}</p>
    <p class="navbar-brand" style="float:right;">
      <slot v-if="online" name="action"></slot>
      <span v-else class="glyphicon glyphicon-flash text-danger"></span>
    </p>
  </nav>
</template>

<style scoped>
.navbar .navbar-header::after { clear: none; }
.navbar .navbar-brand { -webkit-app-region: no-drag; color: #FFF; }
.navbar .navbar-text { float: left; color: #FFF; font-weight: 800;  }
.navbar .navbar-brand:hover { color: #FFF; }
.navbar .navbar-brand:focus { color: #FFF; }
.side-action { position: absolute; width: 250px; top: 0px; bottom: 0px; left: -250px; background: #b3e4f5 url('../../static/navigator.jpg') no-repeat bottom center;
  display: flex; flex-direction: column; justify-content: center; }
.side-action h3 { word-wrap: break-word; }
.side-action .list-group * { background-color: rgba(152, 227, 255, 0.5); color: #1d465f; font-weight: bold; }
.side-modal { -webkit-app-region: no-drag; overflow: hidden; display: none; z-index: 1050; }
.side-modal-on { position: fixed;	right: 0px;	left: 0px; top: 0px; bottom: 0px;	display: block; background-color: rgba(52, 52, 52, 0.5); }
@media screen and (min-width: 800px) {
  .navbar .navbar-menu { display: none; }
  .navbar .navbar-text { margin-left: 15px; }
  .side-action { left: 0; }
  .side-modal { position: fixed; display: block; width: 250px;	left: 0px; top: 0px; bottom: 0px;	display: block; }
}

</style>
<script>
import $ from 'jquery'

export default {
  data () {
    return {
      online: true
    }
  },
  props: ['navtitle', 'email', 'uname'],
  mounted () {
    if (navigator.onLine) {
      this.online = true
    } else {
      this.online = false
    }
    window.addEventListener('online', () => {
      this.online = true
    })
    window.addEventListener('offline', () => {
      this.online = false
    })
    window.addEventListener('resize', (evt) => {
      if (window.screen.availWidth >= 800 && $('.side-modal').hasClass('side-modal-on')) {
        $('.side-modal').removeClass('side-modal-on')
        $('body').css('padding-left', '')
      }
    })
    if (this.$root.runtime !== 'cordova') {
      document.addEventListener('keydown', this.shortCut, false)
    }
  },
  beforeDestroy () {
    if (this.$root.runtime !== 'cordova') {
      document.removeEventListener('keydown', this.shortCut, false)
    }
  },
  methods: {
    shortCut (evt) {
      if (!evt.ctrlKey && evt.altKey) {
        switch (evt.keyCode) {
          case 65: // A->About
            this.$router.push({ name: 'about' })
            break
          case 68: // D->DateList
            this.$router.replace({ name: 'datelist' })
            break
          case 80: // P->ProjectList
            this.$router.replace({ name: 'projectlist' })
            break
          case 81: // Q->logout
            this.$root.logout()
            break
          case 82: // R->Preference
            this.$router.push({ name: 'preference' })
            break
        }
        evt.preventDefault()
        evt.stopPropagation()
      }
    },
    open () {
      var modal = $('.side-modal')
      modal.addClass('side-modal-on')
      modal.children().animate({ left: '0px' }, 'normal')
      $('body').animate({ paddingLeft: '250px' }, 'normal')
    },
    close () {
      if (window.innerWidth >= 800) {
        return
      }
      $('.side-action').animate({ left: '-250px' }, 'normal', () => {
        $('.side-modal').removeClass('side-modal-on')
        $('.side-action').css('left', '')
      })
      $('body').animate({ paddingLeft: '0px' }, 'normal', () => {
        $('body').css('padding-left', '')
      })
    }
  }
}
</script>

