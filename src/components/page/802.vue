<template>
  <div class="error-page">
      <div class="error-code">8<span>0</span>2</div>
      <div class="error-desc">啊哦~ 你暂无访问权限哟</div>
      <div class="error-handle">
          <!--<router-link to="/login">-->
            <el-button type="primary" size="large" @click='loginout'>返回登陆</el-button>
          <!--</router-link>-->
          <el-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</el-button>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
      goBack(){
          this.$router.go(-1);
      },
      loginout(){
      	store.commit('del_token');
        if(localStorage.getItem('login')=='buurt'){
          return this.$router.push('/buurtLogin');
        }
        this.$router.push('/login');
      }
  }
}
</script>


<style scoped>
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    .error-code{
        line-height: 1;
        font-size: 250px;
        font-weight: bolder;
        color: #2d8cf0;
    }
    .error-code span{
        color: #00a854;
    }
    .error-desc{
        font-size: 30px;
        color: #777;
    }
    .error-handle{
        margin-top: 30px;
        padding-bottom: 200px;
    }
    .error-btn{
        margin-left: 100px;
    }
</style>
