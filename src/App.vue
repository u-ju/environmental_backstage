<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<style>
	@import "../static/css/main.css";
	@import "../static/css/color-dark.css";
	/*深色主题*/
	/*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
	
	.center {
		text-align: center;
	}
	
	div.mr10.handle-input {
		width: 120px !important;
	}
	
	.el-tag {
		cursor: pointer;
	}
	
	.tangram-suggestion-main,
	#tangram-suggestion--TANGRAM__1p-main {
		z-index: 9999 !important;
	}
	
	img.avatar {
		display: inline-block !important;
		width: auto !important;
	}
	
	.viewer-container {
		z-index: 10000 !important;
	}
	
	#right_home {
		height: 600px !important;
		width: 1020px;
	}
	
	.iframe_ueditor {
		min-width: 760px;
	}
	
	.el-upload {
		position: relative;
		overflow: hidden;
	}
	
	.right_input {
		width: 1020px !important;
	}
	
	.area_border {
		display: inline-block;
		border: 1px solid #dcdfe6;
		height: 32px;
		line-height: 32px;
		border-radius: 4px;
		outline: 0;
		padding: 0 15px;
	}
	
	.width300 {
		width: 300px;
	}
	
	.width200 {
		width: 200px;
	}
	
	.width500 {
		width: 500px;
	}
	
	.allmap {
		width: 100%;
		height: 400px;
		font-family: "微软雅黑";
		border: 1px solid green;
		margin-top: 10px;
	}
	
	.floatL {
		float: left;
	}
	
	.overhidden {
		overflow: hidden;
	}
	.container{
		min-height: 500px;
	}
</style>