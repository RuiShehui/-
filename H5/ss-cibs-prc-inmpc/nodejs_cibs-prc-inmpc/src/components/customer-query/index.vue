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
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO')">
        <template slot-scope="scope">
          <div class="f-btnColor" @click="toDetail(scope.row)">{{scope.row.ebankCstmNo}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="entName" :label="$t('CUSTOMER_MANAGEMENT.ENT_NAME')"></el-table-column>
      <el-table-column prop="cardType" :label="$t('CUSTOMER_MANAGEMENT.CARD_KIND')"></el-table-column>
      <el-table-column prop="cardNo" :label="$t('CUSTOMER_MANAGEMENT.CARD_NO')"></el-table-column>
      <el-table-column prop="status" :label="$t('CUSTOMER_MANAGEMENT.STATUS')">
        <template slot-scope="scope">{{statusFilter(scope.row.status)}}</template>
      </el-table-column>
      <el-empty slot="empty" :image="require('@/img/table-empty.png')"></el-empty>
    </el-table>
  </div>
</template>

<script>
import {
  queryMerchant,
  queryMerchantList,
  clearAway
} from '@/api/customer-management/customer';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import { getValue } from '@/utils/tools';
// import { setValidateForm } from '@/utils/tools';
export default {
  name: 'CustomerQuery',
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
      tableData: [] //网银客户信息
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      console.log(this.routeName);
      switch (this.routeName) {
        case 'CustomerAccountOpen':
          this.accountOpen = false;
          this.serchType = '4';
          return;
        case 'CustomerInfoView':
          this.phoneAndEmail = true;
          this.serchType = '1';
          return;
        default:
          return;
      }
    },
    handleSubmit(formName) {
      // const submitForm = this.$refs[formName];
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.doQuery();
        }
        // else {
        //   this.$nextTick(() => {
        //     const formTable = this.$refs[formName];
        //     formTable.$el && setValidateForm(formTable.$el, valid);
        //   });
        // }
      });
    },
    async queryMerchant() {
      let result = await queryMerchant({
        serchType: this.serchType,
        ...this.form
      });
      return result;
    },
    async queryMerchantList() {
      let result = await queryMerchantList({
        serchType: this.serchType,
        ...this.form
      });
      return result;
    },
    selectChange(val) {
      if (val === '3') {
        this.getListCardType();
        this.getListCardArea();
      }
      this.$refs['ruleForm'].resetFields();
      this.queryStatus = false;
    },
    async doQuery() {
      // 查询客户号
      if (this.routeName === 'CustomerAccountOpen') {
        const result = await this.queryMerchant();
        if (
          result.body.cstmNo === null &&
          result.head.returnCode === '000000'
        ) {
          this.$showBox({
            content: this.$t('CUSTOMER_MANAGEMENT.CUSTOMER_NOT_EXIST'),
            showCancelButton: false
          });
          return;
        }
        const data = result.body;
        if (data.stemp) {
          // 客户开户逻辑
          this.$showBox({
            content: this.$t('CUSTOMER_MANAGEMENT.SECOND_INPUT', {
              msg: data.maintainer
            }),
            confirm: () => {
              // 如果单式权限已经完成第二步，或者联合权限完成第四步，直接前往确认页
              if (
                (data.entType === '1' && data.stemp === '2') ||
                (data.entType === '2' && data.stemp === '4')
              ) {
                const confirmData = {
                  step: data.stemp,
                  ebankCstmNo: data.ebankCstmNo,
                  cstmNo: data.cstmNo,
                  entType: data.entType
                };
                // 有数据
                // 信息填写完整触发进入确认页方法
                this.$emit('showConfirm', confirmData);
              } else {
                // 无数据
                // 信息不完整触发进入录入页方法
                this.$emit('showIndex', data);
              }
            },
            cancel: async () => {
              const result = await clearAway({
                ebankCstmNo: data.ebankCstmNo,
                stemp: data.stemp
              });
              if (result.body) {
                this.doQuery();
              }
            },
            confirmButtonText: this.$t('CUSTOMER_MANAGEMENT.CONTINUE'),
            cancelButtonText: this.$t('CUSTOMER_MANAGEMENT.CLEAR')
          });
          return;
        }
        if (result.head.returnCode === '000000') {
          // 无数据进入信息录入页方法
          this.$emit('showIndex', data);
        }
      } else {
        let result = await this.queryMerchantList();
        this.queryStatus = false;
        if (result.head.returnCode === '000000') {
          if (result.body.length !== 0) {
            let csInfo = result.body;
            let lang = JSON.parse(sessionStorage.getItem('head')).lang;
            if (result.body[0].entEglsName !== '') {
              this.$set(csInfo[0], 'entName', result.body[0].entEglsName);
            }
            if (result.body[0].entChsName !== '' && lang !== 'en') {
              csInfo[0].entName = result.body[0].entChsName;
            }
            this.tableData = csInfo[0].cardList.map(item => {
              return {
                cardType: item.cardType,
                cardNo: item.cardNo,
                ebankCstmNo: csInfo[0].ebankCstmNo,
                entName: csInfo[0].entName,
                entType: csInfo[0].entType,
                status: csInfo[0].status,
                entChsName: csInfo[0].entChsName,
                entEglsName: csInfo[0].entEglsName
              };
            });
            console.log(csInfo[0].entType, this.routeName);
            if (
              csInfo[0].entType === '1' &&
              (this.routeName === 'AuthTemplateMaintain' ||
                this.routeName === 'TrsAuSettings')
            ) {
              this.$showBox({
                content: this.$t('CUSTOMER_MANAGEMENT.USER_NO_NEED_SETTING'),
                showCancelButton: false
              });
              return;
            }
            this.queryStatus = true;
          } else {
            this.$showBox({
              content: this.$t('CUSTOMER_MANAGEMENT.CUSTOMER_NOT_EXIST'),
              showCancelButton: false
            });
          }
        }
      }
    },
    handleReset(formName) {
      // 重置输入框
      this.queryStatus = false;
      this.$refs[formName].resetFields();
      // const submitForm = this.$refs[formName];
      // submitForm.resetFields();
      // this.$nextTick(() => {
      //   submitForm.$el && setValidateForm(submitForm.$el, true);
      // });
    },
    toDetail(row) {
      sessionStorage.setItem('ebankCstmNo', row.ebankCstmNo);
      sessionStorage.setItem('ebankCsInfo', JSON.stringify(row));
      if (
        row.entType === '1' &&
        (this.routeName === 'AuthTemplateMaintain' ||
          this.routeName === 'TrsAuSettings')
      ) {
        this.$showBox({
          content: this.$t('CUSTOMER_MANAGEMENT.USER_NO_NEED_SETTING'),
          showCancelButton: false
        });
        return;
      }
      if (row.status !== '1') {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.CUSTOMER_STATUS_ERROR'),
          type: 'error'
        });
      } else {
        const data = {
          ebankCstmNo: row.ebankCstmNo,
          entType: row.entType
        };
        // 非开户页面触发父方法
        this.$emit('showIndex', data);
        // this.$router.push({
        //   name: this.routeName,
        //   params: { entType: row.entType }
        // });
      }
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
    statusFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.DELETE_ACCOUNT');
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ENABLE');
        case '2':
          return this.$t('CUSTOMER_MANAGEMENT.DISABLE');
        default:
          return '';
      }
    }
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
</style>
