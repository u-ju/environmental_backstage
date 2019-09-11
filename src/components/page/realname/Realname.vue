<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 实名信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-select v-model="search.status" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-input v-model="search.user_id" placeholder="用户ID" class="handle-input mr10"></el-input>
                <el-input v-model="search.idcard" placeholder="身份证号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table"  :row-style="{height:'65px'}">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="user_id" label="用户ID"  width="100" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column  prop='idcard' label="身份证号" align="center">
                </el-table-column>
                <el-table-column  prop='realname' label="真实姓名" align="center">
                </el-table-column>
                <el-table-column prop="status_name" label="审核状态"  align="center">
                	<template slot-scope="scope">
						<el-tag disable-transitions>{{scope.row.status_name}}</el-tag>
				  	</template>
                </el-table-column>
                <el-table-column  prop='created_at' label="实名时间" align="center">
                </el-table-column>
                <el-table-column
				    prop="[front,back,avatar]"
				    label="图片" align="center"
				    >
				    <template slot-scope="scope">
				      <img  :src="scope.row.front" alt="" style="width: 50px; max-height: 60px;">
				      <img  :src="scope.row.back" alt="" style="width: 50px;max-height: 60px;">
				      <img  :src="scope.row.avatar" alt="" style="width: 50px;max-height: 60px;">
				    </template>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
            	<el-form-item label="真实姓名">
                    <el-input v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input v-model="form.idcard"></el-input>
                </el-form-item>
                <el-form-item label="民族">
                    <el-input v-model="form.nation"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择">
                    	<el-option
					      v-for="item in sele"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                        <!--<el-option key="bbk" label="审核中" value="0"></el-option>
                        <el-option key="xtc" label="审核成功" value="1"></el-option>
                        <el-option key="imoo" label="审核失败" value="-1"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.status_remark"></el-input>
                </el-form-item>
                <!--<el-form-item label="性别">
                    {{form.sex==0?"女":"男"}}
                </el-form-item>-->
                <el-form-item label="图片">
                	<div>
					    <viewer :images="form.signImages">
					        <img v-for="src in form.signImages"  class='margin_pic' :src="src"  width="320">
					    </viewer>
					</div>
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
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                	realname: '',
                    idcard: '',
                    nation: '',
                    address: '',
                    status:'',
                    front: "",
			        back: "",
			        avatar:'',
			        sex:"",
			        signImages:[],
			        status_remark:''
                },
                idx: -1,
                tableData1:[],
                excelData:[],
                loading:true,
                sele:[],
                last_page:1,
                url:'',
                search:{
                	user_id:'',
                	status:'',
                	idcard:''
                }
            }
        },
        created() {
            this.getData();
            console.log()
			this.sele = JSON.parse(localStorage.getItem('config')).realname_status;
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
				this.$axios.get(that.ports.realname.index+"?page="+page,{params:this.search}).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            
			
            search() {
                this.getData(1)
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
                this.$axios.get(that.ports.realname.show+'?id='+this.tableData[index].id).then(function(res) {
		            
		           	var form={
		            	realname: res.data.result.realname,
	                    idcard: res.data.result.idcard,
	                    nation: res.data.result.nation,
	                    address: res.data.result.address,
	                    status:res.data.result.status,
	                    front: res.data.result.front,
				        back: res.data.result.back,
				        avatar:res.data.result.avatar,
				        sex:res.data.result.sex,
				        status_remark:res.data.result.status_remark,
				        signImages:[res.data.result.front,res.data.result.avatar,res.data.result.back],
		            }
		           	that.form = form
		        })
                
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
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
            	console.log(this.form)
            	console.log(this.idx)
            	var that =this;
            	var data =that.qs.stringify({
            		id:that.tableData[that.idx].id,
	              	realname: that.form.realname,
                    idcard: that.form.idcard,
                    nation: that.form.nation,
                    address: that.form.address,
                    status:that.form.status,
                    status_remark:that.form.status_remark,
	            })
            	console.log(data)
            	that.$axios.post(that.ports.realname.update, data)
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
