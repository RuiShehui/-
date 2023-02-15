<!--
 * @Author: your name
 * @Date: 2021-12-06 11:21:31
 * @LastEditTime: 2022-09-26 11:34:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webbank-pc\src\views\authorizeCenter\components\end.vue
-->
<template>
  <div class="g-end-wrapper">
    <div class="g-select-content">
      <el-form :model="formData" ref="formData" :inline="true" label-position="right">
        <el-row>
          <el-col :span="lang === 'en' ? 10:8">
            <el-form-item :label="$t('COMMON.TRADE_TYPE')+ '：'" prop="type">
              <el-cascader
                v-model="formData.type"
                :options="options"
                :props="{expandTrigger: 'hover'}"
                separator="-"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="lang === 'en' ? 10:8">
            <el-form-item
              :label="$t('COMMON.AUTHORIZATION_STATUS')+ '：'"
              prop="status"
              style="margin-top:1px;"
            >
              <el-select v-model="authState" @change="statusChange">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in statusList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top:15px;">
          <el-col class="dataStyle" :span="12">
            <el-form-item
              :label="$t('COMMON.SUBMIT_TIME')+ '：'"
              prop="subTime"
              style="margin-top:1px; display:flex;"
            >
              <el-date-picker
                v-model="formData.subTime.startTime"
                :picker-options="pickerOptions"
                :placeholder="$t('ACCOUNT_MANAGEMENT.START_DATE')"
                class="picker"
                @change="dateChange1"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :clearable="false"
                range-separator
              ></el-date-picker>
              <span class="line">-</span>
              <el-date-picker
                v-model="formData.subTime.endTime"
                :picker-options="pickerOptions"
                :placeholder="$t('ACCOUNT_MANAGEMENT.END_DATE')"
                @change="dateChange2"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                range-separator
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <span class="g-btns">
            <v-button class="f-reset" size="w70" @click="reset">{{$t('COMMON.RESET')}}</v-button>
            <v-button size="w96" type="primary" @click="query">{{$t('COMMON.SEARCH')}}</v-button>
          </span>
        </el-row>
      </el-form>
    </div>
    <div class="g-list-content">
      <el-empty :image-size="200" v-if="waitList.length==0"></el-empty>
      <cardList v-else scene="1" :list="waitList" @detail="goDetail" @reedit="reEdit"></cardList>
    </div>
    <el-pagination
      v-if="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, sizes, jumper"
      :total="Number(total)"
      :current-page="Number(current)"
      :page-size="Number(size)"
      :page-sizes="[10, 20, 30, 50]"
      class="pagination"
    ></el-pagination>
  </div>
</template>

<script>
import cardList from './cardList';
import { searchAuthRecord, searchBySubmitter } from '@/api/authorizeCenter.js';
import { authPathMap } from '@auth/service/constant';
import metemixins from "@/views/applyCheckbook/components/metemixins.js";
export default {
    mixins:[metemixins],
  components: {
    cardList
  },
  data() {
    return {
      formData: {
        type: '',
        subTime: {},
        status: ''
      },
      statusList: [
        // '授权同意'
        { label: this.$t('AUTHORIZE.ARGESS'), value: '1' },
        // '授权拒绝'
        { label: this.$t('AUTHORIZE.REFUSE'), value: '2' },
        // '已撤销'
        // { label: this.$t('AUTHORIZE.AUTH_CANCLE'), value: '3' },
        // // '已过期'
        // { label: this.$t('AUTHORIZE.OUT_DATE'), value: '4' }
      ],
      queryFlag: true,
      waitList: [],
      options: [],
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let year = new Date().getFullYear();
          let day = 365;
          if ((year % 4 === 0 && year % 100 !== 0) || year % 400 == 0) {
            day = 366; //闰年
          }
          let fullYear = day * 24 * 3600 * 1000;
          const oneYear = curDate - fullYear;
          return time.getTime() > Date.now() || time.getTime() < oneYear;
        }
      },
      endTime: '', //结束时间
      current: '1', //分页参数
      size: '10', //分页参数
      startTime: '', //开始时间
      transType: '1', //1普通交易9管理台交易
      authState: '',
      unAuthState: '0',
      businessCode: '', //交易类型
      total: 0,
      lang: ''
    };
  },
  watch: {
    'formData.subTime'(time) {
      if (time) {
        let startTime = time.startTime;
        let endTime = time.endTime;
        startTime = new Date(startTime).getTime();
        endTime = new Date(endTime).getTime();
        this.queryFlag = true;
        if ((endTime - startTime) / 1000 / 3600 / 24 / 30 > 3) {
          this.queryFlag = false;
          // '最大选择范围为3个月，请重新选择！'
          this.$message.error(this.$t('AUTHORIZE.PLEASE_SELECT'));
        }
      }
    },
     lang(){
      this.options=this.i18nDate()
    }
  },
  created() {
    //提交人已结束数据查询
    this.searchBySubmitterInit();
    this.lang = localStorage.getItem('lang');
  },
  methods: {
    statusChange() {},
    handleSizeChange(size) {
      this.size = size;
      this.current = '1';
      this.searchByAuthorizerInit();
      this.searchBySubmitterInit();
    },
    handleCurrentChange(currentPage) {
      this.current = currentPage;
      // this.searchByAuthorizerInit();
      this.searchBySubmitterInit();
    },
    searchBySubmitterInit() {
      let params = {
        current: this.current, //分页参数
        authState: this.authState, //条件
        unAuthState: '0', //标识为我提交的已结束
        endTime: this.endTime, //条件：结束时间
        tcTransactionAbstract: {
          // businessCode: this.businessCode //条件：交易类型
          transactionType: this.businessCode //条件：交易类型
        },
        size: this.size, //分页参数
        startTime: this.startTime, //条件：开始时间
        transType: '1' //1普通交易9管理台交易
      };
      searchBySubmitter(params).then(res => {
        this.waitList = res.records;
        this.total = res.total;
        this.waitList.forEach(item => {
          item.transactionDescribe = JSON.parse(item.transactionDescribe);
        });
        // this.authState = value;
      });
    },
    dateChange1(value) {
      this.startTime = value + ' 00:00:00';
    },
    dateChange2(value) {
      this.endTime = value + ' 23:59:59';
    },
    handleChange(value) {
      this.businessCode = value[value.length - 1];
    },
    reset() {
      this.formData.subTime.startTime = '';
      this.formData.subTime.endTime = '';
      this.startTime = '';
      this.endTime = '';
      this.businessCode = '';
      this.authState = '';
      this.$refs.formData.resetFields();
      this.searchBySubmitterInit();
    },
    query() {
      if (!this.queryFlag) {
        // '最大选择范围为3个月，请重新选择！'
        return this.$message.error(this.$t('AUTHORIZE.PLEASE_SELECT'));
      }
      this.size = '10';
      this.current = '1';
      this.searchBySubmitterInit();
    },
    goDetail(item) {
      console.log('wait', item);

      this.$emit('detail', item);
    },
    reEdit(item) {
      const { creditAcctIdentificationType, transactionDescribe } = item;
      const path = authPathMap[creditAcctIdentificationType];
      if (!path) {
        return;
      }
      this.$router.push({
        path,
        query: {
          /** 统一格式, 勿动!!!!!!!!!! */
          params: JSON.stringify({
            ...(transactionDescribe || {})
          })
        }
      });
      console.log('reEdit', path);
    }
  }
};
</script>

<style lang="scss" scoped>

.f-reset {
  margin-right: 24px;
}
::v-deep .el-form-item {
  margin: 0;
}
::v-deep .oButton {
  margin-left: 24px;
}
::v-deep .el-input,
.el-date-editor {
  width: 200px;
  height: 36px;
}
.dataStyle {
  .el-date-editor {
    width: 140px;
    height: 36px;
  }
}
.g-btns {
  display: flex;
  justify-content: center;
  margin: 0 0 15px 0;
}
::v-deep .el-form .el-select > .el-input {
  width: 200px;
}
/deep/.el-cascader .el-input__suffix .el-icon-arrow-down {
  background: url('~@/images/common/xuanzekuang.png') no-repeat center
    transparent !important;

  content: '' !important;
  -webkit-appearance: none;
  background-size: 18px 18px !important;
  z-index: 10;
  margin-top: 11px;
  margin-right: 5px;
  transform: rotateZ(180deg);
}
/deep/.el-cascader .el-input .el-icon-arrow-down.is-reverse {
  transform: rotateZ(0deg);
}
/deep/ .el-cascader .el-input__suffix {
  height: 38px;
  right: 1px;
  margin-top: 1px;
  width: 40px;
  /* background-color: #f6f6f6; */
}
.line {
  margin: 10px 10px;
}
</style>