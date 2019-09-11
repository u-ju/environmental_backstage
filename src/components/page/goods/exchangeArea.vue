<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 兑换区域管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加兑换区域</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <el-table-column  prop='id' label="ID" align="center">
                </el-table-column>
                <el-table-column  prop='area_id' label="区域ID" align="center">
                </el-table-column>
                <el-table-column  prop='area_name' label="区域名称" align="center">
                </el-table-column>
                <el-table-column  prop='created_at' label="创建时间" align="center">
                </el-table-column>
                 <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
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
        <el-dialog title="添加区域" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
            	<el-form-item label="区域选择" >
                	<el-cascader 
                    	clearable
                    	placeholder="请选择区域"
                    	 change-on-select
                    	id="cascader"
					  :options="area"
		      		  :props="props"
		      		   v-model="sel_area"
		      		   
					></el-cascader>
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
        name: 'exchangeArea',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                tableData1:[],
                loading:true,
                last_page:1,
                url:'',
                area:[],
                res:{},
                sel_area:[],
                props: {
				  value: 'area_id',
		          label:'name',
		          children: 'children'
		        },
		        form:{}
            }
        },
        created() {
            this.getData();
	        this.getarea()
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
				this.$axios.get(that.ports.exchangeArea.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            getarea(){
				var that =this;
				this.$axios.get(that.ports.area.index).then(function(res) {
		        	that.area = res.data.result.list;
		       }) 
		    },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            
            handleDelete(index, row) {
                this.idx = row.id;
                this.delVisible = true;
            },
            handleEdit(index, row) {
                this.editVisible = true;
                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that =this;
            	var data= {area_id:this.sel_area[this.sel_area.length-1]}
            	that.$axios.post(that.ports.exchangeArea.store, data)
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
					that.$message.error(`修改失败`);
				});
            },
            // 确定删除
            deleteRow(){
				var that = this;
				var data =that.qs.stringify({
            		'id[0]':that.idx,
	            })
                that.$axios.post(that.ports.exchangeArea.destroy, data)
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
   
</style>
