<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 问答列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
				
				<el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加问答</el-button>
			</div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table"  :row-style="{height:'65px'}">
				<el-table-column  type="expand" prop="skus">
				  	<template slot-scope="scope" >
					   <el-table  class="table1" style="width: 100%"  :data="scope.row.answer" >
					      	
					      	<el-table-column prop="name" label="答案"  align="center">
					      	</el-table-column>
					      	<el-table-column prop="right" label="是否正确"  align="center">
					      		<template slot-scope="scope">
					      			<span>{{scope.row.right==1?'正确':'错误'}}</span>
				    			</template>
					      	</el-table-column>
					    </el-table>
					    
					</template>
				</el-table-column>
                <el-table-column  prop='id' label="ID" align="center">
                </el-table-column>
                <el-table-column  prop='content' label="内容" align="center">
                </el-table-column>
                <el-table-column  prop='created_at' label="时间" align="center">
                </el-table-column>
                <el-table-column  prop='status_name' label="状态" align="center">
                </el-table-column>
				
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">						
                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>

                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>-->
        </div>
        
        <el-dialog title="添加问答" :visible.sync="editVisible" width="40%">
			<el-form :model="form" label-width="100px">
				<el-form-item label="问题">
					<el-input v-model="form.content"></el-input>
				</el-form-item>
				<el-form-item label="答案">
					<div class="flex" v-for="(item,index) in answer">
						<el-input v-model="item.name"></el-input>
						<el-checkbox v-model="item.right">正确</el-checkbox>
						<i class="el-icon-circle-plus-outline" @click="addanswer"></i>
						<i class="el-icon-delete" @click="delanswer(index)" v-if='answer.length>1'></i>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
		</el-dialog>
         <!--删除提示框--> 
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
        name: 'question',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                delVisible: false,
                loading:true,
                sele:[],
                last_page:1,
                id:0,
                answer:[
                	{name:'',right:0}
                ],
                form:{
                	content:'',
                	answer:''
                },
                editVisible:false
            }
        },
        created() {
            this.getData();
        },
        computed: {
            
        },
        methods: {
        	//添加答案
        	addanswer(){
        		this.answer.push({name:'',right:0})
        	},
        	//删除答案
        	delanswer(index){
        		this.answer.splice(index, 1)
        	},
        	handleEdit(index, row) {
				var that = this;
				this.idx = index;
				this.editVisible = true;
				
				that.form= {content:'',answer:''}
				that.answer=[
                	{name:'',right:0}
                ]
				if(this.idx != -1) {
					that.form = {content:row.content,answer:row.answer}
					var answer =row.answer
					for(var i in answer){
						answer[i]['right']=answer[i]['right']==0?false:true
//						console.log(answer[i]['right'])
					}
					
					that.answer=answer
				}
				
			},
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val,this.url);
            },
            // 获取 easy-mock 的模拟数据
            getData(url='') {
            	var that =this;
				this.$axios.get(that.ports.question.index).then(function(res) {
		        	that.tableData = res.data.result.list;
//		        	that.last_page = Number(res.data.result.page.last_page);
//		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
             handleSelectionChange(val) {
                this.multipleSelection = val;
            },
           handleDelete(idx){
           	this.id=idx
           	this.delVisible = true
           },
            // 确定删除
            deleteRow(){
//              this.tableData.splice(this.idx, 1);
				var that = this;
				var data =that.qs.stringify({
            		"id[0]":that.id,
	            })
                that.$axios.post(that.ports.question.destroy, data)
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
            saveEdit(){
            	console.log(this.answer)
            	var answer = this.answer,that=this
            	var url = that.ports.question.store;
            	for(var i in answer){
					answer[i]['right']=answer[i]['right']==false?0:1
				}
            	this.form.answer=JSON.stringify(answer)
            	var data=this.form
            	if(this.idx!=-1){
            		url = that.ports.question.update;
            		data.id=this.idx
            	}
            	data=that.qs.stringify(data)
            	that.$axios.post(url, data)
					.then(function(res) {
						if(res.data.status == 200) {
							that.getData();
							that.editVisible = false;
							that.$message.success(`操作成功`);

						} else {
							that.$message.warning(res.data.message);
						}

					})
					.catch(function(error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
//          	console.log(this.answer)
            }
        }
    }

</script>

<style scoped>
    
   .flex{
   	display: flex;
   	align-items: center;
   	margin-bottom: 8px;
   }
   .flex i{
   	font-size: 20px;
   	margin-left: 8px;
   }
   .flex .el-checkbox{
   	margin-left: 8px;
   }
</style>
