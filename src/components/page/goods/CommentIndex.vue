<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> 商品评论</el-breadcrumb-item>
                <!--<i class="el-icon-lx-profile"></i>-->
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-select v-model="select_cate" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <el-table-column prop="user_id" label="用户ID"  width="100" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column prop="spu_id" label="商品ID"  width="100" align="center">
                	<!--<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.spu_id}}">
					    	<div >{{ scope.row.spu_id }}</div>
                		</router-link>
					</template>-->
                </el-table-column>
                <el-table-column  prop='nickname' label="用户名" align="center">
                </el-table-column>
                <el-table-column  prop='avatar' label="用户头像" align="center">
                	<template slot-scope="scope">
				      <img :src="scope.row.avatar" alt="" style="width: 50px;">
				    </template>
                </el-table-column>
                
                <el-table-column
				    prop="comment_images"
				    label="评论图片" align="center"
				    >
				    <template slot-scope="scope">
				      <img v-for="(src,index) in scope.row.comment_images" :key="index" :src="src" alt="" style="width: 50px;">
				    </template>
				</el-table-column>
				<el-table-column  prop='comment_message' label="评论内容" align="center">
                </el-table-column>
				<el-table-column prop="status_name" label="审核状态"  align="center">
                	<template slot-scope="scope">
						<el-tag disable-transitions>{{scope.row.status_name}}</el-tag>
				  	</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择">
                    	<el-option
					      v-for="item in sele"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
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
                	comment_id:'',
                	status:''
                },
                idx: -1,
                tableData1:[],
                excelData:[],
                loading:true,
                sele:[],
                last_page:1,
                url:''
            }
        },
        created() {
            this.getData();
            var that =this;
	        this.$axios.get(that.ports.Home.config).then(function(res) {
		        that.sele = res.data.result.order_goods_comment_status;
		    })
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
				this.$axios.get(that.ports.goods.commentIndex+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            
			
            search() {
                this.is_search = true;
                this.url="&status="+this.select_cate
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
                this.form.comment_id=this.tableData[index].comment_id
                this.form.status=this.tableData[index].status
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
            	var data =that.qs.stringify(this.form)
            	console.log(data)
            	that.$axios.post(that.ports.goods.commentAudit, data)
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
					that.$message.error(`修改第 ${that.idx+1} 行失败`);
				});
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
