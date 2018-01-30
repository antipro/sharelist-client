/* global SERVER_URL:true */
import io from 'socket.io-client'

export default function ($vue, store) {
  let socket = io(`${SERVER_URL}`, {
    transports: ['websocket'],
    query: {
      token: $vue.token,
      uid: $vue.uid,
      uname: $vue.uname
    }
  })
  socket.on('init', (all) => {
    all.projects.push({
      id: 0,
      uid: $vue.uid,
      uname: $vue.uname,
      name: '',
      editable: 'N',
      control: ''
    })
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
  socket.on('task added', (task, user) => {
    store.commit('addTask', task)
    if ($vue.runtime === 'cordova') {
      $vue.schedule(task)
    }
    if (user && parseInt(user.uid) !== $vue.uid) {
      $vue.showMessage($vue.$t('message.task_added_by_other', [ user.uname ]), task.content)
    }
  })
  socket.on('task updated', (task, user) => {
    store.commit('updateTask', task)
    if ($vue.runtime === 'cordova') {
      $vue.schedule(task)
    }
    if (user && parseInt(user.uid) !== $vue.uid) {
      $vue.showMessage($vue.$t('message.task_updated_by_other', [ user.uname ]), task.content)
    }
  })
  socket.on('project removed', (pid, pname, user) => {
    if ($vue.runtime === 'cordova') {
      store.state.tasks.forEach(task => {
        if (task.pid === pid) {
          $vue.clearSchedule(task.id)
        }
      })
    }
    store.commit('removeProject', pid)
    if (user && parseInt(user.uid) !== $vue.uid) {
      $vue.showMessage($vue.$t('message.project_removed_by_other', [ user.uname ]), pname)
    }
  })
  socket.on('task removed', (id, content, user) => {
    if ($vue.runtime === 'cordova') {
      $vue.clearSchedule(id)
    }
    store.commit('removeTask', id)
    if (user && parseInt(user.uid) !== $vue.uid) {
      $vue.showMessage($vue.$t('message.task_removed_by_other', [ user.uname ]), content)
    }
  })
  socket.on('task toggled', (task, user) => {
    store.commit('toggleTask', task)
    if ($vue.runtime === 'cordova') {
      $vue.schedule(task)
    }
    if (user && parseInt(user.uid) !== $vue.uid) {
      if (task.state === 1) {
        $vue.showMessage($vue.$t('message.task_finished_by_other', [ user.uname ]), task.content)
      }
      if (task.state === 0) {
        $vue.showMessage($vue.$t('message.task_resumed_by_other', [ user.uname ]), task.content)
      }
    }
  })
  socket.on('project updated', (project, user) => {
    store.commit('updateProject', project)
    if (user && parseInt(user.uid) !== $vue.uid) {
      $vue.showMessage($vue.$t('message.project_updated_by_other', [ user.uname ]), project.name)
    }
  })
  socket.on('project shared', (pid, user) => {
    $vue.$axios.get('/projects/' + pid, {
      headers: {
        TOKEN: $vue.token
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
      $vue.showMessage($vue.$t('message.project_shared', [ user.uname ]), res.data.project.name)
    })
  })
  socket.on('project unshared', (pid, user) => {
    if ($vue.runtime === 'cordova') {
      store.state.tasks.forEach(task => {
        if (task.pid === pid) {
          $vue.clearSchedule(task.id)
        }
      })
    }
    store.commit('removeUnshared', pid)
    $vue.showMessage($vue.$t('message.project_unshared', [ user.uname ]))
  })
  socket.on('preference updated', (preference) => {
    store.commit('updatePreference', preference)
    if (preference['name']) {
      $vue.uname = preference['name']
    }
    if ($vue.runtime === 'cordova') {
      store.state.tasks.forEach(task => {
        $vue.schedule(task)
      })
    }
  })
  socket.on('pwd reseted', () => {
    alert($vue.$t('message.pwd_reseted'))
    $vue.logout()
  })
  socket.on('relogin', () => {
    $vue.logout()
  })
  socket.on('task notified', task => {
    $vue.showNotification(task)
  })
  socket.on('error event', (msg) => {
    alert($vue.$t(msg))
  })
  return socket
}
