<template>
  <div class="confirmInfoWapper">
    <div>
      <divider :title="$t('USER_MANAGEMENT.NORMAL_INFORMATION')" class="mt24 mb20" />
      <div class="confirmContent">
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_TYPE')"
          :content="userInfo.userType === '1' ? $t('USER_MANAGEMENT.ADMINISTRATOR'): userInfo.userType === '3' ? $t('USER_MANAGEMENT.REPORTER') : $t('USER_MANAGEMENT.AUTHORIZER')"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_CHINESE_NAME')"
          :content="userInfo.userChsName"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_ENGLISH_NAME')"
          :content="userInfo.userEglsName"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')"
          :content="userInfo.cardTypeName"
        />
        <detail-item :title="$t('USER_MANAGEMENT.USER_NUMBER')" :content="userInfo.cardNo" />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_STATUS_COLON')"
          :content="userInfo.status === '1' ? $t('USER_MANAGEMENT.ENABLE') : $t('USER_MANAGEMENT.DEACTIVATE')"
        />
        <detail-item
          v-if="userInfo.status === '0'"
          :title="$t('USER_MANAGERMENT.STOP_REASON')"
          :content="userInfo.revokeReason"
        />
        <detail-item
          v-if="userInfo.userType !== '3'"
          :title="$t('USER_MANAGEMENT.AUTHORITH_LEVEL')"
          :content="userInfo.empowerGroupName"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.FA')"
          :content="userInfo.tfaStatus === '1' ? $t('USER_MANAGEMENT.YES') : $t('USER_MANAGEMENT.NO')"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.ONEC_ATHOR')"
          :content="userInfo.cuSoleAuthorizerInd === '1' ?  $t('USER_MANAGEMENT.OPEN') : $t('USER_MANAGEMENT.CLOSE')"
        />
        <detail-item :title="$t('USER_MANAGEMENT.USER_ADDRESS')" :content="userInfo.cardAreaName" />
        <detail-item :title="$t('USER_MANAGEMENT.BIRTHDAY')" :content="userInfo.birthday" />
        <detail-item :title="$t('USER_MANAGEMENT.USER_PHONE')" :content="userInfo.userPhone" />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_PHONE_TWO')"
          :content="userInfo.contactsPhone"
        />
        <detail-item :title="$t('USER_MANAGEMENT.USER_EMAIL')" :content="userInfo.email" />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_MOBILE_PHONE')"
          :content="userInfo.mobilePhone"
        />
        <detail-item
          :title="$t('USER_MANAGEMENT.USER_SMS_ADDRESS')"
          :content="userInfo.mailAddress"
        />
      </div>
      <divider :title="$t('USER_MANAGEMENT.SERVE_SETTING')" class="mt24 mb20" />
      <div class="tableClass">
        <el-table
          :data="
          tableData
        "
          ref="tableData"
          row-key="menuCode"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column
          width="350"
            prop="menuName"
            :label="$t('USER_MANAGEMENT.MENU_NAME')"
            label-class-name="labelClass"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.menuName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('RIGHTS_TEMPLATE.ALL')"
            prop="entryPermission"
            label-class-name="labelClass"
          >
            <template slot="header">
              <el-checkbox
                :indeterminate="isIndeterminate1"
                v-model="queryAll"
                disabled
                @change="querySelectAll"
              >{{$t('RIGHTS_TEMPLATE.ALL')}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                v-show="scope.row.queryShowFlag"
                v-model="scope.row.queryFlag"
                disabled
                @change="querySelect(scope.$index, scope.row)"
              >{{$t('USER_MANAGEMENT.SEARCH_AUTHORITH')}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="entryPermission"
            :label="$t('RIGHTS_TEMPLATE.ALL')"
            label-class-name="labelClass"
          >
            <template slot="header">
              <el-checkbox
                :indeterminate="isIndeterminate2"
                v-model="entryAll"
                disabled
                @change="entrySelectAll"
              >{{$t('RIGHTS_TEMPLATE.ALL')}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.createFlag"
                disabled
                @change="entrySelect(scope.$index, scope.row)"
              >{{$t('USER_MANAGEMENT.ENTRY_AUTHORITY')}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="authAll" label-class-name="labelClass">
            <template slot="header">
              <el-checkbox
                :indeterminate="isIndeterminate3"
                v-model="authAll"
                disabled
                @change="authSelectAll"
              >{{$t('RIGHTS_TEMPLATE.ALL')}}</el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.grantFlag"
                disabled
                @change="authSelect(scope.$index, scope.row)"
              >{{$t('USER_MANAGEMENT.AUTHORIZATION_AUTHORITY')}}</el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="accountSelect">
        <divider class="mt24 mb20" :title="$t('USER_MANAGEMENT.ACCOUNT_CHOOSES')" />
        <div style="overflow: auto">
          <div v-for="(item, index) in operatorAccounts" :key="index">
            <span class="accountCheck">{{item.accName}}</span>
          </div>
        </div>
      </div>

      <div class="mb20" v-if="confirmInfo.operator.cuSoleAuthorizerInd === '1'">
        <div style="clear:both">
          <divider class="mt24 mb20" :title="$t('USER_MANAGEMENT.ONEC_ACCOUNT')" />
        </div>
        <el-table :data="soleTableData" stripe>
          <el-table-column
            :label="$t('USER_MANAGEMENT.PRIVILEGED_ACCOUNT')"
            prop="accName"
            align="left"
            min-width="50%"
          ></el-table-column>
          <el-table-column
            :label="$t('USER_MANAGEMENT.QUOTA')"
            prop="accLimitDaily"
            align="left"
            min-width="50%"
          ></el-table-column>
        </el-table>
      </div>
      <div class="flexc mt36">
        <v-button @click="back" class="mr16">{{$t('COMMON.PREVIOUS_STEP')}}</v-button>
        <v-button @click="$emit('next',confirmInfo)" type="primary">{{$t('COMMON.NEXT_STEP')}}</v-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  queryMenuPermission,
  queryUserAccountLimit,
  queryMenuAll,
  getListCardArea
} from '@/api/userManagement';
import { formatTreeData, deepClone, unique } from '@/utils/tree-table.js';
import _ from 'lodash';

export default {
  props: {
    confirmInfo: {
      required: true,
      type: Object,
      default: () => {}
    },
    props: {
      loading: {
        type: Boolean,
        default: () => {
          return false;
        }
      }
    }
  },
  components: {
    // optRadio
  },
  data() {
    return {
      userInfo: {},
      operatorAccounts: [],
      tableData: [],
      soleTableData: [], //单一批核者特权数组
      queryAll: true, // 控制查询的全部标识
      authAll: true, // 控制授权的全部标识
      entryAll: true, // 控制录入的全部标识
      isIndeterminate1: false,
      isIndeterminate2: false,
      isIndeterminate3: false,
      update: false,
      queryData: [], // 用于存储【查询权限】
      authData: [], // 用于存储【授权权限】
      entryData: [] // 用于存储【录入权限】
    };
  },
  computed: {},
  created() {},
  mounted() {
    console.log('confirmInfo', this.confirmInfo);
    this.userInfo = this.confirmInfo.operator;

    if (this.userInfo.empowerGroup && this.userInfo.empowerGroup == '0') {
      this.userInfo.empowerGroupName = '无';
    } else {
      this.userInfo.empowerGroupName = this.userInfo.empowerGroup;
    }
    this.tableData = this.confirmInfo.serveSettingList;
    this.soleTableData = this.confirmInfo.operator.userAccountLimits;
    this.operatorAccounts = _.cloneDeep(this.confirmInfo.operatorAccounts);
  },
  methods: {
    // 查询权限的全部change事件
    querySelectAll(val) {
      this.isIndeterminate1 = false;
      this.tableData.map(el => {
        el.queryChecked = val;
        if (el.children) {
          el.children.map(item => {
            item.queryChecked = val;
            if (item.children) {
              item.children.map(ele => (ele.queryChecked = val));
            }
          });
        }
      });
      if (this.queryAll) {
        this.tableData.map(item => {
          this.queryData.push(item);
        });
      } else {
        this.queryData = [];
      }
    },
    toNext() {
      console.log('checkWay', this.confirmInfo);
      this.$emit('next', this.confirmInfo);
    },
    // 授权权限的全部change事件
    entrySelectAll(val) {
      this.isIndeterminate2 = false;
      this.tableData.map(el => {
        el.entryChecked = val;
        if (el.children) {
          el.children.map(item => {
            item.entryChecked = val;
            if (item.children) {
              item.children.map(ele => (ele.entryChecked = val));
            }
          });
        }
      });
      if (this.entryAll) {
        this.tableData.map(item => {
          this.entryData.push(item);
        });
      } else {
        this.entryData = [];
      }
    },

    // 授权权限的全部change事件
    authSelectAll(val) {
      this.isIndeterminate3 = false;
      this.tableData.map(el => {
        el.authChecked = val;
        if (el.children) {
          el.children.map(item => {
            item.authChecked = val;
            if (item.children) {
              item.children.map(ele => (ele.authChecked = val));
            }
          });
        }
      });
      if (this.authAll) {
        this.tableData.map(item => {
          this.authData.push(item);
        });
      } else {
        this.authData = [];
      }
    },

    querySelect(index, row) {
      this.isIndeterminate1 = true;
      if (row.queryChecked) {
        this.queryData.push(row);
      }
    },
    entrySelect(index, row) {
      this.isIndeterminate2 = true;
      if (row.entryChecked) {
        this.entryData.push(row);
      }
    },
    authSelect(index, row) {
      this.isIndeterminate3 = true;
      if (row.authChecked) {
        this.authData.push(row);
      }
    },

    next() {
      this.$emit('next', this.data);
    },
    back() {
      console.log('打印this.data', this.confirmInfo);
      this.$emit('back', this.confirmInfo);
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    }
  }
};
</script>
<style lang="scss" scoped>
.info {
  width: 800px;
  margin: 0 auto;
  .el-form-item {
    width: 300px;
  }
}
.accountLimit {
  margin-top: 20px;
}
.accountTable {
  .colAccount {
    margin: 0 100px;
  }
}
.confirmContent {
  width: 940px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 64px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
/deep/ .el-table td,
.el-table th.is-leaf {
  padding: 6px 0 !important;
}
/deep/ .el-checkbox {
  padding: 0;
}
/deep/ .el-table .el-table__cell {
  padding: 6px 0 !important;
  height: 46px;
  line-height: 32px;
}
/deep/ .el-checkbox__label {
  color: #696969 !important;
}
.el-table /deep/.el-table__header /deep/.el-table__cell /deep/.cell,
.el-table .el-table__body /deep/.el-table__cell /deep/.cell {
  margin-left: 18px;
}
.el-table tr {
  background-color: #ffffff;
}
/deep/ .el-table td.el-table__cell div {
  margin-left: 16px;
}
.accountCheck {
  width: 100%;
  float: left;
  width: 30%;
  padding: 12px 0;
  padding-left: 3%;
  font-size: 14px;
}
</style>