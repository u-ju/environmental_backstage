<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 回复列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-select v-model="select_cate" placeholder="审核状态" class="handle-select mr10">
                    <el-option key="1" label="审核成功" value="审核成功"></el-option>
                    <el-option key="2" label="审核失败" value="审核失败"></el-option>
                    <el-option key="3" label="审核中" value="审核中"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table" :row-class-name="tableRowClassName">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="user_id" label="用户ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="news_id" label="新闻ID" sortable width="100" align="center">
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
                <el-table-column  prop='content' label="评论内容" align="center">
                </el-table-column>
                <el-table-column  prop='created_at' label="回复时间" align="center">
                </el-table-column>
                
				
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                          
                        
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>
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
        name: 'Reply',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                delVisible: false,
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
                id:1
            }
        },
        created() {
            this.getData();
	        

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
                this.getData(val);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1) {
            	var that =this;
				this.$axios.get(that.ports.news.replyIndex+"?news_id="+that.id+"&page="+page).then(function(res) {
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
		        console.log(this.id)
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
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
//              this.tableData.splice(this.idx, 1);
				var that = this;
				var data =that.qs.stringify({
            		reply_id:that.tableData[that.idx].reply_id,
	            })
                that.$axios.post(that.ports.news.replyDestroy, data)
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
</style>
