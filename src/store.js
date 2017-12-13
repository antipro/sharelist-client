import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [],
    projects: [],
    preference: {},
    ungroupPid: 0
  },
  mutations: {
    addTask (state, task) {
      state.tasks.push(task)
    },
    updateTask (state, updatedTask) {
      let idx = state.tasks.findIndex(task => {
        return task.id === updatedTask.id
      })
      state.tasks.splice(idx, 1, updatedTask)
    },
    removeProject (state, pid) {
      let idx = state.projects.findIndex(project => {
        return project.id === pid
      })
      state.projects.splice(idx, 1)
      state.tasks.forEach((task, idx) => {
        if (task.pid === pid) {
          state.tasks.splice(idx, 1)
        }
      })
    },
    removeTask (state, id) {
      let idx = state.tasks.findIndex(task => {
        return task.id === id
      })
      state.tasks.splice(idx, 1)
    },
    toggleTask (state, updatedTask) {
      let idx = state.tasks.findIndex(task => {
        return task.id === updatedTask.id
      })
      state.tasks.splice(idx, 1, updatedTask)
    },
    init (state, all) {
      state.tasks = all.tasks
      state.projects = all.projects
      state.preference = all.preference
      state.activeDate = null
      let upgroupProject = all.projects.find(project => {
        return project.name === ''
      })
      state.ungroupPid = upgroupProject.id
    },
    clear (state) {
      state.tasks = []
      state.projects = []
      state.preference = {}
      state.activeDate = null
      state.ungroupPid = 0
    },
    addProject (state, project) {
      state.projects.push(project)
    },
    updateProject (state, updatedProject) {
      state.projects.find(project => {
        return project.id === updatedProject.id
      }).name = updatedProject.name
    },
    updatePreference (state, preference) {
      for (let prop in preference) {
        state.preference[prop] = preference[prop]
      }
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
