// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* global SERVER_IP:true */
/* eslint no-extend-native:off */
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

if (Array.prototype.find === undefined) {
  Array.prototype.find = function (val) {
    for (let idx = 0; idx < this.length; idx++) {
      const ele = this[idx]
      if (typeof val === 'function' && val(ele)) {
        return ele
      } else if (ele === val) {
        return ele
      }
    }
    return undefined
  }
}

if (Array.prototype.findIndex === undefined) {
  Array.prototype.findIndex = function (val) {
    for (let idx = 0; idx < this.length; idx++) {
      const ele = this[idx]
      if (typeof val === 'function' && val(ele)) {
        return idx
      } else if (ele === val) {
        return idx
      }
    }
    return undefined
  }
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
    tasks: [],
    projects: []
  },
  mutations: {
    addTask (state, task) {
      state.tasks.push(task)
    },
    updateTask (state, updatedTask) {
      let task = state.tasks.find(task => {
        return task.id === updatedTask.id
      })
      task.content = updatedTask.content
      task.notify_date = updatedTask.notify_date
    },
    removeProject (state, pid) {
      console.log(pid)
      let idx = state.projects.findIndex(project => {
        return project.id === pid
      })
      console.log(idx)
      state.projects.splice(idx, 1)
      state.tasks.forEach((task, idx) => {
        if (task.pid === pid) {
          state.tasks.splice(idx, 1)
          console.log(idx)
        }
      })
    },
    removeTask (state, id) {
      let idx = state.tasks.findIndex(task => {
        return task.id === id
      })
      state.tasks.splice(idx, 1)
    },
    toggleTask (state, { id, state1 }) {
      state.tasks.find(task => {
        return task.id === id
      }).state = state1
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
    updateProject (state, updatedProject) {
      state.projects.find(project => {
        return project.id === updatedProject.id
      }).name = updatedProject.name
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

function initSocket (uid, token) {
  let socket = io(`http://${SERVER_IP}:3000`, {
    transports: ['websocket'],
    query: {
      token: token,
      uid: uid
    }
  })
  socket.on('init', (all) => {
    store.commit('init', all)
  })
  socket.on('task added', (task) => {
    store.commit('addTask', task)
  })
  socket.on('task updated', (task) => {
    store.commit('updateTask', task)
  })
  socket.on('project removed', (pid) => {
    store.commit('removeProject', pid)
  })
  socket.on('task removed', (id) => {
    store.commit('removeTask', id)
  })
  socket.on('task toggled', (id, state1) => {
    store.commit('toggleTask', { id, state1 })
  })
  socket.on('project updated', (project) => {
    store.commit('updateProject', project)
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
  return socket
}

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
    refresh (fn) {
      this.$socket.emit('refresh', fn)
    },
    addTask (pid, content) {
      this.$socket.emit('addtask', {
        pid,
        uid: this.uid,
        content
      })
    },
    toggleTask (id, state, pid) {
      this.$socket.emit('toggletask', {
        id,
        state,
        pid
      })
    },
    removeProject (pid) {
      this.$socket.emit('removeproject', {
        pid
      })
    },
    removeTask (id, pid) {
      this.$socket.emit('removetask', {
        id,
        pid
      })
    },
    updateProject (pid, pname, shares) {
      this.$socket.emit('updateproject', {
        pid,
        pname,
        shares
      })
    },
    updateTask (id, pid, content, notifyDate) {
      this.$socket.emit('updatetask', {
        id,
        pid,
        content,
        notify_date: notifyDate
      })
    },
    logout () {
      this.token = ''
      this.uname = ''
      this.tel = ''
      this.uid = ''
      this.$store.commit('clear')
      this.$router.replace('/login')
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
  },
  watch: {
    token (val) {
      if (val !== '') {
        console.log('socket connect')
        this.$socket = initSocket(this.uid, this.token)
        return
      }
      if (this.$socket !== null) {
        console.log('socket disconnect')
        this.$socket.disconnect()
      }
    }
  }
})
