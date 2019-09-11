<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 上面订单列表</el-breadcrumb-item>
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
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="order_id" label="订单ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column
				    prop="thumb"
				    label="图片" align="center"
				    >
				    <template slot-scope="scope">
				      <img  :src="scope.row.thumb" alt="" style="width: 50px;max-height: 60px;">
				    </template>
				</el-table-column>
                <el-table-column  prop='intro' label="简介" align="center">
                </el-table-column>
                <el-table-column prop="appoint_time" label="预约时间"  align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间"  align="center">
                </el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-lx-attention" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
                        <el-button type="text" icon="el-icon-edit"  @click="handleDelete(scope.$index, scope.row)">分配上门人员</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible" width="40%">
            <el-form ref="form"  label-width="100px">
            	<el-form-item label="用户昵称">
                    {{form.user_nickname}}
                </el-form-item>
                <el-form-item label="物品描述">
                    {{form.intro}}
                </el-form-item>
                <el-form-item label="图片">
                	<div>
					    <viewer :images="form.images">
					        <img v-for="src in form.images"  class='margin_pic' :src="src"  width="50">
					    </viewer>
					</div>
                </el-form-item>
                <el-form-item label="发单人姓名">
                    {{form.contacts}}
                </el-form-item>
                <el-form-item label="发单人手机号">
                    {{form.contact}}
                </el-form-item>
                <el-form-item label="发单人地址">
                    {{form.area_name}}{{form.address}}
                </el-form-item>
                <el-form-item label="预约时间">
                    {{form.appoint_time}}
                </el-form-item>
                
                <el-form-item label="接单人姓名">
                    {{form.recycle_user_nickname}}
                </el-form-item>
                <el-form-item label="接单人手机号">
                    {{form.recycle_user_nickname}}
                </el-form-item>
                <el-form-item label="处理类型">
                    {{form.order_type}}
                </el-form-item>
                <el-form-item label="评估备注">
                    {{form.assess_intro}}
                </el-form-item>
                <el-form-item label="评估价格">
                    {{form.order_amount}}
                </el-form-item>
                <el-form-item label="订单状态">
                    {{form.order_status}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		<el-dialog name="提示" :visible.sync="delVisible" width="300px">
            <div class="del-dialog-cnt">是否确定分配上门人员？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
        
        
    </div>
</template>

<script>
    export default {
        name: 'OnsiteRecycle',
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
                form: {},
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
		        that.sele = res.data.result.onsite_recycle_order_type;
		        that.onsite_recycle_order_status=res.data.result.onsite_recycle_order_status
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
				this.$axios.get(that.ports.onsiteRecycle.orderIndex+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            search() {
                this.is_search = true;
                this.url="&order_status="+this.select_cate
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
                this.$axios.get(that.ports.onsiteRecycle.orderShow+this.tableData[index].order_id).then(function(res) {
		           	if(res.data.status==200){
		           		that.editVisible = true;
		           		that.form = res.data.result;
		           		
			           	for(var key in that.sele){
			           		console.log(res.data.result.order_type)
			           		if(res.data.result.order_type==that.sele[key].id){
			           			that.form["order_type"]=that.sele[key].name
			           		}
			           	}
			           	if(res.data.result.order_type==0){
			           		that.form["order_type"]='未处理'
			           	}
			           	for(var key in that.onsite_recycle_order_status){
			           		if(res.data.result.order_status==that.onsite_recycle_order_status[key].id){
			           			that.form["order_status"]=that.onsite_recycle_order_status[key].name
			           		}
			           		
			           	}
		           	}else{
						that.$message.warning(res.data.message);
					}
		        })
                .catch(function (error) {
					console.log(error);
					that.$message.error(`修改第 ${that.idx+1} 行失败`);
				});
                
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            deleteRow(){
                var that =this
                var data = that.qs.stringify({order_id:this.tableData[this.idx].order_id})
                this.$axios.post(that.ports.onsiteRecycle.allotL,data).then(function(res) {
                	that.delVisible = false;
		           	if(res.data.status==200){
		           		that.$message.success(res.data.message);
		           		
		           	}else{
		           		
						that.$message.warning(res.data.message);
					}
		        })
                .catch(function (error) {
					console.log(error);
					that.$message.error(`修改第 ${that.idx+1} 行失败`);
				});
            	
            },
            // 保存编辑
            saveEdit() {
            	var that =this;
            	that.editVisible = false;
//          	var data =that.qs.stringify({
//          		id:that.tableData[that.idx].id,
//	              	realname: that.form.realname,
//                  idcard: that.form.idcard,
//                  nation: that.form.nation,
//                  address: that.form.address,
//                  status:that.form.status,
//                  status_remark:that.form.status_remark,
//	            })
//          	console.log(data)
//          	that.$axios.post(that.ports.realname.update, data)
//				.then(function (res) {
//					console.log(res);
//					if(res.data.status==200){
//						that.$message.success(`修改第 ${that.idx+1} 行成功`);
//						that.getData();
//						that.editVisible = false;
//					}else{
//						that.$message.warning(res.data.message);
//					}
//					
//				})
//				.catch(function (error) {
//					console.log(error);
//					that.$message.error(`修改第 ${that.idx+1} 行失败`);
//				});

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
