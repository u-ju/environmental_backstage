<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-friend"></i> 用户角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
            	<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit'>添加用户角色</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table" :row-class-name="tableRowClassName">
                <el-table-column type="selection" width="55"  align="center"></el-table-column>
                <el-table-column prop="role_id" label="角色ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="name" label="名称"   align="center">
                </el-table-column>
                <el-table-column prop="display_name" label="展示名称"   align="center">
                </el-table-column>
                <el-table-column prop="description" label="说明" sortable  align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

<!-- 编辑弹出框 -->
        <el-dialog title="添加" :visible.sync="editVisible" width="40%">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			  <div style="margin: 15px 0;"></div>
			  <el-checkbox-group v-model="choosed" @change="handleCheckedCitiesChange">
			  	<!--:disabled="choosed[index]==item.role_id?true:false"-->
			  	<el-checkbox v-for="(item,index) in role" :label="item.role_id" :key="item.role_id"  >{{item.display_name}}</el-checkbox>
			  </el-checkbox-group>
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
        name: 'UserRole',
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
                last_page:1,
                
                user_id:'',
                
		        area:[],
		        area_selected:[],
        		state1: '',
        		checkAll: false,
		        checkedCities: [],
		        
		        isIndeterminate: true,
		        role:[],
		        all:[],
		        choosed:[],
            }
        },
        created() {
        	this.getParams()
//			this.getData();
			this.getRole();
        },
        computed: {
            data() {
            	return this.tableData

            }
        },
        methods: {
        	handleCheckAllChange(val) {
		        this.checkedCities = val ? this.all : [];
		        this.isIndeterminate = false;
		    },
		    handleCheckedCitiesChange(value) {
		        let checkedCount = value.length;
		        this.checkAll = checkedCount === this.role.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.role.length;
		    },
        	getParams () {
        	// 取到路由带过来的参数 
		        if(!this.$route.query.user_id){
		        	return false
		        }
		        var routerParams = this.$route.query.user_id
		        // 将数据放在当前组件的数据内
		        this.checkedCities=[]
		        this.del_line=[]
		        this.user_id = this.$route.query.user_id
		        this.getData()
		      },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val);
            },
            // 获取 easy-mock 的模拟数据
            getData() {
            	var that =this;
				this.$axios.get(that.ports.user.roleIndex+"?user_id="+that.user_id).then(function(res) {
		        	that.tableData = res.data.result.list;
		            that.loading = false;
		            that.choosed=[]
		            for(var key in that.tableData){
	        			that.choosed[key]=that.tableData[key].role_id
	        			
//	        			that.checkedCities.push(that.tableData[key].role_id)
	        		}
		            console.log(that.choosed)
		       }) 
            },
            getRole(){
            	var that =this;
				this.$axios.get(that.ports.role.index).then(function(res) {
		        	that.role = res.data.result.list;
	        		for(var key in that.role){
	        			that.all.push(that.role[key].role_id)
	        		}
		       }) 
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
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit() {
                this.editVisible = true;

            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data=[];
            	data['user_id']=this.user_id;
            	var checkedCities = this.checkedCities
//          	for(var i in checkedCities){
//          		for(var j in this.choosed){
//          			if(checkedCities[i]==this.choosed[j]){
//          				checkedCities.splice(i, 1);
//          			}
//          		}
//          	}
            	for(var key in this.choosed){
            		data["role_id["+key+"]"]=this.choosed[key]
            	}
            	
            	var url = that.ports.user.roleSync;
            	data = that.qs.stringify(data)
            	that.$axios.post(url, data)
				.then(function (res) {
					if(res.data.status==200){
						that.getData();
						that.checkedCities=[]
						that.editVisible = false;
						that.$message.success(`添加成功`);
						
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					that.$message.error(`添加失败`);
				});
            },
             handleDelete(index, row) {
                this.idx = index;
                this.del_line = [row.role_id]
                this.delVisible = true;
            },
             handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '',arr=[];
                
                this.del_list = this.multipleSelection
                if(this.del_list.length==0){
                	return false
                }
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].title + ' ';
                    arr.push(this.multipleSelection[i].role_id)
                }
                this.del_line = arr
                this.delVisible = true;
//              this.deleteRow(arr)
                
            },
            // 确定删除
            deleteRow(){
				var that = this;
				var arr=[],all = that.checkedCities,data={},del_line = this.del_line
				data['user_id']=this.user_id;
				for(var i in all){
					for(var j in del_line){
						if(all[i]==del_line[j]){
							all.splice(i,1)
						}
					}
				}
				console.log(all)
				for(var key in all){
            		data["role_id["+key+"]"]=all[key]
            	}
				console.log(data)
				var url = that.ports.user.roleSync;
            	data = that.qs.stringify(data)
            	that.$axios.post(url, data)
				.then(function (res) {
					if(res.data.status==200){
						that.getData();
						that.checkedCities=[]
						that.editVisible = false;
						that.$message.success(`解除成功`);
						
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					that.$message.error(`添加失败`);
				});
                this.delVisible = false;
                
            }
           
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
    .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-cascader{
  	width: 628px;
  }
</style>
