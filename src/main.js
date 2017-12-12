// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* global SERVER_ADDRESS:true */
/* eslint-disable no-new */
/* eslint-disable no-eval */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import translation from './locale'
import VuePersist from 'vue-persist'
import App from './App'
import router from './router'
import $ from 'jquery'
import axios from 'axios'
import './backports'
import initSocket from './socket'
import store from './store'

Vue.prototype.$axios = axios.create({
  baseURL: `http://${SERVER_ADDRESS}/api/`,
  timeout: 10000
})

Vue.use(VueI18n)
Vue.use(VuePersist)
Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'en',
  messages: translation,
  fallbackLocale: 'en'
})

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  data: {
    uid: '',
    email: '',
    uname: '',
    token: '',
    runtime: 'browser',
    locale: ''
  },
  persist: ['uid', 'email', 'uname', 'token', 'locale'],
  components: { App },
  created () {
    if (this.locale === '') {
      this.locale = navigator.language
    }
  },
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
    addProject (name) {
      this.$socket.emit('addproject', {
        uid: this.uid,
        name
      })
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
    updateTask (id, pid, content, notifyDate, notifyTime) {
      this.$socket.emit('updatetask', {
        id,
        pid,
        content,
        notify_date: notifyDate,
        notify_time: notifyTime
      })
    },
    updatePreference (preference) {
      this.$socket.emit('updatepreference', preference)
    },
    showNotification (task) {
      switch (this.runtime) {
        case 'browser':
          alert(task.content)
          break
        case 'electron':
          new Notification('Sharelist', {
            icon: 'static/tray.png',
            body: task.content
          })
          break
        // case 'cordova':
        //   window.cordova.plugins.notification.local.schedule({
        //     id: task.id,
        //     title: 'Sharelist',
        //     text: task.content
        //   })
        //   break
        default:
          console.log('unknown environment')
      }
    },
    /**
     * schedule task(cordova only)
     * @param {*} task
     */
    schedule (task) {
      if (task.state === 1) {
        this.clearSchedule(task.id)
        return
      }
      if (task.notify_date === null) {
        return
      }
      let futureTime = Date.parse(task.notify_date + ' ' +
          (task.notify_time === null ? this.$store.state.preference.notify_time : task.notify_time) + ':00')
      let currentTime = Date.now()
      if (futureTime < currentTime) {
        return
      }
      window.cordova.plugins.notification.local.schedule({
        id: task.id,
        title: this.$t('ui.app_name'),
        text: task.content,
        at: new Date(futureTime)
      })
    },
    clearSchedule (id) {
      window.cordova.plugins.notification.local.cancel(id)
    },
    scheduleAll () {
      window.cordova.plugins.notification.local.cancel(
        store.state.tasks.map(task => {
          return task.id
        }),
        () => {
          store.state.tasks.forEach(task => {
            this.schedule(task)
          })
        }
      )
    },
    logout () {
      this.token = ''
      this.uname = ''
      this.email = ''
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
        this.$socket = initSocket(this, store)
        return
      }
      if (this.$socket !== null) {
        console.log('socket disconnect')
        this.$socket.disconnect()
      }
    },
    locale (val) {
      this.$i18n.locale = val
      if (this.token === '') {
        return
      }
      this.updatePreference({
        locale: val
      })
    }
  }
})
