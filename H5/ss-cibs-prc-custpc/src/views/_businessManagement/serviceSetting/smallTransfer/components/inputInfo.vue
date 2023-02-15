<template>
  <div class="u-input-info">
    <divider :title="$t('USER_MANAGERMENT.SETTING_SAMLL')" style="margin-bottom: 20px" />
    <el-form :model="formData" ref="formData" :rules="rules" class="formW_400" label-width="140px">
      <el-form-item :label="$t('AUTHORIZE.AUTH_STATUS')+':'" prop="status" required>
        <el-switch
          style="margin-top: 8px; margin-left: 13px"
          v-model="formData.status"
          @change="changeSwitch"
          :disabled="statusFlag"
        ></el-switch>
      </el-form-item>
      <el-form-item
        v-if="formData.status"
        :label="$t('AUTHORIZE.AUTH_DAYLIMIT')"
        prop="dayLimit"
        class="m-amountStyle is-required"
      >
        <el-input class="m-smallTr-one" v-model="formData.type" disabled></el-input>
         <!--  -->
        <el-input
          class="m-smallTr-two"
          onkeyup="if(isNaN(value)) execCommand('undo')"
          onafterpaste="if(isNaN(value) execCommand('undo'))"
          @focus="foucsChage"
          v-model="formData.dayLimit"
          :placeholder="$t('USER_MANAGERMENT.INPUT_SMALL_MONEY')"
          @blur="blurChange"
        ></el-input>
      </el-form-item>
      <el-row class="flexc mt36">
        <v-button class="mr16" @click="fReset">{{$t('COMMON.RESET')}}</v-button>
        <v-button type="primary" :disabled="statusFlag" @click="submit">{{$t('COMMON.SUBMIT')}}</v-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { querySetResult } from '@/api/setServiceQuota.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
export default {
  props: {
    options: {
      type: Object,
      default: ()=>{
        return{}
      }
    }
  },
  data() {
    return {
      statusFlag: false,
      formData: {
        status: true,
        type: 'HKD',
        dayLimit: '10,000.00',
        email: '',
        phone: ''
      },
      rules: {
        dayLimit: [
          {
            required: true,
            message: this.$t('USER_MANAGERMENT.EMTRY_SAMLL'),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted() {
    console.log('this.options', this.options);
    if (this.options && this.options.type) {
      this.formData = this.options;
    } else {
      //查询小额转账设置
      this.query();
    }
  },
  methods: {
    //提交
    submit() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let moeny =  mathTools.delDecollator(this.formData.dayLimit)
          if (Number(moeny) > 10000) {
            return this.$message({
              type: 'fail',
              message: this.$t('USER_MANAGERMENT.SAMLL_LENGTH'),
              delay: 3000
            });
          }
          if (Number(moeny) == 0) {
            return this.$confirm({
              title: this.$t('COMMON.TIPS'),
              message:
                this.$t('USER_MANAGERMENT.SMALL_CLOSE'),
              btnText: {
                cancleText: this.$t('COMMON.CANCEL'),
                confirmText: this.$t('COMMON.DETERMINE')
              },
              isCancle: true
            }).then(() => {
              this.$emit('submit', this.formData);
            });
          }
          this.$emit('submit', this.formData);
        } else {
          return false;
        }
      });
    },
    //重置
    fReset() {
      this.query();
    },
    //查询小额转账设置
    query() {
      querySetResult().then(resp => {
        if (resp.entType == '2') {
          this.formData.status = false;
          this.statusFlag = true;
        } else {
          if (resp.limitAmount || resp.setStatus) {
            if (resp.setStatus === '1') {
              this.formData.status = true;
            } else {
              this.formData.status = false;
            }
            if (resp.limitAmount) {
              this.formData.dayLimit = tool.currencyFormat(
                resp.limitAmount,
                '',
                2
              );
            } else {
              this.formData.dayLimit = '10,000.00';
            }
          }
        }
      });
    },
    foucsChage(){
       this.formData.dayLimit = mathTools.delDecollator(this.formData.dayLimit);
    },
    //输入框失焦事件
    blurChange(e) {
      this.formData.dayLimit = tool.currencyFormat(
        this.formData.dayLimit,
        '',
        2
      );
    },
    changeSwitch(e) {
      if (e) {
        this.formData.dayLimit = '10000.00';
      } else {
        this.formData.dayLimit = '';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.formW_400 {
  margin-left: 264px;
}
.flexc {
  margin-left: 190px;
}
/deep/ .el-form-item__content {
  display: flex;
}
.m-smallTr-one {
  /deep/ .el-input {
    width: 100px !important;
  }
  /deep/ .el-input__inner {
    width: 100px !important;
  }
}
.m-smallTr-two {
  margin-left: 10px;
  /deep/ .el-input__inner {
    width: 210px !important;
  }
  /deep/ .el-input {
    width: 200px !important;
  }
}
</style>