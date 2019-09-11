<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 代理管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加代理</el-button>
				
                <el-select v-model="level" clearable  placeholder="请选择">
                	<el-option
				      v-for="item in agent_level"
				      :key="item.key"
				      :value="item.key"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="agent_id" label="代理ID"  width="100" align="center">
                </el-table-column>
                <el-table-column prop="user_id" label="用户ID"   align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column prop="level_name" label="级别"   align="center">
                </el-table-column>
                <el-table-column prop="area_name" label="区域"   align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间"   align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
        <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
            	<el-form-item label="用户ID" v-if="idx==-1">
                    <el-input v-model="form.user_id" width='216'></el-input>
               </el-form-item>
                <el-form-item label="级别">
                    <el-select v-model="form.level" @change='change'  placeholder="请选择">
                    	<el-option
					      v-for="item in agent_level"
					      :key="item.key"
					      :value="item.key"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域">
                	<span  v-if='quyu' class="area_border"  v-on:click="quyuclick">{{area_name}}</span>
                    <el-cascader v-else
                    	id="cascader"
                    	 change-on-select
					  :options="area"
		      		  :props="props"
		      		   v-model="area_id"
					></el-cascader>
                </el-form-item>
                <!--<el-form-item label="代理费" v-if="idx!=-1">
                	{{amount}}
	            </el-form-item>-->
               <el-form-item label="创建时间" v-if="idx!=-1">
               		{{created_at}}
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
        name: 'Agent',
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
                loading:true,
                last_page:1,
                form:{
                	user_id:'',
                	level:''
                },
                status:0,
                amount:'',
                earn:'',
                quyu:true,
                area:[],
                area_id:[],
                area_name:'',
                earn_rate:'',
                created_at:'',
                props: {
				  value: 'area_id',
		          label:'name',
		          children: 'children'
		        },
		        agent_level:[],
		        level:'',
		        url:""
            }
        },
        created() {
            this.getData();
            this.getarea();
            this.getSele();
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
				this.$axios.get(that.ports.agent.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            getarea(){
				var that =this;
				this.$axios.get(that.ports.area.index).then(function(res) {
		        	that.area = res.data.result.list;
		       }) 
		    },
		    getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
				    that.agent_level = res.data.result.agent_level;
				})
			  },
			change(e){
			  	console.log(e);
			  	for(var key in this.agent_level){
			  		if(this.agent_level[key].id==e){
			  			this.amount=this.agent_level[key].amount
			  			this.earn_rate=this.agent_level[key].earn_rate
			  		}
			  	}
			},
			search(e){
				this.url="&level="+this.level
				this.getData(1,this.url)
			},
//          search() {
//              this.is_search = true;
//          },
            quyuclick(){
		    	this.quyu =false
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
                this.quyu=true;
                this.editVisible = true;
                that.form = {user_id:'',level:'',}
                that.amount=''
                that.earn_rate=''
                if(this.idx!=-1){
                	console.log(row)
                  	that.form.user_id = row.user_id
					that.form.level = row.level
					that.area_name=row.area_name
					that.created_at=row.created_at
//					that.earn=row.earn
					var arr=[];
					arr.push(row.area_id)
					that.area_id=arr
//              	that.$axios.get(that.ports.agent.show+'?agent_id='+that.tableData[that.idx].agent_id)
//					.then(function (res) {
//						if(res.data.status==200){
//							that.form.user_id = res.data.result.user_id
//							that.form.level = res.data.result.level
//							that.area_name=res.data.result.area_name
//							that.amount=res.data.result.amount
//							that.earn=res.data.result.earn
//							var arr=[];
//							arr.push(res.data.result.area_id)
//							that.area_id=arr
//						}else{
//							that.$message.warning(res.data.message);
//						}
//						
//					})
//					.catch(function (error) {
//						console.log(error);
//						that.$message.error(`执行失败`);
//					});
                }else{
                	this.form={
	                	user_id:'',
	                	level:'',
	                	area_name:'',
	                	
	                }
                	this.area_id = []
                	this.quyu=false
                }
                console.log(that.form)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data = this.form;
            	var url = that.ports.agent.store;
            	data["area_id"]=this.area_id[this.area_id.length-1]
            	if(that.idx!=-1){
            		data.agent_id=that.tableData[that.idx].agent_id;
            		url = that.ports.agent.update;
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
            },
            // 确定删除
            deleteRow(){
//              this.tableData.splice(this.idx, 1);
				var that = this;
				var data =that.qs.stringify({
            		agent_id:that.tableData[that.idx].agent_id,
	            })
                that.$axios.post(that.ports.agent.destroy, data)
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
