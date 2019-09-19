<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-recharge"></i> 货款提现</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_status" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-select v-model="select_flow" clearable  placeholder="提现流向" class="handle-select mr10">
                    <el-option
				      v-for="item in flow"
				      :key="item.key"
				      :value="item.key"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="请输入用户ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column  prop='order_id' label="ID" align="center">
                </el-table-column>
            	<el-table-column prop="user_id" label="用户ID"  width="100" align="center">
            		<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column prop="order_no" label="订单编号"   align="center">
                </el-table-column>
                <el-table-column prop="amount" label="提现总额"   align="center">
                </el-table-column>
                <el-table-column prop="fee" label="手续费"   align="center">
                </el-table-column>
                <el-table-column  prop='flow_name' label="来源" align="center">
                	<template slot-scope="scope">
                		<div>{{scope.row.flow_name}}</div>
                		<template v-if="scope.row.flow='bankcard'">
                			<div>{{scope.row.flow_ext.card_no}}</div>
	                		<div>{{scope.row.flow_ext.cardholder}}</div>
	                		<div>{{scope.row.flow_ext.sub_branch}}</div>
                		</template>
                	</template>
                </el-table-column>
                <el-table-column prop="status_name" label="审核状态"  align="center">
                	<template slot-scope="scope">
						<el-tag disable-transitions >{{scope.row.status_name}}</el-tag>
				  	</template>
                </el-table-column>
                <el-table-column  prop='created_at' label="提现时间" align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
            	
                <el-form-item label="审核">
                    <el-select v-model="form.status"   placeholder="请选择">
                    	<el-option
					      v-for="item in sele"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.status_remark"></el-input>
                </el-form-item>
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
        name: 'ChangeList',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_status: '',
                select_word: '',
                select_flow:'',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                idx: -1,
                tableData1:[],
                excelData:[],
                loading:true,
                sele:[],
                last_page:1,
                form:{
                	status:'',
                	status_remark:''
                },
                status:0,
                flow:[],
                url:''
                
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
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.wallet.settleWithdrawIndex+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	for(var i in that.tableData){
		        		that.tableData[i].flow_ext = JSON.parse(that.tableData[i].flow_ext)
		        	}
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            
			getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
//				    that.user_status = res.data.result.user_status;
				    that.sele = res.data.result.withdraw_status;
				    that.flow = res.data.result.withdraw_flow
				    })
			  },
            search() {
//              this.is_search = true;
				this.url="&user_id="+this.select_word+"&flow="+this.select_flow+"&status="+this.select_status
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
                this.status = this.tableData[index].status;
                this.form.status = this.tableData[index].status;
                this.form.status_remark = this.tableData[index].status_remark||'';
                this.editVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data=that.qs.stringify({
            		order_id:that.tableData[that.idx].order_id,
            		status:that.form.status,
            		status_remark:that.form.status_remark,
	            })
            	that.$axios.post(that.ports.wallet.settleWithdrawUpdate, data)
				.then(function (res) {
					console.log(res);
					if(res.data.status==200){
						that.$message.success(`修改第 ${that.idx+1} 行成功`);
						that.getData();
						that.editVisible = false;
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`修改第 ${that.idx+1} 行失败`);
				});
//              this.$set(this.tableData, this.idx, this.form);
                
                
            },
            // 确定删除
            deleteRow(){
//              this.tableData.splice(this.idx, 1);
				var that = this;
				var data =that.qs.stringify({
            		id:that.tableData[that.idx].id,
	            })
                that.$axios.post(that.ports.realname.destroy, data)
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
