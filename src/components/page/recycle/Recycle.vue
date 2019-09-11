<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-shop"></i> 回收中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-cascader 
                    	clearable
                    	placeholder="请选择区域"
                    	 change-on-select
                    	id="cascader"
					  :options="area"
		      		  :props="props"
		      		   v-model="sel_area"
		      		   
					></el-cascader>
                
                <el-select v-model="sel_status" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">

                <el-table-column prop="id" label="ID"  width="100" align="center">
                </el-table-column>
                
                <el-table-column prop="user_id" label="用户ID" sortable width="100" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column
				    prop="thumb"
				    label="图片" align="center"
				    >
				    <template slot-scope="scope">
				      <img  :src="scope.row.thumb" alt="" style="width: 50px;max-height: 60px;">
				    </template>
				</el-table-column>
                <el-table-column prop="title" label="昵称"  align="center">
                </el-table-column>
                <el-table-column prop="contact" label="联系手机号"  align="center">
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
                <el-form-item label="审核备注">
                    <el-input type="textarea" v-model="form.status_remark"></el-input>
                </el-form-item>

                <el-form-item label="昵称">
                    {{recycle.title}}
                </el-form-item>
               	<el-form-item label="联系方式">
                    {{recycle.contact}}
                </el-form-item>
                <el-form-item label="简介">
                    {{recycle.intro}}
                </el-form-item>
               	<el-form-item label="地址">
                    {{recycle.area_name}} {{recycle.address}}
                </el-form-item>
                <el-form-item label="店面">
                    <div>
					    <viewer >
					        <img   class='margin_pic' :src="recycle.thumb"  width="50">
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
                editVisible2: false,
                delVisible: false,
                delVisible2: false,
                form: {
                    status:'',
                    status_remark:'',
                },
                idx: -1,
                tableData1:[],
                excelData:[],
                loading:true,
                sele:[],
                last_page:1,
                status:-1,
                recycle:{},
                select:[],
                props: {
				  value: 'area_id',
		          label:'name',
		          children: 'children'
		        },
		        selected:[],
		        url:'',
		        sel_area:[],
		        sel_status:'',
		        area:[],
		        res:[]
            }
        },
        created() {
            this.getData();
            this.getarea()
            var that =this;
//	        this.$axios.get(that.ports.Home.config).then(function(res) {
//		        that.sele = res.data.result.recycle_status
//		        
//		    })
			this.sele = JSON.parse(localStorage.getItem('config')).recycle_status;
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
            getarea(){
				var that =this;
				this.$axios.get(that.ports.area.index).then(function(res) {
		        	that.area = res.data.result.list;
		       }) 
		    },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.recycle.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            
			
            search() {
                this.is_search = true;
                var area_id = ''
                if(this.sel_area.length>0){
                	area_id=this.sel_area[this.sel_area.length-1]
                }
                this.url="&status="+this.sel_status+"&area_id="+area_id
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
                var that =this
                const item = this.tableData[index];
                this.$axios.get(that.ports.recycle.show+this.tableData[index].id).then(function(res) {
		            that.form.status = res.data.result.status
		            that.form.status_remark = res.data.result.status_remark
		            that.recycle = res.data.result
//		            that.status = res.data.result.status
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
            	var that =this;
            	var data =that.qs.stringify({
                    status:that.form.status,
                    id:that.tableData[that.idx].id,
                    status_remark:that.form.status_remark,
	            })
            	that.$axios.post(that.ports.recycle.update, data)
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
            		id:that.tableData[that.idx].id,
	            })
                that.$axios.post(that.ports.recycle.destroy, data)
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
