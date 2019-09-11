<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 加盟商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                
                <router-link to="/GoodsAddOffline">
                	<el-button type="primary" icon="el-icon-circle-plus-outline" >添加商品</el-button>
				</router-link>
                <el-select v-model="spu_status" clearable  placeholder="请选择">
                	<el-option
				      v-for="item in goods_spu_status"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData"  class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column  type="expand" prop="skus">
				  	<template slot-scope="scope" >
					   <el-table  class="table1" style="width: 100%"  :data="scope.row.skus" >
					      	<el-table-column prop="sku_name" label="名称" sortable align="center">
					         <template slot-scope="scope">
				               <span>{{scope.row.sku_name}}</span>
				             </template>
					      	</el-table-column>
					      	<el-table-column prop="thumb" label="图片" sortable align="center">
					         	<template slot-scope="scope">
					         		<img  :src="scope.row.thumb" alt="" style="width: 50px;">
					         	</template>
					      	</el-table-column>
					   		<el-table-column prop="price" label="价格"  align="center">
					         
					      	</el-table-column>
					      	<el-table-column prop="stock" label="库存"  align="center">
					      	</el-table-column>
					      	<el-table-column prop="sales" label="售出"  align="center">
					      	</el-table-column>
					      	<el-table-column prop="status_name" label="状态"  align="center">
					      	</el-table-column>
					      	<!--<el-table-column label="操作" width="180" align="center">
				                <template slot-scope="scope">
				                	
				                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				                </template>
				            </el-table-column>-->
					    </el-table>
					    
					</template>
				</el-table-column>
                <el-table-column prop="spu_name" label="名称"  align="center" >
				</el-table-column>
				<el-table-column prop="created_at" label="上架时间"  align="center" >
				</el-table-column>
				<el-table-column prop="status_name" label="状态"  align="center" >
				</el-table-column>
                <el-table-column label="操作" width="320" align="center">
                    <template slot-scope="scope">
                    	<router-link :to="{path:'/GoodskuEdit',query: {id: scope.row.spu_id}}">
                            <el-button type="text" icon="el-icon-edit" >商品详情编辑</el-button>
                        </router-link>
                        <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form"  label-width="100px">
                <el-form-item label="商品名称">
                    <el-input v-model="form.spu_name" ></el-input>
                </el-form-item>
                <el-form-item label="详情图片">
                    
					<el-upload
					  class="avatar-uploader avatar-uploader1"
					  :action="uploadurl"
					  :show-file-list="false"
					  :http-request="upLoad"
					  >
					  <img v-if="form.spu_intro" :src="form.spu_intro" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择">
                    	<el-option
					      v-for="item in goods_spu_status"
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
	
    export default {
        name: 'Goodsonline',
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
                loading:true,
                last_page:1,
                form:{
                	spu_id:'',
                	spu_name:'',
                	status:'',
                	spu_intro:''
                },
                status:0,
                amount:'',
                earn:'',
		        url:"",
		        Sele:'',
		        goods_spu_status:[],
		        spu_status:'',
		        uploadurl:''
            }
        },
        created() {
            this.getData();
            this.getSele();
        	this.upload = this.ports.common.upload
        	this.uploadurl = this.ports.Base+this.ports.common.imageBatch
        },
        computed: {
            data() {
            	return this.tableData

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
				this.$axios.get(that.ports.goods.index+"?page="+page+'&source=online'+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       	}) 
            },
            getSele(){
            	var that = this;
            	this.$axios.get(that.ports.Home.config).then(function(res) {
			        that.goods_spu_status = res.data.result.goods_spu_status;
			    })
            },
//			change(e){
//			  	for(var key in this.goods_level){
//			  		if(this.goods_level[key].id==e){
//			  			this.amount=this.goods_level[key].amount
//			  			this.earn_rate=this.goods_level[key].earn_rate
//			  		}
//			  	}
//			},
			search(e){
				this.url="&status="+this.spu_status
				this.getData(1,this.url)
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
                this.form.spu_id= this.tableData[index].spu_id;

				this.$axios.get(that.ports.goods.show+"?spu_id="+this.tableData[index].spu_id).then(function(res) {
		        	that.form.spu_name= res.data.result.spu_name;
	                that.form.status= res.data.result.status;
	                that.form.spu_intro= res.data.result.spu_intro;
	                that.editVisible = true;
		        	
		       	}) 
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data = this.form;
            	var url = that.ports.goods.update;
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
            		'spu_id[0]':that.tableData[that.idx].spu_id,
	            })
                that.$axios.post(that.ports.goods.destroy, data)
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
			          that.form.spu_intro = data.result.image_url
			        }else{
			        	that.$message.warning(res.data.message);
			        }
		      })
		      .catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
		    },
        },
        watch: {
	    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
	    '$route': ['getSele','getData']
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
    .avatar-uploader1 i{
  	font-size: 28px;
  	line-height: 180px;
  }
  img.avatar{
  	height: 100%;
  }
</style>
