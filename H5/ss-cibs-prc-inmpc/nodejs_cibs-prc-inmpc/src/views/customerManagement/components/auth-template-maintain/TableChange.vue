<template>
  <div>
    <el-form
      :model="modelFromChange"
      class="g-form"
      ref="modelFromChange"
      :rules="modelFromRules"
      :styles="formStyles"
    >
      <el-form-item
        prop="modelName"
        :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')"
        class="g-formitem"
      >
        <el-input
          v-model="modelFromChange.modelName"
          class="f-w-340"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          maxlength="100"
        />
      </el-form-item>
      <el-form-item required :label="$t('CUSTOMER_MANAGEMENT.MODEL_TYPE')" class="g-formitem">
        <el-radio-group
          v-model="modelFromChange.modelType"
          @change="typeChange('modelFromChange')"
          :disabled="hasTemplate"
        >
          <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL')}}</el-radio>
          <el-radio label="0">{{$t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-table
        v-if="modelFromChange.modelType === '1'"
        :cell-style="{padding: 0+'px'}"
        :data="modelFromChange.amuntUserList"
        stripe
        ref="formTable"
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column min-width="420" :label="$t('CUSTOMER_MANAGEMENT.MONEY_INTERVAL')">
          <template slot-scope="scope">
            <div class="g-money">
              <el-input
                class="f-w-160 margint16"
                :disabled="true"
                :value="moneyFormat(scope.row.amountStart)"
                size="mini"
              />
              <div class="text">
                <span>&lt;</span>
                <span>{{$t('CUSTOMER_MANAGEMENT.MONEY')}}</span>
                <span>≤</span>
              </div>
              <el-form-item
                class="g-table-form"
                :prop="'amuntUserList.' + scope.$index + '.amountEnd'"
                :rules="moneyRules(scope.$index)"
                size="mini"
              >
                <money-input
                  v-model="scope.row.amountEnd"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  class="f-w-160"
                  :size="'mini'"
                  :isSaveDot="true"
                  :isThousand="true"
                  @changeBlur="handleMaxChange($event, scope.$index ,scope)"
                  @focus="formatDel"
                />
              </el-form-item>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="300" :label="$t('CUSTOMER_MANAGEMENT.LEVELA_NUMBER')">
          <template slot-scope="scope">
            <el-form-item
              class="g-table-form"
              :prop="'amuntUserList.' + scope.$index + '.levelANumber'"
              :rules="auRules('A')"
              size="mini"
            >
              <el-input
                v-model="scope.row.levelANumber"
                :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                size="mini"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="300" :label="$t('CUSTOMER_MANAGEMENT.LEVELB_NUMBER')">
          <template slot-scope="scope">
            <el-form-item
              class="g-table-form"
              :prop="'amuntUserList.' + scope.$index + '.levelBNumber'"
              :rules="auRules('B')"
              size="mini"
            >
              <el-input
                v-model="scope.row.levelBNumber"
                :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                size="mini"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="300" :label="$t('CUSTOMER_MANAGEMENT.LEVELC_NUMBER')">
          <template slot-scope="scope">
            <el-form-item
              class="g-table-form"
              :prop="'amuntUserList.' + scope.$index + '.levelCNumber'"
              :rules="auRules('C')"
              size="mini"
            >
              <el-input
                v-model="scope.row.levelCNumber"
                :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                size="mini"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="200" :label="$t('CUSTOMER_MANAGEMENT.OPERATION')">
          <template slot-scope="scope">
            <el-form-item class="g-table-form" size="mini">
              <div
                v-if="scope.$index == modelFromChange.amuntUserList.length-1"
                class="f-span-btns"
              >
                <span
                  v-if="scope.$index > 0"
                  @click="delModule(scope.$index)"
                >{{$t('CUSTOMER_MANAGEMENT.DELETE')}}</span>
                <span @click="addModule(scope.row)">{{$t('CUSTOMER_MANAGEMENT.APPEND')}}</span>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="modelFromChange.modelType === '0'"
        :cell-style="{padding: 0+'px'}"
        :data="modelFromChange.amuntUserList"
        stripe
        ref="formTable"
        :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
      >
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELA_NUMBER')">
          <template slot-scope="scope">
            <el-form-item
              class="g-table-form"
              :prop="'amuntUserList.' + scope.$index + '.levelANumber'"
              :rules="auRules('A')"
              size="mini"
            >
              <el-input
                v-model="scope.row.levelANumber"
                :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                size="mini"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELB_NUMBER')">
          <template slot-scope="scope">
            <el-form-item
              class="g-table-form"
              :prop="'amuntUserList.' + scope.$index + '.levelBNumber'"
              :rules="auRules('B')"
              size="mini"
            >
              <el-input
                v-model="scope.row.levelBNumber"
                :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                size="mini"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELC_NUMBER')">
          <template slot-scope="scope">
            <el-form-item
              class="g-table-form"
              :prop="'amuntUserList.' + scope.$index + '.levelCNumber'"
              :rules="auRules('C')"
              size="mini"
            >
              <el-input
                v-model="scope.row.levelCNumber"
                :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                size="mini"
              />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <el-button
        type="primary"
        @click="submit('modelFromChange')"
      >{{$t('CUSTOMER_MANAGEMENT.SUBMIT')}}</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { moneyFormat } from '@/utils/tools';
// import { setValidateForm } from '@/utils/tools';

export default {
  name: 'authTemplateMaintainChange',
  props: {
    modelFrom: {
      type: Object,
      default: () => ({
        modelName: '',
        modelType: '1',
        amuntUserList: [
          {
            amountStart: '0.00',
            amountEnd: '',
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
          }
        ]
      })
    },
    hasTemplate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      option: 'option',
      modelFromChange: [],
      modelFromRules: {
        modelName: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')
            }),
            trigger: 'blur'
          }
        ],
        amountEnd: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.MONEY')
            }),
            trigger: 'blur'
          },
          {
            pattern: /^\d*$/,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.NUMBER')
            }),
            trigger: 'blur'
          }
        ]
      },
      formStyles: {}
    };
  },
  methods: {
    // inputNum(e) {
    //   const amount = e.target.value.split('');
    //   if (amount[0] === '0' && amount[1] !== '.') {
    //     e.target.value = '0';
    //     return;
    //   }
    //   if (amount[0] === '.') {
    //     e.target.value = '';
    //   }
    //   e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0];
    // },
    // handCopy() {
    //   return false;
    // },
    // handPaste() {
    //   return false;
    // },
    back() {
      this.$emit('back');
    },
    submit(formName) {
      // const submitForm = this.$refs[formName];
      // const formTable = this.$refs['formTable'];
      this.$refs[formName].validate(valid => {
        if (valid) {
          const leaveNum = this.modelFromChange.amuntUserList.some(item => {
            const people =
              Number(item.levelANumber) +
              Number(item.levelBNumber) +
              Number(item.levelCNumber);
            return people < 1;
          });
          if (leaveNum) {
            this.$showMsg({
              message: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_LEAVE_NUM'),
              type: 'error'
            });
          } else {
            this.$emit('submit', this.modelFromChange);
          }
        }
        // this.$nextTick(() => {
        //   formTable.$el && setValidateForm(formTable.$el, valid);
        // });
      });
    },
    auRules(contain) {
      return [
        {
          required: true,
          message: this.$t('CUSTOMER_MANAGEMENT.AUTH_EMPTY_RULES', {
            msg: contain
          }),
          trigger: 'blur'
        },
        {
          pattern: /^\d+$/,
          message: this.$t('CUSTOMER_MANAGEMENT.IS_NUMBER'),
          trigger: 'blur'
        },
        {
          pattern: /^([0-9]|[1-9][0-9]+)$/,
          message: this.$t('CUSTOMER_MANAGEMENT.AUTH_SIZE_RULES'),
          trigger: 'blur'
        }
      ];
    },
    moneyRules(index) {
      let rule = (rule, value, callback) => {
        if (!value) {
          return callback(
            new Error(
              this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
                msg: this.$t('CUSTOMER_MANAGEMENT.MONEY')
              })
            )
          );
        }
        if (value < 1) {
          callback(
            new Error(this.$t('CUSTOMER_MANAGEMENT.MONEY_GREATER_THAN'))
          );
        }
        if (!/^\d+(\,\d*)*(\.\d+)?$/.test(value)) {
          return callback(
            new Error(
              this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
                msg: this.$t('CUSTOMER_MANAGEMENT.RESULT_MONEY')
              })
            )
          );
        } else {
          if (
            index > 0 &&
            Number(
              this.modelFromChange.amuntUserList[index - 1].amountEnd
                .split(',')
                .join('')
            ) >= Number(value.split(',').join(''))
          ) {
            callback(
              new Error(this.$t('CUSTOMER_MANAGEMENT.MONEY_SIZE_RULES'))
            );
          } else {
            callback();
          }
        }
      };
      return [{ validator: rule, trigger: 'blur' }];
    },
    addRow(row) {
      if (
        Number(row.levelANumber) +
          Number(row.levelBNumber) +
          Number(row.levelCNumber) <
        1
      ) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_LEAVE_NUM'),
          type: 'error'
        });
        return false;
      }
      return true;
    },
    addModule(row) {
      if (!this.addRow(row)) {
        return;
      }
      const length = this.modelFromChange.amuntUserList.length;
      if (length < 30) {
        this.modelFromChange.amuntUserList.push({
          amountStart: this.modelFromChange.amuntUserList[length - 1].amountEnd,
          amountEnd: '',
          levelANumber: '',
          levelBNumber: '',
          levelCNumber: ''
        });
      } else {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.REACHE_MAX'),
          type: 'error'
        });
      }
    },
    moneyFormat,
    // 删除授权人信息（step3）
    delModule(index) {
      this.modelFromChange.amuntUserList.pop();
    },
    handleMaxChange(value, index, scope) {
      scope.row.amountEnd = value;
      if (index !== this.modelFromChange.amuntUserList.length - 1) {
        this.$set(
          this.modelFromChange.amuntUserList[index + 1],
          'amountStart',
          value
        );
      }
    },
    formatDel(e) {
      e.target.value = e.target.value.split(',').join('');
    },
    typeChange(formName) {
      if (this.modelFromChange.modelType === '0') {
        this.modelFromChange.amuntUserList = [
          {
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
          }
        ];
      } else {
        this.modelFromChange.amuntUserList = [
          {
            amountStart: '0.00',
            amountEnd: '',
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
          }
        ];
      }
      const submitForm = this.$refs[formName];
      this.$refs['modelFromChange'].clearValidate();
      this.$nextTick(() => {
        submitForm.$el && setValidateForm(submitForm.$el, true);
      });
    }
  },
  created() {
    this.modelFromChange = _.cloneDeep(this.modelFrom);
    if (this.modelFromChange.modelType === '1') {
      this.modelFromChange.amuntUserList = this.modelFromChange.amuntUserList.map(
        item => {
          return {
            ...item,
            amountStart: this.moneyFormat(item.amountStart),
            amountEnd: this.moneyFormat(item.amountEnd)
          };
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.g-form {
  .g-formitem {
    display: flex;
    justify-content: center;
    ::v-deep .el-form-item__content {
      width: 350px;
    }
  }
}
.f-w-160 {
  width: 160px;
}
.f-w-150 {
  width: 150px;
}
.f-w-340 {
  width: 340px;
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
.g-money {
  display: flex;
  // align-items: center;
  .margint16 {
    margin-top: 16px;
  }
  .text {
    margin: 18px 10px 0px;
    padding-top: 3px;
    display: flex;
    width: 76px;
    // align-items: center;
    span:nth-of-type(2) {
      margin: 0 15px;
    }
  }
}
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(2) {
    margin-left: 10px;
  }
}
::v-deep .el-table__row td {
  vertical-align: top;
}
.g-table-form {
  margin-top: 16px;
}
</style>