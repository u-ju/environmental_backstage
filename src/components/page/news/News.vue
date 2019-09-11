<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 新闻中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加新闻</el-button>
				<el-select v-model="content_source_val" clearable   placeholder="内容来源" class="handle-select mr10">
                    <el-option
				      v-for="item in news_content_source"
				      :key="item.key"
				      :value="item.key"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-select v-model="status_val" clearable   placeholder="状态" class="handle-select mr10">
                    <el-option
				      v-for="item in news_status"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="news_id" label="ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="title" label="标题"   align="center">
                </el-table-column>
                <!--<el-table-column prop="" label="图片"   align="center">
                </el-table-column>-->
                <el-table-column prop="thumb" label="图片" align="center">
				    <template slot-scope="scope">
				      <img  :src="scope.row.thumb" alt="" style="width: 50px;">
				    </template>
				</el-table-column>
                <el-table-column prop="intro" label="简介"   align="center" max-width='300'>
                	<template slot-scope="scope">
			        <el-popover trigger="hover" placement="top">
			          <p>{{ scope.row.intro }}</p>
			          <div slot="reference" class="name-wrapper">
			            <el-tag size="medium">{{ scope.row.intro }}</el-tag>
			          </div>
			        </el-popover>
			      </template>
                </el-table-column>
                <el-table-column prop="cate_name" label="分类"   align="center">
                </el-table-column>
                <el-table-column prop="content_source_name" label="来源"   align="center">
                </el-table-column>
                <el-table-column prop="view" label="浏览量"   align="center">
                </el-table-column>
                <el-table-column prop="like" label="点赞"   align="center">
                </el-table-column>
                <el-table-column prop="reply" label="回复"   align="center">
                </el-table-column>
                <el-table-column prop="status_name" label="状态"   align="center">
                </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    	<router-link :to="{path:'/Reply',query: {id: scope.row.news_id}}">
                        	<el-button type="text" icon="el-icon-lx-attention" >查看评论</el-button>
                        </router-link>
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
        <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="1200px">
            <el-form ref="form"  label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="form.title"  class='right_input'></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <!--<el-upload
					  action="https://jsonplaceholder.typicode.com/posts/"
					  list-type="picture-card"
					  :on-preview="handlePictureCardPreview"
					  :http-request="upLoad"
   						:show-file-list="false"
   						:limit="1"
					  :on-remove="handleRemove">
					  <i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
					  <img width="148" :src="dialogImageUrl" alt="" >
					</el-dialog>-->
					<el-upload
					  class="avatar-uploader"
					  :action="uploadurl"
					  :show-file-list="false"
					  :http-request="upLoad"
					  >
					  <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </el-form-item>
	            <el-form-item label="简介">
                    <el-input v-model="form.intro"  class='right_input'></el-input>
                </el-form-item>
	            <el-form-item label="类型" >
                    <el-select v-model="form.cate_id"   placeholder="请选择">
                    	<el-option
					      v-for="item in news_cate"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源">
                    <el-select v-model="form.content_source"   placeholder="请选择">
                    	<el-option
					      v-for="item in news_content_source"
					      :key="item.key"
					      :value="item.key"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" v-if="form.content_source=='html'" >
                    <iframe frameborder="0" ref="iframe" name="right_home" id="right_home" :src="http" @load="vueFunc" ></iframe>
                </el-form-item>
                <el-form-item label="内容" v-else>
                	<el-input  type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="状态" v-if="idx!=-1">
                    <el-select v-model="news_status_val"   placeholder="请选择">
                    	<el-option
					      v-for="item in news_status"
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
        name: 'News',
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
                news:{},
                status:0,
                news_status:[],
                news_content_source:[],
                form:{
                	title:"",
                	content_source:"",
                	content:"",
                	cate_id:'',
                	intro:'',
                	thumb:''
                },
                ue:'',
                editor:"",
                news_status_val:'',
                news_cate:[],
                 dialogImageUrl: '',
        		dialogVisible: false,
        		otherdata:{source:"file"},
                status_val:'',
                content_source_val:'',
                url:'',
                http1:store.state.http+'/ueditor',
                test:store.state.http,
                uploadurl:''
            }
        },
        created() {
            this.getData();
            this.getSele()
            this.uploadurl = this.ports.Base+this.ports.common.imageBatch
        },
        computed: {
            data() {
            	return this.tableData
            },
            http(){
            	return this.http1+"?token="+store.state.token
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val,this.url);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.news.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
				    that.news_status = res.data.result.news_status;
				    that.news_content_source = res.data.result.news_content_source;
				    that.news_cate = res.data.result.news_cate;
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
		      	
		        console.log(data)
		        if(data.status == 200){
		          that.dialogImageUrl=data.result.image_url
		          that.form.thumb = data.result.image_url
		          that.dialogVisible = true;
		        }else{
		        	that.$message.warning(res.data.message);
		        }
		      })
		      .catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
		    },
			 handleRemove(file, fileList) {
		        console.log(file, fileList);
		      },
		      handlePictureCardPreview(file) {
		      	console.log(file)
		        this.dialogImageUrl = file.url;
		        this.dialogVisible = true;
		      },
            search() {
//              this.is_search = true;
				this.url="&content_source="+this.content_source_val+"&status="+this.status_val
				this.getData(1,this.url)
            },
            vueFunc(){
            	var that =this;
            	
            	window.addEventListener('message', function (e) {
            	 	if(e.origin.indexOf(that.test)!=-1&&e.data.source=="ueditor"){
            	 		that.form.content = e.data.content
            	 	}
            	})
				that.setVisiblity(that.form.content)
            },
            setVisiblity(con=''){ 
            	if(document.readyState=="complete") {
            		if(!this.$refs.iframe){
            			return false
            		}
            		this.$refs.iframe.contentWindow.postMessage({
            			source: 'ueditor',
            			content: con,
            		}, '*')
            	} else {
            		setTimeout("setVisiblity("+con+")",1000)
            	};
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
                	that.$axios.get(that.ports.news.show+'?news_id='+that.tableData[that.idx].news_id)
					.then(function (res) {
						if(res.data.status==200){
//							that.news = res.data.result;
							that.form={
			                	title:res.data.result.title,
			                	content_source:res.data.result.content_source,
			                	content:res.data.result.content,
			                	cate_id:res.data.result.cate_id,
			                	intro:res.data.result.intro,
			                	thumb:res.data.result.thumb,
			                }
			                that.dialogImageUrl=res.data.result.thumb
							that.news_status_val=res.data.result.status
							that.setVisiblity(that.form.content)
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
                	title:"",
                	content_source:"",
                	content:"",
                	cate_id:'',
                	intro:'',
                	thumb:''
                }
                	that.dialogImageUrl=''
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data = this.form;
            	var url = that.ports.news.store;
            	if(that.idx!=-1){
            		data.news_id=that.tableData[that.idx].news_id;
            		data.status = that.news_status_val
            		url = that.ports.news.update;
            	}
            	data=that.qs.stringify(data)
            	
            	that.$axios.post(url, data)
				.then(function (res) {
					console.log(res);
					if(res.data.status==200){
						that.getData();
						that.editVisible = false;
						that.$message.success(`操作成功`);
						
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
//              this.$set(this.tableData, this.idx, this.form);
                
                
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
            		news_id:that.tableData[that.idx].news_id,
	            })
                that.$axios.post(that.ports.news.destroy, data)
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  ..el-upload--text{
  	display: flex !important;
  	justify-content: center;
  }
</style>
