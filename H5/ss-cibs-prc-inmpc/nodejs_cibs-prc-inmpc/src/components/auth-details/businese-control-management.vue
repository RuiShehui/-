<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 11:35:39
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 15:58:43
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\businese-control-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div>
    <section>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column :label="$t(`MENU_MANAGEMENT.MENU_NAME`)" width="180">
          {{
          $t(`MENU_MANAGEMENT.MENU_NAME`)
          }}
        </el-table-column>
        <el-table-column prop="menuName"></el-table-column>
        <el-table-column width="180">
          {{
          $t('MENU_MANAGEMENT.MENU_STATUS')
          }}
        </el-table-column>
        <el-table-column prop="menuStatus"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="$t('MENU_MANAGEMENT.APPLICATION_OBJECT')"
          width="180"
        >{{ $t('MENU_MANAGEMENT.APPLICATION_OBJECT') }}</el-table-column>
        <el-table-column prop="suitableObject"></el-table-column>
        <el-table-column width="180">
          {{
          $t('MENU_MANAGEMENT.ORGANIZATION_CUS_INFO')
          }}
        </el-table-column>
        <el-table-column prop="customerCodes"></el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant';
export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [
        //列表数组
        {
          menuName: '菜单名称1', //菜单名称
          menuStatus: '菜单状态1', //菜单状态
          suitableObject: '适用对象1', //适用对象
          customerCodes: '机构/白名单1' //机构/白名单
        }
      ]
    };
  },
  computed: {},
  created() {},

  mounted() {
    console.log('JSON:', JSON.parse(this.options.temp.afterMdJson).body);
    let obj = { 0: '机构', 1: '白名单', 2: '全部' };
    this.tableData[0] = JSON.parse(this.options.temp.afterMdJson).body;
    let customerCodes = '';
    if (this.tableData[0].suitableObject === '0') {
      if (this.tableData[0].commNetbankMenuObjects) {
        this.tableData[0].commNetbankMenuObjects.forEach(item => {
          if (customerCodes) {
            customerCodes = customerCodes + ',' + item.objectName;
          } else {
            customerCodes = item.objectName;
          }
        });
        this.tableData[0].customerCodes = customerCodes;
      }
    } else {
      console.log('打印执行11111', this.tableData[0].commNetbankMenuObjects);
      if (this.tableData[0].commNetbankMenuObjects) {
        this.tableData[0].commNetbankMenuObjects.forEach(item => {
          if (customerCodes) {
            customerCodes = customerCodes + ',' + item.customerCode;
          } else {
            customerCodes = item.customerCode;
          }
        });
        this.tableData[0].customerCodes = customerCodes;
      }
    }

    this.tableData[0].menuStatus =
      CONSTANTS.ENABLE[this.tableData[0].menuStatus];
    this.tableData[0].suitableObject = obj[this.tableData[0].suitableObject];
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
