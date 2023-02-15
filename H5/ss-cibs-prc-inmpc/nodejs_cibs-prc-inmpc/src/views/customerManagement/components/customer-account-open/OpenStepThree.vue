<template>
  <div class="side-box">
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_SETTING')" name="option">
        <el-form :model="modelFrom" class="g-form" ref="modelFrom" :rules="modelFromRules">
          <el-form-item
            prop="modelName"
            :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')"
            class="g-formitem"
          >
            <el-input
              v-model="modelFrom.modelName"
              class="f-w-340"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
            />
          </el-form-item>
          <el-form-item required :label="$t('CUSTOMER_MANAGEMENT.MODEL_TYPE')" class="g-formitem">
            <el-radio-group v-model="modelFrom.modelType" @change="changeType('modelFrom')">
              <el-radio label="1">{{$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL')}}</el-radio>
              <el-radio label="0">{{$t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-table
            v-if="modelFrom.modelType === '1'"
            :data="modelFrom.amuntUserList"
            :cell-style="{padding: 0+'px'}"
            stripe
            ref="formTable"
            :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
          >
            <el-table-column width="430" :label="$t('CUSTOMER_MANAGEMENT.MONEY_INTERVAL_HKD')">
              <template slot-scope="scope">
                <div class="g-money">
                  <el-input
                    class="f-w-120 margint16"
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
                    size="mini"
                    :prop="'amuntUserList.' + scope.$index + '.amountEnd'"
                    :rules="moneyRules(scope.$index)"
                  >
                    <money-input
                      class="f-w-150"
                      v-model="scope.row.amountEnd"
                      :isSaveDot="true"
                      :isThousand="true"
                      @changeBlur="handleMaxChange($event, scope.$index ,scope)"
                      @focus="formatDel"
                      :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                    />
                  </el-form-item>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="300" :label="$t('CUSTOMER_MANAGEMENT.LEVELA_NUMBER')">
              <template slot-scope="scope">
                <el-form-item
                  class="g-table-form"
                  size="mini"
                  :prop="'amuntUserList.' + scope.$index + '.levelANumber'"
                  :rules="auRules('A')"
                >
                  <el-input
                    v-model="scope.row.levelANumber"
                    :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="300" :label="$t('CUSTOMER_MANAGEMENT.LEVELB_NUMBER')">
              <template slot-scope="scope">
                <el-form-item
                  class="g-table-form"
                  size="mini"
                  :prop="'amuntUserList.' + scope.$index + '.levelBNumber'"
                  :rules="auRules('B')"
                >
                  <el-input
                    v-model="scope.row.levelBNumber"
                    :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column width="300" :label="$t('CUSTOMER_MANAGEMENT.LEVELC_NUMBER')">
              <template slot-scope="scope">
                <el-form-item
                  class="g-table-form"
                  size="mini"
                  :prop="'amuntUserList.' + scope.$index + '.levelCNumber'"
                  :rules="auRules('C')"
                >
                  <el-input
                    v-model="scope.row.levelCNumber"
                    :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CUSTOMER_MANAGEMENT.OPERATION')" fixed="right">
              <template slot-scope="scope">
                <div
                  v-show="scope.$index == modelFrom.amuntUserList.length-1"
                  class="f-span-btns g-table-form"
                >
                  <span
                    v-if="scope.$index > 0"
                    @click="delModule(scope.$index)"
                  >{{$t('CUSTOMER_MANAGEMENT.DELETE')}}</span>
                  <span @click="addModule(scope.row)">{{$t('CUSTOMER_MANAGEMENT.APPEND')}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="modelFrom.modelType === '0'"
            :data="modelFrom.amuntUserList"
            :cell-style="{padding: 0+'px'}"
            stripe
            ref="formTable"
            :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
          >
            <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELA_NUMBER')">
              <template slot-scope="scope">
                <el-form-item
                  class="g-table-form"
                  size="mini"
                  :prop="'amuntUserList.' + scope.$index + '.levelANumber'"
                  :rules="auRules('A')"
                >
                  <el-input
                    v-model="scope.row.levelANumber"
                    :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELB_NUMBER')">
              <template slot-scope="scope">
                <el-form-item
                  class="g-table-form"
                  size="mini"
                  :prop="'amuntUserList.' + scope.$index + '.levelBNumber'"
                  :rules="auRules('B')"
                >
                  <el-input
                    v-model="scope.row.levelBNumber"
                    :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELC_NUMBER')">
              <template slot-scope="scope">
                <el-form-item
                  class="g-table-form"
                  size="mini"
                  :prop="'amuntUserList.' + scope.$index + '.levelCNumber'"
                  :rules="auRules('C')"
                >
                  <el-input
                    v-model="scope.row.levelCNumber"
                    :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="g-bottom">
          <el-button
            v-if="edit"
            class="f-cancel"
            @click="resetData"
          >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
          <el-button
            v-if="!edit"
            class="f-cancel"
            @click="handleReset('modelFrom')"
          >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
          <el-button type="primary" @click="add('modelFrom')">{{$t('CUSTOMER_MANAGEMENT.APPEND')}}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <article class="article">
      <p>
        <span class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</span>
        {{$t('CUSTOMER_MANAGEMENT.ADD_CUSTOMER_SCENCE_2_TIP')}}
      </p>
    </article>
    <el-tabs v-model="option">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.ADDED_AUTH_TEMPLATE')" name="option">
        <el-table
          class="mt25"
          :data="authTemplateListShow"
          stripe
          :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
        >
          <el-table-column type="index" width="90" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
          <el-table-column
            prop="modelName"
            min-width="200"
            :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')"
          ></el-table-column>
          <el-table-column
            prop="modelType"
            min-width="200"
            :label="$t('CUSTOMER_MANAGEMENT.APPROVAL_TYPE')"
          >
            <template slot-scope="scope">{{modelTypeChange(scope.row.modelType)}}</template>
          </el-table-column>
          <el-table-column min-width="300" :label="$t('CUSTOMER_MANAGEMENT.AUTH_PEOPLE_INFO')">
            <template slot-scope="scope">
              <p
                v-for="(itm, idx) of scope.row.amuntUserList"
                :key="idx"
              >{{handleShowItem(itm,scope.row.modelType)}}</p>
              <!-- <div>{{listShow(scope.row.amuntUserList)}}</div> -->
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('CUSTOMER_MANAGEMENT.OPERATION')" fixed="right">
            <template slot-scope="scope">
              <div class="f-span-btns">
                <span @click="del(scope.$index)">{{$t('CUSTOMER_MANAGEMENT.DELETE')}}</span>
                <span
                  @click="editModules(scope.row,scope.$index)"
                >{{$t('CUSTOMER_MANAGEMENT.EDIT')}}</span>
              </div>
            </template>
          </el-table-column>
          <el-empty
            slot="empty"
            :image="require('@/img/table-empty.png')"
            :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
          ></el-empty>
        </el-table>
      </el-tab-pane>
      <div class="g-bottom g-mb-120">
        <el-button class="f-cancel" @click="lastStep">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
        <!-- <el-button type="primary" @click="nextStep">{{$t('CUSTOMER_MANAGEMENT.NEXTSTEP')}}</el-button> -->
        <el-button type="primary" @click="nextStep">{{$t('CUSTOMER_MANAGEMENT.SAVE')}}</el-button>
      </div>
    </el-tabs>
    <article class="article g-mb-0">
      <p class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</p>
      <br />
      <p>{{$t('CUSTOMER_MANAGEMENT.ADD_CUSTOMER_SCENCE_2_TIP_1')}}</p>
      <p>{{$t('CUSTOMER_MANAGEMENT.ADD_CUSTOMER_SCENCE_2_TIP_2')}}</p>
      <p>{{$t('CUSTOMER_MANAGEMENT.ADD_CUSTOMER_SCENCE_2_TIP_3')}}</p>
    </article>
  </div>
</template>

<script>
import _ from 'lodash';
import { moneyFormat } from '@/utils/tools';
// import { setValidateForm } from '@/utils/tools';
export default {
  name: 'OpenStepThree',
  props: {
    authTemplateList: {
      type: Array,
      default: () => []
    },
    ebankCstmNo: {
      type: String,
      default: ''
    },
    cstmNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      edit: false,
      option: 'option',
      editData: {},
      isChangeDate: false,
      modelFrom: {
        modelName: '',
        modelType: '1',
        amuntUserList: [
          {
            amountStart: '0.00',
            amountEnd: '',
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
            // flowNum: '0',
            // recordNumber: '0'
          }
        ] // 授权模板
      }, // 授权模板表单
      authTemplateListShow: [], //显示列表
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
        amountStart: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.STRAT_MONEY')
            }),
            trigger: 'blur'
          }
        ],
        amountEnd: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.END_MONEY')
            }),
            trigger: 'blur'
          }
        ],
        levelANumber: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.A_AUTH')
            }),
            trigger: 'blur'
          }
        ],
        levelBNumber: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.B_AUTH')
            }),
            trigger: 'blur'
          }
        ],
        levelCNumber: [
          {
            required: true,
            message: this.$t('CUSTOMER_MANAGEMENT.PLEASE_INPUT', {
              msg: this.$t('CUSTOMER_MANAGEMENT.C_AUTH')
            }),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    moneyFormat,
    lastStep() {
      this.$emit('lastStep');
    },
    nextStep() {
      let hasMoney = 0,
        hasnotMoney = 0;
      this.authTemplateListShow.forEach(item => {
        if (item.modelType === '1') {
          hasMoney++;
        } else {
          hasnotMoney++;
        }
      });
      if (hasMoney === 0 || hasnotMoney === 0) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_NUMBER'),
          type: 'error'
        });
      } else {
        // console.log(this.authTemplateListShow);
        // console.log(this.isChangeDate,'this.isChangeDate')
        this.$emit('nextStepThree', {
          isChangeDate: this.isChangeDate,
          authTemplateListShow: this.authTemplateListShow
        });
      }
    },
    del(index) {
      this.$showBox({
        content: this.$t('CUSTOMER_MANAGEMENT.DELETE_CONFIRM'),
        confirm: () => {
          this.authTemplateListShow.splice(index, 1);
          this.isChangeDate = true;
        }
      });
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
    // 增加授权人信息（step3）
    addModule(row) {
      if (!this.addRow(row)) {
        return;
      }
      const length = this.modelFrom.amuntUserList.length;
      if (length < 30) {
        this.modelFrom.amuntUserList.push({
          amountStart: this.modelFrom.amuntUserList[length - 1].amountEnd,
          amountEnd: '',
          levelANumber: '',
          levelBNumber: '',
          levelCNumber: ''
          // flowNum: length,
          // recordNumber: length
        });
      } else {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.REACHE_MAX'),
          type: 'error'
        });
      }
    },
    // 删除授权人信息（step3）
    delModule(index) {
      this.modelFrom.amuntUserList.pop();
    },
    // 编辑模板（step3）
    editModules(row, index) {
      this.isChangeDate = true;
      this.edit = true;
      this.editData = _.cloneDeep(row);
      this.modelFrom = _.cloneDeep(row);
      if (this.modelFrom.modelType === '1') {
        this.modelFrom.amuntUserList = this.modelFrom.amuntUserList.map(itm => {
          return {
            ...itm,
            amountStart: moneyFormat(itm.amountStart),
            amountEnd: moneyFormat(itm.amountEnd)
          };
        });
      }
      console.log(row);
      this.authTemplateListShow.splice(index, 1);
    },
    resetData() {
      this.modelFrom = _.cloneDeep(this.editData);
      const submitForm = this.$refs['modelFrom'];
      submitForm.clearValidate();
      // this.$nextTick(() => {
      //   submitForm.$el && setValidateForm(submitForm.$el, true);
      // });
    },
    handleReset(formName) {
      // const submitForm = this.$refs[formName];
      this.$refs[formName].resetFields();
      // this.$nextTick(() => {
      //   submitForm.$el && setValidateForm(submitForm.$el, true);
      // });
      this.clearTemplate();
    },
    clearTemplate() {
      if (this.modelFrom.modelType === '1') {
        this.modelFrom.amuntUserList = [
          {
            amountStart: '0.00',
            amountEnd: '',
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
          }
        ];
      } else {
        this.modelFrom.amuntUserList = [
          {
            levelANumber: '',
            levelBNumber: '',
            levelCNumber: ''
          }
        ];
      }
    },
    changeType(formName) {
      const submitForm = this.$refs[formName];
      submitForm.clearValidate();
      // this.$nextTick(() => {
      //   submitForm.$el && setValidateForm(submitForm.$el, true);
      // });
      this.clearTemplate();
    },
    add(formName) {
      const submitForm = this.$refs[formName];
      submitForm.validate(valid => {
        if (valid) {
          this.edit = false;
          this.isChangeDate = true;
          for (let i = 0; i < this.authTemplateListShow.length; i++) {
            if (
              this.authTemplateListShow[i].modelName == this.modelFrom.modelName
            ) {
              this.$showMsg({
                message: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME_EXIST'),
                type: 'error'
              });
              return;
            }
          }
          const leaveNum = this.modelFrom.amuntUserList.some(item => {
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
            return;
          }
          this.modelFrom.ebankCstmNo = this.ebankCstmNo;
          if (this.modelFrom.modelType === '1') {
            this.modelFrom.amuntUserList = this.modelFrom.amuntUserList.map(
              itm => {
                return {
                  ...itm,
                  amountStart: itm.amountStart.split(',').join(''),
                  amountEnd: itm.amountEnd.split(',').join('')
                };
              }
            );
          }
          this.authTemplateListShow.push(_.cloneDeep(this.modelFrom));
          this.$refs[formName].resetFields();
          this.clearTemplate();
        }
        // else {
        //   this.$nextTick(() => {
        //     const formTable = this.$refs['formTable'];
        //     formTable.$el && setValidateForm(formTable.$el, valid);
        //   });
        // }
      });
    },
    // amountEnd校验规则
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
              this.modelFrom.amuntUserList[index - 1].amountEnd
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
    // 改变下一项最小金额
    handleMaxChange(value, index, scope) {
      scope.row.amountEnd = value;
      if (this.modelFrom.amuntUserList.length > index + 1) {
        this.$set(
          this.modelFrom.amuntUserList[index + 1],
          'amountStart',
          value
        );
      }
    },
    formatDel(e) {
      e.target.value = e.target.value.split(',').join('');
    },
    // 授权人数校验规则
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
    // 金额区间授权人数显示展示转换
    handleShowItem(item, index) {
      let tpl;
      if (index === '1') {
        tpl = `${moneyFormat(item.amountStart)}<${this.$t(
          'CUSTOMER_MANAGEMENT.MONEY'
        )}≤${moneyFormat(item.amountEnd)}, ${item.levelANumber}A ${
          item.levelBNumber
        }B ${item.levelCNumber}C`;
      } else {
        tpl = `${item.levelANumber}A ${item.levelBNumber}B ${item.levelCNumber}C`;
      }
      return tpl;
    },
    modelTypeChange(val) {
      switch (val.toString()) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL');
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL');
        default:
          return '';
      }
    }
  },
  created() {
    console.log( this.authTemplateList,' this.authTemplateList')
    this.authTemplateListShow = this.authTemplateList;
    if (this.authTemplateListShow.modelType === '1') {
      this.authTemplateListShow.amuntUserList = this.authTemplateListShow.amuntUserList.map(
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
  margin-top: 25px;
  .g-formitem {
    display: flex;
    justify-content: center;
    ::v-deep .el-form-item__content {
      width: 350px;
    }
  }
  ::v-deep .el-table__row td {
    vertical-align: top;
  }
}
.f-w-120 {
  width: 120px;
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
.f-span-btns {
  width: 100%;
  color: #f06b00;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(1) {
    margin-right: 10px;
    color: #e34141;
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
    display: flex;
    width: 76px;
    // align-items: center;
    span:nth-of-type(2) {
      margin: 0 15px;
    }
  }
}
.g-table-form {
  margin-top: 16px;
}
.article {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin: 32px 0px 24px;
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}
.g-mb-0 {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0;
}
.g-mb-120 {
  margin-bottom: 120px;
}
.side-box {
  position: relative;
}
.mt25 {
  margin-top: 25px;
}
</style>