<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品规格管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div  class="container">
        <div class="">
        	
	        	<el-row  >
	        		<el-col :xs="24">
		        		<el-form ref="formgood"  label-width="100px" class='itemadd'>	
		        			<div class="caozuo">
				        			<el-button type="primary" icon="el-icon-edit" circle @click="editgood=true"></el-button>
				            </div>
				            <el-form-item label="商品类型">
				                <span >{{result.source_name}}</span>
				           </el-form-item>
		        			<el-form-item label="商品名称">
				                <span v-if="!editgood">{{result.spu_name}}</span>
				                <el-input v-else v-model="formgood.spu_name" ></el-input>
				           </el-form-item>
				            <el-form-item label="商品分类"  >
				            	<span v-if="!editgood">{{result.cate_name}}</span>
			                    <el-cascader 
			                    	v-else 
			                    	clearable
			                    	placeholder="商品分类"
			                    	 change-on-select
			                    	id="cascader"
								  :options="sele"
					      		  :props="props"
					      		   v-model="cate_id"
					      		   
								></el-cascader>
			                </el-form-item>
				            <el-form-item label="状态"  >
				            	<span v-if="!editgood">{{result.status_name}}</span>
			                    <el-select v-else v-model="formgood.status" placeholder="请选择">
			                    	<el-option
								      v-for="item in goods_spu_status"
								      :key="item.id"
								      :value="item.id"
								      :label="item.name">
								    </el-option>
			                    </el-select>
			                </el-form-item>
			                <el-form-item label="商品介绍" >
				            	<viewer v-if="!editgood"  :images="form.signImages">
							        <img  class='margin_pic' :src="result.spu_intro"  width="320">
							    </viewer>
							    <template v-else>
							    <el-upload
								  class="avatar-uploader avatar-uploader1"
								  :action="uploadurl"
								  :show-file-list="false"
								  :http-request="upLoadspu_intro"
								  >
								  <img v-if="formgood.spu_intro" :src="formgood.spu_intro" class="avatar">
								  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
								</el-upload>
								</template>
				         </el-form-item>
			                <div class="clear"></div>
				            <div  class="dialog-footer" v-if="editgood" >
				            	<el-button type="primary"  @click="savegoodsqx">取消</el-button> 
						        <el-button type="primary"  @click="savegoods">确 定</el-button> 
					        </div>
				        </el-form>
	        		</el-col>
	        		<!--<el-col :xs="24" class='mab40'>
		        		<el-row  class='boder' v-if="list.length>0">
						  <el-col :span="2"><div class="grid-content bg-purple">规格值key</div></el-col>
						  <el-col :span='22'>
						  	<el-row>
						  		<el-col :span="2"  v-for="(item,index) in list" :key="index"><div class="grid-content bg-purple">{{item.key}}</div></el-col>
						  	</el-row>
						  </el-col>
						</el-row>
						<el-row class='boder'  v-if="list.length>0">
						  <el-col :span="2"><div class="grid-content bg-purple">规格名</div></el-col>
						<el-col :span='22'>
						  	<el-row>
						  		<el-col :span="2"  v-for="(item,index) in list" :key="index"><div class="grid-content bg-purple">{{item.name}}</div></el-col>
						  	</el-row>
						  </el-col>
						</el-row>
					</el-col>-->
					<el-form ref="form1"  label-width="100px">
	        		<template v-for="(item,i) in result.skus" >
		        	<!--<el-col :xs="24" :sm="11" :md="7" :offset="1" class='itemmk' >-->
		        	<div class='itemadd'>
		        		<div class="caozuo">
			        			<el-button type="primary" icon="el-icon-edit" circle @click="uplade(item.sku_id,i)"></el-button>
								<el-button type="danger" icon="el-icon-delete" circle @click="detele(item)"></el-button>
			            </div>
		        		
			            <el-form-item label="规格值key">
			                {{item.sku_name}} ({{item.sku_key}})
			            </el-form-item>
			            <div class="clear"></div>
			            
						<div class="clear"></div>
			        	<el-form-item label="采购价">
			        		<div v-if="item.xiugai">{{item.purchase_price}}</div>
			                <el-input  v-else v-model="form1.purchase_price" ></el-input>
			            </el-form-item>
			            <el-form-item label="市场价">
			            	<div v-if="item.xiugai">{{item.market_price}}</div>
			                <el-input v-else  v-model="form1.market_price" ></el-input>
			            </el-form-item>
			            <el-form-item label="售价">
			            	<div v-if="item.xiugai">{{item.price}}</div>
			                <el-input  v-else v-model="form1.price" ></el-input>
			            </el-form-item>
			            <!--<el-form-item label="分期价">
			            	<div v-if="item.xiugai">{{item.nper_price}}</div>
			                <el-input  v-else v-model="form1.nper_price" ></el-input>
			            </el-form-item>-->
			            <!--<el-form-item label="安装费">
			            	<div v-if="item.xiugai">{{item.install_fee}}</div>
			                <el-input  v-else v-model="form1.install_fee" ></el-input>
			            </el-form-item>-->
			            
			            <!--<el-form-item label="重量（kg）">
			            	<div v-if="item.xiugai">{{item.weight}}</div>
			                <el-input v-else  v-model="form1.weight" ></el-input>
			            </el-form-item>-->
			            
			            <el-form-item label="库存">
			            	<div  v-if="item.xiugai">
			            		{{item.stock}}
			            	</div>
			                <el-input v-else  v-model="form1.stock" ></el-input>
			            </el-form-item>
			            
			            
		            	<el-form-item label="状态" >
			            	<div v-if="item.xiugai">{{item.status_name}}</div>
			            	<el-select v-else v-model="form1.status" clearable  placeholder="请选择">
			                	<el-option
							      v-for="item in goods_sku_status"
							      :key="item.id"
							      :value="item.id"
							      :label="item.name">
							    </el-option>
			                </el-select>
			            </el-form-item>
			            <el-form-item label="售出">
			            	<div >
			            		{{item.sales}}
			            	</div>
			            </el-form-item>
			            <div class="clear"></div>
			            <div class='noleft'>
				            <el-form-item label="规格参数">
				            	<div v-if="item.xiugai">{{item.spec_params}}</div>
				                <el-input v-else  type="textarea" autosize  v-model="form1.spec_params" ></el-input>
				            </el-form-item>
			            </div>
			            <div class="clear"></div>
			            <!--<el-form-item label="缩略图">
			            	<img  v-if="item.xiugai" :src="item.thumb"/>
			            	<div @click="dqian(i)" v-else >
				            <el-upload
							  class="avatar-uploader"
							  list-type="picture-card" 
							  :action="uploadurl" 
							  :show-file-list="false"
							  :http-request="upLoadgx"
							  >
							  <img v-if="form1.thumb" :src="form1.thumb" class="avatar">
							  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							
							</div>
							
						</el-form-item>-->
			            <el-form-item label="轮播图">
			            	<span v-if="item.xiugai">
								<img  v-for="(src,index) in item.images" :key='index'  :src="src"/>
			            	</span>
			            	<div @click="dqian(i)" v-else >
			            		<div class="piccz" v-for="(src,index) in imagesxg" :key='index' >
			            			<img  :src="src.url"/>
			            			<div class="zzc">
			            				<i class="el-icon-delete" @click="handleRemovexg('','',src.uid)"></i>
			            			</div>
			            		</div>
			            		<div class="right">
			            			<el-upload
					            	list-type="picture-card" 
								  :action="uploadurl" 
								  :before-upload="beforeAvatarUpload"
								  :on-exceed="handleExceed"
								  :http-request="upLoad1gx"
								  :on-remove="handleRemovexg"
								  :multiple ='multiple'
								  :limit="9"
								  >
								  <i class="el-icon-plus"></i> 
								</el-upload>
			            		</div>
							</div>

						</el-form-item>
			            <div slot="footer" class="dialog-footer">
			            	<el-button v-if="!item.xiugai" type="primary"  @click="saveEditxgqx">取消</el-button> 
					        <el-button v-if="!item.xiugai" type="primary"  @click="saveEditxg(item.sku_key)">确 定</el-button> 
				        </div>
			            
			            <!--</el-col>-->
			            </div>
					</template>
					</el-form>
	        	</el-row>
        	
        </div>
        <el-form ref="form"  label-width="100px">
        	
        	<template v-for="(item,i) in wl" >
        		<div class='itemadd'>
	            <el-form-item label="规格值key">
	                 <el-select v-model="form.key[i]" clearable placeholder="请选择">
					    <el-option
					      v-for="item in list"
					      :key="item.key"
					      :label="item.name"
					      :value="item.key">
					    </el-option>
					</el-select>
	            </el-form-item>
	            
	        	<el-form-item label="采购价">
	                <el-input v-model="form.purchase_price[i]" ></el-input>
	            </el-form-item>
	            <el-form-item label="市场价">
	                <el-input v-model="form.market_price[i]" ></el-input>
	            </el-form-item>
	            <el-form-item label="售价">
	                <el-input v-model="form.price[i]" ></el-input>
	            </el-form-item>
	            <!--<el-form-item label="分期价">
	                <el-input v-model="form.nper_price[i]" ></el-input>
	            </el-form-item>-->
	            <!--<el-form-item label="安装费">
	                <el-input v-model="form.install_fee[i]" ></el-input>
	            </el-form-item>-->
	            
	            <!--<el-form-item label="重量（kg）">
	                <el-input v-model="form.weight[i]" ></el-input>
	            </el-form-item>-->
	            
	            <el-form-item label="库存">
	                <el-input v-model="form.stock[i]" ></el-input>
	            </el-form-item>
	            <div class="clear"></div>
	            <el-form-item label="规格参数">
	                <el-input type="textarea" autosize  class='textarea' v-model="form.spec_params[i]" ></el-input>
	            </el-form-item>
	            <div class="clear"></div>
	            <!--<el-form-item label="缩略图">
	            	<div @click="dqian(i)">
		            <el-upload
					  list-type="picture-card" 
					  class="avatar-uploader"
					  :action="uploadurl" 
					  :http-request="upLoad"
					  >
					  <img v-if="form.thumb[i]" :src="form.thumb[i]" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					</div>
				</el-form-item>-->
	            <el-form-item label="轮播图">
	            	<div @click="dqian(i)">
		            <el-upload
		            	list-type="picture-card" 
						  :action="uploadurl" 
						  :before-upload="beforeAvatarUpload"
						  :on-exceed="handleExceed"
						  :http-request="upLoad1"
						  :on-remove="handleRemove"
						  :multiple ='multiple'
						  :limit="9"
					  >
					  <i class="el-icon-plus"></i> 
					</el-upload>
					</div>
				</el-form-item>
				
	            </div>
			</template>
			<div class="center-align tjwl" @click="tjwl">
        		<i class="el-icon-circle-plus-outline"></i>添加商品规格
        	</div>
        </el-form>
        
        <div slot="footer" class="dialog-footer" v-if="wl>0">
            <el-button type="primary" @click="saveEdit" class='btnsure'>确 定</el-button>
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
        name: 'GoodskuAdd',
        data() {
            return {
            	spec_arr:[],
            	delVisible:false,
                loading:true,
		        dialogImageUrl: '',
        		dialogVisible: false,
        		otherdata:{source:"file"},
        		uploadurl:'',
        		multiple:true,
        		images:[],
        		form1:{
        			sku_id:'',
//      			thumb:'',
        			purchase_price:'',
        			market_price:'',
        			price:'',
//      			nper_price:'',
//      			weight:'',
        			spec_params:'',
        			stock:'',
        			status:'',
//      			install_fee:''
        		},
        		imagsegx:[],
        		form:{
        			key:[],
//      			thumb:[],
        			purchase_price:[],
        			market_price:[],
        			price:[],
//      			nper_price:[],
//      			weight:[],
        			spec_params:[],
        			stock:[],
//      			install_fee:[]
        		},
        		Sele:[],
        		headers: {
    				"channel":"web",
    				"build":0,
    				"token":store.state.token
    			},
    			data:{'source':'file'},
    			ruleForm: [
    			[]
    			],
        		wl:0,
        		dqsz:0,
        		id:1,
        		result:{},
        		list:[],
        		delid:0,
        		goods_sku_status:[],
        		imagesxg:[],
        		imagesxg1:[],
        		goods_spu_status:[],
        		goods_spu_status:[],
        		formgood:{
        			spu_id:'',
        			spu_name:'',
        			spu_intro:'',
        			status:'',
        			cate_id:''
        		},
        		editgood:false,
        		props: {
				  value: 'id',
		          label:'name',
		          children: 'children'
		        },
		        cate_id:[]
            }
        },
        created() {
        	console.log(this.ports)
            this.uploadurl = this.ports.Base+this.ports.common.imageBatch
            this.sele = JSON.parse(localStorage.getItem('config')).goods_cate;
            this.getconfigall();
            this.getParams();
            this.getData()
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
        	uplade(e,i){
        		this.imagesxg=[]
        		for(var a in this.result.skus){
        			this.result.skus[a]['xiugai']=true
        		}
        		this.result.skus[i]['xiugai']=false
        		this.form1={
        			sku_id:this.result.skus[i].sku_id,
//      			thumb:this.result.skus[i].thumb,
        			purchase_price:this.result.skus[i].purchase_price,
//      			install_fee:this.result.skus[i].install_fee,
        			market_price:this.result.skus[i].market_price,
        			price:this.result.skus[i].price,
//      			nper_price:this.result.skus[i].nper_price,
//      			weight:this.result.skus[i].weight,
        			spec_params:this.result.skus[i].spec_params,
        			stock:this.result.skus[i].stock,
        			status:this.result.skus[i].status
        		}
        		
        		for(var b in this.result.skus[i]['images']){
        			this.imagesxg.push({
				          name: 'img',
				          url: this.result.skus[i]['images'][b],
				          uid:b
				        })
        		}
        		
        	},
        	update(){
        		this.editgood=true
        	},
        	savegoodsqx(){
        		this.getData();
				this.editgood=false
        	},
        	savegoods(){
        		var that = this;
            	var data = this.formgood;
            	var url = that.ports.goods.update;
            	data.cate_id=this.cate_id[this.cate_id.length-1]
            	data=that.qs.stringify(data)
            	that.$axios.post(url, data)
				.then(function (res) {
					console.log(res);
					if(res.data.status==200){
						that.getData();
						that.editgood=false
						that.$message.success(`操作成功`);
						
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
        		
        	},
        	getParams () {
		        // 取到路由带过来的参数 
		        if(!this.$route.query.id){
		        	return false
		        }
		        var routerParams = this.$route.query.id
		        // 将数据放在当前组件的数据内
		        this.id = routerParams
		      },
        	dqian(e){
        		this.dqsz=e
        	},
        	tjwl(){
        		this.ruleForm[this.wl]=[]
        		this.wl=this.wl+1
        		for(var a in this.result.skus){
        			this.result.skus[a]['xiugai']=true
        		}
        	},
        	handlePictureCardPreview(){
        		
        	},
        	getData(){
        		this.wl=0
        		if(this.id==''){
        			return false
        		}
        		
        		var that =this;
				this.$axios.get(that.ports.goods.show+"?spu_id="+that.id).then(function(res) {
		        	
		        	for(var i in res.data.result.skus){
	        			res.data.result.skus[i]['xiugai']=true
	        		}
		        	that.result = res.data.result;
		        	console.log(that.result)
		        	var spec_ids = res.data.result.spec_ids,spec_value_ids = res.data.result.spec_value_ids
//          		var data= {}
//	    			for(var b in spec_ids){
//	    				data['spec_id['+b+']']=spec_ids[b]
//	    			}
//          		for(var a in spec_value_ids){
//	    				data['spec_value_id['+a+']']=spec_value_ids[a]
//	    			}
            		that.formgood={
            			spu_id:res.data.result.spu_id,
            			spu_name:res.data.result.spu_name,
	        			spu_intro:res.data.result.spu_intro,
	        			status:res.data.result.status,
	        			cate_id:res.data.result.cate_id,
            		}
            		that.zuhe(res.data.result.spec_str)
		            that.loading = false
		            for(var a in that.result.skus){
	        			that.result.skus[a]['xiugai']=true
	        		}
		            that.editgood=false
		       	}) 
		       	this.$axios.get(that.ports.Home.config).then(function(res) {
			        that.goods_sku_status = res.data.result.goods_sku_status;
			        that.goods_spu_status = res.data.result.goods_spu_status;
			    })
        	},
        	upLoadspu_intro(file){
        		
        		const formData = new FormData()
      			var that =this;
      			console.log(that.formgood.spu_intro)
			      formData.append('file',file.file)
			      formData.append('image',file.file)
			      formData.append('source','file')
			      this.$axios.post(this.ports.common.upload,formData).then(res => res.data)
			      .then(data => {
			      	
			        if(data.status == 200){
			          that.formgood.spu_intro = data.result.image_url
			          console.log(that.formgood.spu_intro)
			        }else{
			        	that.$message.warning(res.data.message);
			        }
		      })
		      .catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
        	},
        	upLoad (file) {
      			const formData = new FormData()
      			var that =this;
			      formData.append('file',file.file)
			      formData.append('image',file.file)
			      formData.append('source','file')
			      this.$axios.post(this.ports.common.upload,formData).then(res => res.data)
			      .then(data => {
			      	
			        if(data.status == 200){
			          that.form.thumb[that.dqsz] = data.result.image_url
			        }else{
			        	that.$message.warning(res.data.message);
			        }
		      })
		      .catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
		    },
		    upLoad1(file){
		    	const formData = new FormData()
      			var that =this;
      			var uid = file.file.uid
      			formData.append('file',file.file)
			      formData.append('image',file.file)
			      formData.append('source','file')
			      this.$axios.post(this.ports.common.upload,formData).then(res => res.data)
			      .then(data => {
			      	
			        if(data.status == 200){
			          that.uploadSuccess(data.result,uid)
			        }else{
			        	that.$message.warning(res.data.message);
			        }
		      })
		      .catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
		    },
		    upLoadgx (file) {
      			const formData = new FormData()
      			var that =this;
			      formData.append('file',file.file)
			      formData.append('image',file.file)
			      formData.append('source','file')
			      this.$axios.post(this.ports.common.upload,formData).then(res => res.data)
			      .then(data => {
			      	
			        if(data.status == 200){
			          that.form1.thumb = data.result.image_url
			        }else{
			        	that.$message.warning(res.data.message);
			        }
		      })
		      .catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
		    },
		    upLoad1gx(file){
		    	const formData = new FormData()
      			var that =this;
      			var uid = file.file.uid
      			formData.append('file',file.file)
			      formData.append('image',file.file)
			      formData.append('source','file')
			      this.$axios.post(this.ports.common.upload,formData).then(res => res.data)
			      .then(data => {
			      	
			        if(data.status == 200){
			          that.uploadSuccessgx(data.result,uid)
			        }else{
			        	that.$message.warning(res.data.message);
			        }
		      })
		      .catch(function (error) {
					that.$message.error(`执行失败`);
				});
		    },
//      	上传限制格式与大小（png,jpg,gif,jpeg），与2M，这边代码没有优化，自行解决
		    beforeAvatarUpload(file) {
		    	
		      const extension =file.name.substring(
		          file.name.lastIndexOf('.') + 1,
		          file.name.length
		        ) === 'png'
		      const extension1 =file.name.substring(
		          file.name.lastIndexOf('.') + 1,
		          file.name.length
		        ) === 'jpg'
		      const extension2 =
		        file.name.substring(
		          file.name.lastIndexOf('.') + 1,
		          file.name.length
		        ) === 'gif'
		      const extension3 =file.name.substring(
		          file.name.lastIndexOf('.') + 1,
		          file.name.length
		        ) === 'jpeg'
		      if (!extension && !extension1 && !extension2 && !extension3) {
		        this.$message.error('文件格式有误!')
		        return false
		      }
		      const isLt2M = file.size / 1024 / 1024 < 2
		      if (!isLt2M) {
		        this.$message.error('上传头像图片大小不能超过 2MB!')
		        return false
		      }
		      return extension || extension1 || extension2 || extension3 || isLt2M
		    },
		    // 超过文件限制提示
		    handleExceed(files, fileList) {
		      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
		    },
		   // 成功后
			uploadSuccess(response, uid){
			        this.ruleForm[this.dqsz].push({
				          name: 'img',
				          url: response.image_url,
				          uid:uid
				       })
//			        this.$message.success('上传成功！')
			},
			uploadSuccessgx(response, uid){
			    this.imagesxg1.push({
				          name: 'img',
				          url: response.image_url,
				          uid:uid
				       })
//			    console.log(this.imagesxg1)
			},
			handleRemove(file, fileList) {
				for(var i in this.ruleForm){
					for(var j in this.ruleForm[i]){
						if(this.ruleForm[i][j].uid==file.uid){
							this.ruleForm[i].splice(j, 1);
						}
					}
				}
				
			 },
			 handleRemovexg(file, fileList,i) {
//			 	console.log(file, fileList,i)
				if(i!=''&&i!=undefined){
					for(var j in this.imagesxg){
						if(this.imagesxg[j].uid==i){
							this.imagesxg.splice(j, 1);
//							console.log(this.imagesxg)
						}
					}
				}else{
					for(var j in this.imagesxg1){
						if(this.imagesxg1[j].uid==file.uid){
							this.imagesxg1.splice(j, 1);
//							console.log(this.imagesxg1)
						}
					}
					
				}
				
			 },
			 zuhe(data){
        		var that = this
//      		data=that.qs.stringify(data)
//      		console.log(data)
            	that.$axios.get(this.ports.goods.specFormat+"?spec_str="+ encodeURIComponent(data))
				.then(function (res) {
					if(res.data.status==200){
						var spec_arr =res.data.result.spec_arr;
						for (var i in spec_arr) {
							for(var j in spec_arr[i]['spec_values']){
								spec_arr[i]['spec_values'][j]['choose']=true
							}
						}
						that.list=res.data.result.spec_group_arr
						that.spec_arr=spec_arr
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
        	},
//      	getSele(){
//          	var that =this;
//				this.$axios.get(that.ports.goodsSpec.groupIndex).then(function(res) {
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
//		        	that.loading = false
//		        	that.Sele = Sele
//		       })
//          },
            handleCheckAllChange(val,e){
            	this.Sele[e]["choose"] = val ? this.Sele[e].all : [];
            	this.Sele[e].isIndeterminate = !this.Sele[e].isIndeterminate;
            },
            handleChecked(val,e){
            	var checkedCount = this.Sele[e]["choose"].length
            	
            	this.Sele[e].checkAll = checkedCount === this.Sele[e]["all"].length?true:false;
            	this.Sele[e].isIndeterminate = checkedCount > 0 && checkedCount < this.Sele[e]["all"].length?true:false
            },
            saveEdit(){
            	var that = this;
            	var data={};
            	for(var i = 0;i<this.wl;i++){
            		data['sku_arr['+i+'][operate]']='add'
            		data['sku_arr['+i+'][key]']=this.form["key"][i]
//          		data['sku_arr['+i+'][thumb]']=this.form["thumb"][i]
            		data['sku_arr['+i+'][purchase_price]']=this.form["purchase_price"][i]
//          		data['sku_arr['+i+'][install_fee]']=this.form["install_fee"][i]
            		
            		data['sku_arr['+i+'][market_price]']=this.form["market_price"][i]
            		data['sku_arr['+i+'][price]']=this.form["price"][i]
//          		data['sku_arr['+i+'][nper_price]']=this.form["nper_price"][i]
//          		data['sku_arr['+i+'][weight]']=this.form["weight"][i]
            		data['sku_arr['+i+'][spec_params]']=this.form["spec_params"][i]
            		data['sku_arr['+i+'][stock]']=this.form["stock"][i]
            		for(var j in this.ruleForm[i]){
            			data['sku_arr['+i+'][images]['+j+']']=this.ruleForm[i][j].url
            		}
            	}
            	data['spu_id']=this.id
            	
            	var url = that.ports.goods.update;
            	data=that.qs.stringify(data)
            	that.$axios.post(url, data)
				.then(function (res) {
					if(res.data.status==200){
						that.getData()
						that.$message.success(`操作成功`);
						
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
           },
           saveEditxgqx(){
           	this.getData()
           	this.imagesxg1 = []
           },
           saveEditxg(key1){
           	//编辑
           	var data1=this.form1,that = this,data={}
           	var jishu=0
           	
           	for(var j in this.imagesxg){
    			data['sku_arr[0][images]['+j+']']=this.imagesxg[j].url
    			jishu=j
    		}
           	for(var p in this.imagesxg1){
    			data['sku_arr[0][images]['+(p-0+jishu-0+1)+']']=this.imagesxg1[p].url
    		}
           	for(var i in data1){
           		data['sku_arr[0]['+i+']']=data1[i]
           	}
           	data['sku_arr[0][operate]']='edit'
           	data['sku_arr[0][key]']=key1
           	data['spu_id']=this.id
           	console.log(data)
           	data=that.qs.stringify(data)
           	that.$axios.post(that.ports.goods.update, data)
				.then(function (res) {
					if(res.data.status==200){
						that.getData()
						that.$message.success(`操作成功`);
						that.imagesxg1 = []
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
           },
           detele(e){
	        	this.delVisible = true
	        	this.delid=e.sku_key
	        	console.log(e)
	        },
	        deleteRow(){
				var that = this;
				var data =that.qs.stringify({
            		spu_id:that.id,
					"sku_arr[0][operate]":'del',
            		'sku_arr[0][key]':this.delid
            	})
                that.$axios.post(that.ports.goods.update, data)
                .then(function (res) {
                	if(res.data.status==200){
                		that.getData();
						that.$message.success('删除成功');
						this.delVisible = false;
					}else{
						that.$message.warning(res.data.message);
					}
                	
                })
                .catch(function (res) {
                	that.$message.error('删除失败');
                })
                
                
            },
        },
        
//      watch: {
//	    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
//	    '$route': ['getParams','getSele','getData']
//	    }
    }

</script>

<style scoped>
    
  img{
  	max-width: 200px;
  }
  .itemmk{
  	/*border: 1px solid #999;*/
  	/*box-shadow: 0 0 4px #ccc;*/
  }
  .piccz{
  	display: inline-block;
  	width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
  	position: relative;
  	border: 1px solid #c0ccda;
  	border-radius: 6px;
  	overflow: hidden;
  }
  .piccz img{
  	width: 148px;
  	line-height: 160px;
  	position: absolute;
  	top: 50%;
  	transform: translate(0,-50%);
  	}
  	
  	img.avatar{
  		position: absolute;
  		top: 50%;
  		transform: translate(-50%,-50%);
  	}
  .piccz .zzc{
  	display: inline-block;
  	position: absolute;
  	width: 148px;
  	height: 148px;
  	line-height: 148px;
  	top: 0;
  	left: 0;
  	background-color: rgba(0,0,0,.2);
  	opacity: 0;
  }
  .piccz .zzc .el-icon-delete{
  	position: absolute;
 	left: 50%;
 	top: 50%;
 	transform: translate(-50%,-50%);
 	color: white;
  }
  .piccz .zzc:hover{
  	opacity: 1;
  }
  .btnsure{
  	width: 100px;
  }
    .el-input{
  	width: 214px;
  }
  .el-form-item{
  	float: left;
  }
  .noleft .el-form-item{
  	float: none;
  }
  .el-form-item--small .el-form-item__content{
  	float: left !importan;
  	margin-left: 0 !important;
  }
  .overhidden{
  	overflow: hidden;
  }
  .clear{
  	clear: both;
  }
  .textarea{
  	width: 600px;
  }
  .el-button--medium{
  	width: 100px;
  }
  .dialog-footer{
  	text-align: right;
  }
  .itemadd{
  	margin-bottom: 40px;
  	padding: 40px;
  	box-shadow: 0 0 10px #eee;
  	position: relative;
  	overflow: hidden;
  }
  .caozuo{
  	position: absolute;
  	top: 10px;
  	right: 10px;
  }
  .right{
  	float: right;
  }
  .mab40{
  	margin-bottom: 40px;
  }
  img{
  	margin-right: 20px;
  }
  .tjwl {
    text-align: center;
    color: #67C23A;
    font-size: 20px;
    cursor: pointer;
}
	.margin_pic{
		max-height: 200px;
		width: 120px;
	}
</style>
