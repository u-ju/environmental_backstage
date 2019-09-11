<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 系统设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加设置</el-button>
				<el-select v-model="source_val" clearable  placeholder="来源" class="handle-select mr10">
                    <el-option
				      v-for="item in setting_source"
				      :key="item.key"
				      :value="item.key"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"   @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="name" label="名称"   align="center">
                </el-table-column>
                <el-table-column prop="title" label="标题"   align="center">
                </el-table-column>
                <!--<el-table-column prop="source" label="来源"   align="center">
                </el-table-column>-->
                <!--<el-table-column prop="attach"  label="附加值"  align="center">
                </el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                <el-form-item label="名称" v-show="idx==-1">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="名称" v-show="idx!=-1">
                    {{form.name}}
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="来源">
                <el-select v-model="form.source" clearable  placeholder="来源" class="handle-select mr10">
                    <el-option
				      v-for="item in setting_source"
				      :key="item.key"
				      :value="item.key"
				      :label="item.name">
				    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="附加值">
                    <el-input  type="textarea" :autosize='{ minRows: 4, maxRows: 20}' v-model="form.attach"></el-input>
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
        name: 'Setting',
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
                status:0,
                form:{
                	name:'',
                	title:"",
                	source:"",
                	attach:""
                },
                ue:'',
                editor:"",
                setting_source:[],
                source_val:'',
                url:'',
                row:{}
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val,this.url);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url="") {
            	var that =this;
				this.$axios.get(that.ports.setting.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
				    that.setting_source = res.data.result.setting_source;
				})
			},
            search() {
                this.url="&source="+this.source_val
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
                this.editVisible = true;
                if(this.idx!=-1){
                	that.$axios.get(that.ports.setting.show+'?name='+row.name)
					.then(function (res) {
						if(res.data.status==200){
							that.form={
			                	title:res.data.result.title,
			                	source:res.data.result.source,
			                	attach:res.data.result.attach,
			                	name:res.data.result.name,
			               }
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
	                	title:'',
	                	source:'',
	                	attach:'',
	                	name:''
	                }	
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data = this.form;
            	var url = that.ports.setting.store;
            	if(that.idx!=-1){
            		url = that.ports.setting.update;
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
                this.row = row;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
//              this.tableData.splice(this.idx, 1);
				var that = this;
				var data =that.qs.stringify({
            		name:that.row.name,
	            })
                that.$axios.post(that.ports.setting.destroy, data)
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
   	.el-table .cell{
   		height: 40px !important;
   	}
</style>
