<template>
	<div v-loading="loading">
	<div class="crumbs">
	    <el-breadcrumb separator="/">
	        <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 维修分类</el-breadcrumb-item>
	    </el-breadcrumb>
	</div>
	<el-row class='pading'>
		
	<el-col    :lg='10'  :md='10' :sm="24" :xs="24">
	<div class="custom-tree-container">
	  <div class="block">
	  	<el-input
		  placeholder="输入关键字进行过滤"
		  v-model="filterText">
		</el-input>
	    <el-tree
	      :data="repair"
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
	            @click="() => append(data)">
	            	添加
	          </el-button>
	          <el-button v-show="data.id!=0"
	            type="text"
	            size="mini"
	            @click="() => edit(node, data)">
	            	编辑
	          </el-button>
	          <el-button v-show="data.id!=0"
	            type="text"
	            size="mini"
	            @click="() => remove(node, data)">
	            	删除
	          </el-button>
	        </span>
	      </span>
	    </el-tree>
	  </div>
	</div>
	</el-col>
	<el-col   :lg='10'  :md='10' :offset='2' :sm="24" :xs="24">
		<el-form ref="form"  label-width="120px" class='from'>
            
        	<el-form-item label="类型ID">
			    <span>{{tableData.id}}</span>
			</el-form-item>
			<el-form-item label="类型名称">
			    <span>{{tableData.name}}</span>
			</el-form-item>
			<el-form-item label="父级ID">
			    <span>{{tableData.parent_id}}</span>
			</el-form-item>
		</el-form>
        
	</el-col>
	</el-row>
	<!-- 编辑弹出框 -->
        <el-dialog :title="id==-1?'添加':'编辑'" :visible.sync="editVisible">
            <el-form ref="form" :model="form" label-width="100px">
            	<el-form-item label="类型ID"  v-if='id!=-1'>
                    {{id}}
              	</el-form-item>
            	<el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
              	</el-form-item>
              	<el-form-item label="排序">
                    <el-input v-model="form.sort"></el-input>
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

  export default {
  	name: 'CateStore',
    data() {
      
      return {
		props: {
		  value: 'id',
          label:'name',
          children: 'children'
        },
        repair:[],
        editVisible: false,
        delVisible: false,
        form:{
        	name:'',
        	parent_id:0,
        	sort:''
        },
        id:-1,
        data_repair:{},
        node_repair:{},
        tableData:[],
        multipleSelection: [],
        filterText: '',
        sele:[],
        loading:true,
      }
    },
	created() {
		this.getData();
    },
     watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
    	filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
     },
    handleCheckChange(data) {
        var id = data.id
        this.tableData = data
        console.log(data)
      },
      handleNodeClick(data) {
//      console.log(data);
      },
       getData(){
    	var that =this;
		this.$axios.get(that.ports.repair.cateIndex).then(function(res) {
        	var repair= res.data.result.list;
        	that.repair =[{id: 0,name: '维修分类',parent_id:0, children: repair}]
        	that.loading=false
       }) 
      },
      append(data) {
      	this.form.name = '';
      	this.editVisible=true;
      	this.form.parent_id = data.id;
      	this.data_repair = data;
		this.id=-1;
		this.form.sort = ''
      },
	  edit(node, data) {
	  	this.editVisible=true;
        this.node_repair=node;
        this.data_repair=data;
        this.id = data.id;
        this.form.parent_id = data.parent_id;
        this.form.name = data.name||'';
        this.form.sort = data.sort||''
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        
      },
      remove(node, data) {
      	this.delVisible=true;
      	this.id = data.id;
      	this.node_repair=node;
        this.data_repair=data;
        
      },
      saveEdit(){
      	var that = this;
    	var url = that.ports.repair.cateStore;
    	var data=this.form;
    	if(that.id!=-1){
    		data.cate_id = that.id;
    		url = that.ports.repair.cateUpdate;
    	}
    	data = that.qs.stringify(data)
    	that.$axios.post(url, data)
		.then(function (res) {
			if(res.data.status==200){
				if(that.id==-1){
					const newChild = { id: res.data.result.cate_id,name: that.form.name,parent_id:that.form.parent_id, children: [] };
			        
			        if (!that.data_repair.children) {
			          that.$set(that.data_repair, 'children', []);
			        }
			        that.data_repair.children.push(newChild);
			        that.$message.success(`添加成功`);
			        
				}else{
					const parent = that.node_repair.parent;
			        const children = parent.data.children || parent.data;
			        const index = children.findIndex(d => d.id === that.data_repair.id);
			        children[index].name=that.form.name
					that.$message.success(`修改成功`);
				}
				that.editVisible = false;
				that.form.name=''
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
        that.$axios.post(that.ports.repair.cateDestroy, data)
        .then(function (res) {
        	if(res.data.status==200){
        		const parent = that.node_repair.parent;
		        const children = parent.data.children || parent.data;
		        const index = children.findIndex(d => d.id === that.data_repair.id);
		        children.splice(index, 1);
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
</style>