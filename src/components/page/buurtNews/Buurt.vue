<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-group"></i> 社区管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				
				<el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加社区</el-button>
				<el-input v-model="searcharr.user_id" placeholder="请输入用户ID" class="handle-input mr10"></el-input>
				<el-input v-model="searcharr.name" placeholder="请输入标题" class="handle-input mr10"></el-input>
				<el-select v-model="searcharr.status" clearable  placeholder="审核状态" class="handle-select mr10">
                    <el-option
				      v-for="item in sele"
				      :key="item.id"
				      :value="item.id"
				      :label="item.name">
				    </el-option>
                </el-select>
				<el-cascader id="cascader1" placeholder="请选择区域"  change-on-select :options="area_id1" :props="props" v-model="area_id"></el-cascader>

				<el-button type="primary" icon="search" @click="searchE">搜索</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
				<!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
				<el-table-column prop="id" label="社区ID" width="100" align="center">
					<template slot-scope="scope">
						<router-link :to="{path:'/buurtNews',query: {id: scope.row.id}}">
							<div>{{ scope.row.id }}</div>
						</router-link>
					</template>
				</el-table-column>
				<el-table-column prop="user_id" label="用户ID" align="center">
					<template slot-scope="scope">
						<router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
							<div>{{ scope.row.user_id }}</div>
						</router-link>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="名称" align="center">
				</el-table-column>
				<!--<el-table-column prop="contact" label="联系方式" align="center">
				</el-table-column>
				<el-table-column prop="license" label="营业执照" align="center">
					<template slot-scope="scope">
						<img :src="scope.row.license" alt="" style="width: 200px;">
					</template>
				</el-table-column>-->
				<el-table-column prop="area_name" label="地址" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.area_name}} {{scope.row.address}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="longitude" label="经度" align="center">
				</el-table-column>
				<el-table-column prop="latitude" label="纬度" align="center">
				</el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-count='last_page' :page-size="15">
				</el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="900">
			<el-form ref="form" :model="form" label-width="100px">
				<el-form-item label="用户ID" v-if='idx==-1'>
					<el-input v-model="form.user_id"></el-input>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="区域">
					<span v-if='quyu' class="area_border" v-on:click="quyuclick">{{area_name}}</span>
					<el-cascader v-else id="cascader" change-on-select :options="area" :props="props" v-model="area_id"></el-cascader>
				</el-form-item>
				<el-form-item label="详细地址">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="经度">
                    <el-input v-model="userlocation.lng" v-on:input ="inputFunc"></el-input>
                </el-form-item>
	            <el-form-item label="纬度">
                    <el-input v-model="userlocation.lat" v-on:input ="inputFunc" ></el-input>
                </el-form-item>
			</el-form>
			<el-row>
		       <el-col :offset="2" :span="22">
		            <div id="map_canvas" class="allmap"></div>
		       </el-col>
		    </el-row>
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
	export default {
		name: 'Role',
		data() {
			return {
				tableData: [],
				cur_page: 1,

				editVisible: false,
				delVisible: false,
				idx: -1,
				excelData: [],
				loading: true,
				last_page: 1,
				form: {
					user_id: '',
					name: '',
					address:'',
					longitude:'',
					latitude:''
				},
				status: 0,
				multipleSelection: [],
				select_cate: '',
				select_word: '',
				del_list: [],
				url: '',
				quyu: true,
				area: [],
				area_id: [],
				area_name: '',
				props: {
					value: 'area_id',
					label: 'name',
					children: 'children'
				},
				uploadurl: '',
				license:'',
				searcharr:{
					user_id:'',
					name:'',
					area_id:'',
					status:''
				},
				sele:[],
				area_id1:[],
				address_detail: "", //详细地址
			    userlocation: { lng: 104.06, lat: 30.67 },
			    clearable: true,
			    suggestId: "suggestId",
			    map : {},
			    mk: {},
			}
		},
		created() {
			this.getData();
			this.getarea()
			this.uploadurl = this.ports.Base + this.ports.common.imageBatch
		},
		computed: {
			

		},
		methods: {
			// 分页导航
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData(val);
			},
			
			// 获取 easy-mock 的模拟数据
			getData(page = 1) {
				var that = this;
				this.$axios.get(that.ports.buurt.index + "?page=" + page,{params:this.searcharr}).then(function(res) {
					
					that.tableData = res.data.result.list;
					that.last_page = Number(res.data.result.page.last_page);
					that.cur_page = Number(res.data.result.page.current_page);
					that.loading = false
				})
			},
			searchE(){
				this.searcharr.area_id=this.area_id1.length>0?this.area_id1[this.area_id1.length-1]:''
				this.getData(1)
			},
			getarea(){
				var that =this;
				this.sele = JSON.parse(localStorage.getItem('config')).buurt_news_cate;
				this.$axios.get(that.ports.area.index).then(function(res) {
		        	that.area = res.data.result.list;
		       }) 
		    },
			upLoad(file) {
				const formData = new FormData()
				var that = this;
				formData.append('file', file.file)
				formData.append('image', file.file)
				formData.append('source', 'file')
				this.$axios.post(that.ports.common.upload, formData).then(res => res.data)
					.then(data => {
						if(data.status == 200) {
							that.license = data.result.image_full_name
							that.form.license = data.result.image_url
							that.dialogVisible = true;
						} else {
							that.$message.warning(res.data.message);
						}
					})
					.catch(function(error) {
						that.$message.error(`执行失败`);
					});
			},
			quyuclick() {
				this.quyu = false
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
				that.form = {
					user_id: '',
					name: '',
					address:'',
					longitude:'',
					latitude:''
				}
				that.quyu=false
				that.area_name=''
				that.area_id=[]
				if(this.idx != -1) {
					that.form = row
					that.form = {
						id: row.id,
						name: row.name,
						address:row.address,
						longitude:row.longitude,
						latitude:row.latitude
					}
					this.license=row.license
					that.quyu=true
					that.area_name=row.area_name
					that.area_id=[row.area_id]
					that.userlocation = { lng: Number(row.longitude), lat: Number(row.latitude) }
					setTimeout(() => {
					    that.drawMap()
					}, 0);
					
				}else{
					that.getlocation();
					setTimeout(() => {
					    that.drawMap()
					}, 0);
				}
				
			},

			// 保存编辑
			saveEdit() {
				var that = this;
				var data = this.form;
				var url = that.ports.buurt.store;
				
				data.area_id = this.area_id[this.area_id.length-1]
				data["longitude"]= this.userlocation.lng,
    			data["latitude"]= this.userlocation.lat
				if(that.idx != -1) {
					data.id = that.tableData[that.idx].id;
					url = that.ports.buurt.update;
				}
				data = that.qs.stringify(data)

				that.$axios.post(url, data)
					.then(function(res) {
						if(res.data.status == 200) {
							that.getData();
							that.editVisible = false;
							that.$message.success(`操作成功`);

						} else {
							that.$message.warning(res.data.message);
						}

					})
					.catch(function(error) {
						console.log(error);
						that.$message.error(`执行失败`);
					});
				//              this.$set(this.tableData, this.idx, this.form);

			},
			handleDelete(index, row) {
				this.idx = index;
				this.delVisible = true;
				this.del_line = [row.id]
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			deleteRow() {
				var that = this;
				var arr = [],
					all = that.checkedCities,
					data = {},
					del_line = this.del_line
				for(var key in del_line) {
					data["id[" + key + "]"] = del_line[key]
				}
				data = that.qs.stringify(data)
				that.$axios.post(that.ports.buurt.destroy, data)
					.then(function(res) {
						if(res.data.status == 200) {
							that.getData();
							that.$message.success('删除成功');
						} else {
							that.$message.warning(res.data.message);
						}

					})
					.catch(function(res) {
						that.$message.error('删除失败');
					})
				this.delVisible = false;

			},
	drawMap() {
     	var that = this;
     	if(document.readyState=="complete") {
     		this.map = new BMap.Map("map_canvas");                // 创建地图实例
	        this.map.addControl(new BMap.NavigationControl());           // 启用放大缩小 尺
	        this.map.enableScrollWheelZoom();
	        //this.getlocation();//获取当前坐标, 测试时获取定位不准。
	//      console.log(this.userlocation.lng+'----'+this.userlocation.lat)
	        var point = new BMap.Point(that.userlocation.lng, that.userlocation.lat);  // 创建点坐标 
	        
	        this.map.centerAndZoom(point, 18);                 // 初始化地图，设置中心点坐标和地图级别 
	        var marker = new BMap.Marker(point);        // 创建标注   
	        this.map.addOverlay(marker); 
	        // 将标注添加到地图中
	        
	        this.map.addEventListener("click",function(e){
	         	that.userlocation = e.point;
	         	that.map.clearOverlays();
	         	
	         	that.getMarker(e.point)
	         })
	        var ac = new BMap.Autocomplete({
	        	//建立一个自动完成的对象
		        input: "suggestId",
		        location: this.map
	        });
     	}else{
     		setTimeout("drawMap()",800)
     	}
        
     },
     inputFunc(e){
//   	console.log(e)
     	if(this.userlocation.lng&&this.userlocation.lat){
     		this.map.clearOverlays(); //清除地图上所有覆盖物
     		this.getMarker(this.userlocation)
     	}
     	
     },
     getMarker (point) {
//   	console.log(point)
        this.mk = new BMap.Marker(point); 
//      this.mk.addEventListener("dragend", this.showInfo);
//      this.mk.enableDragging();    //可拖拽
        this.getAddress(point);
        this.map.addOverlay(this.mk);//把点添加到地图上 
        this.map.panTo(point);
     },
     getlocation () {
        //获取当前位置
        var geolocation = new BMap.Geolocation(); 
        geolocation.getCurrentPosition((r) =>{ 
            if(geolocation.getStatus() == BMAP_STATUS_SUCCESS){ 
//          	console.log(r.point)
                this.getMarker(r.point);
                this.userlocation = r.point;
            }else { 
                alert('failed'+this.getStatus()); 
            } 
        });
     },
      //绑定Marker的拖拽事件
     showInfo(e){
//   	console.log(e)
        var gc = new BMap.Geocoder();
        gc.getLocation(e.point, (rs)=>{
            var addComp = rs.addressComponents;
            var address = addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
             
            //画图 ---》显示地址信息
            var label = new BMap.Label(address,{offset:new BMap.Size(20,-10)});
            this.map.removeOverlay(this.mk.getLabel());//删除之前的label
 
            this.mk.setLabel(label);
            this.address_detail = address;
            this.userlocation = e.point;
                 
        });
     },
         //获取地址信息，设置地址label
     getAddress(point){
        var gc = new BMap.Geocoder();
//      console.log(point)
        gc.getLocation(point, (rs)=>{
//      	console.log(rs)
            var addComp = rs.addressComponents;
            var address =  addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
             
            //画图 ---》显示地址信息
            var label = new BMap.Label(address,{offset:new BMap.Size(20,-10)});
            this.map.removeOverlay(this.mk.getLabel());//删除之前的label
            this.address_detail = address;
            this.mk.setLabel(label);

            });

            },
            setPlace() {
            		this.map.clearOverlays(); //清除地图上所有覆盖物
            		var th = this

            		function myFun() {
            			th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            			th.map.centerAndZoom(th.userlocation, 18);
            			th.getMarker(th.userlocation);
            		}

            		var local = new BMap.LocalSearch(this.map, {
            			onSearchComplete: myFun //智能搜索
            		});
            		local.search(this.address_detail);
            	},
            	search() {
            		var localSearch = new BMap.LocalSearch(this.map);
            		localSearch.enableAutoViewport(); //允许自动调节窗体大小
            		this.searchByInputName(localSearch);
            	},
            	searchByInputName(localSearch) {
            		this.map.clearOverlays(); //清空原来的标注
            		var th = this;
            		var keyword = this.address_detail;
            		localSearch.setSearchCompleteCallback(function(searchResult) {
            			var poi = searchResult.getPoi(0);
            			th.userlocation = poi.point;
            			th.map.centerAndZoom(poi.point, 13);
            			th.getMarker(th.userlocation);
            		});
            		localSearch.search(keyword);
            	},
           },
           
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
	
	.del-dialog-cnt {
		font-size: 16px;
		text-align: center
	}
	
	.table {
		width: 100%;
		font-size: 14px;
	}
	
	.red {
		color: #ff0000;
	}
	
	.margin_pic {
		margin-right: 20px !important;
	}
	
	.v-modal {
		z-index: 2002 !important;
	}
	
	.avatar-uploader,img.avatar{
		width: 360px !important;
		height: 180px;
		line-height: 180px;
	}
	img.avatar{
		height: auto;
	}
</style>