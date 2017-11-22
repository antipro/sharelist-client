import Vue from 'vue'
import Router from 'vue-router'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-datepicker'
import Shell from '@/components/Shell'
import ListByProject from '@/components/ListByProject'
import ListByDate from '@/components/ListByDate'
import Project from '@/components/Project'
import Task from '@/components/Task'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Shell,
      children: [
        {
          path: 'projectlist',
          component: ListByProject
        },
        {
          path: 'datelist',
          component: ListByDate
        }
      ]
    },
    {
      name: 'project',
      path: '/project',
      component: Project
    },
    {
      name: 'task',
      path: '/task',
      component: Task
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
