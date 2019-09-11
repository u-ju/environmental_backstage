<template>
	<div v-loading="loading">
	<div class="crumbs">
	    <el-breadcrumb separator="/">
	        <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 房屋配置分类</el-breadcrumb-item>
	    </el-breadcrumb>
	</div>
	<el-row class='pading'>
		
	<el-col   :lg='10'  :md='10' :sm="24" :xs="24">
		<el-row>
			<el-col :xs="24">
				<div class="custom-tree-container">
				  <div class="block">
				  	<el-input
					  placeholder="输入关键字进行过滤"
					  v-model="filterText2">
					</el-input>
				    <el-tree
				      :data="trentingConfig"
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
  	name: 'rentingConfig',
    data() {
      
      return {
		props: {
		  value: 'id',
          label:'name',
          children: 'children'
        },
        rentingConfig:[],
        trentingConfig:[],
        editVisible: false,
        delVisible: false,
        form:{
        	name:'',
        	sort:'',
        	parent_id:0,
        	type:'',
        	icon:''
        },
        id:-1,
        data_rentingConfig:{},
        node_rentingConfig:{},
        data_trentingConfig:{},
        node_trentingConfig:{},
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
      }
    },
	created() {
		this.getData();
		this.getrentingConfig();
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
//      this.getrentingConfig(id)
		if(id==0){
      		return this.tableData={
      			id: "",
				rentingConfig_name: "",
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
       this.$axios.get(that.ports.rentingConfig.index).then(function(res) {
        	var trentingConfig= res.data.result.list;
        	that.trentingConfig =[{id: 0,name: '房屋配置分类',parent_id:0, children: trentingConfig}]
        	that.loading=false
       })
     },
      getrentingConfig(id=0){
      	if(id==0){
      		return this.tableData={
      			id: "",
				rentingConfig_name: "",
				name: "",
				parent_id: ""
      		}
      	}
    	var that =this;
//		this.$axios.get(that.ports.rentingConfig.show+"?id="+id).then(function(res) {
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
      	if(num==1){
      		this.data_rentingConfig = data;
      		this.form.type = 1;
      	}else{
      		this.data_trentingConfig = data;
      		this.form.type = 2;
      	}
		this.id=-1;
		this.num = num
		this.form.name=''
      },
	  edit(node, data,num) {
	  	this.editVisible=true
        console.log(num)
        if(num==1){
      		this.data_rentingConfig = data;
      		this.node_rentingConfig=node;
      	}else{
      		this.data_trentingConfig = data;
      		this.node_trentingConfig=node;
      	}
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
//    	this.node_rentingConfig=node;
//      this.data_rentingConfig=data;
		if(num==1){
      		this.data_rentingConfig = data;
      		this.node_rentingConfig=node;
      	}else{
      		this.data_trentingConfig = data;
      		this.node_trentingConfig=node;
      	}
        this.num = num
      },
      saveEdit(){
      	var that = this;
    	var url = that.ports.rentingConfig.store;
    	var data=this.form;
    	if(that.id!=-1){
    		data.cate_id = that.id;
    		url = that.ports.rentingConfig.update;
    	}
    	data = that.qs.stringify(data)
    	that.$axios.post(url, data)
		.then(function (res) {
			if(res.data.status==200){
				if(that.id==-1){
					const newChild = { id: res.data.result.cate_id,type: that.form.type,name: that.form.name,parent_id:that.form.parent_id,icon:that.form.icon, children: [] };
			        
			        if(that.num==1){
			        	if (!that.data_rentingConfig.children) {
				          that.$set(that.data_rentingConfig, 'children', []);
				        }
				        that.data_rentingConfig.children.push(newChild);
			        }else{
			        	if (!that.data_trentingConfig.children) {
				          that.$set(that.data_trentingConfig, 'children', []);
				        }
				        that.data_trentingConfig.children.push(newChild);
			        }
			        
			        that.$message.success(`添加成功`);
			        
				}else{
					console.log(that.num)
					if(that.num==1){
						const parent = that.node_rentingConfig.parent;
						const children = parent.data.children || parent.data;
						const index = children.findIndex(d => d.id === that.data_rentingConfig.id);
						children[index].name=that.form.name
				        children[index].type=that.form.type
						that.$message.success(`修改成功`);
					}else{
						
						const parent = that.node_trentingConfig.parent;
						const children = parent.data.children || parent.data;
						const index = children.findIndex(d => d.id === that.data_trentingConfig.id);
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
        that.$axios.post(that.ports.rentingConfig.destroy, data)
        .then(function (res) {
        	
        	if(res.data.status==200){
        		if(that.num==1){
        			const parent = that.node_rentingConfig.parent;
			        const children = parent.data.children || parent.data;
			        const index = children.findIndex(d => d.id === that.data_rentingConfig.id);
			        children.splice(index, 1);
        		}else{
        			const parent = that.node_trentingConfig.parent;
			        const children = parent.data.children || parent.data;
			        const index = children.findIndex(d => d.id === that.data_trentingConfig.id);
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
</style>