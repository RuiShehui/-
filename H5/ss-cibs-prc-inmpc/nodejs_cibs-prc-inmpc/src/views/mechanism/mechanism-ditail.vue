<!--
 * @Autor: 朱涛
 * @Date: 2021-10-22 11:35:51
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-11 19:41:03
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\mechanism\mechanism-ditail.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('GROUP_MANAGEMENT.GROUP_CODE') }}</div>
        <div>{{ tableData.depCode }}</div>
        <div>{{ $t('GROUP_MANAGEMENT.GROUP_NAME') }}</div>
        <div>{{ tableData.depName }}</div>
      </div>
      <div class="row">
        <div>{{ $t('GROUP_MANAGEMENT.GROUP_LEVEL') }}</div>
        <div>{{ tableData.depClazz }}</div>
        <div>{{ $t('GROUP_MANAGEMENT.GROUP_ADDRESS') }}</div>
        <div>{{ tableData.depAddress }}</div>
      </div>
      <div class="row">
        <div>{{ $t('GROUP_MANAGEMENT.BELONGING_GROUP_NAME') }}</div>
        <div>{{ tableData.pDepName }}</div>
        <div>{{ $t('GROUP_MANAGEMENT.BELONGING_GROUP_CODE') }}</div>
        <div>{{ tableData.pDepCode }}</div>
      </div>
      <div class="row">
        <div>{{ $t('GROUP_MANAGEMENT.PERSON') }}</div>
        <div>{{ tableData.linkMan }}</div>
        <div>{{ $t('GROUP_MANAGEMENT.PHONE') }}</div>
        <div>{{ tableData.linkPhone }}</div>
      </div>
      <div class="row">
        <div>{{ $t('GROUP_MANAGEMENT.GROUP_DESCRIBLE') }}</div>
        <div>{{ tableData.depDescrible }}</div>
      </div>
    </div>
    <div class="g-bottom">
      <el-button class="f-backTo" @click="backTo">
        {{
        $t('COMMON.BACK')
        }}
      </el-button>
    </div>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant';
export default {
  components: {},

  data() {
    return {
      tableData: {
        // depCode: '机构编号', //机构编号
        // depName: '机构名称', //机构名称
        // depClazz: '机构级别', //机构级别
        // depStatus: '机构状态', //机构状态
        // pDepName: '所属机构', //所属机构
        // pDepCode: '所属机构编号', //所属机构编号
        // linkMan: '联系人', //联系人
        // linkPhone: '联系电话', //联系电话
        // depAddress: '机构地址', //机构地址
        // depDescrible: '机构描述' //机构描述
      }
    };
  },
  computed: {},
  created() {},

  mounted() {
    this.$route.query.depStatus = CONSTANTS.ENABLE[this.$route.query.depStatus];
    this.$route.query.depClazz =
      CONSTANTS.GROUPCLAZZ[this.$route.query.depClazz];
    this.tableData = this.$route.query;
    console.log(this.tableData);
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    //返回
    backTo() {
      this.$router.push('/systemManagement/mechanism');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/mechanism/ditail'
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
.tabs {
  margin-top: 3.5%;

  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
.g-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
.f-backTo {
  font-size: 18px;
  margin-top: 20px;
  width: 210px;
  height: 40px;
  background: #f06b00;
  color: #fff;
  text-align: center;
}
</style>
