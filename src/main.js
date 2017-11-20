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
import Promise from 'es6-promise'
import axios from 'axios'

if (window.Promise === undefined) {
  window.Promise = Promise
}

Vue.prototype.$axios = axios.create({
  baseURL: `http://${SERVER_IP}:3000/api/`,
  timeout: 5000
})

Vue.use(Vuex)
Vue.use(VuePersist)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    login: true,
    tasks: [],
    projects: []
  },
  mutations: {
    offline (state) {
      state.login = false
    },
    online (state) {
      state.login = true
    },
    addTask (state, task) {
      state.tasks.push(task)
    },
    removeTask (state, id) {
      for (let idx = 0; idx < state.tasks.length; idx++) {
        const task = state.tasks[idx]
        if (task.id === id) {
          state.tasks.splice(idx, 1)
          break
        }
      }
    },
    toggleTask (state, { id, state1 }) {
      for (let idx = 0; idx < state.tasks.length; idx++) {
        const task = state.tasks[idx]
        if (task.id === id) {
          task.state = state1
          break
        }
      }
    },
    init (state, all) {
      state.tasks = all.tasks
      state.projects = all.projects
    },
    clear (state) {
      state.tasks = []
      state.projects = []
    },
    addProject (state, project) {
      state.projects.push(project)
    },
    addShared (state, all) {
      let pid = all.project.id
      state.projects = state.projects.filter(project => project.id !== pid)
      state.projects.push(all.project)
      state.tasks = state.tasks.filter(task => task.pid !== pid)
      state.tasks.push(...all.tasks)
    },
    removeUnshared (state, pid) {
      state.projects = state.projects.filter((project) => {
        return project.id !== pid
      })
      state.tasks = state.tasks.filter((task) => {
        return task.pid !== pid
      })
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
      socket.on('init', (all) => {
        store.commit('init', all)
      })
      socket.on('task added', (task) => {
        store.commit('addTask', task)
      })
      socket.on('task removed', (id) => {
        store.commit('removeTask', id)
      })
      socket.on('task toggled', (id, state1) => {
        store.commit('toggleTask', { id, state1 })
      })
      socket.on('project shared', (pid) => {
        this.$axios.get('/projects/' + pid, {
          headers: {
            TOKEN: this.token
          }
        }).then((response) => {
          let res = response.data
          if (res.state === '001') {
            alert(res.msg)
            return
          }
          store.commit('addShared', res.data)
        })
      })
      socket.on('project unshared', (pid) => {
        store.commit('removeUnshared', pid)
      })
    },
    addTask (pid, content) {
      socket.emit('addtask', {
        pid,
        uid: this.uid,
        content
      })
    },
    toggleTask (id, state, pid) {
      socket.emit('toggletask', {
        id,
        state,
        pid
      })
    },
    removeTask (id, pid) {
      socket.emit('removetask', {
        id,
        pid
      })
    },
    updateProject (pid, pname, shares) {
      socket.emit('updateproject', {
        pid,
        pname,
        shares
      })
    },
    logout () {
      this.token = ''
      this.uname = ''
      this.tel = ''
      this.uid = ''
      store.commit('clear')
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
