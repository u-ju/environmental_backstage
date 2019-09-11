<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-recharge"></i> 积分记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData"  class="table center" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <el-table-column  prop='record_id' label="ID" align="center">
                </el-table-column>
                <el-table-column prop="user_id" label="用户ID"  width="100" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column  prop='value' label="值" align="center">
                </el-table-column>
                
                <el-table-column prop="remain" label="余额"  align="center">
                </el-table-column>
                <el-table-column  prop='intro' label="简介" align="center">
                	<template slot-scope="scope">
				        <el-popover trigger="hover" placement="top">
				          <p>介绍: {{ scope.row.intro }}</p>
				          <div slot="reference" class="name-wrapper">
				            <el-tag size="medium">{{ scope.row.intro }}</el-tag>
				          </div>
				        </el-popover>
				      </template>
                </el-table-column>
				<el-table-column  prop='created_at' label="时间"  align="center">
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
        name: 'Integral',
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
                tagsList:'',
                last_page:1
            }
        },
        created() {
            this.getData();
	        this.getParams()
        },
        computed: {
            data() {
            	return this.tableData

            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
            	console.log(val)
                this.cur_page = val;
                this.getData(val,this.url);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
            	if(this.$route.query.id){
            		url="&user_id="+this.$route.query.id;
            		this.url="&user_id="+this.$route.query.id
            	}
				this.$axios.get(that.ports.wallet.integralIndex+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		        })

                 
            },
            getParams () {
            	
		        if(!this.$route.query.id){
		        	return this.select_word =''
		        }
		        var routerParams = this.$route.query.id
		        this.id = this.$route.query.id;
		        this.select_word = this.$route.query.id
		    },
            search() {
//              this.is_search = true;
				this.url="&user_id="+this.select_word
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
                console.log(row)
                var that =this
                var item = this.tableData[index].user_id;
                console.log(item)

            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            
           
        },
        watch: {
	    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
	    
	    '$route': ['getData','getParams']
	    
	      
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
