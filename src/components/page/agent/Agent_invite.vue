<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-recharge"></i> 推荐用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                
                <el-input v-model="share_user_id" placeholder="请输入用户ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData"  class="table center" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="user_id" label="用户ID" sortable width="100" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column  prop='nickname' label="昵称" align="center">
                </el-table-column>
                <el-table-column  prop='avatar' label="头像" align="center">
                	 <template slot-scope="scope">
				      <img  :src="scope.row.avatar" alt="" style="width: 50px;">
				    </template>
                </el-table-column>
				<el-table-column  prop='effect_time' label="时间" sortable align="center">
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
        name: 'Agent_invite',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                share_user_id: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                idx: -1,
                tableData1:[],
                excelData:[],
                loading:true,
                tagsList:'',
                last_page:1,
                url:'',
                id:''
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
                this.cur_page = val;
                this.getData(val,this.url);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
            	if(this.$route.query.id){
            		url="&share_user_id="+this.$route.query.id;
            		this.url="&share_user_id="+this.$route.query.id
            	}
				this.$axios.get(that.ports.agent.userIndex+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            getParams () {
		        if(!this.$route.query.id){
		        	return false
		        }
		        var routerParams = this.$route.query.id
		        this.id = this.$route.query.id;
		        this.share_user_id = this.$route.query.id
		    },
            search() {
				this.url="&share_user_id="+this.share_user_id
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
