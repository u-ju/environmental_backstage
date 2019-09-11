<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-people"></i> 角色用户列表   &nbsp;&nbsp;&nbsp;&nbsp;{{role_name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
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
                <el-table-column  prop='mobile' label="手机号" align="center">
                </el-table-column>
                <el-table-column
				    prop="avatar"
				    label="头像" align="center"
				    >
				    <template slot-scope="scope">
				      <img  :src="scope.row.avatar" alt="" style="width: 50px;">
				    </template>
				</el-table-column>
                <el-table-column prop="status_name" label="状态"  align="center">
                	<template slot-scope="scope">
			        <el-tag
			          :type="scope.row.status_name === '已锁定' ? 'primary' : 'success'"
			          disable-transitions>{{scope.row.status_name}}</el-tag>
			      </template>
                </el-table-column>
                
            </el-table>
        </div>
    </div>
</template>

<script>
	
    export default {
        name: 'Role',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                
                is_search: false,
                editVisible: false,
                delVisible: false,
                idx: -1,
                excelData:[],
                loading:true,
                last_page:1,
                form:{
                	name:'',
                	display_name:'',
                	description:''
                },
                status:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                url:'',
                role_name:''
            }
        },
        created() {
            
            this.getParams();
        },
        computed: {
            data() {

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
				this.$axios.get(that.ports.role.userIndex+"?role_id="+that.role_id+"&page="+page).then(function(res) {
		        	that.tableData = res.data.result.list;
		            that.loading = false
		       }) 
            },
            getParams () {
        	// 取到路由带过来的参数 
		        if(!this.$route.query.role_id){
		        	return false
		        }
		        this.checkedCities=[]
		        this.checkAll=false
		        var routerParams = this.$route.query.role_id
		        // 将数据放在当前组件的数据内
		        this.role_id = this.$route.query.role_id
		        this.role_name =this.$route.query.role_name
		        this.getData();
		      },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        },
         watch: {
	    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
	    
	    '$route': ['getParams','getData']
	    
	      
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
