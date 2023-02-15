<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 14:25:27
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-12 19:42:45
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\authorization-details\role-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <div class="transverse-table">
      <div class="row">
        <div>{{$t('ROLE_MANAGEMENT.ROLE_CODE')}}</div>
        <div>{{tableData.roleCode}}</div>
        <div>{{$t('ROLE_MANAGEMENT.ROLE_NAME')}}</div>
        <div>{{tableData.roleName}}</div>
      </div>
      <div class="row">
        <div>{{$t('MENU_MANAGEMENT.MENU_NAME')}}</div>
        <div style="background:#f3f6fc;">{{$t('ROLE_MANAGEMENT.OPERATION_AUTHORITY')}}</div>
        <div style="flex:1">{{$t('ROLE_MANAGEMENT.AUTHORZATION_ATYHORITY')}}</div>
        <div style="background:#f3f6fc;">{{$t('ROLE_MANAGEMENT.QUERY_AUTHORITY')}}</div>
      </div>
    </div>

    <el-table :show-header="false" :data="roleArr" border :cell-style="columnDescribleStyle">
      <el-table-column prop="menuName" width="180"></el-table-column>
      <el-table-column prop="operPerm"></el-table-column>
      <el-table-column prop="authPerm"></el-table-column>
      <el-table-column prop="queryPerm"></el-table-column>
    </el-table>
    <div class="transverse-table">
      <div class="row">
        <div>{{$t('ROLE_MANAGEMENT.ROLE_DESCRIBLE')}}</div>
        <div>{{tableData.roleDescrible}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMenuInfoList } from '@/api/menu-management';
import {
  findRuleInfoCode,
  getFindRuleInfoPageList
} from '@/api/role-management/index.js';
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
      roleArr: [], //角色数组
      tableData: [
        //列表数组
        {
          roleCode: '角色描述1', //角色描述
          roleName: '角色名称1', //角色名称
          operationAuthority: '操作权限', //操作权限
          authorizationAuthority: '授权权限', //授权权限
          queryAuthority: '查询权限', //查询权限
          roleDescrible: '角色描述1' //角色描述
        }
      ]
    };
  },
  computed: {},
  created() {},

  mounted() {
    console.log('this.options', JSON.parse(this.options.temp.afterMdJson).body);
    if (
      this.options.operType !== '删除' &&
      this.options.operType !== 'Delete' &&
      this.options.operType !== '刪除'
    ) {
      this.tableData.roleCode = JSON.parse(
        this.options.temp.afterMdJson
      ).body.roleCode;
      this.tableData.roleName = JSON.parse(
        this.options.temp.afterMdJson
      ).body.roleName;
      this.tableData.roleDescrible = JSON.parse(
        this.options.temp.afterMdJson
      ).body.roleDescrible;
      this.getRole(
        JSON.parse(this.options.temp.afterMdJson).body.roleMenuRLATList
      );
    } else {
      findRuleInfoCode({
        roleCode: JSON.parse(this.options.temp.afterMdJson).body.roleCode
      }).then(roleResp => {
        console.log('打印roleResp', roleResp.body);
        this.getRole(roleResp.body);
      });
      this.loadRoleInfo(
        JSON.parse(this.options.temp.afterMdJson).body.roleCode
      );
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

    //删除获取角色信息
    loadRoleInfo(roleCode) {
      getFindRuleInfoPageList({ current: 1, size: 100 }).then(resp => {
        console.log('打印热水瓶：', resp);
        if (resp.body.records) {
          resp.body.records.forEach(item => {
            if (item.roleCode === roleCode) {
              this.tableData.roleCode = item.roleCode;
              this.tableData.roleName = item.roleName;
              this.tableData.roleDescrible = item.roleDescrible;
            }
          });
        }
      });
    },

    //渲染角色拥有的菜单
    getRole(roleList) {
      getMenuInfoList().then(resp => {
        console.log('resp:', resp);
        if (resp.body && resp.body.length) {
          resp.body.forEach(item => {
            item.authPerm = false;
            item.operPerm = false;
            item.queryPerm = false;
            roleList.forEach(rmItem => {
              if (rmItem.menuCode === item.menuCode) {
                if (rmItem.operPerm === 'Y') {
                  item.operPerm = true;
                }
                if (rmItem.authPerm === 'Y') {
                  item.authPerm = true;
                }
                if (rmItem.queryPerm === 'Y') {
                  item.queryPerm = true;
                }
              }
            });
          });
          console.log('daychuli:', resp);
          this.roleData(resp.body);
        }
      });
    },

    //处理角色数组
    roleData(roleList) {
      this.roleArr = [];
      roleList.forEach(item => {
        if (item.authPerm || item.operPerm || item.queryPerm) {
          item.authPerm = item.authPerm
            ? this.$t('AUTHORIZATION_CENTER.HAS')
            : '';
          item.operPerm = item.operPerm
            ? this.$t('AUTHORIZATION_CENTER.HAS')
            : '';
          item.queryPerm = item.queryPerm
            ? this.$t('AUTHORIZATION_CENTER.HAS')
            : '';
          this.roleArr.push(item);
        }
      });
      console.log('打印roleArr', this.roleArr);
    },
    columnDescribleStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff;';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 0;
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
</style>
