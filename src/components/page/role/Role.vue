<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-people"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
            	<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加角色</el-button>
				<el-input v-model="select_word" placeholder="请输入标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column type="selection" width="55" align="center"></el-table-column>
            	<el-table-column prop="role_id" label="角色ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="name" label="名称"   align="center">
                </el-table-column>
                <el-table-column prop="display_name" label="展示名称"   align="center">
                </el-table-column>
                <el-table-column prop="description" label="说明" sortable  align="center">
                </el-table-column>
                
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <router-link :to="{path:'/RoleAbility',query: {role_id:  scope.row.role_id,role_name:  scope.row.display_name}}">
                        <el-button type="text" icon="el-icon-lx-attention" >查看权限</el-button>
                        </router-link>
					    <router-link :to="{path:'/RoleUser',query: {role_id:  scope.row.role_id,role_name:  scope.row.display_name}}">
					    	<el-button type="text" icon="el-icon-lx-attention" >查看用户</el-button>
                	</router-link>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>-->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
            	<el-form-item label="名称" v-if='idx==-1'>
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="展示名称">
                    <el-input v-model="form.display_name"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="form.description"></el-input>
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
                url:''
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
//          	 return this.tableData.filter((d) => {
//                  let is_del = false;
//                  console.log()
//                  for (let i = 0; i < this.del_list.length; i++) {
//                      if (d.name === this.del_list[i].name) {
//                          is_del = true;
//                          break;
//                      }
//                  }
//                  if (!is_del) {
//                      if (d.address.indexOf(this.select_cate) > -1 &&
//                          (d.name.indexOf(this.select_word) > -1 ||
//                              d.address.indexOf(this.select_word) > -1)
//                      ) {
//                          return d;
//                      }
//                  }
//              })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.role.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
//		        	that.last_page = Number(res.data.result.page.last_page);
//		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            
            search() {
//              this.is_search = true;
				this.url="&title="+this.select_word
				this.getData(1,this.url)
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
            	var that = this;
                this.idx = index;
                this.editVisible = true;
                that.form = {
                	name:'',
                	display_name:'',
                	description:''
                }
                if(this.idx!=-1){
                	console.log(row)
                	that.form = row
                }
            },
            
            // 保存编辑
            saveEdit() {
            	var that = this;
            	
            	var data = this.form;
            	var url = that.ports.role.store;
            	if(that.idx!=-1){
            		data.role_id=that.tableData[that.idx].role_id;
            		url = that.ports.role.update;
            	}
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
//              this.$set(this.tableData, this.idx, this.form);
                
                
            },
             handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
                this.del_line = [row.role_id]
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
//              console.log(this.multipleSelection)
//              console.log(val)
            },
            delAll() {
            	const length = this.multipleSelection.length;
                let str = '',arr=[];
                this.del_list = this.multipleSelection;
                if(this.del_list.length==0){
                	return
                }
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].title + ' ';
                    arr.push(this.multipleSelection[i].role_id)
                }
                this.del_line = arr
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
                var that = this;
				var arr=[],all = that.checkedCities,data={},del_line = this.del_line
				console.log(del_line)
				for(var key in del_line){
            		data["role_id["+key+"]"]=del_line[key]
            	}
				console.log(data)
            	data = that.qs.stringify(data)
                that.$axios.post(that.ports.role.destroy, data)
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
