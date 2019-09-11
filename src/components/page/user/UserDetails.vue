<template>
	
<div>
	<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-friend"></i> 用户详情</el-breadcrumb-item>
                <!--<el-breadcrumb-item>用户详情</el-breadcrumb-item>-->
            </el-breadcrumb>
        </div>
	<div v-loading="loading" class="container">
		<el-row>
			
		<el-col   :lg='8'  :md='12' :sm="24" :xs="24">
		
        <div>
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px"class='from'>
                	<div class="center">修改个人信息</div>
                	<el-form-item label="用户名">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="form.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input  v-model="form.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="卡号">
                        <el-input  v-model="form.bind_card_no"></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色">
                    	<router-link :to="{path:'/UserRole',query: {user_id: id}}">
                        	<el-button  type="primary" >查看用户角色</el-button>
                        </router-link>
                    </el-form-item>
                    <el-form-item label="密码">
                    	<el-button v-if='psdxg' type="primary" @click="psdxg = false">修改密码</el-button>
                    	<template v-else>
					    	<el-input  v-model="form.password" class='psd'></el-input>
					    	<el-button type="primary" class='psd_btn'  @click="psdxg = true">取消修改</el-button>
					    </template>
					</el-form-item>
					<el-form-item label="用户状态" >
					  	<el-select v-model="form.status" placeholder="请选择">
	                    	<el-option
						      v-for="item in user_status"
						      :key="item.id"
						      :value="item.id"
						      :label="item.name">
						    </el-option>
	                    </el-select>
					</el-form-item>
					<div class="crop-demo">
						<div class="left">上传图片</div>
		                <img :src="cropImg" class="pre-img">
		                <div class="crop-demo-btn choose">选择图片
		                    <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
		                </div>
		            </div>
		        	<el-form-item label="地址">
                        {{bind_area_name}}
                    </el-form-item>
		            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
		                <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
		                <span slot="footer" class="dialog-footer">
		                    <el-button @click="cancelCrop">取 消</el-button>
		                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		                </span>
		            </el-dialog>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click='getData'>取消</el-button>
                    </el-form-item>
                </el-form>
                <!--<el-form ref="form" :model="form" label-width="80px" class='from'>
                	<div class="center">修改密码</div>
                	<el-form-item label="密码" prop="password">
					    <el-input  v-model="password"></el-input>
					</el-form-item>
					<el-form-item>
                        <el-button type="primary" @click="onSubmitpsd">提交</el-button>
                        <el-button @click='clearpsd'>取消</el-button>
                    </el-form-item>
                </el-form>-->
                
            </div>
        </div>
        </el-col>
        <el-col   :lg='8'  :md='12' :sm="24" :xs="24">
        	<el-form :model="form2" label-width="100px" class='from'>
            	<div class="center">钱包</div>
            	<router-link :to="{path:'/Change',query: {id: id}}">
            	<el-form-item label="环保金">
				    <span>{{wallet.balance}}</span>
				</el-form-item>
				</router-link>
				<router-link :to="{path:'/Integral',query: {id: id}}">
				<el-form-item label="积分">
				    <span>{{wallet.integral}}</span>
				</el-form-item>
				</router-link>
				<router-link :to="{path:'/SettleIndex',query: {id: id}}">
            	<el-form-item label="货款">
				    <span>{{wallet.settle}}</span>
				</el-form-item>
				</router-link>
				<el-form-item label="信用积分">
				    <span>{{wallet.score}}</span>
				</el-form-item>
				<el-form-item label="家庭环保金" v-if="family_wallet.balance">
				    <span>{{family_wallet.balance}}</span>
				</el-form-item>
				<el-form-item label="家庭积分" v-if="family_wallet.integral">
				    <span>{{family_wallet.integral}}</span>
				</el-form-item>
				<el-form-item label="密码">
                	<el-button v-if='psdxg_cat' type="primary" @click="psdxg_cat = false">修改密码</el-button>
                	<template v-else>
				    	<el-input  v-model="form2.password" class='psd'></el-input>
				    	<el-button type="primary" class='psd_btn'  @click="psdxg_cat= true">取消修改</el-button>
				    </template>
				</el-form-item>
                <el-form-item label="钱包状态" >
				  	<el-select v-model="form2.status" placeholder="请选择">
                    	<el-option
					      v-for="item in wallet_status"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="类型" >
				  	<el-select v-model="form2.field" placeholder="请选择">
                    	<el-option
					      v-for="item in wallet_field"
					      :key="item.key"
					      :value="item.key"
					      :label="item.name">
					    </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="值">
                    <el-input  v-model="form2.field_value"></el-input>
                </el-form-item>
                  <el-form-item label="描述">
				    <el-input type="textarea" v-model="form2.intro"></el-input>
				  </el-form-item>
				<el-form-item>
                    <el-button type="primary" @click="onSubmit_cat">提交</el-button>
                    <el-button @click='clear_cat'>取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col   :lg='8'  :md='12' :sm="24" :xs="24">
        	<div class="from">
        		<div class="center">垃圾管理</div>
        		<el-table :data="dispaly" border class="table" ref="multipleTable"  id="out-table">
	            	<el-table-column prop="name" label="名称" >
	            	</el-table-column>
	            	<el-table-column prop="value" label="值" >
	            	</el-table-column>
	            </el-table>
        	</div>
        	
        </el-col>
        </el-row>
	</div>
</div>
</template>

<script>
	import VueCropper  from 'vue-cropperjs';
	export default {
    name: 'UserDetails',
    data () {
      return {
      	loading:true,
        id: '',
        psdxg:true,
        psdxg_cat:true,
        form: {
            nickname:"",
            mobile:'',
            status:"",
            avatar:"",
            username:'',
            password:"",
            bind_card_no:''
        },
        dispaly:[],
        form2: {
			status:"",
            password:"",
            field:"",
            field_value:"",
            intro:"",
        },
        wallet:[],
        defaultSrc: '',
        imgSrc: '',
        cropImg: '',
        dialogVisible: false,
        wallet_field:[],
        wallet_status:[],
        user_status:[],
        bind_area_name:'',
        family_wallet:{
        	balance:'',
        	integral:''
        }
      }
    },
    created(){
       this.getParams()
       this.getSele()
       this.getData()
//     
    },
    methods: {
      getParams () {
        // 取到路由带过来的参数 
        if(!this.$route.query.id){
        	return false
        }
        var routerParams = this.$route.query.id
        // 将数据放在当前组件的数据内
        this.id = routerParams
//      console.log(this.id)
      },
      getSele(){

		this.user_status = JSON.parse(localStorage.getItem('config')).user_status;
		this.wallet_status = JSON.parse(localStorage.getItem('config')).wallet_status;
		this.wallet_field = JSON.parse(localStorage.getItem('config')).wallet_field;
      },
      getData() {
	    	var that =this;
//	    	console.log(that.id)
	    	if(!that.id){
	        	return false
	        }
			this.$axios.get(that.ports.user.show+"?user_id="+that.id).then(function(res) {
				if(res.data.status==200){
					var form_two={};
					that.psdxg=true,
	        		that.psdxg_cat=true,
		        	that.form = {
		        		nickname:res.data.result.user.nickname||"",
		        		username:res.data.result.user.username||"",
			            mobile:res.data.result.user.mobile||"",
			            status:res.data.result.user.status||"",
			            avatar:res.data.result.user.avatar||"",
			            bind_card_no:res.data.result.user.bind_card_no||"",
			            password:"",
		        	};
		        	that.bind_area_name = res.data.result.user.bind_area_name||'空';
		        	that.defaultSrc = res.data.result.user.avatar;
		        	that.cropImg = that.defaultSrc;
		        	that.wallet = res.data.result.wallet;
		        	that.family_wallet = res.data.result.family_wallet;
		        	form_two["status"] = res.data.result.wallet.status;
		        	that.form2 = form_two;
		        	that.dispaly = res.data.result.dispaly;
		            
				}else{
					that.$message.warning(res.data.message);
				}
				that.loading = false;
	       }) 
	    },
	    setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            },
       onSubmit() {
	      	var that =this;
	      	var data={
	    		user_id:that.id,
	          	nickname: that.form.nickname,
	          	username: that.form.username,
	            mobile: that.form.mobile,
	            status: that.form.status,
	            avatar:that.imgSrc,
	            bind_card_no:that.form.bind_card_no,
	       }
	    	
	    	if(!that.psdxg&&that.form.password){
	    		data.password = that.form.password
	    	}
	    	data =that.qs.stringify(data)
	     	that.$axios.post(that.ports.user.update, data)
			.then(function (res) {
				console.log(res);
				if(res.data.status==200){
					that.$message.success(`修改成功`);
					that.getData();
					that.editVisible = false;
				}else{
					that.$message.warning(res.data.message);
				}
				
			})
			.catch(function (error) {
				console.log(error);
				that.$message.success(`修改失败`);
			});
	    },
	    onSubmit_cat(){
	    	var that = this
	    	var data = that.form2;
	    	data.user_id=that.id
	    	data =that.qs.stringify(data)
	     	that.$axios.post(that.ports.wallet.update, data)
			.then(function (res) {
				console.log(res);
				if(res.data.status==200){
					that.$message.success(`修改成功`);
					that.getData();
					that.editVisible = false;
				}else{
					that.$message.warning(res.data.message);
				}
				
			})
			.catch(function (error) {
				console.log(error);
				that.$message.success(`修改失败`);
			});
	    },
	    clear_cat(){
	    	var form_two = {
           
            status:"",
            password:"",
            field:"",
            field_value:"",
            intro:"",
        	}
        	this.form2 = form_two
	    }
    },
    watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
		'$route': ['getParams','getSele','getData']
//		 $route(to,from){
//		    console.log(to.path);
//		    console.log(to,from)
//		  }
    }
  }

</script>

<style scoped="scoped">
.crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
        float: left;
    }
    .form-box{
    	width: 100%;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
    .left{
    	float: left;
    	width: 68px;
    	padding: 0 12px 0 0;
    	text-align: right;
	    float: left;
	    font-size: 14px;    
	    color: #606266;
    }
    .crop-demo{
    	overflow: hidden;
    	margin-bottom: 40px;
    }
    .crop-demo img{
    	width: 80px;
    	float: left;
    	/*margin-left: 92px;*/
    }
    .from{
    	box-shadow: 0 0 6px #CCCCCC;
    	padding: 20px 10px;
    	margin: 10px 0;
    	border-radius: 10px;
    	/*width: 500px;*/
    	width: 90%;
    }
    .center{
    	text-align: center;
    	margin: 0px auto 20px auto;
    }
    .psd_btn{
    	float: right;
    }
    .psd{
    	width: 300px;
    	float: left;
    }
    .psd input{
    	width: 100% !important;
    }
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .table,.el-table__body{
        width: 100% !important;
        font-size: 14px;
    }
    .choose,.crop-input{
    	width: 80px;
    	padding: 0;
    	line-height:30px;
    	height: 30px;
    	text-align: center;
    }
</style>
