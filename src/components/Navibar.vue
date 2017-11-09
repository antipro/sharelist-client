<template>
  <nav class="navbar navbar-default">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <a class="navbar-brand" href="#" @click="open" @touchmove.prevent>
        <span class="glyphicon glyphicon-th-list"></span> 菜单
      </a>
      <div class="side-modal" @click="close">
        <div class="side-action" style="text-align: left;">
          <div class="row" style="margin-bottom: 50px;">
            <div class="col-xs-3">
            </div>
            <div class="col-xs-6">
              <img src="../assets/logo.png" class="img-rounded img-responsive">
              {{ $root.tel }} {{ $root.uname }}
            </div>
            <div class="col-xs-3">
            </div>
          </div>
          <div class="list-group">
            <router-link class="list-group-item" to="/project" replace>按项目查看</router-link>
            <router-link class="list-group-item" to="/date" replace>按时间查看</router-link>
            <button type="button" class="list-group-item" >搜索</button>
            <button type="button" class="list-group-item" @click="exit">退出</button>
          </div>
        </div>
      </div>
      <div class="navbar-brand" style="float:right;">
        <span v-if="online" class="glyphicon glyphicon-cloud"></span>
        <span v-else class="glyphicon glyphicon-flash text-danger"></span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar { margin-bottom: 5px; background-color: #337ab7; width: 100vw; }
.navbar .navbar-brand { color: #FFF; }
.navbar .navbar-brand:hover { color: #FFF; }
.navbar .navbar-brand:focus { color: #FFF; }
.side-action {
	position: absolute; 
	width: 250px; 
	top: 0px; 
	bottom: 0px; 
	left: -250px; 
	display: flex; 
	flex-direction: column;
	justify-content: center;
	background-color: #f9f7f6;
}
.side-modal {
	overflow: hidden;
	display: none;
	z-index: 1050;
}
.side-modal-on {
	position: fixed;
	right: 0px;
	left: 0px;
	top: 0px;
	bottom: 0px;
	display: block;
  background-color: rgba(52, 52, 52, 0.5)
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
  },
  methods: {
    open () {
      var modal = $('.side-modal')
      modal.addClass('side-modal-on')
      modal.children().animate({ left: '0px' }, 'normal')
      $('body').animate({ paddingLeft: '250px' }, 'normal')
    },
    close () {
      $('.side-action').animate({ left: '-250px' }, 'normal', () => {
        $('.side-modal').removeClass('side-modal-on')
      })
      $('body').animate({ paddingLeft: '0px' }, 'normal')
    },
    exit () {
      this.$root.token = ''
      this.$root.uname = ''
      this.$root.tel = ''
      this.$root.uid = ''
      this.$root.exit()
      this.$router.replace('/login')
    }
  }
}
</script>

