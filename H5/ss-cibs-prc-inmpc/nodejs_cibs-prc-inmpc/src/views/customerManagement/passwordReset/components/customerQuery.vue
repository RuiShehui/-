<template>
  <div>
    <el-form
      :model="form"
      ref="ruleForm"
      label-position="right"
      label-width="calc(50% - 170px)"
      label-suffix=":"
    >
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.QUERY_TYPE')">
        <el-select
          class="f-w-340"
          v-model="serchType"
          :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
          @change="selectChange"
        >
          <el-option v-if="accountOpen" :label="$t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO')" value="1"></el-option>
          <el-option v-if="!accountOpen" :label="$t('CUSTOMER_MANAGEMENT.CSTM_NO')" value="4"></el-option>
          <el-option :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_NO')" value="2"></el-option>
          <el-option :label="$t('CUSTOMER_MANAGEMENT.CARD_INFO')" value="3"></el-option>
          <el-option v-if="phoneAndEmail" :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')" value="5"></el-option>
          <el-option v-if="phoneAndEmail" :label="$t('CUSTOMER_MANAGEMENT.USER_EMAIL')" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="serchType === '4'"
        :rules="rules.cstmNo"
        :label="$t('CUSTOMER_MANAGEMENT.CSTM_NO')"
        prop="cstmNo"
      >
        <el-input
          class="f-w-340"
          v-model="form.cstmNo"
          maxlength="7"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="serchType === '1'"
        :rules="rules.ebankCstmNo"
        :label="$t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO')"
        prop="ebankCstmNo"
      >
        <el-input
          class="f-w-340"
          v-model="form.ebankCstmNo"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="serchType === '2'"
        :rules="rules.accountNo"
        :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_NO')"
        prop="accountNo"
      >
        <el-input
          class="f-w-340"
          v-model="form.accountNo"
          maxlength="12"
          show-word-limit
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        ></el-input>
      </el-form-item>
      <div v-if="serchType === '3'">
        <el-form-item
          :label="$t('CUSTOMER_MANAGEMENT.CARD_TYPE')"
          prop="cardType"
          :rules="rules.cardType"
        >
          <el-select
            class="f-w-340"
            v-model="form.cardType"
            :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
          >
            <el-option
              v-for="(item, key) in cardTypeList"
              :key="key"
              :label="item.fiedlDescrible"
              :value="item.fieldValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')"
          prop="cardNo"
          :rules="rules.cardNo"
        >
          <el-input
            class="f-w-340"
            v-model="form.cardNo"
            :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('CUSTOMER_MANAGEMENT.CARD_AREA')"
          prop="cardArea"
          :rules="rules.cardArea"
        >
          <el-select
            class="f-w-340"
            v-model="form.cardArea"
            filterable
            :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
          >
            <el-option
              v-for="(item, key) in cardAreaList"
              :key="key"
              :label="item.fiedlDescrible"
              :value="item.fieldValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item
        v-if="serchType === '5'"
        :rules="rules.mobilePhone"
        :label="$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')"
        prop="mobilePhone"
      >
        <el-input
          class="f-w-340"
          v-model="form.mobilePhone"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="serchType === '6'"
        :rules="rules.email"
        :label="$t('CUSTOMER_MANAGEMENT.USER_EMAIL')"
        prop="email"
      >
        <el-input
          class="f-w-340"
          v-model="form.email"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="g-bottom">
      <el-button
        class="f-cancel"
        @click="handleReset('ruleForm')"
      >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
      <el-button
        type="primary"
        @click="handleSubmit('ruleForm')"
      >{{$t('CUSTOMER_MANAGEMENT.QUERY')}}</el-button>
    </div>
    <el-table
      v-if="queryStatus"
      :data="tableData"
      class="f-mt-40"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
       <el-table-column width="80" type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column label="用戶編號">
        <template slot-scope="scope">
          <span class="f-btnColor">{{scope.row.userCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userEglsName" :label="$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')"></el-table-column>
       <el-table-column width="150" prop="tfaStatus" label="密碼重試次數">
        <template v-slot="{ row }">
          {{ row.canRetryCount }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.USER_STATUS')">
        <template slot-scope="scope">{{userStatusFilter(scope.row.status)}}</template>
      </el-table-column>
      <el-table-column width="150" prop="tfaStatus" label="操作">
        <template v-slot="{ row }">
          <span
            v-if="row.status==='0' && row.canRetryCount===0 "
            @click="resetLoginCount(row.userCode)"
            class="f-btnColor resetPwd"
          >重設</span>
        </template>
      </el-table-column>

      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck"  v-if="queryStatus">
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  queryOperatorPage,
  resetLoginCount
} from '@/api/customer-management/user';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
export default {
  name: 'queryCusomer',
  props: {
    /**
     * @description 跳转路由名称 (string)
     * @required false
     */
    routeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      params: {},
      queryStatus: false,
      accountOpen: true,
      phoneAndEmail: false,
      serchType: '1', // 查询类型
      cardTypeList: [],
      cardAreaList: [],
      form: {
        ebankCstmNo: '', // 网银客户号
        cstmNo: '', // 客户号
        accountNo: '', // 账户号码
        cardType: '', // 证件类型
        cardNo: '', // 证件号码
        cardArea: '', // 证件签发地区/国家
        mobilePhone: '', // 手机号码
        email: '' // 电邮
      },
      rules: {
        cstmNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.CSTM_NO_RULES'),
            trigger: 'blur'
          },
          {
            pattern: /\d{4,7}/,
            message: this.$t('CUSTOMER_MANAGEMENT.CSTM_NO_RULES'),
            trigger: 'blur'
          }
        ],
        ebankCstmNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO_RULES'),
            trigger: 'blur'
          }
        ],
        accountNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.ACCOUNT_NO_RULES'),
            trigger: 'blur'
          },
          {
            min: 12,
            max: 12,
            message: this.$t('CUSTOMER_MANAGEMENT.ACCOUNT_NO_LENGTH_RULES'),
            trigger: 'blur'
          }
        ],
        cardType: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.CARD_TYPE_RULES'),
            trigger: 'change'
          }
        ],
        cardNo: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.CARD_NO_RULES'),
            trigger: 'blur'
          }
        ],
        cardArea: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.CARD_AREA_RULES'),
            trigger: 'blur'
          }
        ],
        mobilePhone: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE_RULES'),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.USER_EMAIL_RULES'),
            trigger: 'blur'
          },
          {
            pattern: /^(\w|\d|\_|\-)+\@(\w|\d)+(\.+|\w)+$/,
            message: this.$t('CUSTOMER_MANAGEMENT.INPUT_TRUE_EMAIL'),
            trigger: 'blur'
          }
        ]
      }, // 验证规则
      faildReson: '', // 失败原因
      tableData: [], //网银客户信息
      size:10,
      current:1,
      total: 1,
    };
  },
  computed: {},
  created() {
    // this.init();
  },
  methods: {
    async resetLoginCount(userCode) {
      const result = await resetLoginCount({ userCode });
      this.getUserInfo();
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getUserInfo();
        }
      });
    },
    handleSizeChange(val) {
      this.size = val;
      this.getUserInfo();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getUserInfo();
    },
     async getUserInfo() {
      let result = await queryOperatorPage({
        ...this.form,
        size: this.size,
        current: this.current
      });
      console.log(result,'result')
      if (result.head.returnCode !== '000000') {
      
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.queryStatus =true
        this.tableData = result.body.records;
        this.total = result.body.total;
      }

    },
    selectChange(val){
       if (val === '3') {
        this.getListCardType();
        this.getListCardArea();
      }
       this.$refs['ruleForm'].resetFields();
      this.queryStatus = false;
    },
    async getListCardType() {
      const result = await getListCardType({
        bigGroupCode: 'language',
        fieldName: this.routeName === 'UserMaintain' ? 'cardTypeEnt' : 'cardTypeEnt'
      });
      if (result.body) {
        this.cardTypeList = result.body.cardTypeList;
      }
    },
    async getListCardArea() {
      const result = await getListCardArea({
        bigGroupCode: 'language',
        fieldName: 'cardArea'
      });
      if (result.body) {
        this.cardAreaList = result.body.cardAreaList;
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
  }
};
</script>

<style lang='scss' scoped>
.f-w-340 {
  width: 340px;
}
.query {
  background: #f06b00;
  border-color: #f06b00;
  color: #ffffff;
  padding: 7px 0px;
  margin-top: 64px;
}
.reset {
  margin-left: 24px;
  border-color: #000000 45%;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
  margin-top: 64px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
::v-deep .el-form-item_ {
  padding-right: 8px;
}
.f-mt-40 {
  margin-top: 40px;
}
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
</style>
