import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/store'
Vue.use(Router);

if(localStorage.getItem('token')) {
	store.commit('set_token', localStorage.getItem('token'))
}

export default new Router({
	mode: 'history',
	routes: [{
			path: '/',
			redirect: '/dashboard'
		},

		{
			path: '/',
			component: resolve => require(['../components/common/Home.vue'], resolve),
			meta: {
				title: '自述文件'
			},
			children: [{
					path: '/dashboard',
					component: resolve => require(['../components/page/Dashboard.vue'], resolve),
					meta: {
						title: '系统首页'
					}
				},
				{ //用户信息
					path: '/user',
					component: resolve => require(['../components/page/user/User.vue'], resolve),
					meta: {
						title: '用户信息'
					}
				},
				{ //实名
					path: '/Realname',
					component: resolve => require(['../components/page/realname/Realname.vue'], resolve),
					meta: {
						title: '实名信息'
					}
				},
				{ //用户详情
					path: '/UserDetails',
					component: resolve => require(['../components/page/user/UserDetails.vue'], resolve),
					meta: {
						title: '用户详情'
					}
				},

				{ //用户详情
					path: '/UserRole',
					component: resolve => require(['../components/page/user/UserRole.vue'], resolve),
					meta: {
						title: '用户角色管理'
					}
				},
				{ //零钱信息
					path: '/Change',
					component: resolve => require(['../components/page/money/Change.vue'], resolve),
					meta: {
						title: '零钱记录'
					}
				},
				{ //积分信息
					path: '/Integral',
					component: resolve => require(['../components/page/money/Integral.vue'], resolve),
					meta: {
						title: '积分记录'
					}
				},
				{ //积分信息
					path: '/SettleIndex',
					component: resolve => require(['../components/page/money/SettleIndex.vue'], resolve),
					meta: {
						title: '货款提现记录'
					}
				},

				{ //零钱提现记录
					path: '/ChangeList',
					component: resolve => require(['../components/page/money/ChangeList.vue'], resolve),
					meta: {
						title: '零钱提现记录'
					}
				},
				{ //钱包批量更新
					path: '/updateBatch',
					component: resolve => require(['../components/page/money/updateBatch.vue'], resolve),
					meta: {
						title: '钱包批量更新'
					}
				},
				{ //角色管理
					path: '/Role',
					component: resolve => require(['../components/page/role/Role.vue'], resolve),
					meta: {
						title: '角色管理'
					}
				},
				{ //角色管理
					path: '/RoleUser',
					component: resolve => require(['../components/page/role/RoleUser.vue'], resolve),
					meta: {
						title: '角色用户'
					}
				},
				{ //角色管理
					path: '/RoleAbility',
					component: resolve => require(['../components/page/role/RoleAbility.vue'], resolve),
					meta: {
						title: '角色能力'
					}
				},
				{ //能力管理
					path: '/Ability',
					component: resolve => require(['../components/page/ability/Ability.vue'], resolve),
					meta: {
						title: '权限管理'
					}
				},
				{ //银行卡管理
					path: '/BankCard',
					component: resolve => require(['../components/page/bankCard/BankCard.vue'], resolve),
					meta: {
						title: '银行卡管理'
					}
				},
				{ //地址管理
					path: '/Area',
					component: resolve => require(['../components/page/area/Area.vue'], resolve),
					meta: {
						title: '地址管理'
					}
				},
				{ //实体商家
					path: '/Shop',
					component: resolve => require(['../components/page/shop/Shop.vue'], resolve),
					meta: {
						title: '线下实体商家'
					}
				},
				{ //实体商家
					path: '/Shopadd',
					component: resolve => require(['../components/page/shop/addshop.vue'], resolve),
					meta: {
						title: '添加商家'
					}
				},
				{ //直营商家
					path: '/ShopOnline',
					component: resolve => require(['../components/page/shop/ShopOnline.vue'], resolve),
					meta: {
						title: '线上自营商家'
					}
				},
				{ //加盟商家
					path: '/ShopLeague',
					component: resolve => require(['../components/page/shop/ShopLeague.vue'], resolve),
					meta: {
						title: '平台自营商家'
					}
				},
				{ //帮助中心
					path: '/Help',
					component: resolve => require(['../components/page/help/Help.vue'], resolve),
					meta: {
						title: '帮助中心'
					}
				},
				{ //新闻中心
					path: '/News',
					component: resolve => require(['../components/page/news/News.vue'], resolve),
					meta: {
						title: '新闻中心'
					}
				},
				{ //回复
					path: '/Reply',
					component: resolve => require(['../components/page/news/Reply.vue'], resolve),
					meta: {
						title: '回复列表'
					}
				},
				{ //社区文化分类
					path: '/buurtNewsCate',
					component: resolve => require(['../components/page/buurtNews/buurtNewsCate.vue'], resolve),
					meta: {
						title: '社区文化分类'
					}
				},
				{ //社区文化分类
					path: '/buurtService',
					component: resolve => require(['../components/page/buurtNews/buurtService.vue'], resolve),
					meta: {
						title: '社区服务分类'
					}
				},
				{ //社区文化
					path: '/buurtNews',
					component: resolve => require(['../components/page/buurtNews/buurtNews.vue'], resolve),
					meta: {
						title: '社区文化'
					}
				},
				{ //社区文化
					path: '/buurtm',
					component: resolve => require(['../components/page/buurtNews/buurt.vue'], resolve),
					meta: {
						title: '社区文化'
					}
				},
				{ //回复
					path: '/buurtNewsReply',
					component: resolve => require(['../components/page/buurtNews/Reply.vue'], resolve),
					meta: {
						title: '社区文化回复列表'
					}
				},
				{ //垃圾分类
					path: '/GarbageCate',
					component: resolve => require(['../components/page/garbage/GarbageCate.vue'], resolve),
					meta: {
						title: '垃圾分类'
					}
				},
				{ //垃圾柜
					path: '/GarbageArk',
					component: resolve => require(['../components/page/garbage/GarbageArk.vue'], resolve),
					meta: {
						title: '垃圾柜'
					}
				},
				{ //垃圾箱
					path: '/GarbageBox',
					component: resolve => require(['../components/page/garbage/GarbageBox.vue'], resolve),
					meta: {
						title: '垃圾箱'
					}
				},
				{ //邻里趣事
					path: '/Vicinage',
					component: resolve => require(['../components/page/vicinage/Vicinage.vue'], resolve),
					meta: {
						title: '邻里趣事'
					}
				},
				{ //邻里趣事回复
					path: '/VicinageReply',
					component: resolve => require(['../components/page/vicinage/Reply.vue'], resolve),
					meta: {
						title: '回复'
					}
				},
				{ //环保袋申请列表
					path: '/EcoBagApply',
					component: resolve => require(['../components/page/ecoBag/EcoBagApply.vue'], resolve),
					meta: {
						title: '环保袋申请列表'
					}
				},
				{ //环保袋申请列表
					path: '/EcoBagExchangeIndex',
					component: resolve => require(['../components/page/ecoBag/EcoBagExchangeIndex.vue'], resolve),
					meta: {
						title: '环保袋兑换列表'
					}
				},
				{ //设置
					path: '/Setting',
					component: resolve => require(['../components/page/setting/Setting.vue'], resolve),
					meta: {
						title: '设置'
					}
				},
				{ //设置
					path: '/Protocol',
					component: resolve => require(['../components/page/setting/Protocol.vue'], resolve),
					meta: {
						title: '协议'
					}
				},
				{ //代理
					path: '/Agent',
					component: resolve => require(['../components/page/agent/Agent.vue'], resolve),
					meta: {
						title: '代理'
					}
				},
				{ //代理
					path: '/Agent_invite',
					component: resolve => require(['../components/page/agent/Agent_invite.vue'], resolve),
					meta: {
						title: '推荐用户'
					}
				},
				{ //代理
					path: '/AgentShopIndex',
					component: resolve => require(['../components/page/agent/AgentShopIndex.vue'], resolve),
					meta: {
						title: '推荐商家'
					}
				},
				{ //代理
					path: '/AgentAgentIndex',
					component: resolve => require(['../components/page/agent/AgentAgentIndex.vue'], resolve),
					meta: {
						title: '推荐代理'
					}
				},
				{ //上门订单
					path: '/OnsiteRecycle',
					component: resolve => require(['../components/page/order/OnsiteRecycle.vue'], resolve),
					meta: {
						title: '上门订单'
					}
				},
				{ //垃圾袋订单
					path: '/BagOrder',
					component: resolve => require(['../components/page/order/BagOrder.vue'], resolve),
					meta: {
						title: '垃圾袋订单'
					}
				},
				{ //站点订单
					path: '/StationOrder',
					component: resolve => require(['../components/page/order/StationOrder.vue'], resolve),
					meta: {
						title: '站点订单'
					}
				},
				{ //站点订单详情
					path: '/StationDetails',
					component: resolve => require(['../components/page/order/StationDetails.vue'], resolve),
					meta: {
						title: '站点订单详情'
					}
				},
				{ //分类管理
					path: '/ShopCate',
					component: resolve => require(['../components/page/shop/ShopCate.vue'], resolve),
					meta: {
						title: '自营产品分类'
					}
				},
				{ //分类管理
					path: '/VicinageCate',
					component: resolve => require(['../components/page/vicinage/VicinageCate.vue'], resolve),
					meta: {
						title: '邻里趣事分类'
					}
				},
				{ //分类管理
					path: '/NewsCate',
					component: resolve => require(['../components/page/news/NewsCate.vue'], resolve),
					meta: {
						title: '新闻分类'
					}
				},
				{ //分类管理
					path: '/VideoCate',
					component: resolve => require(['../components/page/video/VideoCate.vue'], resolve),
					meta: {
						title: '视频分类'
					}
				},
				{ //分类管理
					path: '/Videos',
					component: resolve => require(['../components/page/video/Videos.vue'], resolve),
					meta: {
						title: '视频管理'
					}
				},
				{ //横幅管理
					path: '/banner',
					component: resolve => require(['../components/page/banner/banner.vue'], resolve),
					meta: {
						title: '横幅管理'
					}
				},
				{ //商品规格
					path: '/GoodsSpec',
					component: resolve => require(['../components/page/goods/GoodsSpec.vue'], resolve),
					meta: {
						title: '商品规格'
					}
				},
				{ //商品规格
					path: '/Goods',
					component: resolve => require(['../components/page/goods/Goods.vue'], resolve),
					meta: {
						title: '分期产品'
					}
				},
				{ //兑换区域管理
					path: '/exchangeArea',
					component: resolve => require(['../components/page/goods/exchangeArea.vue'], resolve),
					meta: {
						title: '分期区域管理'
					}
				},
				{ //商品规格
					path: '/GoodsCate',
					component: resolve => require(['../components/page/goods/GoodsCate.vue'], resolve),
					meta: {
						title: '产品分类'
					}
				},
				{ //商品规格
					path: '/GoodsOffline',
					component: resolve => require(['../components/page/goods/GoodsOffline.vue'], resolve),
					meta: {
						title: '实体产品'
					}
				},
				{ //商品规格
					path: '/GoodsOnline',
					component: resolve => require(['../components/page/goods/GoodsOnline.vue'], resolve),
					meta: {
						title: '自营产品'
					}
				},
				{ //兑换产品
					path: '/GoodsMarket',
					component: resolve => require(['../components/page/goods/GoodsMarket.vue'], resolve),
					meta: {
						title: '兑换产品'
					}
				},
				{ //商品规格
					path: '/GoodsAdd',
					component: resolve => require(['../components/page/goods/GoodsAdd.vue'], resolve),
					meta: {
						title: '商品编辑'
					}
				},
				{ //商品规格
					path: '/GoodsAddOffline',
					component: resolve => require(['../components/page/goods/GoodsAddOffline.vue'], resolve),
					meta: {
						title: '商品添加'
					}
				},
				{ //商品规格
					path: '/GoodskuEdit',
					component: resolve => require(['../components/page/goods/GoodskuEdit.vue'], resolve),
					meta: {
						title: '商品规格管理'
					}
				},
				{ //商品规格
					path: '/GoodskuAdd',
					component: resolve => require(['../components/page/goods/GoodskuAdd.vue'], resolve),
					meta: {
						title: '商品规格管理'
					}
				},
				{ //分类管理
					path: '/CateStorerepair',
					component: resolve => require(['../components/page/repair/CateStore.vue'], resolve),
					meta: {
						title: '维修分类'
					}
				},
				{ //分类管理
					path: '/Repair',
					component: resolve => require(['../components/page/repair/Repair.vue'], resolve),
					meta: {
						title: '维修中心'
					}
				},
				{ //分类管理
					path: '/CateStorejiazheng',
					component: resolve => require(['../components/page/jiazheng/CateStore.vue'], resolve),
					meta: {
						title: '家政分类'
					}
				},
				{ //分类管理
					path: '/JiaZheng',
					component: resolve => require(['../components/page/jiazheng/JiaZheng.vue'], resolve),
					meta: {
						title: '家政中心'
					}
				},
				{ //商品订单
					path: '/Order',
					component: resolve => require(['../components/page/goods/Order.vue'], resolve),
					meta: {
						title: '兑换产品订单'
					}
				},
				{ //商品订单
					path: '/OrderOnline',
					component: resolve => require(['../components/page/goods/OrderOnline.vue'], resolve),
					meta: {
						title: '直营产品订单'
					}
				},
				{ //商品订单
					path: '/OrderSeckill',
					component: resolve => require(['../components/page/goods/OrderSeckill.vue'], resolve),
					meta: {
						title: '拼购订单管理'
					}
				},
				{ //商品订单
					path: '/CommentIndex',
					component: resolve => require(['../components/page/goods/CommentIndex.vue'], resolve),
					meta: {
						title: '商品评论'
					}
				},
				{
					path: '/share',
					component: resolve => require(['../components/page/share/share.vue'], resolve),
					meta: {
						title: '推广中心'
					}
				}, {
					path: '/Recycle',
					component: resolve => require(['../components/page/recycle/Recycle.vue'], resolve),
					meta: {
						title: '回收中心'
					}
				},
				{ //分类管理
					path: '/CateStorerecruit',
					component: resolve => require(['../components/page/recruit/CateStore.vue'], resolve),
					meta: {
						title: '招聘分类'
					}
				},
				{
					path: '/802',
					component: resolve => require(['../components/page/802.vue'], resolve),
					meta: {
						title: '802'
					}
				},
				{ //分类管理
					path: '/recruit',
					component: resolve => require(['../components/page/recruit/recruit.vue'], resolve),
					meta: {
						title: '招聘职位'
					}
				},
				{ //分类管理
					path: '/recruitperson',
					component: resolve => require(['../components/page/recruit/recruitperson.vue'], resolve),
					meta: {
						title: '招聘人列表'
					}
				},
				{ //分类管理
					path: '/recruitcompany',
					component: resolve => require(['../components/page/recruit/recruitcompany.vue'], resolve),
					meta: {
						title: '招聘公司列表'
					}
				},
				{ //法律服务
					path: '/law',
					component: resolve => require(['../components/page/convenience/law.vue'], resolve),
					meta: {
						title: '法律服务'
					}
				},
				{ //二手闲置
					path: '/idle',
					component: resolve => require(['../components/page/convenience/idle.vue'], resolve),
					meta: {
						title: '二手闲置'
					}
				},
				{ //分类管理
					path: '/renting',
					component: resolve => require(['../components/page/convenience/renting.vue'], resolve),
					meta: {
						title: '房屋出租'
					}
				},
				{ //分类管理
					path: '/rentingConfig',
					component: resolve => require(['../components/page/convenience/rentingConfig.vue'], resolve),
					meta: {
						title: '房屋配置分类'
					}
				},
				{ //分类管理
					path: '/feedback',
					component: resolve => require(['../components/page/feedback/index.vue'], resolve),
					meta: {
						title: '反馈建议'
					}
				},
				{ //分类管理
					path: '/question',
					component: resolve => require(['../components/page/question/question.vue'], resolve),
					meta: {
						title: '问答列表'
					}
				},
//				{ //分类管理
//					path: '/JiaZheng',
//					component: resolve => require(['../components/page/jiazheng/JiaZheng.vue'], resolve),
//					meta: {
//						title: '家政中心'
//					}
//				},
				//              {
				//                  // 权限页面
				//                  path: '/permission',
				//                  component: resolve => require(['../components/page/Permission.vue'], resolve),
				//                  meta: { title: '权限测试', permission: true }
				//              },
				{ //商品订单
					path: '/Guide',
					component: resolve => require(['../components/page/guide/Guide.vue'], resolve),
					meta: {
						title: '分类指南'
					}
				},
				{
					path: '/403',
					component: resolve => require(['../components/page/403.vue'], resolve),
					meta: {
						title: '403'
					}
				},

				//              {//社区文化
				//                  path: '/buurt',
				//                  component: resolve => require(['../components/page/buurt/Buurt.vue'], resolve),
				//                  meta: { title: '社区文化' }
				//              },
			]
		},
		{
			path: '/login',
			component: resolve => require(['../components/page/Login.vue'], resolve)
		},
		{
			path: '*',
			redirect: '/404'
		},
		{
			path: '/404',
			component: resolve => require(['../components/page/404.vue'], resolve),
			meta: {
				title: '404'
			}
		},
		
//		{
//			path: '/802',
//			component: resolve => require(['../components/page/802.vue'], resolve),
//			meta: {
//				title: '802'
//			}
//		},
		{
			path: '/buurtLogin',
			component: resolve => require(['../components/page/buurtLogin.vue'], resolve)
		},
		
		//		{
//			path: '/buurtLogin',
//			component: resolve => require(['../components/page/buurt/Login.vue'], resolve),
//			meta: {
//				title: '社区登陆'
//			}
//		},
//		{
//			path: '/buurtlogin',
//			component: resolve => require(['../components/page/buurt/login.vue'], resolve),
//			meta: {
//				title: '社区登陆'
//			}
//		},
		{
			path: '/buurt',
			component: resolve => require(['../components/common/HomeBuurt.vue'], resolve),
			meta: {
				title: '社区文化'
			},
			children: [
				
				{ //社区文化
					path: '/buurt',
					component: resolve => require(['../components/page/buurt/Buurt.vue'], resolve),
					meta: {
						title: '社区文化'
					}
				},
				{ //回复
					path: '/buurtReply',
					component: resolve => require(['../components/page/buurt/Reply.vue'], resolve),
					meta: {
						title: '回复列表'
					}
				},
				{ //社区文化
					path: '/buurtNew',
					component: resolve => require(['../components/page/buurt/buurtNews.vue'], resolve),
					meta: {
						title: '社区文化'
					}
				},
				{
					path: '/8021',
					component: resolve => require(['../components/page/802.vue'], resolve),
					meta: {
						title: '802'
					}
				},
				{
					path: '/4141',
					component: resolve => require(['../components/page/403.vue'], resolve),
					meta: {
						title: '414'
					}
				},

			]
		},
	]
})