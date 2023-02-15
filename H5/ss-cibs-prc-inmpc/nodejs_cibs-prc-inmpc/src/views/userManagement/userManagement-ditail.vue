<!--
 * @Autor: 朱涛
 * @Date: 2021-10-22 17:39:26
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-17 09:50:06
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\userManagement\userManagement-ditail.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <div class="transverse-table">
      <div class="row">
        <div>{{$t('USER_MANAGEMENT.USER_NAME')}}</div>
        <div>{{tableData.userName}}</div>
        <div>{{$t('USER_MANAGEMENT.USER_REL_NAME')}}</div>
        <div>{{tableData.userRealName}}</div>
      </div>
      <div class="row">
        <div>{{$t('USER_MANAGEMENT.USER_STATUS')}}</div>
        <div>{{tableData.userStatusName}}</div>
        <div>{{$t('USER_MANAGEMENT.USER_ROLE')}}</div>
        <div>{{tableData.userRoleRLATInfoParamsVOS}}</div>
      </div>
      <div class="row">
        <div>{{$t('GROUP_MANAGEMENT.BELONGING_GROUP_NAME')}}</div>
        <div>{{tableData.depName}}</div>
        <div>{{$t('GROUP_MANAGEMENT.BELONGING_GROUP_CODE')}}</div>
        <div>{{tableData.depCode}}</div>
      </div>
      <div class="row">
        <div>{{$t('USER_MANAGEMENT.CONTAC_TNUMBER')}}</div>
        <div>{{tableData.linkPhone}}</div>
        <div>{{$t('USER_MANAGEMENT.MAILBOX')}}</div>
        <div>{{tableData.email}}</div>
      </div>
      <div class="row">
        <div>{{$t('USER_MANAGEMENT.USER_DESCRIBE')}}</div>
        <div>{{tableData.userDescrible}}</div>
      </div>
    </div>
    <div class="g-btn">
      <el-button type="primary" @click="cancel">{{ $t('COMMON.BACK') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      tableData: {
        userName: '', //用户编号
        userRealName: '', //用户名称
        userStatusName: '', //用户状态
        userRoleRLATInfoParamsVOS: '', //用户角色
        depCode: '', //所属机构编号
        depName: '', //所属机构
        belongDepartmentCode: '', //所属部门
        linkPhone: '', //联系电话
        email: '', //邮箱
        userDescrible: '' //用户描述
      }
    };
  },
  computed: {},
  created() {},

  mounted() {
    this.tableData = this.$route.query;
  },

  methods: {
    //返回
    cancel() {
      this.$router.push('/systemManagement/userManagement');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/userManagement/ditail'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  box-sizing: border-box;
  background: #ffffff;
  min-height: 100%;
}
.g-btn {
  text-align: center;
  margin-top: 40px;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
}
</style>
