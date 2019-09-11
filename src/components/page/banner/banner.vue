<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-pic"></i> banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加banner</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="id" label="ID" sortable width="100" align="center">
               </el-table-column>
                <el-table-column prop="image" label="缩略图" align="center">
				    <template slot-scope="scope">
				      <img  :src="scope.row.image" alt="" style="width: 200px;">
				    </template>
				</el-table-column>
                
                <el-table-column prop="sort" label="排序"   align="center">
                </el-table-column>
                <el-table-column prop="attach"  label="附加信息"   align="center">
                </el-table-column>
                <el-table-column prop="status_name" label="是否显示"   align="center">
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
            <!--<div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>-->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form"  label-width="100px">
                <el-form-item label="图片">
					<el-upload
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :http-request="upLoad"
					  >
					  <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </el-form-item>
                <el-form-item label="排序">
                	<el-input v-model="form.sort"></el-input>
                </el-form-item>
	            <el-form-item label="附加信息">
                	<el-input  type="textarea" autosize v-model="form.attach"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" v-if="idx!=-1">
                	<el-tooltip :content="form.status==1?'显示':'隐藏'" placement="top">
					  <el-switch
					    v-model="form.status"
					    active-color="#13ce66"
					    inactive-color="#ff4949"
					    active-value="1"
					    inactive-value="0">
					  </el-switch>
					</el-tooltip>
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
        name: 'banner',
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
                banner:{},
                status:0,
                banner_status:[],
                banner_parent_id:[],
                form:{
//              	name:"",
//              	parent_id:"",
//              	price:"",
//              	intro:'',
//              	image:''
					image:'',
					sort:'',
					attach:'',
					status:''
                },
                ue:'',
                editor:"",
                banner_status_val:'',
                banner_cate:[],
                dialogImageUrl: '',
        		dialogVisible: false,
        		otherdata:{source:"file"},
        		upload:''
            }
        },
        created() {
            this.getData();
            this.getSele()
            this.upload = this.ports.common.upload
        },
        computed: {
            data() {
            	return this.tableData
            }
        },
        methods: {
            
            getData(page=1) {
            	var that =this;
				this.$axios.get(that.ports.banner.index+"?page="+page).then(function(res) {
		        	that.tableData = res.data.result.list;
		            that.loading = false
		       }) 
            },
            getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
				    that.banner_status = res.data.result.banner_status;
				})
			  },
			   upLoad (file) {
			   	console.log(file)
      			const formData = new FormData()
      			var that =this;
		      formData.append('file',file.file)
		      formData.append('image',file.file)
		      formData.append('source','file')
		      this.$axios.post(that.ports.common.upload,formData).then(res => res.data)
		      .then(data => {
		        if(data.status == 200){
		          that.dialogImageUrl=data.result.image_url
		          that.form.image = data.result.image_url
		          that.dialogVisible = true;
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
                this.is_search = true;
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
                	that.$axios.get(that.ports.banner.show+'?id='+that.tableData[that.idx].id)
					.then(function (res) {
						if(res.data.status==200){
							that.form={
								sort:res.data.result.sort,
								attach:res.data.result.attach,
								status:res.data.result.status,
			                	image:res.data.result.image,
			                }
							
			                that.dialogImageUrl=res.data.result.image,

							that.banner_status_val=res.data.result.status
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
            	var url = that.ports.banner.store;
            	if(that.idx!=-1){
            		data.id=that.tableData[that.idx].id;
            		url = that.ports.banner.update;
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
            		id:that.tableData[that.idx].id,
	            })
                that.$axios.post(that.ports.banner.destroy, data)
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
 		height: auto !important;
 		width: 100% !important;
 		position: relative;
 		top: 50%;
 		transform: translate(0,-50%);
 		max-height: 180px;
 	}
  
</style>
