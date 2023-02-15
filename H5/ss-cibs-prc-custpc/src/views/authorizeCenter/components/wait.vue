<!--
 * @Author: your name
 * @Date: 2021-12-06 11:21:07
 * @LastEditTime: 2022-09-26 11:37:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\wait.vue
-->
<template>
  <div class="g-wait-wrapper">
    <div class="m-select-content">
      <el-form :model="formData" ref="formData" :inline="true" label-position="right">
        <el-row>
          <el-col :span="lang === 'en' ? 8:6">
            <el-form-item :label="$t('COMMON.TRADE_TYPE')+ '：'" prop="value">
              <el-cascader
                v-model="formData.value"
                :options="options"
                :props="{expandTrigger: 'hover'}"
                separator="-"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 提交日期: -->
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
          <el-col :span="8" v-if="lang === 'en' ? false:true" style="margin-top: 15px">
            <el-form-item>
              <span class="g-btns">
                <v-button class="f-reset" size="w70" @click="reset">{{$t('COMMON.RESET')}}</v-button>
                <v-button size="w70" @click="query" type="primary">{{$t('COMMON.SEARCH')}}</v-button>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  style="margin-top:12px;" v-if="lang === 'en' ? true:false">
          <el-col >
            <span class="g-btns">
              <v-button class="f-reset" size="w70" @click="reset">{{$t('COMMON.RESET')}}</v-button>
              <v-button size="w96" @click="query" type="primary">{{$t('COMMON.SEARCH')}}</v-button>
            </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="m-list-content">
      <el-empty :image-size="200" v-if="waitList.length==0"></el-empty>
      <cardList v-else scene="0" :list="waitList" @detail="goDetail" @refresh="refresh"></cardList>
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
// import whiteBtn from '@/components/common/whiteBtn';
import { searchAuthRecord, searchBySubmitter } from '@/api/authorizeCenter.js';
import { findRecentTransferDetail } from '@/api/home.js';
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
        value: ''
      },
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
      lang: '',
      // queryFlag: true,
      waitList: [],
      endTime: '', //结束时间
      current: '1', //分页参数
      currentPage: '1',
      transactionType: '', //交易类型
      size: '10', //分页参数
      pageSize: '10',
      startTime: '', //开始时间
      transType: '1', //1普通交易9管理台交易
      total: 0
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
          this.$message.error(this.$t('AUTHORIZE.PLEASE_SELECT'));
        }
      }
    },
     lang(){
      this.options=this.i18nDate()
    }

  },
  created() {
    this.lang = localStorage.getItem('lang');
    this.Datalist();
    //提交人未授权数据查询接口
    this.searchBySubmitterInit();
  },
  methods: {
    handleSizeChange(size) {
      this.size = size;
      this.current = '1';
      this.searchBySubmitterInit();
    },
    handleCurrentChange(currentPage) {
      this.current = currentPage;
      this.searchBySubmitterInit();
    },
    refresh() {
      this.current = '1';
      this.searchBySubmitterInit();
    },
    searchBySubmitterInit() {
      let params = {
        current: this.current, //分页参数
        authState: '0', //标识是未授权
        endTime: this.endTime, //条件：结束时间
        tcTransactionAbstract: {
          // businessCode: this.businessCode //条件：交易类型
          transactionType: this.businessCode //条件：交易类型
        },
        size: this.size, //分页参数
        startTime: this.startTime, //条件：开始时间
        transType: '1' //1普通交易9管理台交易
      };
      console.log('提交人未授权数据参数', params);
      searchBySubmitter(params).then(res => {
        this.waitList = res.records;
        this.total = res.total;
        this.waitList.forEach(item => {
          item.transactionDescribe = JSON.parse(item.transactionDescribe);
        });
        console.log('提交人未授权数据查询', this.waitList);
      });
    },
    dateChange1(value) {
      console.log('交易时间选择了', value, this.formData.subTime);
      this.startTime = value.split('/').join('-') + ' 00:00:00';
      console.log('开始时间,结束时间', this.startTime);
    },
    dateChange2(value) {
      console.log('交易时间选择了', value, this.formData.subTime);
      this.endTime = value.split('/').join('-') + ' 00:00:00';
      console.log('开始时间,结束时间', this.endTime);
    },
    handleChange(value) {
      this.businessCode = value[value.length - 1];
      console.log('交易类型选择了', value, this.businessCode);
    },
    reset() {
      this.formData.subTime.startTime = '';
      this.formData.subTime.endTime = '';
      this.startTime = '';
      this.endTime = '';
      this.businessCode = '';
      this.$refs.formData.resetFields();
    },
    //查询
    query() {
      this.size = '10';
      this.current = '1';
      this.searchBySubmitterInit();
      // if (!this.queryFlag)
      //   return this.$message.error('最大选择范围为3个月，请重新选择！');
    },
    goList() {
      this.$emit('golist');
    },
    goDetail(item) {
      console.log('wait', item);

      this.$emit('detail', item);
    },
    async Datalist() {
      console.log('你好世界');
      let params = {
        tranCode: '111'
      };
      // const res = await searchAuthRecord(params);
      // searchAuthRecord(params).then(resp => {
      //   console.log('resp', resp);
      // });
      searchAuthRecord(params).then(res => {
        console.log('后的获取的数据：', res);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-btns {
  display: flex;
  justify-content: center;
  margin: 0 0 15px 0 ;
}
.f-reset {
  margin-right: 24px;
}
::v-deep .el-form-item {
  margin: 0;
}
::v-deep .oButton {
  margin-left: 24px;
}
::v-deep .el-input {
  width: 140px;
  height: 36px;
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
  background-color: transparent;
}
/deep/ .pagination {
  .el-select {
    width: auto;
  }
  .el-input {
    width: auto !important;
  }
}
.line {
  margin: 10px 10px;
}
</style>