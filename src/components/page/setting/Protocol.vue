<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 协议设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="key" label="key"  align="center">
                </el-table-column>
                <el-table-column prop="name" label="名称"   align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="900px">
            <el-form ref="form"  label-width="100px">
            	<el-form-item label="名称">
                    {{name}}
                </el-form-item>
                <el-form-item label="key">
                    <el-input v-model="form.key"></el-input>
                </el-form-item>
                
                <el-form-item label="内容"  >
                    <iframe frameborder="0" ref="iframe" name="right_home" id="right_home" :src="http" @load="vueFunc" ></iframe>
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
	import store from '@/store/store'
    export default {
        name: 'Protocol',
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                idx: -1,
                loading:true,
                form:{
                	title:"",
                	content:""
                },
                ue:'',
                editor:"",
                url:'',
                iframeWin:'',
                oIframe:'',
                num:0,
                http1:store.state.http+'/ueditor',
                test:store.state.http,
                name:''
            }
        },
        created() {
            this.getData();
//          this.getSele();			
        },
        computed: {
            data() {
            	return this.tableData
            },
            http(){
            	return this.http1+"?token="+store.state.token
            }
        },
        mounted() {
			 var oIframe = document.getElementById('right_home');
		},
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val,this.url);
            },
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.setting.protocolIndex).then(function(res) {
		        	that.tableData = res.data.result.list;
		            that.loading = false
		       }) 
            },
            vueFunc(){
            	var that =this;
            	window.addEventListener('message', function (e) {
            		console.log(e.data)
            	 	if(e.origin.indexOf(that.test)!=-1&&e.data.source=="ueditor"){
            	 		that.form.content = e.data.content
            	 	}
            	})
				that.setVisiblity(that.form.content)
            },
            setVisiblity(con=''){ 
            	
            	if(document.readyState=="complete") {
            		if(!this.$refs.iframe){
            			return false
            		}
            		this.$refs.iframe.contentWindow.postMessage({
            			source: 'ueditor',
            			content: con,
            		}, '*')
            	} else {
            		setTimeout("setVisiblity("+con+")",1000)
            	};
            	console.log(con)
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
            	var that = this;
                this.idx = index;
                this.editVisible = true;
                console.log(row) 	
            	that.$axios.get(that.ports.setting.protocolShow+row.key)
				.then(function (res) {
					if(res.data.status==200){
						that.help = res.data.result;
						that.form={
		                	key:res.data.result.key,
		                	content:res.data.result.content
		               }
						that.name = res.data.result.name
						that.setVisiblity(that.form.content)
						

					}else{
						that.$message.warning(res.data.message);
					}
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`执行失败`);
				});
                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data = this.form;
            	var url = that.ports.help.store;
            	data=that.qs.stringify(data)
            	that.$axios.post(that.ports.setting.protocolUpdate, data)
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
             handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            
        }
    }

</script>

<style scoped>
    #right_home{
    	width: 100%;
    }
</style>
