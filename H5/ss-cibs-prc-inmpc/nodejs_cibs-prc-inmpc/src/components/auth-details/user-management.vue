<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 09:35:22
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 14:52:24
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\user-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{$t('USER_MANAGEMENT.USER_NAME')}}</div>
      <div>{{tableData.userName}}</div>
      <div>{{$t('USER_MANAGEMENT.USER_REL_NAME')}}</div>
      <div>{{tableData.userRealName}}</div>
    </div>
    <div class="row">
      <div>{{$t('USER_MANAGEMENT.USER_STATUS')}}</div>
      <div>{{tableData.userStatus}}</div>
      <div>{{$t('USER_MANAGEMENT.USER_ROLE')}}</div>
      <div>{{tableData.roleNames}}</div>
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
</template>

<script>
import {
  getFindUserInfoListPage,
  findUserRuleLRLATInfoList
} from '@/api/user-management';
import { getFindRuleInfoPageList } from '@/api/role-management';
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
          userName: '用户编号', //用户编号
          userRealName: '用户名称', //用户名称
          userStatus: '', //用户状态
          roleNames: '', //用户角色
          depCode: '', //所属机构编号
          depName: '', //所属机构
          belongDepartmentCode: '', //所属部门
          linkPhone: '', //联系电话
          email: '', //邮箱
          userDescrible: '' //用户描述
        }
      ]
    };
  },
  computed: {},
  created() {},

  mounted() {
    // getFindUserInfoListPage({})
    // if (
    //   this.options.operType !== '删除' &&
    //   this.options.operType !== 'Delete' &&
    //   this.options.operType !== '刪除'
    // ) {
    //   JSON.parse(
    //     this.options.temp.afterMdJson
    //   ).body.roleNames = this.processUser(
    //     JSON.parse(this.options.temp.afterMdJson).body
    //   );
    // } else {
    this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
    this.tableData.userStatus = CONSTANTS.ENABLE[this.tableData.userStatus];
    // }
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },

    processUser(userInfo) {
      getFindRuleInfoPageList({ current: 1, size: 50 }).then(resp => {
        console.log('打印。。。。', resp, userInfo);
        if (resp.body.records) {
          let roleName = '';
          let roleList = [];
          userInfo.userRoleRLATInfoParamsVOS.forEach(item => {
            resp.body.records.forEach(roleItem => {
              if (item.roleCode === roleItem.roleCode) {
                if (roleName) {
                  roleName = roleName + ',' + roleItem.roleName;
                } else {
                  roleName = roleItem.roleName;
                }
              }
            });
          });
          userInfo.roleNames = roleName;
          userInfo.userStatus = CONSTANTS.ENABLE[userInfo.userStatus];
          this.$nextTick(() => {
            this.tableData = userInfo;
          });

          // console.log('打印roleName', roleName);
          // userInfo.roleNames = roleName;
          this.tableData = userInfo;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
