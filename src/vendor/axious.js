/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import { Loading, Message } from 'element-ui'
import router from '../router';
import store from '../store/store';
import api from '../api/ports';
// 超时时间
axios.defaults.timeout = 100000; // 在超时前，所有请求都会等待 5 秒
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 配置请求头
axios.defaults.baseURL = api.Base; // 配置接口地址
//axios.defaults.baseURL = 'https://wyhb.dev.zgwyhb.com';// 配置接口地址
axios.defaults.withCredentials = false;
axios.defaults.headers['channel'] = 'web'
//axios.defaults.headers['build'] = 99999999
axios.defaults.headers['build'] = 20190912
// http请求拦截器
var loadinginstace
//axios.interceptors.request.use(config => {
// // element ui Loading方法
// loadinginstace = Loading.service({ fullscreen: true })
// return config
//}, error => {
// loadinginstace.close()
// Message.error({
// message: '加载超时'
// })
// return Promise.reject(error)
//})
// http响应拦截器
// http response 拦截器

axios.interceptors.response.use(function(response) {
	//暂停加载动画
	// tryHideFullScreenLoading();
	//      console.log(response.data.status)
	//      switch (response.data.status) {
	//          case 801:
	//              // 返回 801 清除token信息并跳转到登录页面
	//              store.commit('del_token')
	//              router.replace({
	//                  path: 'login',
	//                  query: { redirect: router.history.current.fullPath }
	//              })
	//              break;
	//          case 802:
	//              router.replace({
	//                  path: '802',
	//                  query: { redirect: router.history.current.fullPath }
	//              })
	//              break;
	//          case 414:
	//              router.replace({
	//                  path: '403',
	//                  query: { redirect: router.history.current.fullPath }
	//              })
	//              break;
	//      }
	
	if(response.data.status == 801) {
		
		store.commit('del_token')
		if(localStorage.getItem('login') == 'buurt') {
			return router.replace({
				path: 'buurtLogin',
				query: {
					redirect: router.history.current.fullPath
				}
			})
		} else {
			return router.replace({
				path: 'login',
				query: {
					redirect: router.history.current.fullPath
				}
			})
		}

	} else if(response.data.status == 802) {
		if(localStorage.getItem('login') == 'buurt') {
			return router.replace({
				path: '8021',
				query: {
					redirect: router.history.current.fullPath
				}
			})
		} else {
			return router.replace({
				path: '802',
				query: {
					redirect: router.history.current.fullPath
				}
			})
		}

		//      }else if(response.data.status==414){
		//      	return router.replace({
		//              path: '403',
		//              query: { redirect: router.history.current.fullPath }
		//         })
		//      }

//	}else if(response.data.status == 414){
//		if(localStorage.getItem('login') == 'buurt') {
//			
//			return router.replace({
//				path: '4141',
//				query: {
//					redirect: router.history.current.fullPath
//				}
//			})
//		} else {
//			return router.replace({
//				path: '403',
//				query: {
//					redirect: router.history.current.fullPath
//				}
//			})
//		}
	}else {
		return response;
	}

}, function(err) {
	console.log(err.response)
	if(err.response) {
		console.log(err)
		switch(err.response.status) {
			case 401:
				// 返回 401 清除token信息并跳转到登录页面
				store.commit('del_token');
				router.replace({
					path: 'login',
					query: {
						redirect: router.history.current.fullPath
					}
				})
		}
	}
	return Promise.reject(err);
})

export default axios