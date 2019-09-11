<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-record"></i> 视频管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加视频</el-button>
				<el-select v-model="select_cate" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in video_status"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
               </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="video_id" label="ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="title" label="标题"   align="center">
                </el-table-column>
                <!--<el-table-column prop="content" label="视频" align="center">
				    <template slot-scope="scope">
				      	<video  :src="scope.row.content" controls="controls" :autoplay="false" width="200">
				            	您的浏览器不支持视频播放
				       </video>
				    </template>
				</el-table-column>-->
                
                <el-table-column prop="reply" label="回复"   align="center">
                </el-table-column>
                <el-table-column prop="like" label="点赞"   align="center">
                </el-table-column>
                <el-table-column prop="status_name" label="状态"   align="center">
                </el-table-column>
                <el-table-column prop="cate_name" label="分类"   align="center">
                </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    	<!--<router-link :to="{path:'/Reply',query: {id: scope.row.id}}">
                        	<el-button type="text" icon="el-icon-lx-attention" >查看</el-button>
                        </router-link>-->
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form"  label-width="100px">
            	<el-form-item label="标题">
                	<el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="视频">
					<!--<el-input v-model="form.content"></el-input>-->
				<!--<el-form-item label="添加视频" class="video-upload">-->
                  <el-upload
                    class="avatar-uploader"
                    action="https://wyhb.zgwyhb.com/api/common/upload/video"
                    accept='.mp4,.qlv,.qsv,.ogg,.flv,.avi,.wmv,.rmvb'  
                    :data="paramsdata"                                 
                    :show-file-list="false"
                    :before-upload="beforeUploadVideo"                 
                    :on-success="handleVideoSuccess"                   
                    :on-progress="uploadVideoProcess"
                    :http-request="upLoadvideo"
                    >                 
                    <video
                      v-if="Video !='' && videoFlag == false"
                      :src="Video"
                      width="350"
                      height="180"
                      controls="controls"
                    >您的浏览器不支持视频播放</video>    
                    <i
                      v-else-if="Video =='' && videoFlag == false"
                      class="el-icon-plus avatar-uploader-icon"
                    ></i>           
                    <el-progress
                      v-if="videoFlag == true"
                      type="circle"
                      :percentage="videoUploadPercent"
                      style="margin-top:30px"
                    ></el-progress>    
                  </el-upload>
                <!--</el-form-item>-->
                </el-form-item>
                <el-form-item label="封面">
					<el-upload
					  class="avatar-uploader"
					  action="https://wyhb.zgwyhb.com/api/common/upload/image"
					  :show-file-list="false"
					  :http-request="upLoad"
					  >
					  <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </el-form-item>
	            <el-form-item label="分类id">
                	<el-select v-model="form.cate_id" clearable   placeholder="分类id" class="handle-select mr10">
	                    <el-option
					      v-for="item in video_cate"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
	                </el-select>
                </el-form-item>
                <el-form-item label="状态" v-if="idx!=-1">
                	<el-select v-model="form.status" clearable   placeholder="分类id" class="handle-select mr10">
	                    <el-option
					      v-for="item in video_status"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
	                </el-select>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog name="提示" :visible.sync="delVisible" width="300px">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
	
    export default {
        name: 'videos',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                idx: -1,
                excelData:[],
                loading:true,
                last_page:1,
                video:{},
                status:0,
                video_status:[],
                video_parent_id:[],
                form:{
					title:'',
					content:'',
					status:'',
					cate_id:''
                },
                ue:'',
                editor:"",
                video_status_val:'',
                video_cate:[],
                dialogImageUrl: '',
                url:'',
        		dialogVisible: false,
        		otherdata:{source:"file"},
        		videoFlag:false,      //刚开始的时候显示为flase
		        videoUploadPercent: '0%',  //进度条刚开始的时候为0%
		        paramsdata:{
		            'source': 'file'    //添加其他参数
		        },
		        Video:''
            }
        },
        created() {
            this.getData();
            this.getSele()
        },
        computed: {
            data() {
            	return this.tableData
            }
        },
        methods: {
             handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val,this.url);
            },
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.video.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
				    that.video_status = res.data.result.video_status;
				    that.video_cate = res.data.result.video_cate;
				    
				})
			  },
			  upLoad (file) {
      			const formData = new FormData()
      			var that =this;
		      formData.append('file',file.file)
		      formData.append('image',file.file)
		      formData.append('source','file')
		      this.$axios.post(`/api/common/upload/image`,formData).then(res => res.data)
		      .then(data => {
		      	
		        if(data.status == 200){
		          that.dialogImageUrl=data.result.image_url
		          that.form.thumb = data.result.image_url
		          that.dialogVisible = true;
		        }else{
		        	that.$message.warning(res.data.message);
		        }
		      })
		      .catch(function (error) {
					that.$message.error(`执行失败`);
				});
		    },
			upLoadvideo(file){
				const formData = new FormData()
      			var that =this;
      			console.log(file)
		      formData.append('file',file.file)
		      formData.append('video',file.file)
		      formData.append('source','file')
		      this.$axios.post(this.ports.common.video,formData).then(res => res.data)
		      .then(data => {
		      	
		        if(data.status == 200){
		          that.Video=data.result.video_url
		          that.form.content = data.result.video_url
		          
		          that.videoFlag = false;
		        }else{
		        	that.$message.warning(res.data.message);
		        }
		      })
		      .catch(function (error) {
					that.$message.error(`执行失败`);
				});
			},

			handleRemove(file, fileList) {
				
		    },
		    handlePictureCardPreview(file) {
		        this.dialogImageUrl = file.url;
		        this.dialogVisible = true;
		    },
            search() {
//              this.is_search = true;
				this.url="&status="+this.select_cate
                this.getData(1,this.url)
            },
            beforeUploadVideo(file) {          //视频上传之前判断他的大小
		      const isLt10M = file.size / 1024 / 1024  < 2000;
		      if (!isLt10M) {
		        this.$message.error('上传视频大小不能超过2000MB哦!');
		        return false;
		      }
		    },
		    uploadVideoProcess(event, file, fileList){    //视频上传的时候获取上传进度传给进度条
		      this.videoFlag = true;
		      this.videoUploadPercent = parseInt(file.percentage);
		      console.log(this.videoUploadPercent)
		    },
		    handleVideoSuccess(res, file) {           //视频上传成功之后返回视频地址
		      this.videoFlag = false;
		      this.videoUploadPercent = 0;
		      console.log(res)
		      this.Video = res.data[0];
		    },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
            	var that = this;
                this.idx = index;
                this.editVisible = true;
                if(this.idx!=-1){
                	that.$axios.get(that.ports.video.show+'?video_id='+that.tableData[that.idx].video_id)
					.then(function (res) {
						if(res.data.status==200){
							that.form={
								title:res.data.result.title,
								content:res.data.result.content,
								status:res.data.result.status,
			                	cate_id:res.data.result.cate_id,
			                	thumb:res.data.result.thumb
			               }
							that.dialogImageUrl=res.data.result.thumb
							that.Video=res.data.result.content
						}else{
							that.$message.warning(res.data.message);
						}
					})
					.catch(function (error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
                }else{
                	that.form={
	                	image:'',
						sort:'',
						attach:'',
						status:''
	                }
                	that.Video=''
                	that.dialogImageUrl=''
                }
            },
	        handleRemove(file, fileList) {
		    },
		    handlePictureCardPreview(file) {
		      	console.log(file)
		        this.dialogImageUrl = file.url;
		        this.dialogVisible = true;
		    },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data = this.form;
            	var url = that.ports.video.store;
            	if(that.idx!=-1){
            		data.video_id=that.tableData[that.idx].video_id;
            		url = that.ports.video.update;
            	}
            	data=that.qs.stringify(data)
            	that.$axios.post(url, data)
				.then(function (res) {
					if(res.data.status==200){
						that.getData();
						that.editVisible = false;
						that.$message.success(`操作成功`);
						
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					that.$message.error(`执行失败`);
				});
                
                
            },
             handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
//              this.tableData.splice(this.idx, 1);
				var that = this;
				var data =that.qs.stringify({
            		video_id:that.tableData[that.idx].video_id,
	            })
                that.$axios.post(that.ports.video.destroy, data)
                .then(function (res) {
                	if(res.data.status==200){
                		that.getData();
						that.$message.success('删除成功');
					}else{
						that.$message.warning(res.data.message);
					}
                	
                })
                .catch(function (res) {
                	that.$message.error('删除失败');
                })
                this.delVisible = false;
                
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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .margin_pic{
    	margin-right: 20px !important;
    }
    .v-modal{
    	z-index: 2002 !important;
    }
   	#right_home{
   		width: 100%;
   		height: 456px;
   	}
   	.el-tag--medium{
   		width: 100%;
   		overflow: hidden;
   	}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	.avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	}
	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	}
	/*.avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	}*/
	/*.avatar-uploader{
		line-height: 182px;
	}*/
 	.avatar{
 		height: 100% !important;
 		/*width: 100% !important;
 		position: relative;
 		top: 50%;
 		transform: translate(0,-50%);
 		max-height: 180px;*/
 	}
  
</style>
