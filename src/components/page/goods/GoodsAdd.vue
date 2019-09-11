<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form ref="form" label-width="100px">
				<div class="overhidden">
					<el-form-item label="店铺id">
						<el-input v-model="form.shop_id" class='spu_name'></el-input>
					</el-form-item>
					<el-form-item label="商品名称">
						<el-input v-model="form.spu_name" class='spu_name'></el-input>
					</el-form-item>
					<el-form-item label="商品分类"  >
					 	
	                    <el-cascader 
	                    	clearable
	                    	placeholder="商品分类"
	                    	 change-on-select
	                    	id="cascader"
						  :options="sele"
			      		  :props="props"
			      		   v-model="cate_id"
			      		   
						></el-cascader>
	                </el-form-item>
				</div>
				<div class="overhidden">
					<el-form-item label="商品介绍">
						<el-upload class=" avatar-uploader avatar-uploader1" :action="uploadurl" :show-file-list="false" :http-request="upLoadintro">
							<i v-if="!form.spu_intro" class="el-icon-plus avatar-uploader-icon"></i>
							<img v-else :src="form.spu_intro" class="avatar">
						</el-upload>
					</el-form-item>
				</div>
				<div class="overhidden noflot">
					<el-form-item label="商品规格">
						<el-input v-model="form.spec_str" type="textarea" autosize @blur='textareablur' placeholder="请输入内容 
如颜色：黑色，白色，红色;版本：A，B"></el-input>
						<!--<el-checkbox-group v-model="allselechoose" >
	                 	<el-checkbox v-for="item in allsele" :label="item.spec_id" :key="item.spec_id"  @change="checkedallsele(item.spec_id)">{{item.spec_name}}</el-checkbox>
	            	</el-checkbox-group>-->

					</el-form-item>
				</div>
				<div class="overhidden">
					<el-form-item label="规格值" v-if="spec_arr.length>0">
						<div v-for="(item,index) in spec_arr" :key="index">
							<span>{{item.spec_name}}</span>
							<el-checkbox disabled v-for="spec in item.spec_values" :label="spec.spec_value_id" :checked="true" :key="spec.spec_value_id" @change="handleChecked(spec.spec_value_id,index)">{{spec.spec_value}}</el-checkbox>
						</div>
					</el-form-item>
				</div>
				<!--<div class="overhidden noflot">
	        	<el-form-item label="规格值对照表" v-if="list.length>0">
			        <el-row  class='boder'>
					  <el-col :span="3"><div class="grid-content bg-purple">规格值key</div></el-col>
					  <el-col :span='21'>
					  	<el-row>
					  		<el-col :span="3"  v-for="(item,index) in list" :key="index"><div class="grid-content bg-purple">{{item.key}}</div></el-col>
					  	</el-row>
					  </el-col>
					</el-row>
					<el-row class='boder'  >
					  <el-col :span="3"><div class="grid-content bg-purple">规格名</div></el-col>
						<el-col :span='21'>
						  	<el-row>
						  		<el-col :span="3"  v-for="(item,index) in list" :key="index"><div class="grid-content bg-purple">{{item.name}}</div></el-col>
						  	</el-row>
						</el-col>
					</el-row>
				</el-form-item>
	        </div>-->
				<!--<el-row>-->
				<template v-for="(item,i) in wl">
					<!--<el-col  class='itemadd'>-->
					<div class='itemadd'>
						<!--<el-button type="danger" icon="el-icon-delete" class='delete' @click='delete(i)'  circle ></el-button>-->
						<el-button type="danger" icon="el-icon-delete" class='delete' circle @click="deleter(i)"></el-button>
						<el-form-item label="规格值key">
							<!--<el-input v-model="form.key[i]" ></el-input>-->
							<el-select v-model="form.key[i]" clearable placeholder="请选择">
								<el-option v-for="item in list" :key="item.key" :label="item.name" :value="item.key">
								</el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="采购价">
							<el-input v-model="form.purchase_price[i]"></el-input>
						</el-form-item>
						<el-form-item label="市场价">
							<el-input v-model="form.market_price[i]"></el-input>
						</el-form-item>
						<el-form-item label="售价">
							<el-input v-model="form.price[i]"></el-input>
						</el-form-item>
						<!--<el-form-item label="分期价">
	                <el-input v-model="form.nper_price[i]" ></el-input>
	            </el-form-item>-->
						<el-form-item label="安装费">
							<el-input v-model="form.install_fee[i]"></el-input>
						</el-form-item>
						<el-form-item label="抵扣积分">
							<el-input v-model="form.integral_discount[i]"></el-input>
						</el-form-item>
						<!--<el-form-item label="重量（kg）">
							<el-input v-model="form.weight[i]"></el-input>
						</el-form-item>-->

						<el-form-item label="库存">
							<el-input v-model="form.stock[i]"></el-input>
						</el-form-item>
						<div class="clear"></div>
						<el-form-item label="规格参数">
							<el-input type="textarea" autosize v-model="form.spec_params[i]" class='textarea'></el-input>
						</el-form-item>
						<div class="clear"></div>
						<!--<el-form-item label="缩略图">
							<div @click="dqian(i)">
								<el-upload list-type="picture-card" class="avatar-uploader" :before-upload="beforeAvatarUpload" :action="uploadurl" :show-file-list="false" :http-request="upLoad" :limit="1">
									<i v-if="!form.thumb[i]" class="el-icon-plus avatar-uploader-icon" :class='"item"+form.thumb.length'></i>
									<img v-else :src="form.thumb[i]" class="avatar">
								</el-upload>
							</div>
						</el-form-item>-->

						<el-form-item label="轮播图">
							<div @click="dqian(i)">
								<el-upload list-type="picture-card" :file-list="ruleForm[i]"  :action="uploadurl" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :http-request="upLoad1" :on-remove="handleRemove" :multiple='multiple' :limit="9">
									<i class="el-icon-plus"></i>
								</el-upload>
							</div>
						</el-form-item>
					</div>
				</template>

				<!--</el-row>-->
				<div class="center-align tjwl" @click="tjwl">
					<i class="el-icon-circle-plus-outline"></i>添加商品
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!--<el-button @click="editVisible = false">取 消</el-button>-->
				<el-button type="primary" @click="saveEdit" :disabled='disabledd' size="medium" class='saveEdit'>确 定</el-button>
			</div>
			<el-dialog :visible.sync="dialogVisible" v-for="(src,index) in images" :key="index">
				<img width="100%" :src="src" alt="">
			</el-dialog>
		</div>
		<!-- 删除提示框 -->
		<el-dialog title="提示" :visible.sync="delVisible" width="300px">
			<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
			<span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
		</el-dialog>
	</div>
</template>

<script>
	import store from '@/store/store'
	export default {
		name: 'Agent',
		data() {
			return {
				checked: true,
				spec_arr: [],
				loading: false,
				dialogImageUrl: '',
				dialogVisible: false,
				delVisible: false,
				otherdata: {
					source: "file"
				},
				uploadurl: '',
				multiple: true,
				images: [],
				form: {
					shop_id:'',
					spu_name: '',
					spu_intro: '',
					spec_str: '',
					key: [],
//					thumb: [],
					purchase_price: [],
					market_price: [],
					price: [],
					//      			nper_price:[],
//					weight: [],
					spec_params: [],
					stock: [],
					install_fee: [],
					integral_discount:[]
				},
				list: [],
				Sele: [],
				allsele: [],
				allselechoose: [],
				headers: {
					"channel": "web",
					"build": 0,
					"token": store.state.token
				},
				data: {
					'source': 'file'
				},
				ruleForm: [
					[]
				],
				wl: 1,
				dqsz: 0,
				disabledd: false,
				deletenum: '',
				formData: {},
				props: {
				  value: 'id',
		          label:'name',
		          children: 'children'
		        },
		        cate_id:[],
		        sele:[],
			}
		},
		created() {

			this.uploadurl = this.ports.Base + this.ports.common.imageBatch
			//          this.getSele();
//			this.sele = JSON.parse(localStorage.getItem('config')).goods_cate;
			this.getconfigall()
		},
		computed: {

		},
		methods: {
			getconfigall(){
		    	var that =this;
		    	this.$axios.get(that.ports.Home.config).then(function(res) {
		    		that.sele = res.data.result.goods_cate;
				})
      		},
			deleter(i) {
				console.log(i);
				console.log(this.wl);
				this.delVisible = true
				this.deletenum = i
			},
			
			deleteRow() {
				//      		this.form={
				//      			key:this.form.key.splice(this.deletenum,1),
				//      			thumb:this.form.thumb.splice(this.deletenum,1),
				//      			purchase_price:this.form.purchase_price.splice(this.deletenum,1),
				//      			market_price:this.form.market_price.splice(this.deletenum,1),
				//      			price:this.form.price.splice(this.deletenum,1),
				//      			nper_price:this.form.nper_price.splice(this.deletenum,1),
				//      			weight:this.form.weight.splice(this.deletenum,1),
				//      			spec_params:this.form.spec_params.splice(this.deletenum,1),
				//      			stock:this.form.stock.splice(this.deletenum,1),
				//      		}
				this.form.key.splice(this.deletenum, 1)
//				this.form.thumb.splice(this.deletenum, 1)
				this.form.purchase_price.splice(this.deletenum, 1)
				this.form.market_price.splice(this.deletenum, 1)
				this.form.price.splice(this.deletenum, 1)
				//				this.form.nper_price.splice(this.deletenum,1)
//				this.form.weight.splice(this.deletenum, 1)
				this.form.spec_params.splice(this.deletenum, 1)
				this.form.install_fee.splice(this.deletenum, 1)
				this.form.integral_discount.splice(this.deletenum, 1)
				
				this.form.stock.splice(this.deletenum, 1)
				this.ruleForm.splice(this.deletenum, 1)
				this.delVisible = false
				this.wl = this.wl - 1
				console.log(this.wl)
				console.log(this.ruleForm)
			},
			handlePictureCardPreview(file) {
				//		      	console.log(1111)
				console.log(file)
				//		        this.dialogImageUrl = file.url;
				//		        this.dialogVisible = true;
			},
			checkedallsele(e) {
				var data = {},
					pjurl = ''
				for(var i in this.allselechoose) {
					pjurl = pjurl + '&spec_id[' + i + ']=' + this.allselechoose[i]
				}
				if(this.allselechoose.length > 0) {
					this.getSele1(pjurl)
				} else {
					this.Sele = []
				}
			},
			//      	getSele1(pjurl){
			//          	var that =this;
			////          	data=this.qs.stringify(data)
			//				this.$axios.get(that.ports.goodsSpec.groupIndex+"?page=1"+pjurl).then(function(res) {
			//		        	var Sele = res.data.result.list;
			//		        	for(var i in Sele){
			//		        		Sele[i]["checkAll"]=false
			//		        		Sele[i]["choose"]=[]
			//		        		Sele[i]["all"]=[]
			//		        		Sele[i]["isIndeterminate"]=true
			//		        		
			//		        		for(var a in Sele[i]["spec_values"]){
			//		        			Sele[i]["spec_values"][a]["checked"]=false
			//		        			Sele[i]["all"].push(Sele[i]["spec_values"][a].spec_value_id)
			//		        		}
			//		        	}
			//		        	console.log(Sele)
			//		        	that.Sele = Sele
			//		       })
			//          },
			dqian(e) {
				this.dqsz = e
			},
			tjwl() {
				this.ruleForm[this.wl] = []
				this.wl = this.wl + 1

			},

			handlePictureCardPreview() {

			},
			textareablur() {
				var that = this
//				console.log(that.form.spec_str)
				//      		var data = {spec_str:}
				//      		data=that.qs.stringify(data)
				that.$axios.get(this.ports.goods.specFormat + "?spec_str=" + encodeURIComponent(that.form.spec_str))
					.then(function(res) {
						if(res.data.status == 200) {
							var spec_arr = res.data.result.spec_arr;
							for(var i in spec_arr) {
								for(var j in spec_arr[i]['spec_values']) {
									spec_arr[i]['spec_values'][j]['choose'] = true
								}
							}
							//						颜色：黑色，白色，红色
							//版本：A，B
							console.log(spec_arr)
							that.list = res.data.result.spec_group_arr
							that.spec_arr = spec_arr
						} else {
							that.$message.warning(res.data.message);
						}

					})
					.catch(function(error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
			},
			upLoad(file) {
				console.log(file)
				const formData = new FormData()
				var that = this;
				formData.append('file', file.file)
				formData.append('image', file.file)
				formData.append('source', 'file')
				this.$axios.post(this.ports.common.upload, formData).then(res => res.data)
					.then(data => {
						if(data.status == 200) {
							that.form.thumb[that.dqsz] = data.result.image_url
							console.log(that.form.thumb)
						} else {
							that.$message.warning(res.data.message);
						}
					})
					.catch(function(error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
			},
			upLoad1(file) {
				const formData = new FormData()
				var that = this;
				var uid = file.file.uid
				formData.append('file', file.file)
				formData.append('image', file.file)
				formData.append('source', 'file')
				this.$axios.post(this.ports.common.upload, formData).then(res => res.data)
					.then(data => {
						if(data.status == 200) {
							that.uploadSuccess(data.result, uid)
						} else {
							that.$message.warning(res.data.message);
						}
					})
					.catch(function(error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
			},
			upLoadintro(file) {
				const formData = new FormData()
				var that = this;
				formData.append('file', file.file)
				formData.append('image', file.file)
				formData.append('source', 'file')
				this.$axios.post(this.ports.common.upload, formData).then(res => res.data)
					.then(data => {

						if(data.status == 200) {
							that.form.spu_intro = data.result.image_url
						} else {
							that.$message.warning(res.data.message);
						}
					})
					.catch(function(error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
			},
			//      	上传限制格式与大小（png,jpg,gif,jpeg），与2M，这边代码没有优化，自行解决
			beforeAvatarUpload(file) {
				console.log(file)
				var formData = {
					'file': file,
					'image': file,
					'source': 'file'
				}
				//				formData.append('file', file)
				//				formData.append('image', file)
				//				formData.append('source', 'file')
				console.log(formData)
				this.formData = formData
				console.log(this.formData)
				const extension = file.name.substring(
					file.name.lastIndexOf('.') + 1,
					file.name.length
				) === 'png'
				const extension1 = file.name.substring(
					file.name.lastIndexOf('.') + 1,
					file.name.length
				) === 'jpg'
				const extension2 =
					file.name.substring(
						file.name.lastIndexOf('.') + 1,
						file.name.length
					) === 'gif'
				const extension3 = file.name.substring(
					file.name.lastIndexOf('.') + 1,
					file.name.length
				) === 'jpeg'
				if(!extension && !extension1 && !extension2 && !extension3) {
					this.$message.error('文件格式有误!')
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!')
					return false
				}
				return extension || extension1 || extension2 || extension3 || isLt2M
			},
			handleAvatarSuccess(res, file) {
				console.log(res, file)
			},
			// 超过文件限制提示
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
			},
			// 成功后
			uploadSuccess(response, uid) {

				this.ruleForm[this.dqsz].push({
					name: 'img',
					url: response.image_url,
					uid: uid
				})
				//			        this.$message.success('上传成功！')
			},
			handleRemove(file, fileList) {
				for(var i in this.ruleForm) {
					for(var j in this.ruleForm[i]) {
						if(this.ruleForm[i][j].uid == file.uid) {
							this.ruleForm[i].splice(j, 1);
						}
					}
				}

			},
			//      	getSele(){
			//          	var that =this;
			//				this.$axios.get(that.ports.goodsSpec.groupIndex).then(function(res) {
			//					that.allsele=res.data.result.list
			//		        	that.loading = false
			//		       })
			//          },
			//          handleCheckAllChange(val,e){
			//          	var data={},jishu=0,jishu1=0
			//          	this.Sele[e]["choose"] = val ? this.Sele[e].all : [];
			//          	this.Sele[e].isIndeterminate = !this.Sele[e].isIndeterminate;
			//          	for(var a in this.Sele){
			//          		if(this.Sele[a]["choose"].length>0){
			//          			data['spec_id['+jishu+']']=this.Sele[a].spec_id
			//          			jishu=jishu+1
			//          			for(var b in this.Sele[a]["choose"]){
			//          				data['spec_value_id['+jishu1+']']=this.Sele[a]["choose"][b]
			//          				jishu1=jishu1+1
			//          			}
			//          		}
			//          	}
			//      			this.zuhe(data)
			//
			//          },
			//          handleChecked(val,e){
			//          	var checkedCount = this.Sele[e]["choose"].length
			//          	var data={},jishu=0,jishu1=0
			//          	this.Sele[e].checkAll = checkedCount === this.Sele[e]["all"].length?true:false;
			//          	this.Sele[e].isIndeterminate = checkedCount > 0 && checkedCount < this.Sele[e]["all"].length?true:false
			//      		for(var a in this.Sele){
			//          		if(this.Sele[a]["choose"].length>0){
			//          			data['spec_id['+jishu+']']=this.Sele[a].spec_id
			//          			jishu=jishu+1
			//          			for(var b in this.Sele[a]["choose"]){
			//          				data['spec_value_id['+jishu1+']']=this.Sele[a]["choose"][b]
			//          				jishu1=jishu1+1
			//          			}
			//          		}
			//          }
			//      		this.zuhe(data)
			//
			//          },
			saveEdit() {
				this.disabledd = true
				var that = this;
				var data = {},
					jishu = 0,
					jishu1 = 0
				for(var a in this.Sele) {
					if(this.Sele[a]["choose"].length > 0) {
						data['spec_id[' + jishu + ']'] = this.Sele[a].spec_id
						jishu = jishu + 1
						for(var b in this.Sele[a]["choose"]) {
							data['spec_value_id[' + jishu1 + ']'] = this.Sele[a]["choose"][b]
							jishu1 = jishu1 + 1
						}
					}
				}
				data['cate_id'] = this.cate_id[this.cate_id.length-1]
				data['shop_id'] = this.form["shop_id"]
				data['spu_name'] = this.form["spu_name"]
				data['spu_intro'] = this.form["spu_intro"]
				data['spec_str'] = this.form["spec_str"]
				for(var i = 0; i < this.wl; i++) {
					data['sku_arr[' + i + '][key]'] = this.form["key"][i]
//					data['sku_arr[' + i + '][thumb]'] = this.form["thumb"][i]
					data['sku_arr[' + i + '][purchase_price]'] = this.form["purchase_price"][i]
					data['sku_arr[' + i + '][market_price]'] = this.form["market_price"][i]
					data['sku_arr[' + i + '][price]'] = this.form["price"][i]
					//          		data['sku_arr['+i+'][nper_price]']=this.form["nper_price"][i]
//					data['sku_arr[' + i + '][weight]'] = this.form["weight"][i]
					data['sku_arr[' + i + '][spec_params]'] = this.form["spec_params"][i]
					data['sku_arr[' + i + '][install_fee]'] = this.form["install_fee"][i]
					data['sku_arr[' + i + '][integral_discount]'] = this.form["integral_discount"][i]

					
					data['sku_arr[' + i + '][stock]'] = this.form["stock"][i]
					for(var j in this.ruleForm[i]) {
						data['sku_arr[' + i + '][images][' + j + ']'] = this.ruleForm[i][j].url
					}
				}
				var url = that.ports.goods.store;
				data = that.qs.stringify(data)
				that.$axios.post(url, data)
					.then(function(res) {
						that.disabledd = false
						if(res.data.status == 200) {
							that.form={
								shop_id:'',
								spu_name: '',
								spu_intro: '',
								spec_str: '',
								key: [],
								purchase_price: [],
								market_price: [],
								price: [],
								spec_params: [],
								stock: [],
								install_fee: [],
								integral_discount:[]
								}
							that.ruleForm=[[]]
							that.cate_id=[]
							that.list=[]
							that.spec_arr=[]
							that.$message.success(`操作成功`);
							that.back()

						} else {
							that.$message.warning(res.data.message);
						}

					})
					.catch(function(error) {
						console.log(error);
						that.disabledd = false
						that.$message.error(`执行失败`);
					});
			},
			back(){
	            if (window.history.length <= 1) {
	                this.$router.push({path:'/'})
	                return false
	            } else {
//	            	window.opener = null;
//					window.open("about:blank", "_top").close()
	                this.$router.go(-1)
	            }
	        }
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
	
	.handle-input {
		width: 300px;
		display: inline-block;
	}
	
	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}
	
	.table {
		width: 100%;
		font-size: 14px;
	}
	
	.red {
		color: #ff0000;
	}
	
	.margin_pic {
		margin-right: 20px !important;
	}
	
	.v-modal {
		z-index: 2002 !important;
	}
	
	.demo-table-expand {
		font-size: 0;
	}
	
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
	
	.tjwl {
		text-align: center;
		color: #67C23A;
		font-size: 20px;
		cursor: pointer;
	}
	
	.el-icon-circle-plus-outline {
		margin-right: 4px;
	}
	/*.el-input{
  	width: 360px !important;
  }*/
	
	.el-upload {
		width: 400px !important;
	}
	
	img.avatar {
		width: 100% !important;
	}
	/*.avatar-uploader .el-icon-plus{
 	font-size: 30px;
 	position: absolute;
 	left: 50%;
 	top: 50%;
 	transform: translate(-50%,-50%);
 }*/
	
	.el-upload--picture-card {
		width: 400px !important;
	}
	
	.el-row {
		margin-bottom: 1px;
		/**/
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.el-col {
		border-radius: 4px;
	}
	
	.bg-purple-dark {
		background: #99a9bf;
	}
	
	.bg-purple {
		background: #d3dce6;
	}
	
	.bg-purple-light {
		background: #e5e9f2;
	}
	
	.grid-content {
		text-align: center;
		color: white;
		border-radius: 0px;
		height: 36px;
		line-height: 36px;
		margin: 0 1px 1px 0;
		font-size: 14px;
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	
	.spu_name {
		width: 300px;
	}
	
	.itemadd {
		margin-bottom: 40px;
		padding: 40px;
		box-shadow: 0 0 10px #eee;
		position: relative;
		overflow: hidden;
	}
	
	.delete {
		position: absolute;
		right: 10px;
		top: 10px;
	}
	
	.el-input {
		width: 214px;
	}
	
	.el-form-item {
		float: left;
	}
	
	.el-form-item--small .el-form-item__content {
		float: left !importan;
		margin-left: 0 !important;
	}
	
	.overhidden {
		overflow: hidden;
	}
	
	.clear {
		clear: both;
	}
	
	.noflot .el-form-item {
		float: none;
		max-width: 600px;
	}
	
	.textarea {
		width: 600px;
	}
	
	.el-button--medium {
		width: 100px;
	}
	
	.dialog-footer {
		text-align: right;
	}
	
	.avatar-uploader1 i {
		font-size: 28px;
		line-height: 180px;
	}
	
	.el-textarea__inner {
		width: 600px !important;
	}
</style>