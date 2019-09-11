<template>
	<div class="">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-copy"></i> 推广中心</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-table :data="stat" style="width: 100%;margin-bottom: 50px;">
				<el-table-column prop="total_amount" label="总收益"></el-table-column>
				<el-table-column prop="user_count" label="直推用户数量"></el-table-column>
				<el-table-column prop="user_amount" label="直推用户收益"></el-table-column>
				<el-table-column prop="two_user_count" label="间推用户数量"></el-table-column>
				<el-table-column prop="two_user_amount" label="间推用户收益"></el-table-column>
				<el-table-column prop="shop_count" label="直推商家数量"></el-table-column>
				<el-table-column prop="shop_amount" label="直推商家总收益"></el-table-column>
				<el-table-column prop="two_shop_count" label="间推商家数量"></el-table-column>
				<el-table-column prop="two_shop_amount" label="间推商家收益"></el-table-column>
			</el-table>
			<el-tabs v-model="message" @tab-click="handleClick">
				<el-tab-pane :label="`推荐用户列表`" name="first">
					<el-table :data="userIndex"  style="width: 100%">
						<el-table-column prop="id" label="ID">
						</el-table-column>
						<el-table-column prop="user_info.id" label="用户ID">
							<template slot-scope="scope">
							    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_info.id}}">
							    	<div >{{ scope.row.user_info.id }}</div>
		                		</router-link>
							</template>
						</el-table-column>
						<el-table-column prop="user_info.nickname" label="用户昵称"></el-table-column>
						<el-table-column prop="user_info.avatar" label="用户头像">
							<template slot-scope="scope">
						      <img  :src="scope.row.user_info.avatar" alt="" style="width: 50px;">
						    </template>
						</el-table-column>
						<el-table-column prop="created_at" label="推广时间"></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination background @current-change="handleCurrentChange1" layout="prev, pager, next" :page-count='last_page1' :page-size="15">
						</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane :label="`推荐商家列表`"  name="second">
					<template v-if="message === 'second'">
						<el-table :data="shopIndex"  style="width: 100%">
							<el-table-column prop="id" label="ID">
							</el-table-column>
							<el-table-column prop="shop_info.id" label="店铺ID">
								<!--<template slot-scope="scope">
								    <router-link :to="{path:'/UserDetails',query: {id: scope.row.shop_info.id}}">
								    	<div >{{ scope.row.shop_info.id }}</div>
			                		</router-link>
								</template>-->
							</el-table-column>
							<el-table-column prop="shop_info.title" label="店铺昵称"></el-table-column>
							<el-table-column prop="shop_info.thumb" label="店铺缩略图">
								<template slot-scope="scope">
							      <img  :src="scope.row.shop_info.thumb" alt="" style="width: 50px;">
							    </template>
							</el-table-column>
							<el-table-column prop="created_at" label="推广时间"></el-table-column>
						</el-table>
						<div class="pagination">
							<el-pagination background @current-change="handleCurrentChange2" layout="prev, pager, next" :page-count='last_page2' :page-size="15">
							</el-pagination>
						</div>
					</template>
				</el-tab-pane>

			</el-tabs>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'share',
		data() {
			return {
				message: 'first',
				showHeader: false,
				stat: [],
				userIndex: [],
				shopIndex: [],
				last_page1:1,
				cur_page1:1,
				last_page2:1,
				cur_page2:1,
				url1:"",
				url2:''
			}
		},
		created() {
	          this.getParams()  
	        },
		methods: {
			handleCurrentChange1(val) {
            	
                this.cur_page1 = val;
                this.getuserIndex(val,this.url1);
            },
            handleCurrentChange2(val) {
                this.cur_page2 = val;
                this.getshopIndex(val,this.url2);
            },
            
			getData(url = '') {
				var that = this;
				this.$axios.get(that.ports.share.share +that.id).then(function(res) {
					that.stat = [res.data.result.stat];
					console.log(that.stat)
				})
			},
			getuserIndex(page=1,url = '') {
				var that = this;
				this.$axios.get(that.ports.share.userIndex +that.id+"&page="+page).then(function(res) {

					that.userIndex = res.data.result.list;
					that.last_page1 = Number(res.data.result.page.last_page);
		        	that.cur_page1 = Number(res.data.result.page.current_page);
				})
			},
			getshopIndex(page=1,url = '') {
				var that = this;
				this.$axios.get(that.ports.share.shopIndex + that.id+"&page="+page).then(function(res) {

					that.shopIndex = res.data.result.list;
					that.last_page2 = Number(res.data.result.page.last_page);
		        	that.cur_page2 = Number(res.data.result.page.current_page);
//		            that.loading = false
				})
			},
			getParams () {
		        if(!this.$route.query.id){
		        	return false
		        }
		        var routerParams = this.$route.query.id
		        // 将数据放在当前组件的数据内
		        this.id = routerParams
		        
		        this.getData();
	            this.getuserIndex();
	            this.getshopIndex();
		    },
		    handleClick(tab, event) {
		        if(this.message=='first'){
		        	this.getuserIndex()
		        }else if(this.message=='second'){
		        	this.getshopIndex()
		        }
		    }
		},
		watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
			'$route': ['getParams','getSele','getData']
	    }
	}
</script>

<style>
	.message-title {
		cursor: pointer;
	}
	
	.handle-row {
		margin-top: 30px;
	}
</style>