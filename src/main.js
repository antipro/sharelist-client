// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* global SERVER_IP:true */
import Vue from 'vue'
import Vuex from 'vuex'
import VuePersist from 'vue-persist'
import App from './App'
import router from './router'
import io from 'socket.io-client'

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
    replaceAllItems (state, items) {
      state.items = items
    },
    addProject (state, project) {
      state.projects.push(project)
    },
    replaceAllProjects (state, projects) {
      state.projects = projects
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
    token: ''
  },
  persist: ['uid', 'tel', 'uname', 'token'],
  components: { App },
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
      socket.on('items', function (items) {
        store.commit('replaceAllItems', items)
      })
      socket.on('projects', function (projects) {
        store.commit('replaceAllProjects', projects)
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
    exit () {
      socket.disconnect()
    }
  }
})
