<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>商品规格</el-breadcrumb-item>
                <!--<i class="el-icon-lx-delete"></i>--> 
            </el-breadcrumb>
        </div>
        
        <el-row class='bgfff'>
        	<el-col :span="23" :offset="1" class='marb20'>
        		<el-button type="primary" class='marr30' icon="el-icon-circle-plus-outline" @click="handleUpdate('','')">添加规格</el-button>
        		<el-input v-model="spec_id" placeholder="规格id" class="handle-input mr10"></el-input>
        		<el-button type="primary" icon="search" @click="search">搜索</el-button>
        	</el-col>
        	<el-col :span="24"  v-if="tableData.length==0">
        		<div class="centertxt">
        			暂无数据
        		</div>
        	</el-col>
        	<template v-else>
        	<el-col :span="10" :offset="1" class="container relative" v-for="(item,index) in tableData" :key="index" >
	        <!--<div >-->
	        	<div class="delbtn"><el-button type="danger" icon="el-icon-delete" circle @click="handleDdestroy(item.spec_id,item.spec_name)"></el-button></div>
	        	<div class="spec_name">{{item.spec_name}}</div>
	            <div class="handle-box">
	            	<!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
	                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(item.spec_id)'>添加{{item.spec_name}}</el-button>
	                <el-button type="primary" class='marr30' icon="el-icon-edit" @click="handleUpdate(item.spec_id,item.spec_name)">编辑{{item.spec_name}}</el-button>
        			<!--<el-button type="primary" class='marr30 bgred' icon="el-icon-delete" @click="handleDdestroy(item.spec_id,item.spec_name)">删除{{item.spec_name}}</el-button>-->
	            </div>
	            <el-table :data="item.spec_values" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
	                <!--<el-table-column type="selection" width="55"  align="center"></el-table-column>-->
	                <el-table-column prop="spec_id" label="规格id" sortable width="100" align="center">
	                </el-table-column>
	                <el-table-column  prop='spec_value' label="规格名称" align="center">
	                </el-table-column>
	                
	                <el-table-column  prop='spec_value_id' label="规格值" align="center">
	                </el-table-column>
					
	                <el-table-column label="操作" width="180" align="center">
	                    <template slot-scope="scope">
	                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(item.spec_id, scope.row.spec_value_id,scope.row.spec_value)">编辑</el-button>
	                    	<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.spec_value_id)">删除</el-button>
	                    </template>
	                </el-table-column>
	            </el-table>
	        <!--</div>-->
	        </el-col>
	        </template>
		</el-row>
<!-- 编辑弹出框 -->
        <el-dialog :title="form.spec_id==-1?'添加':'编辑'" :visible.sync="store" width="40%">
            <el-form ref="form"  label-width="100px">
                <el-form-item label="规格名称">
                	<el-input v-model="form.spec_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="store = false">取 消</el-button>
                <el-button type="primary" @click="savestore">确 定</el-button>
            </span>
        </el-dialog>
		<el-dialog :title="form1.spec_value_id==-1?'添加':'编辑'" :visible.sync="editVisible" width="40%">
            <el-form ref="form1"  label-width="100px">
                <el-form-item label="规格值">
                	<el-input v-model="form1.spec_value"></el-input>
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
        
        <el-dialog title="提示" :visible.sync="destroy" width="300px">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="destroy = false">取 消</el-button>
                <el-button type="primary" @click="deldestroy">确 定</el-button>
            </span>
        </el-dialog>
   </div>
</template>

<script>
export default {
	name: 'GoodsSpec',
  	data() {
    	return {
    		loading:true,
    		tableData:[],
    		editVisible:false,
    		delVisible:false,
    		store:false,
    		destroy:false,
    		form:{
    			spec_id:'',
    			spec_name:''
    		},
    		form1:{
    			spec_id:'',
    			spec_value_id:'',
    			spec_value:''
    		},
    		spec_id:''
    	}
   	},
   	created() {
        this.getData();
    },
	methods: {
	  	getData(url='') {
	    	var that =this;
			this.$axios.get(that.ports.goodsSpec.groupIndex+url).then(function(res) {
	        	that.tableData = res.data.result.list;
	            that.loading = false
	       })
	    },
	    handleUpdate(id, spec_name) {
            this.form.spec_name=spec_name || ''
            this.form.spec_id=id||''
            this.store=true
        },
        handleDdestroy(id, spec_name) {
            this.form.spec_id=id||''
            this.destroy=true
        },
        deldestroy(){
        	var that = this;
			var data =that.qs.stringify({
        		spec_id:this.form.spec_id
            })
            that.$axios.post(that.ports.goodsSpec.destroy, data)
            .then(function (res) {
            	if(res.data.status==200){
            		that.getData();
            		that.destroy=false
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
        search() {
            
//          for(var key in data){
//          	this.url=this.url+"&"+key+"="+data[key]
//          }
            this.getData("?spec_id[0]="+this.spec_id)
            },
	    savestore(index, row) {
        	var that = this;
        	var data=this.form
        	for (var i in data){
        		if(data[i]==''){
        			delete data[i]
        		}
        	}
        	data =that.qs.stringify(data)
        	var url = that.ports.goodsSpec.store
        	if(this.form.spec_id !=''&&this.form.spec_id !=undefined){
        		url = that.ports.goodsSpec.update
        	}
        	that.$axios.post(url,data)
			.then(function (res) {
				if(res.data.status==200){
					that.$message.success(`操作成功`);
					
					that.getData();
					that.store=false
				}else{
					that.$message.warning(res.data.message);
				}
				
			})
			.catch(function (error) {
				console.log(error);
				that.$message.error(`执行失败`);
			});
            
        },
        
    	handleEdit(spec_id, spec_value_id,spec_value) {
        	var that = this;
            this.form1.spec_value_id=spec_value_id || ''
            this.form1.spec_id=spec_id||''
            this.form1.spec_value=spec_value||''
            this.editVisible=true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 保存编辑
        saveEdit() {
        	var that = this;
        	var data = this.form1;
        	for (var i in data){
        		if(data[i]==''){
        			delete data[i]
        		}
        	}
        	console.log(this.form.spec_id)
        	var url = that.ports.goodsSpec.valueStore;
        	if(that.form1.spec_value_id!=''&&that.form1.spec_value_id!=undefined){
        		url = that.ports.goodsSpec.valueUpdate;
        	}
        	data=that.qs.stringify(data)
        	that.$axios.post(url, data)
			.then(function (res) {
				console.log(res);
				if(res.data.status==200){
					that.getData();
					that.editVisible = false;
					that.$message.success(`操作成功`);
					
				}else{
					that.$message.warning(res.data.message);
				}
				
			})
			.catch(function (error) {
				console.log(error);
				that.$message.error(`执行失败`);
			});
        },
         handleDelete(spec_value_id) {
            this.form1.spec_value_id=spec_value_id || ''
            this.delVisible = true;
        },
        // 确定删除
        deleteRow(){
			var that = this;
			var data =that.qs.stringify({
        		spec_value_id:this.form1.spec_value_id
            })
            that.$axios.post(that.ports.goodsSpec.valueDestroy, data)
            .then(function (res) {
            	if(res.data.status==200){
            		that.getData();
            		that.delVisible=false
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

<style>
	.table{
		margin-top: 20px;
	}
	.red{
        color: #ff0000;
    }
    .bgfff{
    	background-color: white;
    	padding: 40px 0;
    	min-height: 400px;
    }
    .spec_name{
    	text-align: center;
    	margin-bottom: 20px;
    }
    .marb20{
    	margin-bottom: 20px;
    }
    .container{
    	margin-bottom: 10px;
    }
    .bgred{
    	background-color: #ff0000;
    	border-color: #ff0000;
    }
    /*.marb20 .marr30{
    	margin: 0 0 0px 30px;
    }*/
   .centertxt{
   	text-align: center;
   }
   .relative{
   	position: relative;
   }
   .delbtn{
   	position: absolute;
   	right: 10px;
   	top: 10px;
   }
</style>