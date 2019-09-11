<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-friend"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
        	<div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='editVisibleadd'>添加用户</el-button>
            </div>
            <div class="handle-box">
                <el-select v-model="form.status"  clearable  placeholder="用户状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-input v-model="form.bind_card_no" placeholder="卡号" class="handle-input mr10"></el-input>
                <el-input v-model="form.username" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-input v-model="form.nickname" placeholder="昵称" class="handle-input mr10"></el-input>
                <el-input v-model="form.mobile" placeholder="手机号" class="handle-input mr10"></el-input>
                <el-input v-model="form.email" placeholder="邮箱" class="handle-input mr10"></el-input>
                <el-input v-model="form.created_ip" placeholder="注册ip" class="handle-input mr10"></el-input>
                
                <!--<div>-->
                	<el-date-picker
				      v-model="form.start_created_at"
				      type="datetime"
				       value-format='yyyy-MM-dd hh:mm:ss'
				      placeholder="注册开始时间">
				    </el-date-picker>
				    <el-date-picker
				      v-model="form.end_created_at"
				      type="datetime"
				      value-format='yyyy-MM-dd hh:mm:ss'
				      placeholder="注册结束时间">
				    </el-date-picker>
				    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <!--</div>-->
                <!--<el-input v-model="form.start_created_at" placeholder="注册开始时间" class="handle-input mr10"></el-input>
                <el-input v-model="form.end_created_at" placeholder="注册结束时间" class="handle-input mr10"></el-input>-->
                
                

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table" :row-class-name="tableRowClassName">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="user_id" label="用户ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column  prop='nickname' label="昵称" align="center">
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
                <el-table-column  prop='bind_card_no' label="卡号" align="center">
                </el-table-column>
                <el-table-column  prop='created_ip' label="注册ip" align="center">
                </el-table-column>
				<el-table-column  prop='created_at' label="注册时间" align="center">
                </el-table-column>
                <el-table-column label="操作" width="240" align="center">
                    <template slot-scope="scope">
                    	<router-link :to="{path:'/UserDetails',params: {id: scope.row.user_id},query: {id: scope.row.user_id}}">
                            <el-button type="text" icon="el-icon-lx-attention" >编辑查看</el-button>
                            <!--@click="handleEdit(scope.$index, scope.row)"-->
                        </router-link>
                        <router-link :to="{path:'/share',params: {id: scope.row.user_id},query: {id: scope.row.user_id}}">
                            <el-button type="text" icon="el-icon-lx-attention" >推广信息</el-button>
                            <!--@click="handleEdit(scope.$index, scope.row)"-->
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

		<!-- 编辑弹出框 -->
        <el-dialog title="添加" :visible.sync="editVisible">
            <el-form ref="form1" :model="form1" label-width="100px">
            	<el-form-item label="用户名">
                    <el-input v-model="form1.username"></el-input>
               	</el-form-item>
               	<el-form-item label="昵称">
                    <el-input v-model="form1.nickname"></el-input>
               	</el-form-item>
               	<el-form-item label="密码">
                    <el-input v-model="form1.password"></el-input>
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
        name: 'user',
        data() {
            return {
                url: '',
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
                last_page:1,
                sele:[],
                form:{
                	username:'',
                	nickname:'',
                	mobile:'',
                	email:'',
                	status:'',
                	created_ip:'',
                	bind_card_no:'',
                	start_created_at:'',
                	end_created_at:''
                },
                form1:{
                	username:'',
                	password:'',
                	nickname:''
                }
            }
        },
        created() {
            this.getData();
//	        var that =this;
//	        this.$axios.get(that.ports.Home.config).then(function(res) {
//		        that.sele = res.data.result.user_status;
//		    })
			this.sele = JSON.parse(localStorage.getItem('config')).user_status;
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
            	
				this.$axios.get(that.ports.user.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       })
            },
            getParams () {
		        // 取到路由带过来的参数 
		        if(!this.$route.query.id){
		        	return false
		        }
		        var routerParams = this.$route.query.id
		        // 将数据放在当前组件的数据内
		        this.id = routerParams
		      },
            tableRowClassName({row, rowIndex}) {
		        if (rowIndex === 1) {
		          return 'warning-row';
		        } else if (rowIndex === 3) {
		          return 'success-row';
		        }
		        return '';
		      },
            search() {
                this.is_search = true;
                this.url=''
                var data = this.form
                for(var key in data){
                	this.url=this.url+"&"+key+"="+data[key]
                }
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
            editVisibleadd(){
            	this.editVisible = true;
            	this.form1={
                	username:'',
                	password:'',
                	nickname:''
                }
            },
            saveEdit(){
            	var that = this;
            	
            	var data = this.form1;
            	var url = that.ports.user.store;
//          	if(that.idx!=-1){
//          		data.user_id=that.tableData[that.idx].user_id;
//          		url = that.ports.user.update;
//          	}
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
    .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  div.mr10.handle-input{
   	margin: 0 0px 20px 30px;
   }
   .el-date-editor--datetime{
   	margin-left: 30px !important;
   }
   .el-button--primary{
   	margin-left: 20px;
   }
</style>
