export default {
	Base:'https://wyhb.dev.zgwyhb.com',　
//	Base: 'https://wyhb.zgwyhb.com',
	Login:{
		mobileLogin:'api/auth/mobileLogin',
		mobile:'api/common/captcha/mobile',
		login:'api/auth/login'
	},
    Home:{
    	index:'/api/admin',//GET 首页信息
    	config:'/api/admin/config',//GET 公共配置
    },
    common:{
    	upload:'/api/common/upload/image',
    	video:'/api/common/upload/video',
    	imageBatch:'/api/common/upload/imageBatch',
    },
    Area:{
    	store:'/api/admin/area/store',//POST 区域添加
    	show:'/api/admin/area/show',//GET 区域详情
    	index:'/api/admin/area/index',//GET 区域列表
    	update:'/api/admin/area/update',//POST  区域更新
    	destroy:'/api/admin/area/destroy',//POST  区域删除
    },
    user:{
    	authShow:'/api/admin/user/authShow',
    	store:'/api/admin/user/store',//POST 用户添加
    	index:'/api/admin/user/index',//GET 用户列表
    	show:'/api/admin/user/show',//GET 用户详情
    	update:'/api/admin/user/update',//POST 用户更新
    	roleIndex:'/api/admin/user/roleIndex',//GET 用户角色列表
    	roleSync:'/api/admin/user/roleSync',//POST 用户角色添加
    	//roleUnassign:'/api/admin/user/roleUnassign',//POST 户角色删除
    },
    realname:{
    	index:'/api/admin/realname/index',//GET 实名列表
    	show:'/api/admin/realname/show',//GET 实名详情
    	update:'/api/admin/realname/update',//POST 实名更新
    	destroy:'/api/admin/realname/destroy',//POST 实名删除
    },
    wallet:{
    	update:'/api/admin/wallet/update',//POST 钱包更新
    	balanceIndex:'/api/admin/wallet/balanceIndex',//GET 零钱记录列表
    	integralIndex:'/api/admin/wallet/integralIndex',//GET 积分记录列表
    	settleWithdrawIndex:'/api/admin/wallet/settleWithdrawIndex',//GET 货款记录列表
    	settleWithdrawUpdate:'/api/admin/wallet/settleWithdrawUpdate',//GET 货款记录列表
    	balanceWithdrawIndex:'/api/admin/wallet/balanceWithdrawIndex',//GET 零钱提现列表
    	balanceWithdrawUpdate:'/api/admin/wallet/balanceWithdrawUpdate',//POST 零钱提现更新,
    	updateBatch:'/api/admin/wallet/updateBatch',//POST 钱包批量更新,
    },
    role:{
    	store:'/api/admin/role/store',//POST 角色添加
    	index:'/api/admin/role/index',//GET  角色列表
    	//show:'/api/admin/role/show',//GET 角色详情
    	update:'/api/admin/role/update',//POST 角色更新
    	destroy:'/api/admin/role/destroy',//POST 角色删除
    	abilityIndex:'/api/admin/role/permissionIndex',//GET 角色能力列表
//  	abilityAssign:'/api/admin/role/abilityAssign',//POST 角色能力分配
//  	abilityUnassign:'/api/admin/role/abilityUnassign',//POST 角色能力解除
		permissionSync:'/api/admin/role/permissionSync',
		userIndex:'/api/admin/role/userIndex',
    },
    ability:{
    	store:'/api/admin/permission/store',//POST  能力添加
    	index:'/api/admin/permission/index',//GET   能力列表
//  	show:'/api/admin/permission/show',//GET  能力详情
    	update:'/api/admin/permission/update',//POST  能力更新
    	destroy:'/api/admin/permission/destroy',//POST  能力删除
    },
    area:{
    	store:'/api/admin/area/store',//POST  地区添加
    	index:'/api/admin/area/index',//GET   地区列表
    	show:'/api/admin/area/show',//GET  地区详情
    	update:'/api/admin/area/update',//POST  地区更新
    	destroy:'/api/admin/area/destroy',//POST  地区删除
    },
    shop:{
    	store:'/api/admin/shop/store',//POST 商家更新
    	index:'/api/admin/shop/index',//GET 商家列表
    	show:'/api/admin/shop/show',//GET 商家实名详情
    	update:'/api/admin/shop/update',//POST 商家更新
    	destroy:'/api/admin/shop/destroy',//POST 商家删除
    	adStore:'/api/admin/shop/adStore',
    	adDestroy:'/api/admin/shop/adDestroy',
    	thirdpartyStore:'/api/admin/shop/thirdpartyStore',
    	thirdpartyUpdate:'/api/admin/shop/thirdpartyUpdate',
    	
    },
    help:{
    	store:'/api/admin/help/store',//POST  帮助添加
    	index:'/api/admin/help/index',//GET   帮助列表
    	show:'/api/admin/help/show',//GET  帮助详情
    	update:'/api/admin/help/update',//POST  帮助更新
    	destroy:'/api/admin/help/destroy',//POST  帮助删除
    },
    news:{
    	store:'/api/admin/news/store',//POST  新闻添加
    	index:'/api/admin/news/index',//GET   新闻列表
    	show:'/api/admin/news/show',//GET  新闻详情
    	update:'/api/admin/news/update',//POST  新闻更新
    	destroy:'/api/admin/news/destroy',//POST  新闻删除
    	replyIndex:'/api/admin/news/replyIndex',//GET 新闻回复列表
    	replyDestroy:'/api/admin/news/replyDestroy',//POST 新闻回复删除
    },
    garbageCate:{
    	store:'/api/admin/commonCate/garbage/store',//POST  垃圾分类添加
    	index:'/api/admin/commonCate/garbage/index',//GET   垃圾分类列表
//  	show:'/api/admin/commonCate/garbage/show',//GET  垃圾分类详情
    	update:'/api/admin/commonCate/garbage/update',//POST  垃圾分类更新
    	destroy:'/api/admin/commonCate/garbage/destroy',//POST  垃圾分类删除
    },
    garbageArk:{
    	store:'/api/admin/garbageArk/store',//POST  垃圾柜添加
    	index:'/api/admin/garbageArk/index',//GET   垃圾柜列表
    	show:'/api/admin/garbageArk/show',//GET  垃圾柜详情
    	update:'/api/admin/garbageArk/update',//POST  垃圾柜更新
    	destroy:'/api/admin/garbageArk/destroy',//POST  垃圾柜删除
    },
    garbageBox:{
    	store:'/api/admin/garbageBox/store',//POST  垃圾箱添加
    	index:'/api/admin/garbageBox/index',//GET   垃圾箱列表
    	show:'/api/admin/garbageBox/show',//GET  垃圾箱详情
    	update:'/api/admin/garbageBox/update',//POST  垃圾箱更新
    	destroy:'/api/admin/garbageBox/destroy',//POST  垃圾箱删除
    },
    vicinage:{
    	store:'/api/admin/vicinage/store',//POST  新闻添加
    	index:'/api/admin/vicinage/index',//GET   新闻列表
    	show:'/api/admin/vicinage/show',//GET  新闻详情
    	update:'/api/admin/vicinage/update',//POST  新闻更新
    	destroy:'/api/admin/vicinage/destroy',//POST  新闻删除
    	replyIndex:'/api/admin/vicinage/replyIndex',//GET 新闻回复列表
    	replyDestroy:'/api/admin/vicinage/replyDestroy',//POST 新闻回复删除
    },
    ecoBag:{
    	applyIndex:'/api/admin/ecoBag/applyIndex',//GET 环保袋申请列表
    	applyUpdate:'/api/admin/ecoBag/applyUpdate',//POST 环保袋申请更新
    	exchangeIndex:'/api/admin/ecoBag/exchangeIndex',//GET 环保袋兑换列表
    },
    setting:{
    	store:'/api/admin/setting/store',//POST  帮助添加
    	index:'/api/admin/setting/index',//GET   帮助列表
    	show:'/api/admin/setting/show',//GET  帮助详情
    	update:'/api/admin/setting/update',//POST  帮助更新
    	destroy:'/api/admin/setting/destroy',//POST  帮助删除
    	protocolIndex:'/api/admin/protocol/index',
    	protocolShow:'/api/admin/protocol/show?key=',
    	protocolUpdate:'/api/admin/protocol/update',
    },
    agent:{
    	store:'/api/admin/agent/store',//POST 代理添加
    	index:'/api/admin/agent/index',//GET  代理列表
//  	show:'/api/admin/agent/show',//GET 代理详情
    	update:'/api/admin/agent/update',//POST 代理更新
    	destroy:'/api/admin/agent/destroy',//POST 代理删除
    	userIndex:'/api/admin/agent/userIndex',//GET 推荐用户列表
    	shopIndex:'/api/admin/agent/shopIndex',//GET 推荐商家列表
    	agentIndex:'/api/admin/agent/agentIndex',//GET 推荐代理列表

    },
    onsiteRecycle:{
    	orderIndex:'/api/admin/onsiteRecycle/orderIndex',//GET 订单列表
    	orderShow:'/api/admin/onsiteRecycle/orderShow?order_id=',//GET   订单详情
    	allotL:'/api/admin/onsiteRecycle/allot',//POST 分配上门人员
    },
    garbage:{
    	bagOrderIndex:'/api/admin/garbage/bagOrderIndex',//GET 垃圾袋订单列表
    	bagOrderShow:'/api/admin/garbage/bagOrderShow?order_id=',//GET  垃圾袋订单详情
    	stationOrderIndex:'/api/admin/garbage/stationOrderIndex',//GET 站点订单列表
    	stationOrderShow:'/api/admin/garbage/stationOrderShow?order_id=',//GET  站点订单详情
    },
    shopCate:{
    	store:'/api/admin/commonCate/shop/store',//POST 分类添加
//  	show:'/api/admin/commonCate/shop/show',//GET 分类详情
    	index:'/api/admin/commonCate/shop/index',//GET 分类列表
    	update:'/api/admin/commonCate/shop/update',//POST  分类更新
    	destroy:'/api/admin/commonCate/shop/destroy',//POST  分类删除
    },
    vicinageCate:{
    	store:'/api/admin/vicinageCate/store',//POST 分类添加
    	show:'/api/admin/vicinageCate/show',//GET 分类详情
    	index:'/api/admin/vicinageCate/index',//GET 分类列表
    	update:'/api/admin/vicinageCate/update',//POST  分类更新
    	destroy:'/api/admin/vicinageCate/destroy',//POST  分类删除
    },
    newsCate:{
    	store:'/api/admin/commonCate/news/store',//POST 分类添加
//  	show:'/api/admin/commonCate/new/show',//GET 分类详情
    	index:'/api/admin/commonCate/news/index',//GET 分类列表
    	update:'/api/admin/commonCate/news/update',//POST  分类更新
    	destroy:'/api/admin/commonCate/news/destroy',//POST  分类删除
    },
    banner:{
    	store:'/api/admin/banner/store',//POST 分类添加
    	show:'/api/admin/banner/show',//GET 分类详情
    	index:'/api/admin/banner/index',//GET 分类列表
    	update:'/api/admin/banner/update',//POST  分类更新
    	destroy:'/api/admin/banner/destroy',//POST  分类删除
    },
    videoCate:{
    	store:'/api/admin/commonCate/video/store',//POST 分类添加
//  	show:'/api/admin/commonCate/video/show',//GET 分类详情
    	index:'/api/admin/commonCate/video/index',//GET 分类列表
    	update:'/api/admin/commonCate/video/update',//POST  分类更新
    	destroy:'/api/admin/commonCate/video/destroy',//POST  分类删除
    },
    video:{
    	store:'/api/admin/video/store',//POST  新闻添加
    	index:'/api/admin/video/index',//GET   新闻列表
    	show:'/api/admin/video/show',//GET  新闻详情
    	update:'/api/admin/video/update',//POST  新闻更新
    	destroy:'/api/admin/video/destroy',//POST  新闻删除
    	replyIndex:'/api/admin/video/replyIndex',//GET 新闻回复列表
    	replyDestroy:'/api/admin/video/replyDestroy',//POST 新闻回复删除
    },
    goodsSpec:{
    	store:'/api/admin/goodsSpec/store',//POST 规格添加
    	update:'/api/admin/goodsSpec/update',//POST  规格更新
    	destroy:'/api/admin/goodsSpec/destroy',//POST  规格删除
    	valueStore:'/api/admin/goodsSpec/valueStore',//POST 规格值添加
    	valueUpdate:'/api/admin/goodsSpec/valueUpdate',//POST  规格值更新
    	valueDestroy:'/api/admin/goodsSpec/valueDestroy',//POST  规格值删除
    	groupIndex:'/api/admin/goodsSpec/groupIndex',//GET 规格组合列表
    	combineIndex:'/api/admin/goodsSpec/combineIndex',//POST 规格分组列表
    },
    goods:{
    	specFormat:'/api/admin/goods/specFormat',
    	store:'/api/admin/goods/store',//POST 分类添加
    	show:'/api/admin/goods/show',//GET 分类详情
    	index:'/api/admin/goods/index',//GET 分类列表
    	update:'/api/admin/goods/update',//POST  分类更新
    	destroy:'/api/admin/goods/destroy',//POST  分类删除
//  	skuStore:'/api/admin/goods/skuStore',//POST  商品sku添加
//  	skuUpdate:'/api/admin/goods/skuUpdate',//POST  商品sku更新
//  	skuDestroy:'/api/admin/goods/skuDestroy',//POST  商品sku删除
    	commentIndex:'/api/admin/goods/commentIndex',//GET 商品评论列表
    	commentAudit:'/api/admin/goods/commentAudit',//POST 商品评论审核
    },
    goodsc:{
    	store:'/api/admin/commonCate/goods/store',//POST 分类添加
    	index:'/api/admin/commonCate/goods/index',//GET 分类列表
    	update:'/api/admin/commonCate/goods/update',//POST  分类更新
    	destroy:'/api/admin/commonCate/goods/destroy',//POST  分类删除
    },
    order:{
    	index:'/api/admin/order/index',//GET 订单列表
    	show:'/api/admin/order/show',//GET 订单详情
    	deliver:'/api/admin/order/deliver',//POST 订单发货
    	expressStore:'/api/admin/order/expressStore',//POST   物流添加
    	expressDestroy:'/api/admin/order/expressDestroy',//POST 物流删除
    },
    bankCard:{
    	index:'/api/admin/bankCard/index',//GET 银行卡列表
    	destroy:'/api/admin/bankCard/destroy',//POST 银行卡删除
    },
    repair:{
    	cateStore:'/api/admin/commonCate/repair/store',//POST 分类添加
    	cateIndex:'/api/admin/commonCate/repair/index',//GET 分类列表
    	cateUpdate:'/api/admin/commonCate/repair/update',//GET 分类更新
    	cateDestroy:'/api/admin/commonCate/repair/destroy',//POST  分类删除
    	index:'/api/admin/repair/index',//GET   维修列表
    	show:'/api/admin/repair/show',//GET  维修详情
    	update:'/api/admin/repair/update',//POST  维修更新
    	destroy:'/api/admin/repair/destroy',//POST  维修删除
    },
    jiazheng:{
    	cateStore:'/api/admin/commonCate/jiazheng/store',//POST 分类添加
    	cateIndex:'/api/admin/commonCate/jiazheng/index',//GET 分类列表
    	cateUpdate:'/api/admin/commonCate/jiazheng/update',//GET 分类更新
    	cateDestroy:'/api/admin/commonCate/jiazheng/destroy',//POST  分类删除
    	index:'/api/admin/jiazheng/index',//GET   家政列表
    	show:'/api/admin/jiazheng/show',//GET  家政详情
    	update:'/api/admin/jiazheng/update',//POST  家政更新
    	destroy:'/api/admin/jiazheng/destroy',//POST  家政删除
    },
    guide:{
    	store:'/api/admin/commonCate/guide/store',//POST 分类添加
    	index:'/api/admin/commonCate/guide/index',//GET 分类列表
    	update:'/api/admin/commonCate/guide/update',//POST  分类更新
    	destroy:'/api/admin/commonCate/guide/destroy',//POST  分类删除
    },
    share:{
    	share:'/api/admin/share?user_id=',//GET 推广信息
    	userIndex:'/api/admin/share/userIndex?user_id=',//GET 推荐用户列表
    	shopIndex:'/api/admin/share/shopIndex?user_id=',//GET 推荐商家列表	
    },
    recycle:{
    	index:'/api/admin/recycle/index',//GET 回收人员列表
    	show:'/api/admin/recycle/show?id=',//回收人员详情
    	update:'/api/admin/recycle/update',//POST 回收人员更新
    	destroy:'/api/admin/recycle/destroy',//POST 回收人员更新
    },
    buurtNewsCate:{
    	store:'/api/admin/commonCate/buurtNews/store',//POST 分类添加
//  	show:'/api/admin/commonCate/new/show',//GET 分类详情
    	index:'/api/admin/commonCate/buurtNews/index',//GET 分类列表
    	update:'/api/admin/commonCate/buurtNews/update',//POST  分类更新
    	destroy:'/api/admin/commonCate/buurtNews/destroy',//POST  分类删除
    },
    buurtNews:{
    	store:'/api/admin/buurtNews/store',//POST  新闻添加
    	index:'/api/admin/buurtNews/index',//GET   新闻列表
    	show:'/api/admin/buurtNews/show',//GET  新闻详情
    	update:'/api/admin/buurtNews/update',//POST  新闻更新
    	destroy:'/api/admin/buurtNews/destroy',//POST  新闻删除
    	replyIndex:'/api/admin/buurtNews/replyIndex',//GET 新闻回复列表
    	replyDestroy:'/api/admin/buurtNews/replyDestroy',//POST 新闻回复删除
    },
    buurt:{
    	store:'/api/admin/buurt/store',//POST 角色添加
    	index:'/api/admin/buurt/index',//GET  角色列表
    	update:'/api/admin/buurt/update',//POST 角色更新
    	destroy:'/api/admin/buurt/destroy',//POST 角色删除
    },
    buurtI:{
    	index:'/api/buurt',//GET 首页信息
    	buurt:'/api/buurt/buurt',//GET 社区信息
    	config:'/api/buurt/config',//GET 公共配置
    },
    buurtN:{
    	store:'/api/buurt/news/store',//POST  新闻添加
    	index:'/api/buurt/news/index',//GET   新闻列表
    	show:'/api/buurt/news/show',//GET  新闻详情
    	update:'/api/buurt/news/update',//POST  新闻更新
    	destroy:'/api/buurt/news/destroy',//POST  新闻删除
    	replyIndex:'/api/buurt/news/replyIndex',//GET 新闻回复列表
    	replyDestroy:'/api/buurt/news/replyDestroy',//POST 新闻回复删除
    },
    recruitPost:{
    	cateStore:'/api/admin/commonCate/recruitPost/store',//POST 分类添加
    	cateIndex:'/api/admin/commonCate/recruitPost/index',//GET 分类列表
    	cateUpdate:'/api/admin/commonCate/recruitPost/update',//GET 分类更新
    	cateDestroy:'/api/admin/commonCate/recruitPost/destroy',//POST  分类删除
//  	index:'/api/admin/recruitPost/index',//GET   维修列表
//  	show:'/api/admin/recruitPost/show',//GET  维修详情
//  	update:'/api/admin/recruitPost/update',//POST  维修更新
//  	destroy:'/api/admin/recruitPost/destroy',//POST  维修删除
    },
    recruit:{
    	conf:'/api/admin/recruit/conf',//GET 配置信息
		postIndex:'/api/admin/recruit/postIndex',//GET 招聘职位列表
		postShow:'/api/admin/recruit/postShow?id=',//GET 招聘职位详情
		postUpdate:'/api/admin/recruit/postUpdate',//  招聘职位更新
		postDestroy:'/api/admin/recruit/postDestroy',// 招聘职位删除
		personIndex:'/api/admin/recruit/personIndex',// 招聘人列表
		personUpdate:'/api/admin/recruit/personUpdate',// 招聘人更新
		personDestroy:'/api/admin/recruit/personDestroy',// 招聘人删除
		companyIndex:'/api/admin/recruit/companyIndex',// 招聘人公司列表
		companyUpdate:'/api/admin/recruit/companyUpdate',// 招聘人公司更新
    	companyUpdate:'/api/admin/recruit/companyUpdate',// 招聘人删除
    },
    exchangeArea:{
    	store:'/api/admin/exchangeArea/store',//POST 区域添加
		index:'/api/admin/exchangeArea/index',//GET 区域列表
		destroy:'/api/admin/exchangeArea/destroy',//  区域删除
    },
    law:{
    	conf:'/api/admin/law/conf',//GET  配置信息
    	index:'/api/admin/law/index',//GET  列表
    	show:'/api/admin/law/show?id=',//GET  列表
    	update:'/api/admin/law/update',//POST 更新
		destroy:'/api/admin/law/destroy',//  删除
    },
    idle:{
    	conf:'/api/admin/idle/conf',//GET  配置信息
    	index:'/api/admin/idle/index',//GET  列表
    	show:'/api/admin/idle/show?id=',//GET  列表
    	update:'/api/admin/idle/update',//POST 更新
		destroy:'/api/admin/idle/destroy',//  删除
    },
    rentingConfig:{
    	store:'/api/admin/commonCate/rentingConfig/store',//POST 分类添加
    	index:'/api/admin/commonCate/rentingConfig/index',//GET 分类列表
    	update:'/api/admin/commonCate/rentingConfig/update',//GET 分类更新
    	destroy:'/api/admin/commonCate/rentingConfig/destroy',//POST  分类删除
    },
    renting:{
    	conf:'/api/admin/renting/conf',//GET  配置信息
    	index:'/api/admin/renting/index',//GET  列表
    	show:'/api/admin/renting/show?id=',//GET  列表
    	update:'/api/admin/renting/update',//POST 更新
		destroy:'/api/admin/renting/destroy',//  删除
    },
    buurtService:{
    	store:'/api/admin/commonCate/buurtService/store',//POST 分类添加
    	index:'/api/admin/commonCate/buurtService/index',//GET 分类列表
    	update:'/api/admin/commonCate/buurtService/update',//GET 分类更新
    	destroy:'/api/admin/commonCate/buurtService/destroy',//POST  分类删除	
    },
    huifu:{
	    provIndex:  '/api/common/huifu/provIndex',//获取省列表
	    cityIndex:  '/api/common/huifu/cityIndex',//获取市列表
	    countyIndex:  '/api/common/huifu/countyIndex',//获取区列表
	    headBankIndex:  '/api/common/huifu/headBankIndex',//获取总行列表
	    branchBankIndex:  '/api/common/huifu/branchBankIndex',//获取支行行列表
	},
	feedback:{
		index:  '/api/admin/feedback/index',//反馈列表
		destroy:  '/api/admin/feedback/destroy',//反馈删除
	},
	huifu:{
	    provIndex: '/api/common/huifu/provIndex',//获取省列表
	    cityIndex: '/api/common/huifu/cityIndex',//获取市列表
	    countyIndex: '/api/common/huifu/countyIndex',//获取区列表
	    headBankIndex: '/api/common/huifu/headBankIndex',//获取总行列表
	    branchBankIndex: '/api/common/huifu/branchBankIndex',//获取支行行列表
	},
	feedback:{
		index:  '/api/admin/feedback/index',//反馈列表
		destroy:  '/api/admin/feedback/destroy',//反馈删除
	},
	question:{
	    store:'/api/admin/question/store',//POST 分类添加
    	index:'/api/admin/question/index',//GET 分类列表
    	update:'/api/admin/question/update',//GET 分类更新
    	destroy:'/api/admin/question/destroy',//POST  分类删除	
	},
}
