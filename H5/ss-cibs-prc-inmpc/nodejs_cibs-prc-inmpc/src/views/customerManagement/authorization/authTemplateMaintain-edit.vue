<!--
 * @Author: zhangcheng
 * @Date: 2021-10-29 09:42:00
 * @LastEditTime: 2021-12-23 16:26:37
 * @LastEditors: zhangcheng
 * @Description: 模板信息维护修改
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\authorization\authTemplateMaintain-edit.vue
-->
<template>
  <div class="contain">
    <table-change :modelFrom="modelFrom" @back="back" @submit="submit" :hasTemplate="true"></table-change>
  </div>
</template>

<script>
import TableChange from '../components/auth-template-maintain/TableChange';
export default {
  name: 'AuthTemplateMaintainEdit',
  components: {
    TableChange
  },
  data() {
    return {
      modelFrom: {
        modelName: '1',
        modelType: '1',
        authModule: [
          {
            amountStart: '0',
            amountEnd: '1',
            aLevel: '1',
            bLevel: '1',
            cLevel: '1'
          }
        ]
      }
    };
  },
  methods: {
    back() {
      this.$router.replace({
        name: 'AuthTemplateMaintain'
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/authTemplateMaintain/edit' 
      );
    },
    submit(data) {
      this.$router.push({
        name: 'AuthTemplateMaintainEditConfirm',
        params: data
      });
    }
  },
  created() {
    this.modelFrom = this.$route.params;
    console.log(this.modelFrom);
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
</style>