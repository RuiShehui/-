<!--
 * @Author: zhutao
 * @Date: 2021-11-18 17:44:07
 * @LastEditTime: 2022-07-06 10:34:03
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\user-maintenance-management.vue
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>特殊天气设定</div>
      <div>{{tableData.flag === '1'? '开启' : '关闭'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserMaintainConfirm',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: {}
    };
  },
  mounted() {
    this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
    console.log('aadadada', this.tableData);
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
