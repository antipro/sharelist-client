/* global SERVER_ADDRESS:true */
import io from 'socket.io-client'

export default function ($vue, store) {
  let socket = io(`http://${SERVER_ADDRESS}`, {
    transports: ['websocket'],
    query: {
      token: $vue.token,
      uid: $vue.uid
    }
  })
  socket.on('init', (all) => {
    store.commit('init', all)
    if ($vue.runtime === 'cordova') {
      store.state.tasks.forEach(task => {
        $vue.schedule(task)
      })
    }
    if (all.preference.locale) {
      $vue.locale = all.preference.locale
    }
  })
  socket.on('project added', (project) => {
    store.commit('addProject', project)
  })
  socket.on('task added', (task) => {
    store.commit('addTask', task)
    if ($vue.runtime === 'cordova') {
      $vue.schedule(task)
    }
  })
  socket.on('task updated', (task) => {
    store.commit('updateTask', task)
    if ($vue.runtime === 'cordova') {
      $vue.schedule(task)
    }
  })
  socket.on('project removed', (pid) => {
    if ($vue.runtime === 'cordova') {
      store.state.tasks.forEach(task => {
        if (task.pid === pid) {
          $vue.clearSchedule(task.id)
        }
      })
    }
    store.commit('removeProject', pid)
  })
  socket.on('task removed', (id) => {
    if ($vue.runtime === 'cordova') {
      $vue.clearSchedule(id)
    }
    store.commit('removeTask', id)
  })
  socket.on('task toggled', (task) => {
    store.commit('toggleTask', task)
    if ($vue.runtime === 'cordova') {
      $vue.schedule(task)
    }
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
        alert($vue.$t(res.msg))
        return
      }
      store.commit('addShared', res.data)
      if ($vue.runtime === 'cordova') {
        res.data.tasks.forEach(task => {
          $vue.schedule(task)
        })
      }
    })
  })
  socket.on('project unshared', (pid) => {
    if ($vue.runtime === 'cordova') {
      store.state.tasks.forEach(task => {
        if (task.pid === pid) {
          $vue.clearSchedule(task.id)
        }
      })
    }
    store.commit('removeUnshared', pid)
  })
  socket.on('preference updated', (preference) => {
    store.commit('updatePreference', preference)
    if ($vue.runtime === 'cordova') {
      store.state.tasks.forEach(task => {
        $vue.schedule(task)
      })
    }
  })
  socket.on('task notified', task => {
    $vue.showNotification(task)
  })
  socket.on('error event', (msg) => {
    alert($vue.$t(msg))
  })
  return socket
}
