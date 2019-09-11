<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-shop"></i> 实体商家列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                    <el-cascader 
                    	clearable
                    	placeholder="请选择区域"
                    	change-on-select
                    	id="cascader"
					    :options="area1"
		      		    :props="props"
		      		    v-model="area_id"
					></el-cascader>
                
                
                <!--<el-select v-model="search.cate_id" clearable  placeholder="招聘分类" class="handle-select mr10">
                    <el-option
				      v-for="item in cate1"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>-->
                <el-cascader 
                	clearable
                	placeholder="请选择分类"
                	change-on-select
                	id="cascader"
				    :options="cate1"
	      		    :props="props1"
	      		    v-model="cate_id"
				></el-cascader>
				<el-select v-model="search.status" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in status1"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
				<el-select v-model="search.experience" clearable  placeholder="经验" class="handle-select mr10">
                    <el-option
				      v-for="item in experience1"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-select v-model="search.education" clearable  placeholder="学历" class="handle-select mr10">
                    <el-option
				      v-for="item in education1"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-select v-model="search.salary" clearable  placeholder="薪资" class="handle-select mr10">
                    <el-option
				      v-for="item in salary_filter1"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select> 	
                <el-input class='width300' v-model="search.keywords" placeholder="请输入内容"></el-input>
                <el-button type="primary" icon="search" @click="searchbtn">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="id" label="ID" align="center">
                </el-table-column>
                <el-table-column prop="person_info" label="发布人" align="center">
                	<template slot-scope="scope">
                		<el-tag disable-transitions>{{scope.row.person_info.name}}</el-tag>

					    <!--<router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>-->
					</template>
                </el-table-column>
                
                <el-table-column prop="company_info" label="发布公司"  align="center">
                	<template slot-scope="scope">
                		<el-tag disable-transitions>{{scope.row.company_info.name}}</el-tag>

					    <!--<router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>-->
					</template>
                	
                </el-table-column>
                
                <el-table-column  prop='name' label="职位名称" align="center" >
                </el-table-column>
                <el-table-column  prop='salary_name' label="工资" align="center" >
                </el-table-column>
                <el-table-column  prop='experience_name' label="经验" align="center" >
                </el-table-column>
                <el-table-column  prop='education_name' label="学历" align="center" >
                </el-table-column>
                <el-table-column  prop='area_cut_name' label="地区" align="center">
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
                
                <el-form-item label="职位昵称">
                    {{result.name}}
                </el-form-item>
               	<el-form-item label="工资">
                    {{result.salary_name}}
                </el-form-item>
                <el-form-item label="经验">
                    {{result.experience_name}}
                </el-form-item>
                <el-form-item label="学历">
                    {{result.education_name}}
                </el-form-item>
               	<el-form-item label="地区">
                    {{result.area_name}}{{result.address}}
                </el-form-item>
                <el-form-item label="工作内容">
                    {{result.content}}
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
		        cate_id:[],
		        area_id:[],
		        search:{
		        	status:'',
		        	experience:'',
		        	education:'',
		        	salary:'',
		        	cate_id:'',
		        	area_id:'',
		        	keywords:'',
		        },
		        area1:[],
                props: {
				  value: 'area_id',
		          label:'name',
		          children: 'children'
		        },
		        props1:{
		        	value: 'id',
		          	label:'name',
		          	children: 'children'
		        },
		        status1:[],
		        cate1:[],
		        education1:[],
		        salary_filter1:[]
            }
        },
        created() {
            this.getData();
            this.getsele()
			this.getarea()
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
                this.getData(val);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1) {
            	var that =this,data=this.search;
            	
				this.$axios.get(that.ports.recruit.postIndex+"?page="+page,{params:data}).then(function(res) {
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
			        that.person1 = res.data.result.person.status;
			        that.status1 = res.data.result.post.status;
			        that.experience1 = res.data.result.post.experience;
			        that.education1 = res.data.result.post.education;
			        that.salary_filter1 = res.data.result.post.salary_filter;
			        that.cate1 = res.data.result.post.cate;
			    })
            },
            getarea(){
				var that =this;
				this.$axios.get(that.ports.area.index).then(function(res) {
		        	that.area1 = res.data.result.list;
		       }) 
		    },
            searchbtn() {
				console.log(this.search)
				this.search.cate_id=this.cate_id.length>0?this.cate_id[this.cate_id.length-1]:''
				this.search.area_id=this.area_id.length>0?this.area_id[this.area_id.length-1]:''
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
                var that =this
                const item = this.tableData[index];
                this.$axios.get(that.ports.recruit.postShow+this.idx).then(function(res) {
		            that.result = res.data.result
		            that.form.status=res.data.result.status
		        })
                
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
            	that.$axios.post(that.ports.shop.update, data)
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
                that.$axios.post(that.ports.recruit.postDestroy, data)
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