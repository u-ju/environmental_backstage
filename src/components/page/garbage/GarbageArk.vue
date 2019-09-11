<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-delete"></i> 垃圾柜</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click='handleEdit(-1)'>添加垃圾柜</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
            	<el-table-column prop="garbage_ark_id" label="垃圾柜id" sortable width="100" align="center">
                </el-table-column>
                <el-table-column prop="title" label="垃圾柜名称"   align="center">
                </el-table-column>
                <el-table-column prop="thumb" label="缩略图" align="center">
				    <template slot-scope="scope">
				      <img  :src="scope.row.thumb" alt="" style="width: 50px;">
				    </template>
				</el-table-column>
                <el-table-column prop="longitude" label="经度"   align="center">
                </el-table-column>
                <el-table-column prop="latitude" label="纬度"   align="center" >
                </el-table-column>
                <el-table-column prop="status_name" label="状态"   align="center" >
                </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
	    
	    <el-dialog :title="idx==-1?'添加':'编辑'" :visible.sync="editVisible" width="900px">
	    	<el-form ref="form"  label-width="100px">
                <el-form-item label="垃圾柜名称">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="缩略图">
					<el-upload
					  class="avatar-uploader"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :show-file-list="false"
					  :http-request="upLoad"
					  >
					  <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
                </el-form-item>
                <el-form-item label="区域">
                	<span  v-if='quyu' class="area_border"  v-on:click="quyuclick">{{area_name}}</span>
                    <el-cascader v-else
                    	id="cascader"
					  :options="area"
		      		  :props="props"
		      		   change-on-select
		      		   v-model="area_id"
		      		  @change="change"
					></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                	<el-input v-model="form.address"></el-input>
                </el-form-item>
	            <el-form-item label="设备号">
                	<el-input v-model="form.device_no"></el-input>
                </el-form-item>
                <el-form-item label="设备开关">
                	<el-input v-model="form.switch_no"></el-input>
                </el-form-item>
                <el-form-item label="状态" v-if="idx!=-1">
                    <el-select v-model="status"   placeholder="请选择">
                    	<el-option
					      v-for="item in garbage_ark_status"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
               	<el-form-item label="经度">
                    <el-input v-model="userlocation.lng" v-on:input ="inputFunc"></el-input>
                </el-form-item>
	            <el-form-item label="纬度">
                    <el-input v-model="userlocation.lat" v-on:input ="inputFunc" ></el-input>
                </el-form-item>
            </el-form>
	        <el-row >
		         <!--<el-col :offset="2" :span="19">
		             <el-input :id="suggestId" v-model="address_detail"  :clearable='clearable' placeholder="请输入店铺地址,获取店铺坐标" ></el-input>
		        </el-col>
		        <el-col :offset="1" :span="2">
		            <el-button id="position" @click="search"  type="primary">定位</el-button>
		        </el-col>-->
		        <!--<el-col :offset="2" :span="22" class='margint10' >
		        	<el-form :inline="true" :model="userlocation" class="demo-form-inline">
			        	<el-form-item label="经度">
						    <el-input v-model="userlocation.lng" v-on:input ="inputFunc"  placeholder="经度"></el-input>
						</el-form-item>
						<el-form-item label="纬度">
						    <el-input v-model="userlocation.lat" v-on:input ="inputFunc" placeholder="纬度"></el-input>
						</el-form-item>
					</el-form>
		        </el-col> -->
		    </el-row>
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
	    <el-dialog name="提示" :visible.sync="delVisible" width="300px">
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
	name: 'GarbageArk',
  	data() {
    return {
      address_detail: "", //详细地址
      userlocation: { lng: "", lat: "" },
      clearable: true,
      suggestId: "suggestId",
      map : {},
      mk: {},
      editVisible:false,
      tableData:[],
      loading:true,
      multipleSelection: [],
      delVisible:false,
      status:'',
	    form:{
	    	title:"",
	    	area_id:"",
	    	address:"",
	    	longitude:'',
	    	thumb:'',
	    	latitude:'',
	    	device_no:'',
	    	switch_no:''
	    },
	    dialogImageUrl: '',
	    dialogVisible: true,
		props: {
		  value: 'area_id',
          label:'name',
          children: 'children'
        },
        area:[],
        area_id:[],
        area_name:'',
        idx:-1,
        quyu:true
    };
  },
  created() {
        this.getData();
        this.getSele();
        this.getarea();
    },
  methods: {
  	getData(page=1) {
    	var that =this;
		this.$axios.get(that.ports.garbageArk.index+"?page="+page).then(function(res) {
        	that.tableData = res.data.result.list;
            that.loading = false
       })
    },
    getarea(){
		var that =this;
		this.$axios.get(that.ports.area.index).then(function(res) {
			
        	that.area = res.data.result.list;
       }) 
    },
    getSele(){
		var that =this;
		this.$axios.get(that.ports.Home.config).then(function(res) {
		    that.garbage_ark_status = res.data.result.garbage_ark_status;
		})
	  },
	change(e){
//  	console.log(document.getElementsByClassName("el-cascader__label")[0])
//  	console.log(document.getElementsByClassName("el-cascader__label")[0].innerHTML)
    },
    quyuclick(){
//  	console.log(11)
    	this.quyu =false
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    upLoad (file) {
	  const formData = new FormData()
	  var that =this;
      formData.append('file',file.file)
      formData.append('image',file.file)
      formData.append('source','file')
      this.$axios.post(`/api/common/upload/image`,formData).then(res => res.data)
      .then(data => {
      	
//      console.log(data)
        if(data.status == 200){
          that.dialogImageUrl=data.result.image_url
          that.form.thumb = data.result.image_url
          that.dialogVisible = true;
//        console.log(that.dialogImageUrl);
        }else{
        	that.$message.warning(res.data.message);
        }
      })
      .catch(function (error) {
//			console.log(error);
			that.$message.error(`执行失败`);
		});
    },
	handleRemove(file, fileList) {
//      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      	console.log(file)
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    handleEdit(index, row) {
    	var that = this;
        this.idx = index;
        this.editVisible = true;
		
        if(this.idx!=-1){
        	that.quyu =true
        	that.$axios.get(that.ports.garbageArk.show+'?garbage_ark_id='+that.tableData[that.idx].garbage_ark_id)
			.then(function (res) {
				
				if(res.data.status==200){
//					console.log('emmmmmmmmmmm')
					that.form={
	                	title:res.data.result.title,
	                	thumb:res.data.result.thumb,
	                	area_id:res.data.result.area_id,
	                	address:res.data.result.address,
	                	longitude:res.data.result.longitude,
	                	latitude:res.data.result.latitude,
	                	device_no:res.data.result.device_no,
	    				switch_no:res.data.result.switch_no
	               }
					
					
					that.userlocation = { lng: Number(res.data.result.longitude), lat: Number(res.data.result.latitude) },
					setTimeout(() => {
					    that.drawMap()
					}, 0);
	                that.status=res.data.result.status
	                that.area_name=res.data.result.area_name
	                that.dialogImageUrl=res.data.result.thumb
//					console.log(that.form)	
				}else{
					that.$message.warning(res.data.message);
				}
			})
			.catch(function (error) {
//				console.log(error);
				that.$message.error(`执行失败`);
			});
        }else{
        	setTimeout(() => {
			    that.drawMap()
			}, 0);
        	that.form={
            	title:"",
            	area_id:"",
            	address:"",
            	longitude:'',
            	thumb:'',
            	latitude:''
            }
        	that.status =''
        	that.dialogImageUrl=''
        	that.quyu =false
        	that.getlocation();//获取当前坐标, 测试时获取定位不准。
//      	this.map.clearOverlays(); //清除地图上所有覆盖物
//   		this.getMarker(this.userlocation)
        }
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit() {
    	var that = this;
    	var data = this.form;
    	var url = that.ports.garbageArk.store;
    	
    	data["area_id"]=this.area_id[this.area_id.length-1]
    	data["longitude"]= this.userlocation.lng,
    	data["latitude"]= this.userlocation.lat
    	if(that.idx!=-1){
    		data.garbage_ark_id=that.tableData[that.idx].garbage_ark_id;
    		data.status=that.status;
    		url = that.ports.garbageArk.update;
    	}
    	data=that.qs.stringify(data)
    	that.$axios.post(url, data)
		.then(function (res) {
//			console.log(res);
			if(res.data.status==200){
				that.getData();
				that.editVisible = false;
				that.$message.success(`操作成功`);
				
			}else{
				that.$message.warning(res.data.message);
			}
			
		})
		.catch(function (error) {
//			console.log(error);
			that.$message.error(`执行失败`);
		});
//              this.$set(this.tableData, this.idx, this.form);
        
        
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
    		garbage_ark_id:that.tableData[that.idx].garbage_ark_id,
        })
        that.$axios.post(that.ports.garbageArk.destroy, data)
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
        
    },
     drawMap() {
     	var that = this;
        this.map = new BMap.Map("map_canvas");                // 创建地图实例
        this.map.addControl(new BMap.NavigationControl());           // 启用放大缩小 尺
        this.map.enableScrollWheelZoom();
        //this.getlocation();//获取当前坐标, 测试时获取定位不准。
//      console.log(this.userlocation.lng+'----'+this.userlocation.lat)
        var point = new BMap.Point(that.userlocation.lng, that.userlocation.lat);  // 创建点坐标 
        
        this.map.centerAndZoom(point, 18);                 // 初始化地图，设置中心点坐标和地图级别 
        var marker = new BMap.Marker(point);        // 创建标注   
        this.map.addOverlay(marker);                     // 将标注添加到地图中
         this.map.addEventListener("click",function(e){
//       	console.log(e)
         	that.userlocation = e.point;
         	that.map.clearOverlays();
         	that.getMarker (e.point)
         })
        var ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: this.map
        });
//      var myValue;
//    ac.addEventListener("onconfirm", (e)=> {
//      //鼠标点击下拉列表后的事件
//      var _value = e.item.value;
//      myValue =_value.province +_value.city +_value.district +_value.street +_value.business;
//      this.address_detail = myValue;
//      this.setPlace();
//    });
     },
     inputFunc(e){
//   	console.log(e)
     	if(this.userlocation.lng&&this.userlocation.lat){
     		this.map.clearOverlays(); //清除地图上所有覆盖物
     		this.getMarker (this.userlocation)
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
     search () {
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
  mounted() {
//  this.$nextTick(function() {
//   this.drawMap();
//  });
//   this.$nextTick(this.drawMap)


  }
};
</script>
<style scoped>

.el-tag {
  cursor: pointer;
}
.margint10{
	margin-top: 10px;
}
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
   	#right_home{
   		width: 100%;
   		height: 456px;
   	}
   	.el-tag--medium{
   		width: 100%;
   		overflow: hidden;
   	}
   	 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload--text{
  	display: flex !important;
  	justify-content: center;
  }
  .area_border{
  	display: inline-block;
  	border: 1px solid #dcdfe6;
  	    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    outline: 0;
    padding: 0 15px;
  }
</style>
