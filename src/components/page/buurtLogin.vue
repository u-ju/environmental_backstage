<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title color409EFF">啄木鸟社区后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content" v-show="!show">
                <el-form-item prop="username">
                    <el-input v-model.number="ruleForm.username" class='logininput' placeholder="手机号" maxlength='11'>
                        <!--<el-button slot="prepend" icon="el-icon-lx-people"></el-button>-->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input  placeholder="验证码" class='password logininput' v-model.number="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"  maxlength='6'>
                        <!--<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>-->
                    </el-input>
                    <span v-show="sendAuthCode" class="auth_text auth_text_blue"  @click="getAuthCode">{{text}}</span>
    				<span v-show="!sendAuthCode" class="auth_text disabled"> <span class="auth_text_blue">{{auth_time}} </span> S</span> 
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                
            </el-form>
            <el-form :model="ruleForm1"  :rules="rules1" ref="ruleForm1" l label-width="0px" class="ms-content" v-show="show">
                <el-form-item prop="username">
                    <el-input v-model.number="ruleForm1.username" class='logininput' placeholder="用户名/手机号/邮箱" >
                        <!--<el-button slot="prepend" icon="el-icon-lx-people"></el-button>-->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                	<el-input type="password"  class='logininput' v-model.number="ruleForm1.password" placeholder="密码" >
                        <!--<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>-->
                   </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm1('ruleForm1')">登录</el-button>
                </div>
            </el-form>
            <div class="center-align">
               	<span @click="show=!show">{{show?"验证码登录":"账号登录"}}</span>
            </div>
        </div>
    </div>
</template>

<script>
	import store from '@/store/store'
    export default {
        data: function(){
        	    var checPsd = (rule, value, callback) => {
		        if (value == '') {
		          return callback(new Error('验证码不能为空'));
		        }else {
	        	if (!Number.isInteger(value)) {
	            	callback(new Error('请输入数字值'));
		          }else{
		            callback();
		          }
		        }
		      };
		      var checUs = (rule, value, callback) => {
		        if (value == '') {
		          return callback(new Error('手机号不能为空'));
		        }else {
		        	
	        	if (!Number.isInteger(value)) {
	            	callback(new Error('请输入数字值'));
		          }else if (value.toString().length != 11) {
	            	callback(new Error('请输入十一位手机号'));
		          }else{
		            callback();
		          }
		        }
		      };
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                ruleForm1:{
                	username: '',
                    password: ''
                },
                rules: {
                    username: [
						{ validator: checUs, trigger: 'blur' }
                    ],
                    password: [
                        { validator: checPsd, trigger: 'blur' }
                    ]
                },
                 rules1: {
		          username: [
		            { required: true, message: '请输入账号', trigger: 'blur', }
		          ],
		          password: [
		            { required: true, message: '请输入密码', trigger: 'blur', }
		          ],
		        },
		        show:true,
                sendAuthCode:true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        		auth_time: 0, /*倒计时 计数器*/
        		text:'获取验证码'
            }
        },
        created(){
        	store.commit('del_token');
        	store.commit('set_login', 'buurt');
        },
        
        methods: {
            submitForm(formName) {
            	var that = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                    	var data =that.qs.stringify({
		            		mobile:that.ruleForm.username,
		            		mobile_code:that.ruleForm.password,
			            })
//                  	console.log(valid)
                    	that.$axios.post(that.ports.Login.mobileLogin,data).then(function(res) {
                    		
                    		if(res.data.status==200){
                    			store.commit('set_token', res.data.result.token);
                    			that.$axios({
									method:"get",
									url:that.ports.buurtI.buurt,
									headers:{
										'token':res.data.result.token
									}
								}).then(function(res1) {
				            		if(res1.data.status==200){
				            			localStorage.setItem('buurt_title',res1.data.result.title);
									store.commit('set_login', 'buurt');
			            			that.$router.push('/buurt');
				             		}else{
				             			that.$message.warning(res1.data.message);
				             		}
						        }).catch(function (error) {
//										console.log(error);
										that.$message.error(`失败`);
								})
		             		}else{
		             			that.$message.warning(res.data.message);
		             		}
				        }).catch(function (error) {
//								console.log(error);
								that.$message.error(`失败`);
						})
                        
                    } else {
//                      console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitForm1(formName) {
            	var that = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                    	var data =that.qs.stringify({
		            		username:that.ruleForm1.username,
		            		password:that.ruleForm1.password,
			            })
//                  	console.log(valid)
                    	that.$axios.post(that.ports.Login.login,data).then(function(res) {
                    		if(res.data.status==200){
//                  			console.log(that.store)
                    			store.commit('set_token', res.data.result.token);
								that.$axios({
									method:"get",
									url:that.ports.buurtI.buurt,
									headers:{
										'token':res.data.result.token
									}
								}).then(function(res1) {
				            		if(res1.data.status==200){
				            			localStorage.setItem('buurt_title',res1.data.result.title);
									store.commit('set_login', 'buurt');
			            			that.$router.push('/buurt');
				             		}else{
				             			that.$message.warning(res1.data.message);
				             		}
						        }).catch(function (error) {
//										console.log(error);
										that.$message.error(`失败`);
								})
		             		}else{
		             			that.$message.warning(res.data.message);
		             		}
				        }).catch(function (error) {
//								console.log(error);
								that.$message.error(`失败`);
						})
                        
                    } else {
//                      console.log('error submit!!');
                        return false;
                    }
                });
            },
             getAuthCode:function () {
             	var that =this;
				var data =that.qs.stringify({
            		mobile:that.ruleForm.username,
            		source:'login'
	            })
				
             	this.$axios.post(that.ports.Login.mobile,data).then(function(res) {
             		if(res.data.status==200){
             			that.$message.success(res.data.message);
			        	that.sendAuthCode = false;
			            that.auth_time = 60;
			            var auth_timetimer =  setInterval(()=>{
			                that.auth_time--;
			                if(that.auth_time<=0){
			                    that.sendAuthCode = true;
			                    that.text='重新获取'
			                    clearInterval(auth_timetimer);
			                }
			            }, 1000);
             		}else{
             			that.$message.warning(res.data.message);
             		}
		        	
		        }).catch(function (error) {
						console.log(error);
						that.$message.error(`执行失败`);
				})

	        }
        }
    }
</script>

<style >
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .password{
    	width: 200px;
    }
    .auth_text{
    	float: right;
	    line-height: 32px;
	    height: 32px;
	    background-color: #409EFF;
	    margin-top: 2px;
	    color: white;
	    border-radius: 4px;
	    width: 78px;
	    text-align: center;
    }
    .disabled{
    	background-color: #CCCCCC;
    	color: white;
    }
    .auth_text_blue{
    	cursor: pointer;
    }
    .center-align{
    	text-align: center;
    	color: #409EFF;
    	font-size: 12px;
    }
    .center-align span{
    	cursor: pointer;
    	display: inline-block;
    	padding: 0 10px 10px 10px;
    }
    .color409EFF{
    	color: #409EFF;
    }
    .logininput input{
    	border: none;
    	/*border-bottom: 1px solid #EEEEEE;*/
    	
    }
</style>