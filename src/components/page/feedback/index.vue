<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 意见反馈</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table"  :row-style="{height:'65px'}">
				<el-table-column  prop='id' label="ID" align="center" width='80'>
                </el-table-column>
                <el-table-column prop="user_info.id" label="用户ID"  width="80" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.id}}">
					    	<div >{{ scope.row.user_info.id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column  prop='user_info.nickname' label="用户昵称" align="center">
                </el-table-column>
                <el-table-column  prop='content' label="内容" align="center">
                </el-table-column>
                <el-table-column
				    prop="images"
				    label="图片" align="center"
				    >
				    <template slot-scope="scope">
				    	<viewer :images="scope.row.images">
<img v-for="item in scope.row.images"  class='margin_pic' :src="item"  width="50" style="margin-right: 8px;">					    </viewer>
				      <!--<img  v-for='item in scope.row.images' :src="item" alt="" style="width: 50px; max-height: 60px;margin-right: 8px;">-->
				    </template>
				</el-table-column>
                <el-table-column  prop='created_at' label="实名时间" align="center">
                </el-table-column>
                
				
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id)">删除</el-button>
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
                delVisible: false,
                loading:true,
                sele:[],
                last_page:1,
                id:0
            }
        },
        created() {
            this.getData();
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
				this.$axios.get(that.ports.feedback.index+"?page="+page).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
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
                that.$axios.post(that.ports.feedback.destroy, data)
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
    
   
</style>
