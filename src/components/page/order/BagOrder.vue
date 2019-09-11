<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 垃圾袋订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_cate" clearable placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <el-table-column prop="order_id" label="订单ID" width="100" align="center">
                </el-table-column>
                <el-table-column  prop='bag_no' label="垃圾袋编号" align="center">
                </el-table-column>
                <el-table-column prop="order_status" label="订单状态"  align="center">
                </el-table-column>
                <el-table-column prop="order_amount" label="订单金额"  align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间"  align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-lx-attention" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible" width="40%">
            <el-form ref="form"  label-width="100px">
            	<el-form-item label="订单编号">
                    {{form.bag_no}}
                </el-form-item>
                <el-form-item label="订单状态">
                    {{form.order_status_name}}
                </el-form-item>
                <el-form-item label="订单金额">
                    {{form.order_amount}}
                </el-form-item>
                <el-table :data="form.order_detail" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table1">
	                <el-table-column prop="garbage_cate_id" label="垃圾分类ID" sortable width="100" align="center">
	                </el-table-column>
	                <el-table-column  prop='garbage_cate_name' label="名称" align="center">
	                </el-table-column>
	                <el-table-column prop="price" label="单价"  align="center">
	                </el-table-column>
	                <el-table-column prop="weight" label="重量"  align="center">
	                </el-table-column>
	                <el-table-column prop="count" label="数量"  align="center">
	                </el-table-column>
	                <el-table-column prop="amount" label="总额"  align="center">
	                </el-table-column>
	            </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		
    </div>
</template>

<script>
    export default {
        name: 'OnsiteRecycle',
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
                form: {},
                idx: -1,
                tableData1:[],
                excelData:[],
                loading:true,
                sele:[],
                last_page:1,
                url:''
            }
        },
        created() {
            this.getData();
            var that =this;
	        this.$axios.get(that.ports.Home.config).then(function(res) {
		        that.sele = res.data.result.garbage_bag_order_status;
		    })
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
				this.$axios.get(that.ports.garbage.bagOrderIndex+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            search() {
                this.is_search = true;
                this.url="&order_status="+this.select_cate
                this.getData(1,this.url)
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                var that =this
                const item = this.tableData[index];
                this.$axios.get(that.ports.garbage.bagOrderShow+this.tableData[index].order_id).then(function(res) {
		           	if(res.data.status==200){
		           		that.editVisible = true;
		           		that.form = res.data.result;
		           		
		           	}else{
						that.$message.warning(res.data.message);
					}
		        })
                .catch(function (error) {
					console.log(error);
					that.$message.error(`修改第 ${that.idx+1} 行失败`);
				});
                
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that =this;
            	that.editVisible = false;
            },
            
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
