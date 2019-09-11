<template>
    <div class="table" v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-shop"></i> 加盟商家列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
               <el-input v-model="search.user_id" placeholder="请输入用户ID" class="handle-input mr10"></el-input>
                <el-input v-model="search.contact" placeholder="请输入联系方式" class="handle-input mr10"></el-input>
                <el-input v-model="search.keywords" placeholder="请输入用户关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="searchbtn">搜索</el-button>
			</div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" id="out-table">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="shop_id" label="商店ID"  width="100" align="center">
                </el-table-column>
                
                <el-table-column prop="user_id" label="用户ID"  width="100" align="center">
                	<template slot-scope="scope">
					    <router-link :to="{path:'/UserDetails',query: {id: scope.row.user_id}}">
					    	<div >{{ scope.row.user_id }}</div>
                		</router-link>
					</template>
                	
                </el-table-column>
                
                <el-table-column  prop='title' label="店名" align="center" max-width='300'>
                	<template slot-scope="scope">
				        <el-popover trigger="hover" placement="top">
				          <p>店名: {{ scope.row.title }}</p>
				          <div slot="reference" class="name-wrapper">
				            <el-tag size="medium">{{ scope.row.title }}</el-tag>
				          </div>
				        </el-popover>
				      </template>
                </el-table-column>
                <el-table-column  prop='intro' label="简介" align="center" max-width='300'>
                	 <template slot-scope="scope">
				        <el-popover trigger="hover" placement="top">
				          <p>简介: {{ scope.row.intro }}</p>
				          <div slot="reference" class="name-wrapper">
				            <el-tag size="medium">{{ scope.row.intro }}</el-tag>
				          </div>
				        </el-popover>
				      </template>
                </el-table-column>
                <el-table-column  prop='contact' label="联系电话" align="center">
                </el-table-column>
                 <el-table-column  prop='created_at' label="创建时间" align="center">
                </el-table-column>
                <el-table-column prop="status_name" label="审核状态"  align="center">
                	<template slot-scope="scope">
						<el-tag disable-transitions>{{scope.row.status_name}}</el-tag>
				  	</template>
                </el-table-column>
                <el-table-column
				    prop="thumb"
				    label="图片" align="center"
				    >
				    <template slot-scope="scope">
				      <img  :src="scope.row.thumb" alt="" style="width: 50px;max-height: 60px;">
				    </template>
				</el-table-column>
                
				
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                    	<el-button type="text" icon="el-icon-edit" @click="handleIn(scope.row)">第三方入驻</el-button>

                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit2(scope.$index, scope.row)">广告位</el-button>-->
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <!--<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete2(scope.$index, scope.row)">删除广告位</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange"  layout="prev, pager, next" :page-count='last_page' :page-size="15" >
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="审核">
                    <el-select v-model="form.status"  placeholder="请选择">
                    	<el-option
					      v-for="item in sele"
					      :key="item.id"
					      :value="item.id"
					      :label="item.name">
					    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="经度">
                    <el-input v-model="form.longitude" width='216'></el-input>
               	</el-form-item>
                <el-form-item label="纬度">
                    <el-input v-model="form.latitude" width='216'></el-input>
               	</el-form-item>
                <!--<el-form-item label="审核备注">
                    <el-input type="textarea" v-model="form.status_remark"></el-input>
                </el-form-item>-->
                <el-form-item label="签约利率">
                    <el-input v-model="form.signed_rate" width='216'></el-input>
               	</el-form-item>
                <el-form-item label="店名">
                    {{shop.title}}
                </el-form-item>
                <el-form-item label="营业执照">
                    <div>
					    <viewer >
					        <img   class='margin_pic' :src="shop.license"  width="50">
					    </viewer>
					</div>
                </el-form-item>
                <el-form-item label="店面">
                    <div>
					    <viewer >
					        <img   class='margin_pic' :src="shop.thumb"  width="50">
					    </viewer>
					</div>
                </el-form-item>
                <el-form-item label="图片">
                	<div>
					    <viewer :images="shop.images">
					        <img v-for="src in shop.images"  class='margin_pic' :src="src"  width="50" >
					    </viewer>
					</div>
                </el-form-item>
                <el-form-item label="身份证正面" v-if='lp_idcard.front'>
                	<div>
					    <viewer v-if='lp_idcard.front.indexOf(".")>-1'>
					        <img   class='margin_pic' :src="lp_idcard.front"  width="50">
					    </viewer>
					    <span v-else>{{lp_idcard.front}}</span>
					</div>
                </el-form-item>
                <el-form-item label="身份证反面" v-if='lp_idcard.back'>
                	<div>
					    <viewer v-if='lp_idcard.back.indexOf(".")>-1'>
					        <img   class='margin_pic' :src="lp_idcard.back"  width="50">
					    </viewer>
					    <span v-else>{{lp_idcard.back}}</span>
					</div>
                </el-form-item>
                <!--<el-form-item label="银行卡正面" v-if='bankcard.front'>
                	<div>
					    <viewer v-if='bankcard.front.indexOf(".")>-1'>
					        <img   class='margin_pic' :src="bankcard.front"  width="50">
					    </viewer>
					    <span v-else>{{bankcard.front}}</span>
					</div>
                </el-form-item>-->
                <el-form-item label="银行卡号">
                    <span>{{bankcard.cardNo}}</span>
                </el-form-item>
                <el-form-item label="持卡人姓名" >
                    {{bankcard.cardholder}}
                </el-form-item>
                <el-form-item label="支行信息">
					<span v-if='bankcard.subBank.length>0'>{{bankcard.subBank[0]['provName']}}{{bankcard.subBank[1]['cityName']}}{{bankcard.subBank[2]['bankName']}}{{bankcard.subBank[3]['branchName']}}</span>
                	<span v-else>{{bankcard.subBank}}</span>
                </el-form-item>
                <el-form-item label="简介">
                    {{shop.intro}}
                </el-form-item>
                <el-form-item label="联系电话">
                    {{shop.contact}}
                </el-form-item>
                <el-form-item label="地址">
                    {{shop.area_name}} {{shop.address}}
                </el-form-item>
                <el-form-item label="商家折扣">
                    {{shop.discount_percent}}
                </el-form-item>
                <el-form-item label="分类名称">
                    {{shop.cate_name}}
                </el-form-item>
                <!--<el-form-item label="广告位时间" wx:if="shop_ad.start_time">
                	{{shop_ad.start_time}} -  {{shop_ad.end_time}}
                    
                </el-form-item>-->
                <el-form-item label="推荐人ID" v-if="shop.share_user_id">
                    <router-link :to="{path:'/UserDetails',query: {id: shop.share_user_id}}">
					    	{{shop.share_user_id}}
                	</router-link>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
		<!-- 广告位提交 -->
        <el-dialog title="广告位提交" :visible.sync="editVisible2" width="40%">
            <el-form  :model="form2" label-width="100px">
                <el-form-item label="推荐天数">
                    <el-input  v-model="form2.days"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit2">确 定</el-button>
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
        <el-dialog title="提示" :visible.sync="delVisible2" width="300px">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow2">确 定</el-button>
            </span>
        </el-dialog>
        <!--第三方入驻-->
		<el-dialog title="编辑" :visible.sync="inVisible" width="900">
			<div class="overhidden">

				<el-form label-width="100px" class='floatL'>
					<el-form-item label="店名">
						{{shop.title}}
					</el-form-item>
					<el-form-item label="营业执照">
						<div>
							<viewer>
								<img class='margin_pic' :src="shop.license" width="50">
							</viewer>
						</div>
					</el-form-item>
					<el-form-item label="店面">
						<div>
							<viewer>
								<img class='margin_pic' :src="shop.thumb" width="50">
							</viewer>
						</div>
					</el-form-item>
					<el-form-item label="轮播图">
						<div>
							<viewer :images="shop.images">
								<img v-for="src in shop.images" class='margin_pic' :src="src" width="50">
							</viewer>
						</div>
					</el-form-item>
					<el-form-item label="身份证正面" v-if='lp_idcard.front'>
						<div>
							<viewer v-if='lp_idcard.front.indexOf(".")>-1'>
								<img class='margin_pic' :src="lp_idcard.front" width="50">
							</viewer>
							<span v-else>{{lp_idcard.front}}</span>
						</div>
					</el-form-item>
					<el-form-item label="身份证反面" v-if='lp_idcard.back'>
						<div>
							<viewer v-if='lp_idcard.back.indexOf(".")>-1'>
								<img class='margin_pic' :src="lp_idcard.back" width="50">
							</viewer>
							<span v-else>{{lp_idcard.back}}</span>
						</div>
					</el-form-item>
					<el-form-item label="银行卡号">
						<span>{{bankcard.cardNo}}</span>
					</el-form-item>
					<el-form-item label="持卡人姓名">
						{{bankcard.cardholder}}
					</el-form-item>
					<el-form-item label="支行信息">
						<span v-if='bankcard.subBank.length>0'>{{bankcard.subBank[0]['provName']}}{{bankcard.subBank[1]['cityName']}}{{bankcard.subBank[2]['bankName']}}{{bankcard.subBank[3]['branchName']}}</span>
						<span v-else>{{bankcard.subBank}}</span>
					</el-form-item>
					<el-form-item label="简介">
						{{shop.intro}}
					</el-form-item>
					<el-form-item label="联系电话">
						{{shop.contact}}
					</el-form-item>
					<el-form-item label="地址">
						{{shop.area_name}} {{shop.address}}
					</el-form-item>
					<el-form-item label="商家折扣">
						{{shop.discount_percent}}
					</el-form-item>
					<el-form-item label="分类名称">
						{{shop.cate_name}}
					</el-form-item>
					<el-form-item label="推荐人ID" v-if="shop.share_user_id">
						<router-link :to="{path:'/UserDetails',query: {id: shop.share_user_id}}">
							{{shop.share_user_id}}
						</router-link>
					</el-form-item>
					<el-form-item label="经度">
						{{form.longitude}}
					</el-form-item>
					<el-form-item label="纬度">
						{{form.latitude}}
					</el-form-item>
					<el-form-item label="审核备注">
						{{form.status_remark}}
					</el-form-item>
				</el-form>
				<el-form ref="third" :model="third"  label-width="100px" class='floatL'>
					<div class="textR">
						三方商家经营区域
					</div>
					<el-form-item label="省" >
						<el-select v-model="third.provName" value-key='provId' placeholder="请选择" @change='provblur'>
						    <el-option
						      v-for="item in provIndex"
						      :key="item.provId"
						      :label="item.provName"
						      :value="item">
						    </el-option>
						  </el-select>
					</el-form-item>
					<el-form-item label="市" v-if='cityIndex.length>0'>
						<el-select v-model="third.cityName" value-key='cityId' placeholder="请选择" @change='cityblur'>
						    <el-option
						      v-for="item in cityIndex"
						      :key="item.cityId"
						      :label="item.cityName"
						      :value="item">
						    </el-option>
						  </el-select>
					</el-form-item>
					<el-form-item label="区" v-if='areaIndex.length>0'>
						<el-select v-model="third.areaName" value-key='areaId' placeholder="请选择"  @change='areablur'>
						    <el-option
						      v-for="item in areaIndex"
						      :key="item.areaId"
						      :label="item.areaName"
						      :value="item">
						    </el-option>
						  </el-select>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
                <el-button @click="inVisible = false">取 消</el-button>
                <el-button type="primary" @click="InEdit">确 定</el-button>
            </span>
		</el-dialog>
    </div>
</template>

<script>
	import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        name: 'realname',
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
                editVisible2: false,
                delVisible: false,
                delVisible2: false,
                form: {
                    status:'',
                    status_remark:'',
                    signed_rate:'',
                    longitude:'',
                    latitude:''
                },
                idx: -1,
                tableData1:[],
                excelData:[],
                loading:true,
                sele:[],
                last_page:1,
                status:-1,
                shop:{},
                shop_cate:[],
                tshop_cate:[],
                select:[],
                props: {
		          value: 'id',
		          label:'name',
		          children: 'children'
		        },
		        selected:[],
		        shop_type:[],
		        url:'',
		        form2:{
		        	shop_id:'',
		        	days:''
		        },
		        shop_ad:{},
		        search:{
		        	user_id:'',
		        	keywords:'',
		        	contact:''
		        },
		        lp_idcard:{
		        	front:'',
		        	back:''
		        },
		        bankcard:{
		        	cardNo:'',
		        	cardholder:'',
		        	subBank:[]
		        },
		        inVisible: false,
		        third:{
					provName:[],
					cityName:[],
					areaName:[]
				},
				provIndex:[],
				areaIndex:[],
				cityIndex:[],
				is_vendor:''
            }
        },
        created() {
            this.getData();
            this.provData()
            var that =this;
	        this.$axios.get(that.ports.Home.config).then(function(res) {
		        that.sele = res.data.result.shop_status;
		        that.shop_type =  res.data.result.shop_type;
		        that.tshop_cate =  res.data.result.tshop_cate;
		        that.shop_cate =  res.data.result.shop_cate;
		        var arr = [res.data.result.shop_cate,res.data.result.tshop_cate]
		        for(var key in that.shop_type){
		        	that.shop_type[key]["children"]=arr[key]
		        }
		    })
        },
        computed: {
            data() {
            	return this.tableData

            }
        },
        methods: {
        	//省
			provData(){
				var that = this;
				this.$axios.get(that.ports.huifu.provIndex).then(function(res) {
					that.provIndex = res.data.result.list;
					that.cityIndex = []
					that.countyIndex = []
				})
			},
			cityData(){
				var that = this;
				this.$axios.get(that.ports.huifu.cityIndex,
				{params: {provId:that.third.provName.provId}}
				).then(function(res) {
					that.cityIndex = res.data.result.list;
					that.countyIndex = []
				})
			},
			countyData(){
				var that = this;
				this.$axios.get(that.ports.huifu.countyIndex,
				{
					params: {provId:that.third.provName.provId,cityId:that.third.cityName.cityId}
				}
				).then(function(res) {
					that.areaIndex = res.data.result.list;
				})
			},
			provblur(e){
				console.log(e)
				this.cityData()
			},	
			cityblur(e){
				this.countyData()
			},
			areablur(e){
				
			},
			handleIn(row) {
				var that = this
				that.shop_id=row.shop_id
				that.is_vendor=row.is_vendor
				this.$axios.get(that.ports.shop.show + '?shop_id=' + row.shop_id).then(function(res) {
					that.form.signed_rate = res.data.result.signed_rate
					that.form.status = res.data.result.status
					that.form.latitude = res.data.result.latitude
					that.form.longitude = res.data.result.longitude
					that.shop = res.data.result
					that.status = res.data.result.status
					that.shop_ad = res.data.result.shop_ad
					if(JSON.stringify(res.data.bankcard) != "{}") {
						that.lp_idcard.front = that.lp_idcard.type == 1 ? res.data.result.lp_idcard.front : '使用实名认证'
						that.lp_idcard.back = that.lp_idcard.type == 1 ? res.data.result.lp_idcard.back : '使用实名认证'
						that.bankcard.cardNo = res.data.result.bankcard.cardNo || ''
						that.bankcard.subBank = res.data.result.bankcard.subBank || []
						that.bankcard.cardholder = res.data.result.bankcard.cardholder || ''
					} else {
						that.lp_idcard.front = "未定义"
						that.lp_idcard.back = "未定义"
						that.bankcard.cardNo = "未定义"
						that.bankcard.cardholder = "未定义"
						that.bankcard.subBank = "未定义"
					}
					that.inVisible = true;
				})
			},
			InEdit(){
				var that = this;
				var url1 = that.ports.shop.thirdpartyStore,data={}
				if(this.is_vendor==0){
					data={
						provName: that.third.provName.provName,
						cityName: that.third.cityName.cityName,
						areaName: that.third.areaName.areaName,
						shop_id: that.shop_id,
					}
				}else{
					url1 = that.ports.shop.thirdpartyUpdate
					data={
						provName: that.third.areaName.areaName?that.third.provName.provName:'',
						cityName: that.third.areaName.areaName?that.third.cityName.cityName:'',
						areaName: that.third.areaName.areaName?that.third.areaName.areaName:'',
						shop_id: that.shop_id,
					}
				}
				var data = that.qs.stringify({
					data})
				that.$axios.post(url1, data)
					.then(function(res) {
						console.log(res);
						if(res.data.status == 200) {
							that.$message.success(`修改成功`);
							that.getData();
							that.editVisible = false;
						} else {
							that.$message.warning(res.data.message);
						}

					})
					.catch(function(error) {
						console.log(error);
						that.$message.error(`修改失败`);
					});
			},
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData(val,this.url);
            },
            // 获取 easy-mock 的模拟数据
            getData(page=1,url='') {
            	var that =this;
				this.$axios.get(that.ports.shop.index+"?page="+page+"&source=league"+url,{params:this.search}).then(function(res) {
		        	that.tableData = res.data.result.list;
		        	that.last_page = Number(res.data.result.page.last_page);
		        	that.cur_page = Number(res.data.result.page.current_page);
		            that.loading = false
		       }) 
            },
            
			
            searchbtn() {

				this.getData(1)
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                var that =this
                const item = this.tableData[index];
                this.$axios.get(that.ports.shop.show+'?shop_id='+this.tableData[index].shop_id).then(function(res) {
		            that.form.signed_rate = res.data.result.signed_rate
		            that.form.status = res.data.result.status
		            that.form.latitude = res.data.result.latitude
		            that.form.longitude = res.data.result.longitude
		            that.shop = res.data.result
		            that.status = res.data.result.status
		            that.shop_ad = res.data.result.shop_ad
		            if(JSON.stringify(res.data.bankcard)!="{}"){
		            	that.lp_idcard.front=that.lp_idcard.type==1?res.data.result.lp_idcard.front:'使用实名认证'
			            that.lp_idcard.back=that.lp_idcard.type==1?res.data.result.lp_idcard.back:'使用实名认证'
			            that.bankcard.cardNo=res.data.result.bankcard.cardNo||''
			            that.bankcard.subBank=res.data.result.bankcard.subBank||[]
			            that.bankcard.cardholder=res.data.result.bankcard.cardholder||''
		            }else{
		            	that.lp_idcard.front="未定义"
			            that.lp_idcard.back="未定义"
			            that.bankcard.cardNo="未定义"
			            that.bankcard.cardholder="未定义"
			            that.bankcard.subBank="未定义"
		            }
		            
		            
		        })
                
                this.editVisible = true;
            },
            handleEdit2(index, row){
            	this.form2.shop_id =this.tableData[index].shop_id
                this.editVisible2 = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleDelete2(index, row){
            	this.idx = index;
                this.delVisible2 = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
            	var that =this;
            	var data =that.qs.stringify({
                    status:that.form.status,
                    shop_id:that.tableData[that.idx].shop_id,
                    status_remark:that.form.status_remark,
                    signed_rate:that.form.signed_rate,
                    latitude:that.form.latitude,
                    longitude:that.form.longitude
	            })
            	that.$axios.post(that.ports.shop.update, data)
				.then(function (res) {
					console.log(res);
					if(res.data.status==200){
						that.$message.success(`修改第 ${that.idx+1} 行成功`);
						that.getData();
						that.editVisible = false;
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`修改第 ${that.idx+1} 行失败`);
				});
                
                
            },
            saveEdit2(){
            	var that =this;
            	var data =that.qs.stringify(that.form2)
            	that.$axios.post(that.ports.shop.adStore, data)
				.then(function (res) {
					console.log(res);
					if(res.data.status==200){
						that.$message.success(`修改成功`);
						that.getData();
						that.editVisible2 = false;
					}else{
						that.$message.warning(res.data.message);
					}
					
				})
				.catch(function (error) {
					console.log(error);
					that.$message.error(`修改第 ${that.idx+1} 行失败`);
				});
            },
            // 确定删除
            deleteRow(){
				var that = this;
				var data =that.qs.stringify({
            		shop_id:that.tableData[that.idx].shop_id,
	            })
                that.$axios.post(that.ports.shop.destroy, data)
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
            // 确定删除
            deleteRow2(){
				var that = this;
				var data =that.qs.stringify({
            		shop_id:that.tableData[that.idx].shop_id,
	            })
                that.$axios.post(that.ports.shop.adDestroy, data)
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
                this.delVisible2 = false;
                
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
   .el-tag--medium {
	    max-width: 200px;
	    overflow: hidden;
	}
	.textC{
		font-size: 24px;
		text-align: center;
		margin:  0 0 20px 0;
	}
</style>
