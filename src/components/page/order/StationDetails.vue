<template>
<div>
	<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-friend"></i> 站点订单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
	<div v-loading="loading" class="container" v-if="!loading">
		<div class="">
			<div class="item">
				<span class="item_head">订单编号</span>
				<span>{{result.order_no}}</span>
			</div>
			<div class="item">
				<span class="item_head">订单状态</span>
				<span>{{result.order_status_name}}</span>
			</div>
			<div class="item">
				<span class="item_head">订单总额</span>
				<span>{{result.order_amount}}</span>
			</div>
		</div>
		<el-row>
			<el-col  :lg='12'  :md='12' :sm="24" :xs="24">
			<el-row>
	        <el-col  :xs="24">
	        	<div class="from">
	        		<div class="center">订单</div>
	        		<el-table :data="result.details" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table1">
		                <el-table-column prop="garbage_cate_id" label="垃圾分类ID" sortable width="100" align="center">
		                </el-table-column>
		                <el-table-column prop='garbage_cate_name' label="名称" align="center">
		                </el-table-column>
		                <el-table-column prop="price" label="单价"  align="center">
		                </el-table-column>
		                <el-table-column prop="weight" label="重量"  align="center">
		                </el-table-column>
		                <el-table-column prop="count" label="数量"  align="center">
		                </el-table-column>
		                <el-table-column prop="amount" label="总额"  align="center">
		                </el-table-column>
		           </el-table>
	        	</div>
	        </el-col>
	        <el-col    :xs="24">
	        	<div class="from">
	        		<div class="center">订单</div>
	        		<div class="item">
						<span class="item_head">订单总额</span>
						<span>{{result.bag_stat.amount}}</span>
					</div>
	        		<el-table :data="result.bag_stat.garbage_cate" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table1">
		                <el-table-column prop="garbage_cate_id" label="垃圾分类ID" sortable width="100" align="center">
		                </el-table-column>
		                <el-table-column prop='garbage_cate_name' label="名称" align="center">
		                </el-table-column>
		                <el-table-column prop="price" label="单价"  align="center">
		                </el-table-column>
		                <el-table-column prop="weight" label="重量"  align="center">
		                </el-table-column>
		                <el-table-column prop="count" label="数量"  align="center">
		                </el-table-column>
		                <el-table-column prop="amount" label="总额"  align="center">
		                </el-table-column>
		           </el-table>
	        	</div>
	        </el-col>
	        </el-row>
	        </el-col>
	        <el-col   :lg='12'  :md='12' :sm="24" :xs="24">
	        	<div class="from">
	        		<div class="center">订单</div>
	        		<template v-for="(bag_order_arr, index) in result.bag_order_arr">
		        		<div class="item_row">
		        			<div class="item">
								<span class="item_head">订单ID</span>
								<span>{{bag_order_arr.order_id}}</span>
							</div>
		        			<div class="item">
								<span class="item_head">垃圾袋编号</span>
								<span>{{bag_order_arr.bag_no}}</span>
							</div>
		        		</div>
		        		<el-table :data="bag_order_arr.details" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table1">
			                <el-table-column prop="garbage_cate_id" label="垃圾分类ID" sortable width="100" align="center">
			                </el-table-column>
			                <el-table-column prop='garbage_cate_name' label="名称" align="center">
			                </el-table-column>
			                <el-table-column prop="price" label="单价"  align="center">
			                </el-table-column>
			                <el-table-column prop="weight" label="重量"  align="center">
			                </el-table-column>
			                <el-table-column prop="count" label="数量"  align="center">
			                </el-table-column>
			                <el-table-column prop="amount" label="总额"  align="center">
			                </el-table-column>
			           </el-table>
		           </template>
	        	</div>
	        </el-col>
	        
        </el-row>
	</div>
</div>
</template>

<script>
	import VueCropper  from 'vue-cropperjs';
	export default {
    name: 'UserDetails',
    data () {
      return {
      	loading:true,
        id: '',
        psdxg:true,
        psdxg_cat:true,
        
        dispaly:[],
        result:[],
        wallet:[],
        defaultSrc: '',
        imgSrc: '',
        cropImg: '',
        dialogVisible: false,
        wallet_field:[],
        wallet_status:[],
        user_status:[],

      }
    },
    created(){
       this.getParams()
       this.getData()
//     
    },
    methods: {
      getParams () {
        // 取到路由带过来的参数 
        if(!this.$route.query.id){
        	return false
        }
        var routerParams = this.$route.query.id
        // 将数据放在当前组件的数据内
        this.id = routerParams
//      console.log(this.id)
      },
      getData() {
	    	var that =this;
	    	if(!that.id){
	        	return false
	        }
			this.$axios.get(that.ports.garbage.stationOrderShow+that.id).then(function(res) {
				that.result = res.data.result
				that.loading = false;
	       }) 
	    },
	  handleSelectionChange(val) {
        this.multipleSelection = val;
        
    	},
    },
    watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    
    '$route': ['getParams','getData']
    
      
    }
  }

</script>

<style scoped="scoped">
.item_head{
	display: inline-block;
	width: 100px;
}
.item_row{
	display: flex;
	padding: 30px 0 10px 0;
}
.item_row .item{
	width: 50%;
}
.crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
        float: left;
    }
    .form-box{
    	width: 100%;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
    .left{
    	float: left;
    	width: 68px;
    	padding: 0 12px 0 0;
    	text-align: right;
	    float: left;
	    font-size: 14px;    
	    color: #606266;
    }
    .crop-demo{
    	overflow: hidden;
    	margin-bottom: 40px;
    }
    .crop-demo img{
    	width: 80px;
    	float: left;
    	/*margin-left: 92px;*/
    }
    .from{
    	box-shadow: 0 0 6px #CCCCCC;
    	padding: 20px 10px;
    	margin: 10px 0;
    	border-radius: 10px;
    	/*width: 500px;*/
    	width: 90%;
    }
    .center{
    	text-align: center;
    	margin: 0px auto 20px auto;
    }
    .psd_btn{
    	float: right;
    }
    .psd{
    	width: 300px;
    	float: left;
    }
    .psd input{
    	width: 100% !important;
    }
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .table,.el-table__body{
        width: 100% !important;
        font-size: 14px;
    }
</style>
