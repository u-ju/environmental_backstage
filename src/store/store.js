import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api/ports';
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    token:'',
    login:'',
    http:api.Base,
    config:{}
  },
  mutations: {
    //所有mutations中的方法的第一个参数一定是state变量，用来进行对state中的状态的操作
    //第二个参数是可选参数，用于调用该 mutations 方法的时候传参
		set_token(state, token) {
			state.token = token
			localStorage.token = token
			localStorage.setItem('token',token)
		},
    del_token(state) {
			state.token = ''
			localStorage.removeItem('token')
		},
		set_login(state, login) {
			state.login = login
			localStorage.login = login
			localStorage.setItem('login',login)
		},
    del_login(state) {
			state.login = ''
			localStorage.removeItem('login')
		},
		set_config(state, config) {
			state.config = config
			localStorage.config = config
//			localStorage.setItem('config',config)
		},
    del_config(state) {
			state.config = {}
//			localStorage.removeItem('config')
		}
  }
})

export default store