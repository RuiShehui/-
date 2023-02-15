<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 11:16:51
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-12-14 19:51:46
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\src\components\authorization-details\group-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
<div class="transverse-table">
    <div class="row">
      <div>{{ $t(`GROUP_MANAGEMENT.GROUP_CODE`) }}</div>
      <div>{{ tableData.depCode }}</div>
      <div>{{ $t(`GROUP_MANAGEMENT.GROUP_NAME`) }}</div>
      <div>{{ tableData.depName }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`GROUP_MANAGEMENT.GROUP_LEVEL`) }}</div>
      <div>{{ tableData.depClazz }}</div>
      <div>{{ $t(`GROUP_MANAGEMENT.GROUP_ADDRESS`) }}</div>
      <div>{{ tableData.depAddress }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`GROUP_MANAGEMENT.BELONGING_GROUP_NAME`) }}</div>
      <div>{{ tableData.pDepName }}</div>
      <div>{{ $t(`GROUP_MANAGEMENT.BELONGING_GROUP_CODE`) }}</div>
      <div>{{ tableData.pDepCode }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`GROUP_MANAGEMENT.BELONGING_GROUP_NAME`) }}</div>
      <div>{{ tableData.linkMan }}</div>
      <div>{{ $t(`GROUP_MANAGEMENT.PHONE`) }}</div>
      <div>{{ tableData.linkPhone }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`GROUP_MANAGEMENT.GROUP_DESCRIBLE`) }}</div>
      <div>{{ tableData.depDescrible }}</div>
    </div>
  </div>
  <!-- <div class="g-groupDetail">
    <section>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="$t('GROUP_MANAGEMENT.GROUP_CODE')"
          width="180"
        >{{ $t('GROUP_MANAGEMENT.GROUP_CODE') }}</el-table-column>
        <el-table-column prop="depCode"></el-table-column>
        <el-table-column width="180">
          {{
          $t('GROUP_MANAGEMENT.GROUP_NAME')
          }}
        </el-table-column>
        <el-table-column prop="depName"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="$t('GROUP_MANAGEMENT.GROUP_LEVEL')"
          width="180"
        >{{ $t('GROUP_MANAGEMENT.GROUP_LEVEL') }}</el-table-column>
        <el-table-column prop="depClazz"></el-table-column>
        <el-table-column
          :label="$t('GROUP_MANAGEMENT.GROUP_ADDRESS')"
          width="180"
        >{{ $t('GROUP_MANAGEMENT.GROUP_ADDRESS') }}</el-table-column>
        <el-table-column prop="depAddress"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column
          :label="$t('GROUP_MANAGEMENT.BELONGING_GROUP_CODE')"
          width="180"
        >{{ $t('GROUP_MANAGEMENT.BELONGING_GROUP_NAME') }}</el-table-column>
        <el-table-column prop="pDepName"></el-table-column>
        <el-table-column width="180">
          {{
          $t('GROUP_MANAGEMENT.BELONGING_GROUP_CODE')
          }}
        </el-table-column>
        <el-table-column prop="pDepCode"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column :label="$t('GROUP_MANAGEMENT.PERSON')" width="180">
          {{
          $t('GROUP_MANAGEMENT.PERSON')
          }}
        </el-table-column>
        <el-table-column prop="linkMan"></el-table-column>
        <el-table-column width="180">
          {{
          $t('GROUP_MANAGEMENT.PHONE')
          }}
        </el-table-column>
        <el-table-column prop="linkPhone"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column width="180">
          {{
          $t('GROUP_MANAGEMENT.GROUP_DESCRIBLE')
          }}
        </el-table-column>
        <el-table-column prop="depDescrible"></el-table-column>
      </el-table>
    </section>
  </div> -->
</template>

<script>
import CONSTANTS from '@/utils/constant';
import {
  findOrganizationInfo,
  findOrganizationInfoDetail
} from '@/api/mechanism/index.js';
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
      tableData: {
        depCode: '机构编号', //机构编号
          depName: '机构名称', //机构名称
          depClazz: '机构级别', //机构级别
          depStatus: '机构状态', //机构状态
          pDepName: '所属机构', //所属机构
          pDepCode: '所属机构编号', //所属机构编号
          linkMan: '联系人', //联系人
          linkPhone: '联系电话', //联系电话
          depAddress: '机构地址', //机构地址
          depDescrible: '机构描述' //机构描述
      }
    };
  },
  computed: {},
  created() {},

  mounted() {
    let groupLevel = { 0: '总行', 1: '分行' };
    if (
      this.options.operType !== '删除' &&
      this.options.operType !== 'Delete' &&
      this.options.operType !== '刪除'
    ) {
      this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
      this.tableData.depStatus =
        CONSTANTS.ENABLE[this.tableData.depStatus];
      this.tableData.depClazz = groupLevel[this.tableData.depClazz];
    } else {
      this.loadGroup(JSON.parse(this.options.temp.afterMdJson).body.depCode);
    }
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },

    //删除获取机构信息
    loadGroup(groupCode) {
      let groupLevel = { 0: '总行', 1: '分行' };
      // findOrganizationInfo({
      findOrganizationInfoDetail({
        depCode: groupCode
      }).then(resp => {
        console.log('打印resp111', resp.body);
        if (resp.body) {
          // this.tableData = resp.body;
          this.tableData.depCode = resp.body.depCode;
          this.tableData.depName = resp.body.depName;
          this.tableData.pDepName = resp.body.pDepName;
          this.tableData.pDepCode = resp.body.pDepCode;
          this.tableData.linkMan = resp.body.linkMan;
          this.tableData.linkPhone = resp.body.linkPhone;
          this.tableData.depAddress = resp.body.depAddress;
          this.tableData.depDescrible = resp.body.depDescrible;
          if (resp.body.depStatus) {
            this.tableData.depStatus = CONSTANTS.ENABLE[resp.body.depStatus];
          }
          if (this.tableData.depClazz) {
            this.tableData.depClazz = groupLevel[resp.body.depClazz];
          }
          console.log('打印。。。', this.tableData);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-groupDetail {
  //   padding: 20px 1%;
  background: #ffffff;
  height: 100%;
}
.tabs {
  margin-top: 3.5%;

  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}

/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
</style>
