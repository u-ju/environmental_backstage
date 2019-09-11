<template>
	<div v-loading="loading">
	<div class="crumbs">
	    <el-breadcrumb separator="/">
	        <el-breadcrumb-item><i class="el-icon-lx-location"></i> 区域管理</el-breadcrumb-item>
	    </el-breadcrumb>
	</div>
	<el-row class='pading'>
		
	<el-col   :lg='10'  :md='10' :sm="24" :xs="24">
	<div class="custom-tree-container" >
	  <div class="block">
	  	<el-input
		  placeholder="输入关键字进行过滤"
		  v-model="filterText">
		</el-input>
	    <el-tree
	      :data="area"
	      :props="props"
	      show-checkbox
	      node-key="area_id"
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
	          <el-button v-show="data.area_id!=0"
	            type="text"
	            size="mini"
	            @click="() => edit(node, data)">
	            	编辑
	          </el-button>
	          <el-button v-show="data.area_id!=0"
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
            
        	<el-form-item label="区域ID">
			    <span>{{tableData.area_id}}</span>
			</el-form-item>
			<el-form-item label="区域名称">
			    <span>{{tableData.name}}</span>
			</el-form-item>
			<el-form-item label="父级ID">
			    <span>{{tableData.parent_id}}</span>
			</el-form-item>
			<el-form-item label="区域详细名称">
			    <span>{{tableData.area_name}}</span>
			</el-form-item>
		</el-form>
        
	</el-col>
	</el-row>
	<!-- 编辑弹出框 -->
        <el-dialog :title="area_id==-1?'添加':'编辑'" :visible.sync="editVisible">
            <el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="父级区域" v-if='area_id!=-1'>
                    <el-cascader 
                    	clearable
                    	placeholder="请选择区域"
                    	change-on-select
                    	id="cascader"
					    :options="area"
		      		    :props="props1"
		      		    v-model="areaId"
					></el-cascader>
               	</el-form-item>
            	<el-form-item label="区域名称">
                    <el-input v-model="form.name"></el-input>
               	</el-form-item>
               	<el-form-item label="区域排序">
                    <el-input v-model="form.sort"></el-input>
               	</el-form-item>
               	<el-form-item label="区域类型">
	                <el-select v-model="form.type"  placeholder="请选择">
	                	<el-option
					      v-for="item in sele"
					      :key="item.key"
					      :value="item.key"
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
  	name: 'Area',
    data() {
      
      return {
		props: {
		  value: 'area_id',
          label:'name',
          children: 'children'
        },
        area:[],
        editVisible: false,
        delVisible: false,
        form:{
        	name:'',
        	parent_id:0,
        	type:'',
        	sort:''
        },
        area_id:-1,
        data_area:{},
        node_area:{},
        tableData:[],
        multipleSelection: [],
        filterText: '',
        sele:[],
        loading:true,
        props1: {
				  value: 'area_id',
		          label:'name',
		          children: 'children'
		        },
		areaId:[],
		areaall:[]
      }
    },
	created() {
		this.getData();
		this.getArea();
		this.getSele();
//		this.getareaall()
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
        var area_id = data.area_id
        this.getArea(area_id)
      },
      handleNodeClick(data) {
        console.log(data);
      },
       getData(){
    	var that =this;
		this.$axios.get(that.ports.area.index).then(function(res) {
        	var area= res.data.result.list;
        	that.area =[{area_id: 0,type: 'province',name: '中国',parent_id:0, children: area}]
        	that.loading=false
       }) 
      },
      getSele(){
    	var that =this;
		this.$axios.get(that.ports.Home.config).then(function(res) {
        	that.sele = res.data.result.area_type;
       }) 
      },
      getArea(area_id=0){
      	if(area_id==0){
      		return this.tableData={
      			area_id: "0",
				area_name: "中国",
				name: "中国",
				parent_id: "",
				type: "countries",
				type_name: "国家"
      		}
      	}
    	var that =this;
		this.$axios.get(that.ports.area.show+"?area_id="+area_id).then(function(res) {
        	that.tableData = res.data.result;
        	
       }) 
      },
//    getareaall(){
//				var that =this;
//				this.$axios.get(that.ports.area.index).then(function(res) {
//		        	that.areaall = res.data.result.list;
//		       }) 
//		},
      append(data) {
		
      	this.editVisible=true;
      	this.form.parent_id = data.area_id;
      	this.form.name = '';
      	this.form.type = '';
      	this.data_area = data;
		this.area_id=-1;
		this.form.sort=''
      },
	  edit(node, data) {

	  	this.editVisible=true
        this.node_area=node;
        this.data_area=data;
        this.area_id = data.area_id;
        this.form.parent_id = data.parent_id;
        this.form.name = data.name||'';
        this.form.type = data.type
        this.form.sort = data.sort
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.area_id === data.area_id);
        
      },
      remove(node, data) {
      	console.log(data)
      	this.delVisible=true;
      	this.area_id = data.area_id;
      	this.node_area=node;
        this.data_area=data;
        
      },
      saveEdit(){
      	var that = this;
    	var url = that.ports.Area.store;
    	var data=this.form;
    	if(that.area_id!=-1){
    		data.area_id = that.area_id;
    		data.sort = that.form.sort;
    		url = that.ports.Area.update;
    		data.parent_id=this.areaId.length>0?this.areaId[this.areaId.length-1]:this.form.parent_id
    	}
    	data = that.qs.stringify(data)
    	console.log(data)
    	console.log(url)
    	that.$axios.post(url, data)
		.then(function (res) {
			console.log(res);
			if(res.data.status==200){
				if(that.area_id==-1){
					const newChild = { area_id: res.data.result.area_id,type: that.form.type,sort: that.form.sort,name: that.form.name,parent_id:that.form.parent_id, children: [] };
			        console.log(newChild)
			        if (!that.data_area.children) {
			          that.$set(that.data_area, 'children', []);
			        }
			        console.log(that.data_area.children)
			        that.data_area.children.push(newChild);
			        console.log(that.area)
			        that.$message.success(`添加成功`);
			        
				}else{
					const parent = that.node_area.parent;
			        const children = parent.data.children || parent.data;
			        const index = children.findIndex(d => d.area_id === that.data_area.area_id);
			        children[index].name=that.form.name
			        children[index].type=that.form.type
					that.$message.success(`修改成功`);
				}
				that.editVisible = false;
				that.form.name=''
				that.form.type=''
			}else{
				that.$message.warning(res.data.message);
			}
			
		})
		.catch(function (error) {
			console.log(error);
			that.$message.error(`执行失败`);
		});
      },
      deleteRow(){
      	var that = this;
		var data =that.qs.stringify({
    		area_id:that.area_id,
        })
        that.$axios.post(that.ports.Area.destroy, data)
        .then(function (res) {
        	console.log(res);
        	if(res.data.status==200){
        		const parent = that.node_area.parent;
        		console.log(parent)
		        const children = parent.data.children || parent.data;
		        console.log(children)
		        const index = children.findIndex(d => d.area_id === that.data_area.area_id);
		        console.log(index)
		        children.splice(index, 1);
				that.$message.success('删除成功');
			}else{
				that.$message.warning(res.data.message);
			}
        })
        .catch(function (res) {
        	console.log(res)
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