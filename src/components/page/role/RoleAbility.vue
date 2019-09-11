<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-friend"></i> 角色权限管理    &nbsp;&nbsp;&nbsp;&nbsp;{{role_name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
            	<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit'>编辑角色权限</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table" :row-class-name="tableRowClassName">
                <el-table-column type="selection" width="55"  align="center"></el-table-column>
                <el-table-column prop="permission_id" label="权限ID" sortable width="100" align="center">
                </el-table-column>
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
			  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
			  	<!--:disabled="choosed[index]==item.permission_id?true:false"-->
			  	<el-checkbox v-for="(item,index) in ability" :label="item.permission_id" :key="item.permission_id"  >{{item.display_name}}</el-checkbox>
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
        name: 'roleRole',
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
                
                role_id:'',
                
		        area:[],
		        area_selected:[],
        		state1: '',
        		checkAll: false,
		        checkedCities: [],
		        
		        isIndeterminate: true,
		        ability:[],
		        all:[],
		        choosed:[],
		        role_name:''
            }
        },
        created() {
        	this.getParams()
			this.getData();
			this.getAbility();
        },
        computed: {
            data() {
            	return this.tableData

            }
        },
        methods: {
        	handleCheckAllChange(val) {
        		console.log(val)
		        this.checkedCities = val ? this.all : [];
		        this.isIndeterminate = false;
		    },
		    handleCheckedCitiesChange(value) {
		        let checkedCount = value.length;
		        this.checkAll = checkedCount === this.ability.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.ability.length;
		    },
        	getParams () {
        	// 取到路由带过来的参数 
		        if(!this.$route.query.role_id){
		        	return false
		        }
		        this.checkedCities=[]
		        this.del_line=[]
		        this.checkAll=false
		        var routerParams = this.$route.query.role_id
		        // 将数据放在当前组件的数据内
		        this.role_id = this.$route.query.role_id
		        this.role_name =this.$route.query.role_name
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
				this.$axios.get(that.ports.role.abilityIndex+"?role_id="+that.role_id).then(function(res) {
		        	that.tableData = res.data.result.list;
		            that.loading = false;
		            that.choosed=[]
		            that.checkedCities=[]
		            for(var key in that.tableData){
	        			that.choosed[that.tableData[key].permission_id-1]=that.tableData[key].permission_id;
	        			that.checkedCities.push(that.tableData[key].permission_id)
	        		}
		            console.log(that.checkedCities)
		       }) 
            },
            getAbility(){
            	var that =this;
				this.$axios.get(that.ports.ability.index).then(function(res) {
		        	that.ability = res.data.result.list;
	        		for(var key in that.ability){
	        			that.all.push(that.ability[key].permission_id)
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
            	data['role_id']=this.role_id;
            	var checkedCities = this.checkedCities
            	for(var key in checkedCities){
            		data["permission_id["+key+"]"]=checkedCities[key]
            	}
            	
            	var url = that.ports.role.permissionSync;
            	data = that.qs.stringify(data)
            	
            	that.$axios.post(url, data)
				.then(function (res) {
					if(res.data.status==200){
						that.getData();
						that.editVisible = false;
						that.$message.success(`添加成功`);
						that.checkedCities=[]
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
//              console.log(row.permission_id)
                this.del_line = [row.permission_id]
                this.delVisible = true;
            },
             handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '',arr=[];
                this.del_list = this.del_list.concat(this.multipleSelection);
                if(this.del_list.length==0){
                	return
                }
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].title + ' ';
                    arr.push(this.multipleSelection[i].permission_id)
                }
                this.del_line = arr
                this.delVisible = true;
//              this.$message.error('删除了' + str);
                
            },
            // 确定删除
            deleteRow(){
				var that = this;
				var arr=[],all = that.checkedCities,data={},del_line = this.del_line
				data.role_id=that.role_id;
				for(var i in all){
					for(var j in del_line){
						if(all[i]==del_line[j]){
							all.splice(i,1)
						}
					}
				}
				console.log(all)
				console.log(data)
				for(var key in all){
            		data["permission_id["+key+"]"]=all[key]
            	}
				var url = that.ports.role.permissionSync;
            	data = that.qs.stringify(data)
            	that.$axios.post(url, data)
				.then(function (res) {
					if(res.data.status==200){
						that.getData();
						that.editVisible = false;
						that.$message.success(`解除成功`);
						that.checkedCities=[]
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
  .el-checkbox{
  	margin: 10px 0 !important;
    width: 40%;
  }
</style>
