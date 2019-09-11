<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 商品管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-form ref="form" label-width="180px">
				<div class="overhidden">
					<el-form-item label="用户id">
						<el-input v-model="form.user_id" class='spu_name'></el-input>
					</el-form-item>
					<el-form-item label="店铺来源">
						<el-select v-model="form.source" placeholder="请选择">
							<el-option v-for="item in shop_source" :key="item.key" :label="item.name" :value="item.key">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="店铺名称">
						<el-input v-model="form.title" class='spu_name'></el-input>
					</el-form-item>
					<el-form-item label="联系方式">
						<el-input v-model="form.contact" class='spu_name'></el-input>
					</el-form-item>
					<el-form-item label="商家优惠百分比">
						<el-input v-model="form.discount_percent" class='spu_name'></el-input>
					</el-form-item>
					<el-form-item label="简介描述">
						<el-input v-model="form.intro" type="textarea" autosize></el-input>
					</el-form-item>
					<el-form-item label="视频">
						<el-upload class="avatar-uploader" action="https://wyhb.zgwyhb.com/api/common/upload/video" accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb' :data="paramsdata" :show-file-list="false" :before-upload="beforeUploadVideo" :on-success="handleVideoSuccess" :on-progress="uploadVideoProcess" :http-request="upLoadvideo">
							<video v-if="Video !='' && videoFlag == false" :src="Video" width="350" height="180" controls="controls">您的浏览器不支持视频播放</video>
							<i v-else-if="Video =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
							<el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px"></el-progress>
						</el-upload>
					</el-form-item>
					<el-form-item label="轮播图">
						<div>
							<div v-if='shop_id' class="piccz" v-for="(src,index) in images" :key='index'>
								<img :src="src.url" />
								<div class="zzc">
									<i class="el-icon-delete" @click="handleRemovexg(src.uid)"></i>
								</div>
							</div>
							<el-upload list-type="picture-card" :file-list="ruleForm" :action="uploadurl" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :http-request="upLoad1" :on-remove="handleRemove1" :multiple='multiple' :limit="9">
								<i class="el-icon-plus"></i>
							</el-upload>
						</div>
					</el-form-item>
					<el-form-item label="简介描述">
						<!--<el-radio-group v-model="form.lp_idcard.type">-->
							<el-radio  v-model="form.lp_idcard.type" label="0">使用实名认证</el-radio>
							<el-radio  v-model="form.lp_idcard.type" label="1">新建</el-radio>
						<!--</el-radio-group>-->
					</el-form-item>
					<template v-if="form.lp_idcard.type==1">
						<el-form-item label="法人证件信息正面">
							<div @click='uploadName("front")'>
								<el-upload :show-file-list="false" :action="uploadurl" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :http-request="upLoad"  :on-remove="handleRemove" >
									<img v-if="front" :src="front" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>

								</el-upload>
							</div>
						</el-form-item>
						<el-form-item label="法人证件信息反面">
							<div @click='uploadName("back")'>
								<el-upload :show-file-list="false" :action="uploadurl" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :http-request="upLoad"  :on-remove="handleRemove" >
									<img v-if="back" :src="back" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
								</el-upload>
							</div>
						</el-form-item>
					</template>
					<el-form-item label="营业执照（积分商家必填）">
						<div @click='uploadName("license")'>
							<el-upload :show-file-list="false" :action="uploadurl" :before-upload="beforeAvatarUpload" :on-exceed="handleExceed" :http-request="upLoad" :on-remove="handleRemove" >
								<img v-if="license" :src="license" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</div>
					</el-form-item>

					<el-form-item label="银行卡信息">
						<el-input v-model="form.bankcard['cardNo']" placeholder='银行卡号码'></el-input>
						<el-input v-model="form.bankcard['cardholder']" placeholder='持卡人姓名'></el-input>
						<el-select v-model="area1" value-key='provId' placeholder="请选择省" @change='provblur'>
							<el-option v-for="item in prov" :key="item.provId" :label="item.provName" :value="item">
							</el-option>
						</el-select>
						<el-select v-model="area2" value-key='cityId' placeholder="请选择市" @change='cityblur'>
							<el-option v-for="item in city" :key="item.cityId" :label="item.cityName" :value="item">
							</el-option>
						</el-select>
						<el-select v-model="area3" value-key='bankId' placeholder="请选择总行" @change='bankblur'>
							<el-option v-for="item in headBank" :key="item.bankId" :label="item.bankName" :value="item">
							</el-option>
						</el-select>
						<el-select v-model="area4" value-key='bankUnionCode' placeholder="请选择支行" @change='branchblur'>
							<el-option v-for="item in branchBank" :key="item.bankUnionCode" :label="item.branchName" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="区域">
						<el-cascader clearable :placeholder="area_name" change-on-select id="cascader" :options="area_" :props="props1" v-model="area_id"></el-cascader>
					</el-form-item>
					<el-form-item label="详细地址">
						<el-input v-model="form.address"></el-input>
					</el-form-item>
					<el-form-item label="经度">
						<el-input v-model="form.longitude"></el-input>
					</el-form-item>
					<el-form-item label="纬度">
						<el-input v-model="form.latitude"></el-input>
					</el-form-item>
					<el-form-item label="商家分类">
						<el-cascader clearable :placeholder="cate_name" change-on-select id="cascader" :options="shop_cate" :props="props2" v-model="cate_id"></el-cascader>
					</el-form-item>
					<el-form-item label="人均消费">
						<el-input v-model="form.cost"></el-input>
					</el-form-item>
					<el-form-item label="营业时间">
						<el-select v-model="business_time" clearable multiple filterable allow-create default-first-option placeholder="输入营业时间，用回车添加">
							<el-option v-for="item in business_timei" :key="item.value" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="店铺特色">
						<el-select v-model="feature" clearable multiple filterable allow-create default-first-option placeholder="输入店铺特色，用回车添加">
							<el-option v-for="item in featurei" :key="item.value" :label="item.value" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<!---->

					<!--<div id="map_canvas" class="allmap"></div>-->
				</div>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<!--<el-button @click="editVisible = false">取 消</el-button>-->
				<el-button type="primary" @click="saveEdit" size="medium" class='saveEdit'>确 定</el-button>
			</div>
			<!--<el-dialog :visible.sync="dialogVisible" v-for="(src,index) in images" :key="index">
				<img width="100%" :src="src" alt="">
			</el-dialog>-->
		</div>
	</div>
</template>

<script>
	import store from '@/store/store'
	export default {
		name: 'Agent',
		data() {
			return {
				loading: false,

				props: {
					value: 'id',
					label: 'name',
					children: 'children'
				},
				form: {
					user_id: '',
					title: '',
					contact: '',
					discount_percent: '',
					intro: '',
					lp_idcard: {
						type: '',
						front: '',
						back: ''
					},
					bankcard: {
						cardNo: '',
						cardholder: '',
						subBank: ''
					},
					address: '',
					cost: '',
					longitude: '',
					latitude: '',
					license: '',
					area_id:'',
					cate_id:'',
					source:''
				},
				ruleForm: [],
				images: [],
				//		       front:[],
				//		       	back:[],
				//		       license:[],
				front: '',
				back: '',
				license: '',
				shop_source: [],
				multiple: true,
				upload_Name: '',
				//video
				otherdata: {
					source: "file"
				},
				videoFlag: false, //刚开始的时候显示为flase
				videoUploadPercent: '0%', //进度条刚开始的时候为0%
				paramsdata: {
					'source': 'file' //添加其他参数
				},
				Video: '',
				props1: {
					value: 'area_id',
					label: 'name',
					children: 'children'
				},
				props2: {
					value: 'id',
					label: 'name',
					children: 'children'
				},
				type:0,
				prov: [],
				city: [],
				headBank: [],
				branchBank: [],
				area1: [],
				area2: [],
				area3: [],
				area4: [],
				area_: [],
				area_id: [],
				shop_source: [],
				shop_cate: [],
				cate_id: [],
				business_time: [],
				feature: [],
				featurei: [{
					value: "WIFI"
				}, {
					value: "空调"
				}, ],
				business_timei: [{
					value: "00:00-00:00"
				}, ],
				shop_id: '',
				area_name: '请选择区域',
				cate_name: '请选择商家分类'
			}
		},
		created() {

			this.uploadurl = this.ports.Base + this.ports.common.imageBatch
			this.getconfigall()
			this.getprov()
			this.getData()
			this.getParams()
		},
		computed: {

		},
		methods: {
			getParams () {
				console.log(this.$route.query.id)
		        if(!this.$route.query.id){
		        	return false
		        }
		        var routerParams = this.$route.query.id
		        // 将数据放在当前组件的数据内
		        this.shop_id = routerParams
		        if(this.id){
		        	this.getData()
		        }
		        
		    },
			getData() {
				if(!this.$route.query.id){
					return
				}
				var that = this;
				this.$axios.get(that.ports.shop.show + "?shop_id=" + this.$route.query.id).then(function(res) {
					that.images = []
					that.featurei = []
					that.business_timei = []
					that.feature = []
					that.business_time = []
					var result = res.data.result
					that.form ={
					user_id: result.user_id,
					title:  result.title,
					contact:  result.contact,
					discount_percent: result.discount_percent,
					intro:  result.intro,
					lp_idcard: {
						type:  result.lp_idcard.type,
						front:  result.lp_idcard.front,
						back:  result.lp_idcard.back
					},
					bankcard: {
						cardNo:  result.bankcard.cardNo,
						cardholder:  result.bankcard.cardholder,
						subBank:  result.bankcard.subBank
					},
					address:  result.address,
					cost:  result.cost,
					longitude:  result.longitude,
					latitude:  result.latitude,
					license:  result.license,
					area_id:result.area_id,
					cate_id:result.cate_id,
					source:result.source
				}
					for(var b in res.data.result['images']) {
						that.images.push({
							name: 'img',
							url: res.data.result['images'][b],
							uid: b
						})
					}
					that.license = res.data.result.license
					that.front = res.data.result.lp_idcard['front']
					that.back = res.data.result.lp_idcard['back']
					that.type = res.data.result.lp_idcard['type']
					that.Video = res.data.result.video
					that.area_name = res.data.result.area_name
					that.cate_name = res.data.result.cate_name
					that.area_id = [res.data.result.area_id]
					that.cate_id = [res.data.result.cate_id]
					if(result.bankcard.subBank.length==4){
						that.area1 = result.bankcard.subBank[0]
						that.area2 = result.bankcard.subBank[1]
						that.area3 = result.bankcard.subBank[2]
						that.area4 = result.bankcard.subBank[3]
						that.getcity()
						that.getheadBank()
						that.getbranchBank()
					}
					
					
					for(var i in res.data.result.business_time) {
						that.business_timei.push({
							value: res.data.result.business_time[i].start + "-" + res.data.result.business_time[i].end
						})
						that.business_time.push(res.data.result.business_time[i].start + "-" + res.data.result.business_time[i].end)
					}
					for(var j in res.data.result.feature) {
						that.featurei.push({
							value: res.data.result.feature[j]
						})
						that.feature.push(res.data.result.feature[j])
					}
					console.log(that.form.lp_idcard)
					//					that.images= res.data.result.images
					//					console.log(that.images)
				})
			},
			uploadName(name) {
				console.log(name)
				this.upload_Name = name
			},
			getarea() {
				var that = this;
				this.$axios.get(that.ports.area.index).then(function(res) {
					that.area_ = res.data.result.list;
				})
			},
			getconfigall() {
				var that = this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
					that.shop_source = res.data.result.shop_source;
					that.shop_cate = res.data.result.shop_cate;
				})
			},
			getprov() {
				var that = this;
				this.$axios.get(that.ports.huifu.provIndex).then(function(res) {
					that.prov = res.data.result.list;
					that.city = []
					that.headBank = []
					that.branchBank = []
				})
			},
			getcity() {
				var that = this;
				this.$axios.get(that.ports.huifu.cityIndex, {
					params: {
						provId: that.area1.provId
					}
				}).then(function(res) {
					that.city = res.data.result.list;
					that.headBank = []
					that.branchBank = []
				})
			},
			getheadBank() {
				var that = this;
				this.$axios.get(that.ports.huifu.headBankIndex, {
					params: {
						provId: that.area1.provId,
						cityId: that.area2.cityId
					}
				}).then(function(res) {
					that.headBank = res.data.result.list
					that.branchBank = []
				})
			},
			getbranchBank() {
				var that = this;
				this.$axios.get(that.ports.huifu.branchBankIndex, {
					params: {
						provId: that.area1.provId,
						cityId: that.area2.cityId,
						bankId: that.area3.bankId,
					}
				}).then(function(res) {
					that.branchBank = res.data.result.list
				})
			},
			provblur(e) {
				console.log(e)
				this.getcity()
			},
			cityblur(e) {
				this.getheadBank()
			},
			bankblur(e) {
				this.getbranchBank()
			},
			branchblur(e) {

			},
			deleter(i) {
				console.log(i);
				console.log(this.wl);
				this.delVisible = true
				this.deletenum = i
			},

			handlePictureCardPreview(file) {
				console.log(file)
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
			dqian(e) {
				this.dqsz = e
			},

			handlePictureCardPreview() {

			},
			textareablur() {
				var that = this
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
				const formData = new FormData()
				var that = this;
				formData.append('file', file.file)
				formData.append('image', file.file)
				formData.append('source', 'file')
				this.$axios.post(this.ports.common.upload, formData).then(res => res.data)
					.then(data => {
						if(data.status == 200) {
//							that.form[that.upload_Name] = data.result.image_url
							that[that.upload_Name] = data.result.image_url
							console.log(that.form[that.upload_Name],"-----------------------------",that.upload_Name)
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

			upLoadvideo(file) {
				const formData = new FormData()
				var that = this;
				console.log(file)
				formData.append('file', file.file)
				formData.append('video', file.file)
				formData.append('source', 'file')
				this.$axios.post(this.ports.common.video, formData).then(res => res.data)
					.then(data => {

						if(data.status == 200) {
							that.Video = data.result.video_url
							that.form.content = data.result.video_url

							that.videoFlag = false;
						} else {
							that.$message.warning(res.data.message);
						}
					})
					.catch(function(error) {
						that.$message.error(`执行失败`);
					});
			},
			beforeUploadVideo(file) { //视频上传之前判断他的大小
				const isLt10M = file.size / 1024 / 1024 < 2000;
				if(!isLt10M) {
					this.$message.error('上传视频大小不能超过2000MB哦!');
					return false;
				}
			},
			uploadVideoProcess(event, file, fileList) { //视频上传的时候获取上传进度传给进度条
				this.videoFlag = true;
				this.videoUploadPercent = parseInt(file.percentage);
				console.log(this.videoUploadPercent)
			},
			handleVideoSuccess(res, file) { //视频上传成功之后返回视频地址
				this.videoFlag = false;
				this.videoUploadPercent = 0;
				console.log(res)
				this.Video = res.data[0];
			},
			//      	上传限制格式与大小（png,jpg,gif,jpeg），与2M，这边代码没有优化，自行解决
			beforeAvatarUpload(file) {
				console.log(file)
				var formData = {
					'file': file,
					'image': file,
					'source': 'file'
				}
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

				this.ruleForm.push({
					name: 'img',
					url: response.image_url,
					uid: uid
				})
				console.log(this.ruleForm)
				//			        this.$message.success('上传成功！')
			},
			handleRemovexg(uid){
				for(var j in this.images) {

					if(this.images[j].uid == uid) {
						this.images.splice(j, 1);
					}

				}
			},
			handleRemove1(file, fileList) {
				for(var j in this.ruleForm) {

					if(this.ruleForm[j].uid == file.uid) {
						this.ruleForm.splice(j, 1);
					}

				}

			},
			
			handleRemove(file, fileList) {
				this.form[this.upload_Name] = []
			},
			saveEdit() {
				this.disabledd = true
				var that = this;
				var data = this.form
				console.log(this.ruleForm,this.images)
				for(var a in this.images){
					data["images[" +  a + "]"] = this.images[a].url
				}
				for(var i in this.ruleForm) {
					console.log(i-0+this.images.length)
					data["images[" + (i-0+this.images.length) + "]"]  = this.ruleForm[i].url
				}
				
				data.lp_idcard.front = this.front
				data.lp_idcard.back = this.back
				data.license = this.license
				data.area_id = this.area_id[this.area_id.length - 1]
				data.cate_id = this.cate_id[this.cate_id.length - 1]
				data.feature = this.feature
				for(var j in this.business_time) {
					data['business_time[' + j + '][start]'] = this.business_time[j].split('-')[0]
					data['business_time[' + j + '][end]'] = this.business_time[j].split('-')[0]
				}
				data.bankcard.subBank = JSON.stringify([this.area1, this.area2, this.area3, this.area4])
				data.video= that.Video
				
				var url = that.ports.shop.store;
				if(this.shop_id){
					data.shop_id=this.shop_id
					url = that.ports.shop.update;
				}
				data = that.qs.stringify(data)
				that.$axios.post(url, data)
					.then(function(res) {
						that.disabledd = false
						if(res.data.status == 200) {
							
							that.$message.success(`操作成功`);
//							that.backc()

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
			backc() {
				if(window.history.length <= 1) {
					this.$router.push({
						path: '/'
					})
					return false
				} else {
					this.$router.go(-1)
				}
			},

			drawMap() {
				var that = this;
				this.map = new BMap.Map("map_canvas"); // 创建地图实例
				this.map.addControl(new BMap.NavigationControl()); // 启用放大缩小 尺
				this.map.enableScrollWheelZoom();
				//this.getlocation();//获取当前坐标, 测试时获取定位不准。
				var point = new BMap.Point(that.userlocation.lng, that.userlocation.lat); // 创建点坐标 

				this.map.centerAndZoom(point, 18); // 初始化地图，设置中心点坐标和地图级别 
				var marker = new BMap.Marker(point); // 创建标注   
				this.map.addOverlay(marker); // 将标注添加到地图中
				this.map.addEventListener("click", function(e) {
					that.userlocation = e.point;
					that.map.clearOverlays();
					that.getMarker(e.point)
				})
				var ac = new BMap.Autocomplete({
					//建立一个自动完成的对象
					input: "suggestId",
					location: this.map
				});
				//      var myValue;
				//    ac.addEventListener("onconfirm", (e)=> {
				//      //鼠标点击下拉列表后的事件
				//      var _value = e.item.value;
				//      myValue =_value.province +_value.city +_value.district +_value.street +_value.business;
				//      this.address_detail = myValue;
				//      this.setPlace();
				//    });
			},
			inputFunc(e) {
				if(this.userlocation.lng && this.userlocation.lat) {
					this.map.clearOverlays(); //清除地图上所有覆盖物
					this.getMarker(this.userlocation)
				}

			},
			getMarker(point) {
				this.mk = new BMap.Marker(point);
				//      this.mk.addEventListener("dragend", this.showInfo);
				//      this.mk.enableDragging();    //可拖拽
				this.getAddress(point);
				this.map.addOverlay(this.mk); //把点添加到地图上 
				this.map.panTo(point);
			},
			getlocation() {
				//获取当前位置
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition((r) => {
					if(geolocation.getStatus() == BMAP_STATUS_SUCCESS) {
						this.getMarker(r.point);
						this.userlocation = r.point;
					} else {
						alert('failed' + this.getStatus());
					}
				});
			},
			//绑定Marker的拖拽事件
			showInfo(e) {
				var gc = new BMap.Geocoder();
				gc.getLocation(e.point, (rs) => {
					var addComp = rs.addressComponents;
					var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber; //获取地址

					//画图 ---》显示地址信息
					var label = new BMap.Label(address, {
						offset: new BMap.Size(20, -10)
					});
					this.map.removeOverlay(this.mk.getLabel()); //删除之前的label

					this.mk.setLabel(label);
					this.address_detail = address;
					this.userlocation = e.point;

				});
			},
			//获取地址信息，设置地址label
			getAddress(point) {
				var gc = new BMap.Geocoder();
				gc.getLocation(point, (rs) => {
					var addComp = rs.addressComponents;
					var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber; //获取地址

					//画图 ---》显示地址信息
					var label = new BMap.Label(address, {
						offset: new BMap.Size(20, -10)
					});
					this.map.removeOverlay(this.mk.getLabel()); //删除之前的label
					this.address_detail = address;
					this.mk.setLabel(label);

				});

			},
			setPlace() {
				this.map.clearOverlays(); //清除地图上所有覆盖物
				var th = this

				function myFun() {
					th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
					th.map.centerAndZoom(th.userlocation, 18);
					th.getMarker(th.userlocation);
				}

				var local = new BMap.LocalSearch(this.map, {
					onSearchComplete: myFun //智能搜索
				});
				local.search(this.address_detail);
			},
			search() {
				var localSearch = new BMap.LocalSearch(this.map);
				localSearch.enableAutoViewport(); //允许自动调节窗体大小
				this.searchByInputName(localSearch);
			},
			searchByInputName(localSearch) {
				this.map.clearOverlays(); //清空原来的标注
				var th = this;
				var keyword = this.address_detail;
				localSearch.setSearchCompleteCallback(function(searchResult) {
					var poi = searchResult.getPoi(0);
					th.userlocation = poi.point;
					th.map.centerAndZoom(poi.point, 13);
					th.getMarker(th.userlocation);
				});
				localSearch.search(keyword);
			},
		},
		watch: {
		'$route': ['getParams','getconfigall','getData','getprov']
	    }
	}
</script>

<style scoped>
	.piccz {
		display: inline-block;
		width: 148px;
		height: 148px;
		margin: 0 8px 8px 0;
		position: relative;
		border: 1px solid #c0ccda;
		border-radius: 6px;
		overflow: hidden;
	}
	
	.piccz img {
		width: 148px;
		line-height: 160px;
		position: absolute;
		top: 50%;
		transform: translate(0, -50%);
	}
	
	img.avatar {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	
	.piccz .zzc {
		display: inline-block;
		position: absolute;
		width: 148px;
		height: 148px;
		line-height: 148px;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .2);
		opacity: 0;
	}
	
	.piccz .zzc .el-icon-delete {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		color: white;
	}
	
	.piccz .zzc:hover {
		opacity: 1;
	}
</style>