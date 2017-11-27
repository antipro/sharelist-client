<template>
  <nav class="navbar navbar-default">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <slot name="header">
        <a class="navbar-brand navbar-menu" href="#" @click="open" @touchmove.prevent>
          <span class="glyphicon glyphicon-tasks"></span>
        </a>
      </slot>
      <div class="side-modal" @click="close">
        <div class="side-action" style="text-align: left;">
          <div class="row" style="margin-bottom: 50px;">
            <div class="col-xs-12" style="text-align: center;">
              <router-link class="list-group-item" to="/preference">
                <img src="../assets/user.png" class="img-rounded img-responsive" style="width: 60%;margin: 0 auto;">
              </router-link>
              <h3>{{ tel }}<br><small>{{ uname }}</small></h3>
            </div>
          </div>
          <div class="list-group">
            <router-link class="list-group-item" to="/projectlist" replace>
              <span class="glyphicon glyphicon-menu-hamburger"></span> 按项目查看
            </router-link>
            <router-link class="list-group-item" to="/datelist" replace>
              <span class="glyphicon glyphicon-calendar"></span> 按时间查看
            </router-link>
            <button type="button" class="list-group-item">
              <span class="glyphicon glyphicon-search"></span> 搜索
            </button>
            <button type="button" class="list-group-item" @click="$root.logout">
              <span class="glyphicon glyphicon-log-out"></span> 登出
            </button>
            <button v-if="$root.runtime !== 'browser'" type="button" class="list-group-item" @click="$root.exit">
              <span class="glyphicon glyphicon-off"></span> 退出
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
.navbar { font-size: 16px; }
.navbar { height: 50px; margin-bottom: 0px; background-color: #337ab7; width: 100%; border-width: 0px; border-radius: 0; }
.navbar .navbar-header::after { clear: none; }
.navbar .navbar-brand { color: #FFF; }
.navbar .navbar-text { float: left; color: #FFF; font-weight: 800;  }
.navbar .navbar-brand:hover { color: #FFF; }
.navbar .navbar-brand:focus { color: #FFF; }
.side-action { position: absolute; width: 250px; top: 0px; bottom: 0px; left: -250px; background-color: #f9f7f6;
  display: flex; flex-direction: column; justify-content: center; }
.side-modal { overflow: hidden; display: none; z-index: 1050; }
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
  props: ['navtitle', 'tel', 'uname'],
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
  },
  methods: {
    open () {
      var modal = $('.side-modal')
      modal.addClass('side-modal-on')
      modal.children().animate({ left: '0px' }, 'normal')
      $('body').animate({ paddingLeft: '250px' }, 'normal')
    },
    close () {
      if (window.screen.availWidth >= 800) {
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

