import Vue from 'vue';
import App from './App';
import router from './router';
import qs from 'qs';
import axios from './vendor/axious';
import Vuex from 'vuex'
import store from './store/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/icon.css';
import "babel-polyfill";
import QRCode from 'qrcode'
import ports from './api/ports'

Vue.prototype.ports = ports

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer);
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});



//axios.defaults.headers['token'] = localStorage.getItem('wyhb_token')||""


Vue.prototype.$axios = axios;// 将axios配置成vue的原型

Vue.use(ElementUI, { size: 'small' });

Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = store.state.token;
    if(store.state.token){
			axios.defaults.headers['token']=store.state.token
		}
    
    if(!role && to.path !== '/login'&&store.state.login=='wyhb'){
    	
    	
//  	if(to.path==='/buurtLogin'){
//  		store.commit('del_token');
//  		next('/buurtLogin');
//  	}else{
				console.log(to.path)
				store.commit('del_token');
    		next('/login');
    		
//  	}
      
    }else if(!role && to.path !== '/buurtLogin'&&store.state.login=='buurt'){
    		console.log(to.path)
    	store.commit('del_token');
        next('/buurtLogin');
    		
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})

new Vue({
    router,
//  axios,
    render: h => h(App)
}).$mount('#app');