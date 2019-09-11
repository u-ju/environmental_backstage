<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-profile"></i> 订单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                
                <el-select v-model="search1.status" clearable  placeholder="订单状态" class="handle-select mr10">
                    <el-option
				      v-for="item in order_info_search_status"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-select v-model="search1.payment" clearable  placeholder="支付方式" class="handle-select mr10">
                    <el-option
				      v-for="item in payment"
				      :key="item.cate_id"
				      :value="item.cate_id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-input v-model="search1.user_id" placeholder="用户ID" class="handle-input mr10"></el-input>
                <el-input v-model="search1.order_no" placeholder="订单编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>

            </div>
            <el-table :data="tableData"  class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column  type="expand" prop="order_goods">
				  	<template slot-scope="scope" >
					   <el-table  class="table1" style="width: 100%"  :data="scope.row.order_goods" >
					   		<el-table-column prop="thumb" label="图片"  align="center">
					         	<template slot-scope="scope">
					         		<img  :src="scope.row.thumb" alt="" style="width: 50px;">
					         	</template>
					      	</el-table-column>
					      	<el-table-column prop="spu_name" label="商品名称"  align="center">
					      	</el-table-column>
					      	<el-table-column prop="sku_name" label="商品规格"  align="center">
					      	</el-table-column>
					      	
					      	<el-table-column prop="buy_count" label="购买数量"  align="center">
					      	</el-table-column>
					      	<el-table-column prop="real_price" label="金额"  align="center">
					      	</el-table-column>
					    </el-table>
					</template>
				</el-table-column>
				<el-table-column prop="order_id" label="订单ID"  align="center" >
				</el-table-column>
				<el-table-column prop="user_id" label="用户ID"  width="100" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                </el-table-column>
                <el-table-column prop="order_no" label="订单编号"  align="center" >
				</el-table-column>
                <el-table-column prop="order_amount" label="订单金额"  align="center" >
				</el-table-column>
				<el-table-column prop="payment_name" label="支付方式"  align="center" >
				</el-table-column>
				<el-table-column prop="order_status_name" label="订单状态"  align="center" >
				</el-table-column>
                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handle(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row,1)">发货</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row,2)">添加物流</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>
		<el-dialog :title="title" :visible.sync="editVisible1" width="40%">
			<el-form ref="form" :model="form" label-width="100px">
				<template v-for="(item,i) in wl" >
					<el-form-item label="物流key">
	                    <el-select v-model="form.express_key[i]" clearable  class="handle-select mr10">
		                    <el-option
						      v-for="item in order_logistics_express"
						      :key="item.key"
						      :value="item.key"
						      :label="item.name">
						    </el-option>
		                </el-select>
	                </el-form-item>
	                <el-form-item label="物流单号">
	                    <el-input v-model="form.express_num[i]" width='216'></el-input>
	                </el-form-item>
				</template>
            	<div class="center-align tjwl" @click="tjwl">
            		<i class="el-icon-circle-plus-outline"></i>添加物流
            	</div>
                
            </el-form>
			<span slot="footer" class="dialog-footer">
                <el-button @click="editVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="详情" :visible.sync="editVisible" width="40%">
            <el-form ref="res" :model="res" label-width="100px">
            	<el-form-item label="订单编号">
                    <div>{{res.order_no}}</div>
                </el-form-item>
                <el-form-item label="订单总金额">
                    <div>{{res.order_amount}}</div>
                </el-form-item>
                <el-form-item label="用户名称">
                    <div>{{res.shipping_name}}</div>
                </el-form-item>
                <el-form-item label="用户手机号">
                    <div>{{res.shipping_phone}}</div>
                </el-form-item>
                <el-form-item label="用户地址">
                    <div>{{res.shipping_address}}</div>
                </el-form-item>
                <el-form-item label="支付方式">
                    <div>{{res.payment_name}}</div>
                </el-form-item>
                <el-form-item label="商品">
                	
                	<el-row>
					  <el-col :span="10" v-for="(order_goods, index) in res.order_goods" :key='index' :offset="index > 0 ? 1 : 0">
					    <el-card :body-style="{ padding: '0px' }">
					      <img :src="order_goods.thumb" class="image">
					      <div style="padding: 14px;">
					        <div>{{order_goods.spu_name}}{{order_goods.sku_name}}</div>
					        <div>{{order_goods.real_price}}<i class="el-icon-close"></i>{{order_goods.buy_count}}</div>
					        
					      </div>
					    </el-card>
					  </el-col>
					</el-row>
                </el-form-item>
                <el-form-item label="物流">
                	<div v-for="(item,index) in res.order_logistics" :key="index" class="border">
                		<el-button type="danger" icon="el-icon-delete" @click='delwl(item.logistics_id)' class='shanchu' circle></el-button>
                		<div>物流名称： {{item.express_key_name}}</div>
                		<div>物流单号： {{item.express_num}}</div>
                		<div>创建时间： {{item.created_at}}</div>
                	</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editVisible = false">确 定</el-button>
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
	
    export default {
        name: 'Order',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                editVisible1: false,
                form:{
                	order_id:'',
                	express_key:[],
                	express_num:[]
                },
                search1:{
                	status:'',
                	payment:'',
                	payment:'',
                	order_no:''
                },
                idx: -1,
                tableData1:[],
                loading:true,
                last_page:1,
                url:'',
                area:[],
                res:{},
                props: {
				  value: 'area_id',
		          label:'name',
		          children: 'children'
		        },
		        order_info_search_status:[],
		        payment:[],
		        order_logistics_express:[],
		        wl:1,
		        title:'发货',
		        zzxx:1,
		        logistics_id:''
            }
        },
        created() {
            this.getData();
	        this.getSele();
        },
        computed: {
            data() {
            	return this.tableData

            }
        },
        methods: {
        	tjwl(){
        		this.wl=this.wl+1
        	},
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val,this.url);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.order.index+"?page="+page+"&source=exchange"+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
		    getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
					that.order_info_search_status = res.data.result.order_info_search_status
					that.payment = res.data.result.payment
					that.order_logistics_express = res.data.result.order_logistics_express
				})
			},
            search() {
                this.url = "&status="+this.search1.status+"&payment="+this.search1.payment+"&payment="+this.search1.payment+"&order_no="+this.search1.order_no
                this.getData(1,this.url)
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handle(index, row) {
                this.idx = index;
                var that =this
                const item = this.tableData[index];
                this.$axios.get(that.ports.order.show+'?order_id='+this.tableData[index].order_id).then(function(res) {
		            
		           	that.res = res.data.result
		        })
                
                this.editVisible = true;
            },
            handleEdit(index, row,i){
            	this.form={
                	order_id:'',
                	express_key:[],
                	express_num:[]
                }
            	this.wl=1
            	this.idx = index;
                var that =this
                this.editVisible1 = true;
                this.zzxx=i
                this.title=i==1?"发货":"添加物流"
                this.form.order_id=that.tableData[index].order_id
                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delwl(logistics_id){
            	this.delVisible=true;
            	this.logistics_id = logistics_id
            },
            saveEdit() {
            	console.log(this.form)
            	
            	console.log(this.idx)
            	var that =this;
            	var data={}
            	data["order_id"] = that.form.order_id
            	for (var i=0;i<this.wl;i++){
            		data['logistics['+i+'][express_key]']=that.form.express_key[i]
            		data['logistics['+i+'][express_num]']=that.form.express_num[i]
            	}
            	
            	console.log(data)
            	data =that.qs.stringify(data)
            	var url = that.ports.order.deliver;
            	if(this.zzxx==2){
            		url = that.ports.order.expressStore;
            	}
            	that.$axios.post(url, data)
				.then(function (res) {
					console.log(res);
					if(res.data.status==200){
						that.$message.success(res.data.message);
						that.getData();
						that.editVisible1 = false;
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`修改失败`);
				});
            },
            deleteRow(){
            	var that = this;
				var data =that.qs.stringify({
            		'logistics_id[0]':that.logistics_id
            	})
                that.$axios.post(that.ports.order.expressDestroy, data)
                .then(function (res) {
                	if(res.data.status==200){
                		that.getData();
						that.$message.success('删除成功');
						that.editVisible = false;
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
   .time {
    font-size: 13px;
    color: #999;
  }
 
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  .tjwl{
  	text-align: center;
  	color: #67C23A;
  	font-size: 20px;
  	cursor: pointer;
  }
  .el-icon-circle-plus-outline{
  	margin-right: 4px;
  }
   .border{
  	box-shadow: 0 0 4px #ccc;
  	position: relative;
  	width: 50%;
  	padding: 0 20px;
  	margin-bottom: 20px;
  }
  .shanchu{
  	position: absolute;
  	right: 20px;
  	top: 10px;
  	
  }
</style>
