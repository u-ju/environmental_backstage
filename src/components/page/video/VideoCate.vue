<template>
	<div>
	<div class="crumbs">
	    <el-breadcrumb separator="/">
	        <el-breadcrumb-item><i class="el-icon-lx-record"></i> 视频分类</el-breadcrumb-item>
	    </el-breadcrumb>
	</div>
	<el-row class='pading'>
		
	<el-col   :lg='10'  :md='10' :sm="24" :xs="24">
	<div class="custom-tree-container">
	  <div class="block">
	  	<el-input
		  placeholder="输入关键字进行过滤"
		  v-model="filterText">
		</el-input>
	    <el-tree
	      :data="videoCate"
	      :props="props"
	      show-checkbox
	      node-key="cate_id"
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
	          <el-button v-show="data.cate_id!=0"
	            type="text"
	            size="mini"
	            @click="() => edit(node, data)">
	            	编辑
	          </el-button>
	          <el-button v-show="data.cate_id!=0"
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
			    <span>{{tableData.cate_id}}</span>
			</el-form-item>
			<el-form-item label="类型名称">
			    <span>{{tableData.name}}</span>
			</el-form-item>
			<el-form-item label="父级ID">
			    <span>{{tableData.parent_id}}</span>
			</el-form-item>
			<el-form-item label="视频类型名称">
			    <span>{{tableData.cate_name}}</span>
			</el-form-item>
		</el-form>
        
	</el-col>
	</el-row>
	<!-- 编辑弹出框 -->
        <el-dialog :title="cate_id==-1?'添加':'编辑'" :visible.sync="editVisible">
            <el-form ref="form" :model="form" label-width="100px">
            	<el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
               </el-form-item>
               <!--<el-form-item label="类型">
	                <el-select v-model="form.type"  placeholder="请选择">
	                	<el-option
					      v-for="item in sele"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
	                </el-select>
	            </el-form-item>-->
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
  	name: 'videoCate',
    data() {
      
      return {
		props: {
		  value: 'cate_id',
          label:'name',
          children: 'children'
        },
        videoCate:[],
        editVisible: false,
        delVisible: false,
        form:{
        	name:'',
        	parent_id:0,
//      	type:''
        },
        cate_id:-1,
        data_videoCate:{},
        node_videoCate:{},
        tableData:[],
        multipleSelection: [],
        filterText: '',
        sele:[],
        
      }
    },
	created() {
		this.getData();
		this.getvideoCate();
//		this.getSele()
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
        var cate_id = data.cate_id
        this.getvideoCate(cate_id)
      },
      handleNodeClick(data) {
//      console.log(data);
      },
       getData(){
    	var that =this;
		this.$axios.get(that.ports.videoCate.index).then(function(res) {
        	var videoCate= res.data.result.list;
        	that.videoCate =[{cate_id: 0,name: '视频分类',parent_id:0, children: videoCate}]
       }) 
      },
      getvideoCate(cate_id=0){
      	if(cate_id==0){
      		return this.tableData={
      			cate_id: "0",
				cate_name: "视频分类",
				name: "视频分类",
				parent_id: ""
      		}
      	}
    	var that =this;
		this.$axios.get(that.ports.videoCate.show+"?cate_id="+cate_id).then(function(res) {
        	that.tableData = res.data.result;
        	
       }) 
      },
      append(data) {
      	this.editVisible=true;
      	this.form.parent_id = data.cate_id;
      	this.data_videoCate = data;
		this.cate_id=-1;
		
      },
	  edit(node, data) {
	  	this.editVisible=true;
        this.node_videoCate=node;
        this.data_videoCate=data;
        this.cate_id = data.cate_id;
        this.form.parent_id = data.parent_id;
        this.form.name = data.name||'';
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.cate_id === data.cate_id);
        
      },
      remove(node, data) {
      	this.delVisible=true;
      	this.cate_id = data.cate_id;
      	this.node_videoCate=node;
        this.data_videoCate=data;
        
      },
      saveEdit(){
      	var that = this;
    	var url = that.ports.videoCate.store;
    	var data=this.form;
    	if(that.cate_id!=-1){
    		data.cate_id = that.cate_id;
    		url = that.ports.videoCate.update;
    	}
    	data = that.qs.stringify(data)
    	that.$axios.post(url, data)
		.then(function (res) {
			if(res.data.status==200){
				if(that.cate_id==-1){
					const newChild = { cate_id: res.data.result.cate_id,name: that.form.name,parent_id:that.form.parent_id, children: [] };
			        
			        if (!that.data_videoCate.children) {
			          that.$set(that.data_videoCate, 'children', []);
			        }
			        that.data_videoCate.children.push(newChild);
			        that.$message.success(`添加成功`);
			        
				}else{
					const parent = that.node_videoCate.parent;
			        const children = parent.data.children || parent.data;
			        const index = children.findIndex(d => d.cate_id === that.data_videoCate.cate_id);
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
    		cate_id:that.cate_id,
        })
        that.$axios.post(that.ports.videoCate.destroy, data)
        .then(function (res) {
        	if(res.data.status==200){
        		const parent = that.node_videoCate.parent;
		        const children = parent.data.children || parent.data;
		        const index = children.findIndex(d => d.cate_id === that.data_videoCate.cate_id);
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