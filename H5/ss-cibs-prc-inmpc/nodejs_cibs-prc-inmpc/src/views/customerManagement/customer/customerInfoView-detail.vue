<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 16:09:13
 * @LastEditTime: 2021-12-29 18:05:47
 * @LastEditors: zhangcheng
 * @Description: 客户信息概览用户详情
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\customer\customerInfoView-detail.vue
-->
<template>
  <div class="contain">
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.BASE_INFO')" name="option"></el-tab-pane>
    </el-tabs>
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.USER_TYPE')}}</p>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">{{userTypeFilter(scope.row.userType) }}</template>
      </el-table-column>
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')}}</p>
      </el-table-column>
      <el-table-column prop="loginName"></el-table-column>
    </el-table>
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')}}</p>
      </el-table-column>
      <el-table-column prop="userChsName"></el-table-column>
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')}}</p>
      </el-table-column>
      <el-table-column prop="userEglsName"></el-table-column>
    </el-table>
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.CARD_TYPE')}}</p>
      </el-table-column>
      <el-table-column prop="cardType"></el-table-column>
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.CARD_NO')}}</p>
      </el-table-column>
      <el-table-column prop="cardNo"></el-table-column>
    </el-table>
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.CARD_AREA')}}</p>
      </el-table-column>
      <el-table-column prop="cardArea"></el-table-column>
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.USER_STATUS')}}</p>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_TYPE')">
        <template slot-scope="scope">{{userStatusFilter(scope.row.status)}}</template>
      </el-table-column>
    </el-table>
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.TFA_STATUS')}}</p>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">{{tfaStatusFilter(scope.row.tfaStatus)}}</template>
      </el-table-column>
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')}}</p>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">{{empowerGroupFilter(scope.row.empowerGroup)}}</template>
      </el-table-column>
    </el-table>
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')}}</p>
      </el-table-column>
      <el-table-column prop="userPhone"></el-table-column>
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')}}</p>
      </el-table-column>
      <el-table-column prop="email"></el-table-column>
    </el-table>
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')}}</p>
      </el-table-column>
      <el-table-column prop="mobilePhone"></el-table-column>
      <el-table-column width="180">
        <p>{{$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')}}</p>
      </el-table-column>
      <el-table-column prop="mailAddress"></el-table-column>
    </el-table>
    <!-- <el-tabs v-model="option" class="g-mt-32">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.OP_ACCOUNT_INFO')" name="option"></el-tab-pane>
    </el-tabs>-->
    <!-- <el-table
      :data="accountInfo"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_NO')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.QUERY')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ENTRY')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.AUTH')"></el-table-column>
    </el-table>
    <el-tabs v-model="option" class="g-mt-32">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.MENU_TREE')" name="option"></el-tab-pane>
    </el-tabs>
    <el-tree :data="menuTree"></el-tree>-->
    <div class="g-bottom">
      <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
    </div>
  </div>
</template>

<script>
import { queryOperatorDetail } from '@/api/customer-management/user';
import { findUserRoleMenuList } from '@/api/menu-management/index.js';
import filters from '@/filters/clientManage';
export default {
  name: 'CustomerInfoViewDetail',
  data() {
    return {
      tableData: [
        {
          channel: '',
          loginName: '',
          userChsName: '',
          userEglsName: '',
          cardType: '',
          cardNo: '',
          userStatus: '',
          authLevel: '',
          tfaStatus: '',
          cardArea: '',
          birthday: '',
          phone: '',
          emilAddress: '',
          mobilePhone: ''
        }
      ],
      option: 'option',
      accountInfo: [
        {
          accountNo: '1'
        },
        {
          accountNo: '1'
        }
      ],
      menuTree: [
        {
          label: '1',
          children: [
            {
              label: '1-1'
            }
          ]
        },
        {
          label: '2',
          children: [
            {
              label: '2-1'
            }
          ]
        },
        {
          label: '3',
          children: [
            {
              label: '3-1'
            }
          ]
        }
      ]
    };
  },
  filters,
  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    back() {
      this.$router.replace({
        name: 'CustomerInfoViewDetail'
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/customerInfoView/detail'
      );
    },
    async queryOperatorDetail() {
      const result = await queryOperatorDetail({
        userCode: this.userCode
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.tableData = [result.body];
      }
    },
    async findUserRoleMenuList() {
      const result = await findUserRoleMenuList({
        userCode: this.userCode
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        console.log(result);
      }
    },
    userStatusFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ENABLE');
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.DISABLE');
        default:
          return '';
      }
    },
    empowerGroupFilter(val) {
      switch (val) {
        case 'A':
          return 'A';
        case 'B':
          return 'B';
        case 'C':
          return 'C';
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NONE');
        default:
          return '';
      }
    },
    tfaStatusFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO');
        case '1':
        default:
          return this.$t('CUSTOMER_MANAGEMENT.YES');
      }
    },
    userTypeFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ADMAIN');
        case '2':
          return this.$t('CUSTOMER_MANAGEMENT.AUTH_USER');
        case '3':
          return this.$t('CUSTOMER_MANAGEMENT.INPUT_USER');
        default:
          return '';
      }
    }
  },
  created() {
    this.userCode = this.$route.params.userCode;
    this.queryOperatorDetail();
    this.findUserRoleMenuList();
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
.g-mt-32 {
  margin-top: 32px;
}
</style>
