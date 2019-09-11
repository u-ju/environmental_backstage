<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-tag"></i> 帮助中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加帮助</el-button>
				<el-select v-model="content_source_val" clearable  placeholder="内容来源" class="handle-select mr10">
                    <el-option
                    	
				      v-for="item in help_content_source"
				      :key="item.key"
				      :value="item.key"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-select v-model="status_val" clearable  placeholder="状态" class="handle-select mr10">
                    <el-option
				      v-for="item in help_status"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="help_id" label="ID" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="title" label="标题"   align="center">
                </el-table-column>
                <el-table-column prop="content_source_name" label="来源"   align="center">
                </el-table-column>
                <el-table-column prop="view" label="观看"   align="center">
                </el-table-column>
                <el-table-column prop="status_name" label="状态"   align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <!--<el-button type="text" icon="el-icon-lx-attention" @click="handleEdit(scope.$index, scope.row)">查看</el-button>-->
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="1200px">
            <el-form ref="form"  label-width="100px">
                <el-form-item label="标题">
                    <el-input v-model="form.title" class='right_input'></el-input>
                </el-form-item>
                <el-form-item label="来源">
                    <el-select v-model="form.content_source"   placeholder="请选择">
                    	<el-option
					      v-for="item in help_content_source"
					      :key="item.key"
					      :value="item.key"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" v-if="form.content_source=='html'" >
                    <iframe frameborder="0" ref="iframe" name="right_home" id="right_home" :src="http" @load="vueFunc" ></iframe>
                </el-form-item>
                <el-form-item label="内容" v-else>
                	<el-input  type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="状态" v-if="idx!=-1">
                    <el-select v-model="help_status_val"   placeholder="请选择">
                    	<el-option
					      v-for="item in help_status"
					      :key="item.id"
					      :value="item.id"
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
	import store from '@/store/store'
    export default {
        name: 'Help',
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
                idx: -1,
                excelData:[],
                loading:true,
                last_page:1,
                help:{},
                status:0,
                help_status:[],
                help_content_source:[],
                form:{
                	title:"",
                	content_source:"",
                	content:""
                },
                ue:'',
                editor:"",
                help_status_val:'',
                status_val:'',
                content_source_val:'',
                url:'',
                iframeWin:'',
                oIframe:'',
                num:0,
                http1:store.state.http+'/ueditor',
                test:store.state.http
            }
        },
        created() {
            this.getData();
            this.getSele();
//          this.iframeWin = document.getElementById('right_home').contentWindow;				
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
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.help.index+"?page="+page+url).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            getSele(){
				var that =this;
				this.$axios.get(that.ports.Home.config).then(function(res) {
				    that.help_status = res.data.result.help_status;
				    that.help_content_source = res.data.result.help_content_source;
				})
			  },
            search() {
				this.url="&content_source="+this.content_source_val+"&status="+this.status_val
				this.getData(1,this.url)
            },
            vueFunc(){
            	var that =this;
            	console.log(1)
            	window.addEventListener('message', function (e) {
//          		console.log(e.data)
            	 	if(e.origin.indexOf(that.test)!=-1&&e.data.source=="ueditor"){
            	 		that.form.content = e.data.content
            	 	}
            	})
				that.setVisiblity(that.form.content)
            },
            setVisiblity(con=''){ 
            	console.log(document.readyState)
            	if(document.readyState=="complete") {
            		console.log(this.$refs.iframe)
            		if(!this.$refs.iframe){
            			return false
            		}
//          		console.log(con)
            		this.$refs.iframe.contentWindow.postMessage({
            			source: 'ueditor',
            			content: con,
            		}, '*')
            	} else {
            		setTimeout("setVisiblity("+con+")",800)
            	};
            	
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
                if(this.idx!=-1){
                	
                	that.$axios.get(that.ports.help.show+'?help_id='+that.tableData[that.idx].help_id)
					.then(function (res) {
						if(res.data.status==200){
							that.help = res.data.result;
							that.form={
			                	title:res.data.result.title,
			                	content_source:res.data.result.content_source,
			                	content:res.data.result.content
			                }
							that.help_status_val=res.data.result.status
							that.setVisiblity(that.form.content)
							

						}else{
							that.$message.warning(res.data.message);
						}
					})
					.catch(function (error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
                }else{
                	that.form={
	                	title:'',
	                	content_source:'',
	                	content:''
	                }	
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that = this;
            	var data = this.form;
            	var url = that.ports.help.store;
            	if(that.idx!=-1){
            		data.help_id=that.tableData[that.idx].help_id;
            		data.status = that.help_status_val
            		url = that.ports.help.update;
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
             handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow(){
//              this.tableData.splice(this.idx, 1);
				var that = this;
				var data =that.qs.stringify({
            		help_id:that.tableData[that.idx].help_id,
	            })
                that.$axios.post(that.ports.help.destroy, data)
                .then(function (res) {
                	if(res.data.status==200){
                		that.getData();
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
   	/*#right_home{
   		width: 1020px;
   		height: 800px;
   	}*/
</style>
