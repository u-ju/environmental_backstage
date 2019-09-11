<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-group"></i> 社区管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="linelight600" v-if="nulln">四川森林啄木鸟环保社区管理</div>
			
		</div>


	</div>
</template>

<script>
	import store from '@/store/store'
	export default {
		name: 'Role',
		data() {
			return {
				tableData: [],
				uploadurl:'',
				nulln:false,
				loading:true
			}
		},
		created() {
			store.commit('set_login', 'buurt');
			this.getData();
			this.uploadurl = this.ports.Base + this.ports.common.imageBatch
			
		},
		computed: {
			

		},
		methods: {
			
			// 获取 easy-mock 的模拟数据
			getData(page = 1) {
				var that = this;
				this.$axios.get(that.ports.buurtI.index ).then(function(res) {
					
					that.tableData = res.data.result
					that.nulln=true
					that.loading=false
				})
			},
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}
	
	.handle-select {
		width: 120px;
	}
	.container{
		min-height: 600px;
	}
	.linelight600{
		line-height: 600px;
		text-align: center;
	}
</style>