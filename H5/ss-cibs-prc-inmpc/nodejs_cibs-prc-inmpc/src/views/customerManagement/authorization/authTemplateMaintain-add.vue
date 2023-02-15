<!--
 * @Author: zhangcheng
 * @Date: 2021-10-29 09:42:00
 * @LastEditTime: 2021-11-30 14:37:44
 * @LastEditors: ZhangZhen
 * @Description: 模板信息维护新增
 * @FilePath: \workplace\src\views\customerManagement\authorization\authTemplateMaintain-add.vue
-->
<template>
  <div class="contain">
    <table-change @back="back" @submit="submit" :modelFrom="modelFrom"></table-change>
  </div>
</template>

<script>
import TableChange from '../components/auth-template-maintain/TableChange.vue';
export default {
  name: 'AuthTemplateMaintainAdd',
  components: {
    TableChange
  },
  data() {
    return {
      modelFrom: {
        modelName: '',
        modelType: '1',
        amuntUserList: [
          {
            amountStart: '0.00',
            amountEnd: '',
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
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
        '/customerManagement/authTemplateMaintain/add' 
      );
    },
    submit(data) {
      this.$router.push({
        name: 'AuthTemplateMaintainAddConfirm',
        params: {
          ...data
        }
      });
    }
  },
  created() {
    if (Object.getOwnPropertyNames(this.$route.params).length !== 0) {
      this.modelFrom = this.$route.params;
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  box-sizing: border-box;
  min-height: 100%;
}
</style>