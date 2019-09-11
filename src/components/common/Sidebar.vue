<template>
	<div class="sidebar">
		<el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.index" :key="item.index">
						<template slot="title">
							<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
						</template>
						<template v-for="subItem in item.subs">
							<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
								<template slot="title">{{ subItem.title }}</template>
								<el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
									{{ threeItem.title }}
								</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="subItem.index" :key="subItem.index">
								{{ subItem.title }}
							</el-menu-item>
						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	import bus from '../common/bus';
	export default {
		data() {
			return {
				collapse: false,
				items: [
					//              	{
					//                      icon: 'el-icon-lx-home',
					//                      index: 'share',
					//                      title: '推广中心'
					//                  },
					{
						icon: 'el-icon-lx-home',
						index: 'dashboard',
						title: '系统首页'
					},
					{
						icon: 'el-icon-lx-profile',
						index: 'user',
						title: '用户中心',
						subs: [{
								index: 'User',
								title: '用户管理'
							},
							{
								index: 'Realname',
								title: '实名管理'
							},
							{
								index: 'role',
								title: '角色管理'
							},
							{
								index: 'Ability',
								title: '权限管理'
							},
						]
					},
					{
						icon: 'el-icon-lx-recharge',
						index: 'money',
						title: '钱包管理',
						subs: [{
								index: 'Change',
								title: '零钱记录'
							},
							{
								index: 'Integral',
								title: '积分记录'
							},
							{
								index: 'SettleIndex',
								title: '货款提现'
							},
							{
								index: 'ChangeList',
								title: '零钱提现'
							},
							{
								index: 'updateBatch',
								title: '钱包批量更新'
							},
							{
								index: 'BankCard',
								title: '银行卡管理'
							},
						]
					},
					{
						icon: 'el-icon-lx-friendadd',
						index: 'agent',
						title: '代理中心',
						subs: [{
								index: 'Agent',
								title: '代理中心'
							},
							//                          {
							//                              index: 'Agent_invite',
							//                              title: '推荐用户'
							//                          },
							//                          {
							//                              index: 'AgentShopIndex',
							//                              title: '推荐商家'
							//                          },
							//                          {
							//                              index: 'AgentAgentIndex',
							//                              title: '推荐代理'
							//                          },
						]
					},
					{
						icon: 'el-icon-lx-shop',
						index: 'Shop',
						title: '商家中心',
						subs: [{
								icon: 'el-icon-lx-copy',
								index: 'Shopadd',
								title: '添加商家',

							},
							{
								icon: 'el-icon-lx-copy',
								index: 'shop',
								title: '线下实体商家',
								subs: [{
										icon: 'el-icon-lx-copy',
										index: 'ShopCate',
										title: '自营产品分类',
									},
									{
										icon: 'el-icon-lx-copy',
										index: 'Shop',
										title: '线下实体商家',
									},
								]
							},

							{
								icon: 'el-icon-lx-copy',
								index: 'ShopOnline',
								title: '线上自营商家',

							},
							//							{
							//								icon: 'el-icon-lx-copy',
							//								index: 'ShopLeague',
							//								title: '平台自营商家',
							//
							//							},
							//	                        	{
							//			                        icon: 'el-icon-lx-copy',
							//			                        index: '',
							//			                        title: '线下商家',
							//			                        subs:[
							//			                        	{
							//			                                index: 'ShopCate',
							//			                                title: '商家分类'
							//			                            },
							//			                            {
							//			                                index: 'Shop',
							//			                                title: '商家列表'
							//			                            },
							//									]
							//			                    },
						]
					},
					{
						icon: 'el-icon-lx-goods',
						index: 'goods',
						title: '商品中心',
						subs: [{
								index: 'GoodsI',
								title: '分期产品',
								subs: [{
										index: 'exchangeArea',
										title: '分期区域管理',

									},
									{
										index: 'Goods',
										title: '分期产品',
									},
								]
							},
							{
								index: 'GoodsonlineI',
								title: '自营产品',
								subs: [{
										index: 'GoodsCate',
										title: '产品分类',
									},
									{
										index: 'Goodsonline',
										title: '自营产品',
									},
								]
							},

							{
								index: 'GoodsOffline',
								title: '实体产品',

							},
							{
								index: 'GoodsMarket',
								title: '兑换产品',

							},
							{
								index: 'CommentIndex',
								title: '商品评论'
							},

						]
					},
					{
						icon: 'el-icon-lx-recharge',
						index: 'order',
						title: '订单管理',
						subs: [{
								index: 'Order',
								title: '兑换产品订单'
							},
							{
								index: 'OrderOnline',
								title: '直营产品订单'
							},
							//                          {
							//                              index: 'OrderSeckill',
							//                              title: '拼购订单管理'
							//                          },
							//                      	{
							//                              index: 'OnsiteRecycle',
							//                              title: '上门订单'
							//                          },新闻
							//                          {
							//                              index: 'BagOrder',
							//                              title: '垃圾袋订单'
							//                          },
							//                          {
							//                              index: 'StationOrder',
							//                              title: '站点订单'
							//                          },

						]
					},
					{
						icon: 'el-icon-lx-group',
						index: 'convenience',
						title: '便民服务',
						subs: [{
								icon: 'el-icon-lx-settings',
								index: 'Repair',
								title: '维修服务',
								subs: [{
										index: 'CateStorerepair',
										title: '维修分类'
									},
									{
										index: 'Repair',
										title: '维修中心'
									},
								]
							},

							{
								icon: 'el-icon-lx-shop',
								index: 'JiaZheng',
								title: '家政服务',
								subs: [{
										index: 'CateStorejiazheng',
										title: '家政分类'
									},
									{
										index: 'JiaZheng',
										title: '家政中心'
									},

								]
							},
							{
								icon: 'el-icon-lx-shop',
								index: 'recruit',
								title: '招聘服务',
								subs: [{
										index: 'CateStorerecruit',
										title: '招聘分类'
									},
									{
										index: 'recruit',
										title: '招聘职位'
									},
									{
										index: 'recruitperson',
										title: '招聘人列表'
									},
									{
										index: 'recruitcompany',
										title: '招聘公司列表'
									},

								]
							},
							{
								icon: 'el-icon-lx-settings',
								index: 'renting',
								title: '维修服务',
								subs: [{
										index: 'rentingConfig',
										title: '房屋配置分类'
									},
									{
										index: 'renting',
										title: '房屋出租'
									},
								]
							},
							{
								index: 'Recycle',
								title: '回收中心'
							},
							{
								index: 'law',
								title: '法律服务'
							},
							{
								index: 'idle',
								title: '二手闲置'
							},
						]
					},
					{
						icon: 'el-icon-lx-group',
						index: 'buurtnews',
						title: '社区管理',
						subs: [{
								index: 'buurtm',
								title: '社区中心'
							},
							//							{
							//								index: 'buurtNewsCate',
							//								title: '社区文化分类'
							//							},
							{
								index: 'buurtService',
								title: '社区服务分类'
							},
							{
								index: 'buurtNews',
								title: '社区文化管理'
							},
						]
					},

					{
						icon: 'el-icon-lx-global',
						index: 'protection',
						title: '环保中心',
						subs: [
							//	                        {
							//		                        icon: 'el-icon-lx-delete',
							//		                        index: 'garbage',
							//		                        title: '垃圾管理',
							//		                        subs:[
							//		                        	{
							//		                                index: 'GarbageCate',
							//		                                title: '垃圾分类'
							//		                            },
							//		                            {
							//		                                index: 'GarbageArk',
							//		                                title: '垃圾柜'
							//		                            },
							{
								index: 'GarbageBox',
								title: '垃圾箱'
							},
							{
								icon: 'el-icon-lx-shop',
								index: 'Guide',
								title: '分类指南',
							},
							//		                        ]
							//		                    },
							//                      	{
							//		                        icon: 'el-icon-goods',
							//		                        index: 'ecoBag',
							//		                        title: '环保袋管理',
							//		                        subs:[
							//		                        	{
							//		                                index: 'EcoBagApply',
							//		                                title: '环保袋申请列表'
							//		                            },
							//		                            {
							//		                                index: 'EcoBagExchangeIndex',
							//		                                title: '环保袋兑换列表'
							//		                            },
							//		                        ]
							//		                    },

						]
					},
					{
						icon: 'el-icon-lx-location',
						index: 'Area',
						title: '区域管理'
					},
					{
						icon: 'el-icon-lx-pic',
						index: 'banner',
						title: 'banner管理'
					},

					{
						icon: 'el-icon-lx-copy',
						index: 'articlevideo',
						title: '文章视频',
						subs: [{
								icon: 'el-icon-lx-emoji',
								index: 'Help',
								title: '帮助中心'
							},
							{
								icon: 'el-icon-lx-copy',
								index: 'news',
								title: '新闻管理',
								subs: [{
										index: 'NewsCate',
										title: '新闻分类'
									},
									{
										index: 'News',
										title: '新闻中心'
									},
								]
							},

							{
								icon: 'el-icon-lx-record',
								index: 'video',
								title: '视频管理',
								subs: [{
										index: 'VideoCate',
										title: '视频分类'
									},
									{
										index: 'Videos',
										title: '视频中心'
									},
								]
							},
							//		                    {
							//		                        icon: 'el-icon-lx-copy',
							//		                        index: 'Vicinage',
							//		                        title: '邻里趣事',
							//		                        subs:[
							//		                        	{
							//		                                index: 'VicinageCate',
							//		                                title: '邻里趣事分类'
							//		                            },
							////		                            {
							////		                                index: 'Vicinage',
							////		                                title: '邻里趣事中心'
							////		                            },
							//								]
							//		                    },
						]
					},
					{
						icon: 'el-icon-lx-settings',
						index: 'feedback',
						title: '反馈建议',
					},
					{
						icon: 'el-icon-lx-settings',
						index: 'Setting',
						title: '系统设置',
						subs: [{
								index: 'Setting',
								title: '系统设置'
							},
							{
								index: 'Protocol',
								title: '协议设置'
							},
						]
					},
					{
						icon: 'el-icon-lx-settings',
						index: 'question',
						title: '问答列表',
					},
					//                  {
					//                      icon: 'el-icon-lx-copy',
					//                      index: 'tabs',
					//                      title: 'tab选项卡'
					//                  },
					//                  {
					//                      icon: 'el-icon-lx-calendar',
					//                      index: '3',
					//                      title: '表单相关',
					//                      subs: [
					//                          {
					//                              index: 'form',
					//                              title: '基本表单'
					//                          },
					//                          {
					//                              index: '3-2',
					//                              title: '三级菜单',
					//                              subs: [
					//                                  {
					//                                      index: 'editor',
					//                                      title: '富文本编辑器'
					//                                  },
					//                                  {
					//                                      index: 'markdown',
					//                                      title: 'markdown编辑器'
					//                                  },
					//                                  {
					//                                      index: 'ueditor',
					//                                      title: 'ueditor编辑器'
					//                                  },
					//                              ]
					//                          },
					//                          {
					//                              index: 'upload',
					//                              title: '文件上传'
					//                          }
					//                      ]
					//                  },
					//                  {
					//                      icon: 'el-icon-lx-emoji',
					//                      index: 'icon',
					//                      title: '自定义图标'
					//                  },
					//                  {
					//                      icon: 'el-icon-lx-favor',
					//                      index: 'charts',
					//                      title: 'schart图表'
					//                  },
					//                  {
					//                      icon: 'el-icon-rank',
					//                      index: 'drag',
					//                      title: '拖拽列表'
					//                  },
					//                  {
					//                      icon: 'el-icon-lx-warn',
					//                      index: '6',
					//                      title: '错误处理',
					//                      subs: [
					//                          {
					//                              index: 'permission',
					//                              title: '权限测试'
					//                          },
					//                          {
					//                              index: '404',
					//                              title: '404页面'
					//                          }
					//                      ]
					//                  }
				]
			}
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
		},
		created() {
			// 通过 Event Bus 进行组件间通信，来折叠侧边栏
			bus.$on('collapse', msg => {
				this.collapse = msg;
			})
		}
	}
</script>

<style scoped>
	.sidebar {
		display: block;
		position: absolute;
		left: 0;
		top: 70px;
		bottom: 0;
		overflow-y: scroll;
	}
	
	.sidebar::-webkit-scrollbar {
		width: 0;
	}
	
	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 250px;
	}
	
	.sidebar>ul {
		height: 100%;
	}
</style>