
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Tallent from '../components/Tallent'
import Supervisor from '../components/Supervisor'
import Hrd from '../components/Hrd'

Vue.use(Router)

export default new Router({
	// mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/tallent',
      name: 'tallent',
      component: Tallent
    },
    {
      path: '/supervisor',
      name: 'supervisor',
      component: Supervisor
    },
    {
      path: '/hrd',
      name: 'hrd',
      component: Hrd
    }
  ]
})