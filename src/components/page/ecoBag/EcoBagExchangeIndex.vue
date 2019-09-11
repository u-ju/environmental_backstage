<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-goods"></i> 环保袋兑换列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            
            <el-table :data="tableData" border class="table" ref="multipleTable"  id="out-table">
            	<el-table-column prop="order_id" label="订单ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="bag_type_name" label="环保袋类型"   align="center">
                </el-table-column>
                <el-table-column prop="bag_count" label="环保袋数量"   align="center">
                </el-table-column>
                <el-table-column prop="pay_integral" label="支付积分"   align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="订单时间"   align="center">
                </el-table-column>
                
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

        
    </div>
</template>

<script>
	
    export default {
        name: 'EcoBagExchangeIndex',
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
                tableData1:[],
                excelData:[],
                loading:true,
                sele:[],
                last_page:1,
                form:{
                	status:'',
                	status_remark:''
                },
                status:0
                
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
                this.getData(val);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1) {
            	var that =this;
				this.$axios.get(that.ports.ecoBag.exchangeIndex+"?page="+page).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
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
