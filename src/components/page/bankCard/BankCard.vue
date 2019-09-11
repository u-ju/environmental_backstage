<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 代理管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="form.user_id" placeholder="用户ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column  prop='card_id' label="ID" align="center">
                </el-table-column>
                <el-table-column prop="user_id" label="用户ID"   align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column prop="realname" label="用户名"  width="100" align="center">
                </el-table-column>
                <el-table-column prop="card_no" label="卡号"   align="center">
                </el-table-column>
                
                <el-table-column prop="card_type_name" label="银行卡类型"   align="center">
                </el-table-column>
                <el-table-column prop="bank_name" label="银行名称"   align="center">
                </el-table-column>
                <el-table-column prop="bank_ad" label="银行名称"   align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间"   align="center">
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
        name: 'BankCard',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_word: '',
                del_list: [],
                is_search: false,
                delVisible: false,
                idx: -1,
                loading:true,
                last_page:1,
                form:{
                	user_id:'',
                },
                
            }
        },
        created() {
            this.getData();
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
				this.$axios.get(that.ports.bankCard.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
			search(e){
				this.url="&user_id="+this.form.user_id
				this.getData(1,this.url)
			},
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定删除
            deleteRow(){
				var that = this;
				var data =that.qs.stringify({
            		card_id:that.tableData[that.idx].card_id,
	           })
                that.$axios.post(that.ports.bankCard.destroy, data)
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
   .area_border{
  	display: inline-block;
  	border: 1px solid #dcdfe6;
  	    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    outline: 0;
    padding: 0 15px;
  }
  .el-input__inner{
  	width: 216px !important;
  }
</style>
