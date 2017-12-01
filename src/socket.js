/* global SERVER_IP:true */
import io from 'socket.io-client'

export default function ($vue, store) {
  let socket = io(`http://${SERVER_IP}:3000`, {
    transports: ['websocket'],
    query: {
      token: $vue.token,
      uid: $vue.uid
    }
  })
  socket.on('init', (all) => {
    store.commit('init', all)
  })
  socket.on('project added', (project) => {
    store.commit('addProject', project)
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
  socket.on('preference updated', (preference) => {
    store.commit('updatePreference', preference)
  })
  socket.on('task notified', task => {
    console.log(new Date(), task)
    $vue.showNotification(task)
  })
  return socket
}
