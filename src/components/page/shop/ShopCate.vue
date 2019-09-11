<template>
	<div v-loading="loading">
	<div class="crumbs">
	    <el-breadcrumb separator="/">
	        <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 商家分类</el-breadcrumb-item>
	    </el-breadcrumb>
	</div>
	<el-row class='pading'>
		
	<el-col   :lg='10'  :md='10' :sm="24" :xs="24">
		<el-row>
			<!--<el-col :xs="24">
				<div class="custom-tree-container">
				  <div class="block">
				  	<el-input
					  placeholder="输入关键字进行过滤"
					  v-model="filterText">
					</el-input>
				    <el-tree
				      :data="shopCate"
				      :props="props"
				      show-checkbox
				      node-key="id"
				      default-expand-all
				      :expand-on-click-node="false"
				      @node-click="handleCheckChange"
				      :filter-node-method="filterNode"
						ref="tree2"
				      >
				      
				      <span class="custom-tree-node" slot-scope="{ node, data }">
				        <span>{{ node.label }}</span>
				        <span >
				          <el-button
				            type="text"
				            size="mini"
				            @click="() => append(data,1)">
				            	添加
				          </el-button>
				          <el-button v-show="data.id!=0"
				            type="text"
				            size="mini"
				            @click="() => edit(node, data,1)">
				            	编辑
				          </el-button>
				          <el-button v-show="data.id!=0"
				            type="text"
				            size="mini"
				            @click="() => remove(node, data,1)">
				            	删除
				          </el-button>
				        </span>
				      </span>
				    </el-tree>
				  </div>
				</div>
			</el-col>-->
			<el-col :xs="24">
				<div class="custom-tree-container">
				  <div class="block">
				  	<el-input
					  placeholder="输入关键字进行过滤"
					  v-model="filterText2">
					</el-input>
				    <el-tree
				      :data="tshopCate"
				      :props="props"
				      show-checkbox
				      node-key="id"
				      :expand-on-click-node="false"
				      @node-click="handleCheckChange"
				      :filter-node-method="filterNode2"
						ref="tree3"
				      >
				      
				      <span class="custom-tree-node" slot-scope="{ node, data }">
				        <span>{{ node.label }}</span>
				        <span >
				          <el-button
				            type="text"
				            size="mini"
				            @click="() => append(data,2)">
				            	添加
				          </el-button>
				          <el-button v-show="data.id!=0"
				            type="text"
				            size="mini"
				            @click="() => edit(node, data,2)">
				            	编辑
				          </el-button>
				          <el-button v-show="data.id!=0"
				            type="text"
				            size="mini"
				            @click="() => remove(node, data,2)">
				            	删除
				          </el-button>
				        </span>
				      </span>
				    </el-tree>
				  </div>
				</div>
			</el-col>
		</el-row>
	</el-col>
	<el-col   :lg='10'  :md='10' :offset='2' :sm="24" :xs="24">
		<el-form ref="form"  label-width="120px" class='from'>
            
        	<el-form-item label="分类ID">
			    <span>{{tableData.id}}</span>
			</el-form-item>
			<el-form-item label="商店名称">
			    <span>{{tableData.name}}</span>
			</el-form-item>
			<el-form-item label="父级ID">
			    <span>{{tableData.parent_id}}</span>
			</el-form-item>
			<el-form-item label="图标">
			    <img :src="tableData.icon" />
			</el-form-item>
		</el-form>
	</el-col>
	</el-row>
	<!-- 编辑弹出框 -->
        <el-dialog :title="id==-1?'添加':'编辑'" :visible.sync="editVisible">
            <el-form ref="form" :model="form" label-width="100px">
            	<el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
               	</el-form-item>
               	<!--<template v-if='id!=-1'>
               	<el-form-item label="商家让利" v-for="(item,index) in rang" :key="index" >
                    <div class="flex">
                    	<el-input v-model="form.rangli[index]" type='number'  ></el-input>
                    	<i class="el-icon-delete"  @click="deleteli(index)"></i>
                    	<i class="el-icon-circle-plus-outline"  @click="addli"></i>
                    </div>
               	</el-form-item>
               	</template>-->
               	<el-form-item label="排序">
                    <el-input v-model="form.sort"></el-input>
               	</el-form-item>
               	<el-form-item label="图标">
					<el-upload
					  class="avatar-uploader"
					  :action="uploadurl"
					  :show-file-list="false"
					  :http-request="upLoad"
					  >
					  <img v-if="form.icon" :src="form.icon" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
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
	let id = 1000;
import store from '@/store/store'
  export default {
  	name: 'shopCate',
    data() {
      
      return {
		props: {
		  value: 'id',
          label:'name',
          children: 'children'
        },
        shopCate:[],
        tshopCate:[],
        editVisible: false,
        delVisible: false,
        form:{
        	name:'',
        	sort:'',
        	parent_id:0,
        	type:'',
        	icon:'',
//      	rangli:[]
        },
        id:-1,
        data_shopCate:{},
        node_shopCate:{},
        data_tshopCate:{},
        node_tshopCate:{},
        tableData:[],
        multipleSelection: [],
        filterText: '',
        filterText2:'',
        sele:[],
        num:'',
        loading:true,
        test:store.state.http,
        uploadurl:'',
        dialogImageUrl: '',
        rang:1
      }
    },
	created() {
		this.getData();
		this.getshopCate();
		this.getSele()
		this.uploadurl = this.ports.Base+this.ports.common.imageBatch
    },
     watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      filterText2(val) {
        this.$refs.tree3.filter(val);
      }
    },
    methods: {
    	addli(){
    		this.rang=this.rang-0+1
    	},
    	deleteli(e){
    		console.log(e)
    		this.form.rangli.splice(e,1)
    		this.rang=this.rang-1
    	},
    	filterNode(value, data) {
    		console.log(value)
	        if (!value) return true;
	        return data.name.indexOf(value) !== -1;
     	},
     	filterNode2(value, data) {
     		console.log(value)
	        if (!value) return true;
	        return data.name.indexOf(value) !== -1;
     	},
    handleCheckChange(data) {
        var id = data.id
        console.log(data)
//      this.getshopCate(id)
		if(id==0){
      		return this.tableData={
      			id: "",
				shopCate_name: "",
				name: "",
				parent_id: ""
      		}
      	}
		this.tableData = data;
      },
      handleNodeClick(data) {
//      console.log(data);
      },
       getData(){
    	var that =this;
//		this.$axios.get(that.ports.shopCate.index+"?type=1").then(function(res) {
//      	var shopCate= res.data.result.list;
//      	that.shopCate =[{id: 0,name: '便民商家',parent_id:0, children: shopCate}]
//     }) 
       this.$axios.get(that.ports.shopCate.index+"?type=2").then(function(res) {
        	var tshopCate= res.data.result.list;
        	that.tshopCate =[{id: 0,name: '实体商家分类',parent_id:0, children: tshopCate}]
        	that.loading=false
       })
      },
      getSele(){
    	var that =this;
		this.$axios.get(that.ports.Home.config).then(function(res) {
        	that.sele = res.data.result.shop_type;
       }) 
      },
      getshopCate(id=0){
      	if(id==0){
      		return this.tableData={
      			id: "",
				shopCate_name: "",
				name: "",
				parent_id: ""
      		}
      	}
    	var that =this;
//		this.$axios.get(that.ports.shopCate.show+"?id="+id).then(function(res) {
//      	that.tableData = res.data.result;
//      	
//     }) 
      },
      upLoad (file) {
      		const formData = new FormData()
      		var that =this;
		      formData.append('file',file.file)
		      formData.append('image',file.file)
		      formData.append('source','file')
		      this.$axios.post(`/api/common/upload/image`,formData).then(res => res.data)
		      .then(data => {
		      	
		        console.log(data)
		        if(data.status == 200){
		          that.dialogImageUrl=data.result.image_url
		          that.form.icon = data.result.image_url
//		          that.dialogVisible = true;
		        }else{
		        	that.$message.warning(res.data.message);
		        }
		      })
		      .catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
		},
		handleRemove(file, fileList) {
		        console.log(file, fileList);
		      },
		      handlePictureCardPreview(file) {
		      	console.log(file)
		        this.dialogImageUrl = file.url;
		        this.dialogVisible = true;
		      },
      append(data,num) {
      	this.editVisible=true;
      	this.form.parent_id = data.id;
//    	this.form.rangli=[]
      	if(num==1){
      		this.data_shopCate = data;
      		this.form.type = 1;
      	}else{
      		this.data_tshopCate = data;
      		this.form.type = 2;
      	}
		this.id=-1;
		this.num = num
		this.form.name=''
      },
	  edit(node, data,num) {
	  	this.editVisible=true
        console.log(data)
        if(num==1){
      		this.data_shopCate = data;
      		this.node_shopCate=node;
      	}else{
      		this.data_tshopCate = data;
      		this.node_tshopCate=node;
      	}
//    	this.form.rangli=data.rangli'
//    	this.rang=data.rangli.length
        this.id = data.id;
        this.form.parent_id = data.parent_id;
        this.form.name = data.name||'';
        this.form.type = data.type;
        this.form.icon = data.icon;
        this.dialogImageUrl = data.icon;
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        this.num = num
      },
      remove(node, data,num) {
      	this.delVisible=true;
      	this.id = data.id;
//    	this.node_shopCate=node;
//      this.data_shopCate=data;
		if(num==1){
      		this.data_shopCate = data;
      		this.node_shopCate=node;
      	}else{
      		this.data_tshopCate = data;
      		this.node_tshopCate=node;
      	}
        this.num = num
      },
      saveEdit(){
      	var that = this;
    	var url = that.ports.shopCate.store;
    	var data=this.form;
    	if(that.id!=-1){
    		data.cate_id = that.id;
    		url = that.ports.shopCate.update;
    	}
    	data = that.qs.stringify(data)
    	that.$axios.post(url, data)
		.then(function (res) {
			if(res.data.status==200){
				if(that.id==-1){
					const newChild = { id: res.data.result.cate_id,type: that.form.type,name: that.form.name,parent_id:that.form.parent_id,icon:that.form.icon, children: [] };
			        
			        if(that.num==1){
			        	if (!that.data_shopCate.children) {
				          that.$set(that.data_shopCate, 'children', []);
				        }
				        that.data_shopCate.children.push(newChild);
			        }else{
			        	if (!that.data_tshopCate.children) {
				          that.$set(that.data_tshopCate, 'children', []);
				        }
				        that.data_tshopCate.children.push(newChild);
			        }
			        
			        that.$message.success(`添加成功`);
			        
				}else{
					console.log(that.num)
					if(that.num==1){
						const parent = that.node_shopCate.parent;
						const children = parent.data.children || parent.data;
						const index = children.findIndex(d => d.id === that.data_shopCate.id);
						children[index].name=that.form.name
				        children[index].type=that.form.type
						that.$message.success(`修改成功`);
					}else{
						
						const parent = that.node_tshopCate.parent;
						const children = parent.data.children || parent.data;
						const index = children.findIndex(d => d.id === that.data_tshopCate.id);
						console.log(parent)
						console.log(children)
						console.log(index)
						children[index].name=that.form.name
				        children[index].type=that.form.type
						that.$message.success(`修改成功`);
					}
			        
			        
			        
				}
				that.editVisible = false;
				that.form.name=''
				that.form.type=''
			}else{
				that.$message.warning(res.data.message);
			}
			
		})
		.catch(function (error) {
			
			that.$message.error(`执行失败`);
		});
      },
      deleteRow(){
      	var that = this;
		var data =that.qs.stringify({
    		cate_id:that.id,
        })
        that.$axios.post(that.ports.shopCate.destroy, data)
        .then(function (res) {
        	
        	if(res.data.status==200){
        		if(that.num==1){
        			const parent = that.node_shopCate.parent;
			        const children = parent.data.children || parent.data;
			        const index = children.findIndex(d => d.id === that.data_shopCate.id);
			        children.splice(index, 1);
        		}else{
        			const parent = that.node_tshopCate.parent;
			        const children = parent.data.children || parent.data;
			        const index = children.findIndex(d => d.id === that.data_tshopCate.id);
			        children.splice(index, 1);
        		}
		        
		        
				that.$message.success('删除成功');
			}else{
				that.$message.warning(res.data.message);
			}
        })
        .catch(function (res) {
        	
        	that.$message.error('删除失败');
        })
        that.delVisible = false;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    }
  };
</script>

<style scoped="scoped">
	 .custom-tree-node {
	    flex: 1;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    font-size: 14px;
	    padding-right: 8px;
	  }
	.el-row{
		background-color: white;
		min-height: 500px;
	}
	.pading{
		padding: 20px;
	}
	.from{
    	box-shadow: 0 0 6px #CCCCCC;
    	padding: 20px 10px;
    	margin: 10px 0;
    	border-radius: 10px;
    	/*width: 500px;*/
    	width: 90%;
    }
    img{
    	width: 160px;
    }
    .avatar-uploader-icon{
    	position: absolute;
    	top: 50%;
    	margin: -20px 0 0 -10px;
    	font-size: 30px;   
    	left: 50%; 
    }
    .flex{
    	display: flex;
    }
    .el-icon-circle-plus-outline,.el-icon-delete{
    	font-size: 30px;
    	margin-left: 20px;
    	color: #67C23A;
    }
    .el-icon-delete{
    	color: #F56C6C;
    }
</style>