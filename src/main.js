// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* global SERVER_IP:true */
import Vue from 'vue'
import Vuex from 'vuex'
import VuePersist from 'vue-persist'
import App from './App'
import router from './router'
import io from 'socket.io-client'
import $ from 'jquery'

Vue.use(Vuex)
Vue.use(VuePersist)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    login: true,
    items: [],
    projects: []
  },
  mutations: {
    offline (state) {
      state.login = false
    },
    online (state) {
      state.login = true
    },
    addItem (state, item) {
      state.items.push(item)
    },
    init (state, all) {
      state.items = all.items
      state.projects = all.projects
    },
    addProject (state, project) {
      state.projects.push(project)
    }
  }
})

var socket = null

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  data: {
    uid: '',
    tel: '',
    uname: '',
    token: '',
    runtime: 'browser'
  },
  persist: ['uid', 'tel', 'uname', 'token'],
  components: { App },
  mounted () {
    var userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('electron/') > -1) {
      this.runtime = 'electron'
    }
    $.getScript('cordova.js').done(() => {
      this.runtime = 'cordova'
    })
  },
  methods: {
    connect () {
      socket = io(`http://${SERVER_IP}:3000`, {
        transports: ['websocket'],
        query: {
          token: this.token,
          uid: this.uid
        }
      })
      socket.on('init', function (all) {
        store.commit('init', all)
      })
      socket.on('newitem', function (item) {
        store.commit('addItem', item)
      })
    },
    addItem (pid, content) {
      socket.emit('addnewitem', {
        pid,
        uid: this.uid,
        content
      })
    },
    logout () {
      this.token = ''
      this.uname = ''
      this.tel = ''
      this.uid = ''
      this.$router.replace('/login')
      socket.disconnect()
    },
    exit () {
      switch (this.runtime) {
        case 'electron':
          window.close()
          break
        case 'cordova':
          window.navigator.app.exitApp()
          break
        default:
          console.log('unknown environment')
      }
    }
  }
})
