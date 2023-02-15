<!--
 * @Author: your name
 * @Date: 2022-10-10 10:45:43
 * @LastEditTime: 2022-10-10 14:51:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\customerManagement\components\user\inform.vue
-->
<template>
  <div class="g-form">
    <div v-if="step===1">
      <UserMaintainOperate
        :userInfoProp="userInfoPropData"
        :ebankCstmNo="ebankCstmNo"
        :entType="entType"
        :show-login-name="showLoginName"
        @backIndex="backIndex"
        @handleShowDetail="handleShowDetail"
      ></UserMaintainOperate>
    </div>
    <div v-if="step===2">
      <menuList></menuList>
    </div>
    <div v-if="step===3">
      <accountList></accountList>
    </div>
  </div>
</template>

<script>
import UserMaintainOperate from './UserMaintainOperate';
import menuList from "./menuList.vue"
import accountList from "./accountList.vue"
export default {
  components: {
    UserMaintainOperate,
    menuList,
    accountList
  },
  props: {
    showLoginName: {
      type: Boolean,
      default: false
    }, // 是否修改
    userCode: {
      type: String,
      default: ''
    }, // 查询条件

    //客户号
    ebankCstmNo: {
      type: String,
      default: ''
    },
    //判断客户号类型——sa/mam
    entType: {
      type: String,
      default: ''
    },
    userInfoProp: {
      type: Object,
      default() {
        return {};
      }
    } //传入数据
  },
  data() {
    return {
      step: 1,
      userInfoPropData: {},
    };
  },
  mounted(){
  },
  methods:{
    backIndex(){
     this.$emit('backIndex')
    },
    handleShowDetail(){
      this.step++
    }
  }
};
</script>

<style lang="scss" scoped>
.g-margin {
  margin: 12px 0px 18px;
}
</style>