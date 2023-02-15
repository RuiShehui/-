<!--
 * @Author: zhangcheng
 * @Date: 2022-07-21 20:18:23
 * @LastEditTime: 2022-07-22 09:33:00
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\op-logs\components\detail.vue
-->
<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 10:41:18
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 15:28:52
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\announcement-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->

<template>
  <div class="contain">
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t(`OP_LOGS.OP_ROLE_DATA`) }}</div>
        <div>{{ tableData.roleName }}</div>
        <div>{{ $t(`OP_LOGS.OP_NAME_DATA`) }}</div>
        <div>{{ tableData.userName }}</div>
      </div>
      <div class="row">
        <div>{{ $t(`OP_LOGS.OPERATE_TIME`) }}</div>
        <div>{{ tableData.createTime }}</div>
        <div>{{ $t(`OP_LOGS.OPERATE_ADRESS`) }}</div>
        <div>{{ tableData.ip }}</div>
      </div>
      <div class="row">
        <div>{{ $t(`OP_LOGS.FUNCTION_UNIT_DATA`) }}</div>
        <div>{{ tableData.ability }}</div>
        <div>操作內容</div>
        <div>{{ tableData.reqData }}</div>
      </div>
    </div>
    <div class="g-bottom">
      <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OpLogDetail',
  props: {
    tableData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {},
  created() {
    console.log(this.tableData, 'this.tableData');
  },

  mounted() {},

  methods: {
    back() {
      this.$emit('back')
    }
  }
};
</script>

<style lang="scss" scoped>
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    border-color: #f06b00;
  }
}
</style>

