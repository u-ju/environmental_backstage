<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-shop"></i> 实体商家列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="search.status" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-input class='width200' v-model="search.person_id" placeholder="请输入personID"></el-input>
                 <el-button type="primary" icon="search" @click="searchbtn">搜索</el-button>


            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="ID" align="center">
                </el-table-column>
                <!--<el-table-column prop="user_id" label="发布人id" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>-->
                <el-table-column
				    prop="thumb"
				    label="logo图片" align="center"
				    >
				    <template slot-scope="scope">
				      <img  :src="scope.row.thumb" alt="" style="width: 50px;">
				    </template>
				</el-table-column>
				<el-table-column
				    prop="license"
				    label="营业执照" align="center"
				    >
				    <template slot-scope="scope">
				      <img  :src="scope.row.license" alt="" style="width: 50px;">
				    </template>
				</el-table-column>
                <el-table-column prop="name" label="公司名字" align="center">
                </el-table-column>
                <el-table-column  prop='intro' label="公司介绍" align="center" >
                </el-table-column>
                <el-table-column  prop='created_at' label="创建时间" align="center" >
                </el-table-column>
                <el-table-column prop="status_name" label="审核状态"  align="center">
                	<template slot-scope="scope">
						<el-tag disable-transitions>{{scope.row.status_name}}</el-tag>
				  	</template>
                </el-table-column>
                
				
                <el-table-column label="操作" width="300" align="center">
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="公司名字">
                    {{result.name}}
                </el-form-item>
                <el-form-item label="审核">
                    <el-select v-model="form.status"  placeholder="请选择">
                    	<el-option
					      v-for="item in sele"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                    </el-select>
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
	import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        name: 'realname',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                editVisible: false,
                delVisible: false,
                form: {
                    status:'',
                    status_remark:'',
                },
                idx: -1,
                loading:true,
                last_page:1,
                select:[],
                props: {
		          value: 'id',
		          label:'name',
		          children: 'children'
		        },
		        url:'',
		        result:{},
		        sele:[],
		        search:{
		        	status:'',
		        	person_id:''
		        },
            }
        },
        created() {
            this.getData();
            this.getsele()

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
            	var that =this,data=this.search;
				this.$axios.get(that.ports.recruit.companyIndex+"?page="+page,{params:data}).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
			getsele() {
            	var that =this;
				this.$axios.get(that.ports.recruit.conf).then(function(res) {
			        that.sele = res.data.result.company.status;
			        
			    })
            },
            searchbtn() {
				this.getData(1)
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = row.id;
                this.result =row
                this.form.status=row.status
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = row.id;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that =this;
            	var data =that.qs.stringify({
                    status:that.form.status,
                    id:that.idx
	            })
            	that.$axios.post(that.ports.recruit.companyUpdate, data)
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
                that.$axios.post(that.ports.recruit.companyDestroy, data)
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
   .el-tag--medium {
	    max-width: 200px;
	    overflow: hidden;
	}
</style>