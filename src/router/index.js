import Vue from 'vue'
import Router from 'vue-router'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import Shell from '@/components/Shell'
import ListByProject from '@/components/ListByProject'
import ListByDate from '@/components/ListByDate'
import Project from '@/components/Project'
import Task from '@/components/Task'
import Preference from '@/components/Preference'
import Login from '@/components/Login'
import Signup from '@/components/Signup'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Shell,
      children: [
        {
          name: 'projectlist',
          path: 'projectlist',
          component: ListByProject
        },
        {
          name: 'datelist',
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
      name: 'preference',
      path: '/preference',
      component: Preference
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'signup',
      path: '/signup',
      component: Signup
    }
  ]
})
