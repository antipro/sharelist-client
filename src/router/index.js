import Vue from 'vue'
import Router from 'vue-router'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import Shell from '@/components/Shell'
import ListByProject from '@/components/ListByProject'
import ListByDate from '@/components/ListByDate'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Shell,
      children: [
        {
          path: 'project',
          component: ListByProject
        },
        {
          path: 'date',
          component: ListByDate
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
