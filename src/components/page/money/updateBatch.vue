<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-friend"></i> 钱包批量更新</el-breadcrumb-item>
				<!--<el-breadcrumb-item>用户详情</el-breadcrumb-item>-->
			</el-breadcrumb>
		</div>
		<div  class="container">
			<el-form  ref="form" :model="form" label-width="80px"class='from'>
				<el-form-item label="类型">
					<el-select v-model="form.field" placeholder="请选择">
						<el-option v-for="item in wallet_field" :key="item.key" :value="item.key" :label="item.name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="值">
					<el-input v-model="form.field_value" class='width500'></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="form.intro"  class='width500'></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-date-picker v-model="time1" type="datetimerange" format='yyyy-MM-dd HH:mm:ss' value-format='yyyy-MM-dd HH:mm:ss' range-separator="至" start-placeholder="注册开始时间" end-placeholder="注册结束时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">提交</el-button>
					<el-button @click='clear_cat'>取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'updateBatch',
		data() {
			return {
				form: {
					field: '',
					field_value: '',
					intro: '',
					stime: '',
					etime: ''
				},
				time1: '',
				wallet_field: []
			}
		},
		created() {
			this.getSele()
		},
		methods: {
			getSele() {
				this.wallet_field = JSON.parse(localStorage.getItem('config')).wallet_field;
			},
			clear_cat() {
				this.form = {
						field: '',
						field_value: '',
						intro: '',
						stime: '',
						etime: ''
					},
					this.time1 = ''
			},
			onSubmit() {
				console.log(this.time1)
				if(this.time1.length > 1) {
					this.form.stime = this.time1[0]
					this.form.etime = this.time1[1]
				}
			}
		}
	}
</script>

<style>

</style>