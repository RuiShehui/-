<!--
 * @Autor: 朱涛
 * @Date: 2021-10-22 11:15:45
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 09:46:43
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\system-manage\components\organization\OrganizationEdit.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="contain">
    <header>
      <el-form
        :disabled="isSubmit"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="calc(50% - 170px)"
      >
        <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_CODE_SYMBOL`)" prop="depCode">
          <el-input
            class="g-w-340"
            :disabled="true"
            v-model="ruleForm.depCode"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_NAME_SYMBOL`)" prop="depName">
          <el-input
            class="g-w-340"
            v-model="ruleForm.depName"
            maxlength="100"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_LEVEL_SYMBOL`)" prop="depClazz">
          <el-select
            :disabled="true"
            v-model="ruleForm.depClazz"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectGroupDepClazz"
          >
            <el-option
              v-for="item in groupTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="groupDepClazzFlag"
          :label="$t(`GROUP_MANAGEMENT.BELONGING_GROUP_NAME_SYMBOL`)"
          prop="pDepName"
        >
          <el-select
            :disabled="true"
            v-model="ruleForm.pDepName"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectPGroup"
          >
            <el-option
              v-for="item in pGroupList"
              :key="item.depCode"
              :label="item.depName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="groupDepClazzFlag"
          :label="$t(`GROUP_MANAGEMENT.BELONGING_GROUP_CODE_SYMBOL`)"
          prop="pDepCode"
        >
          <el-select
            :disabled="true"
            v-model="ruleForm.pDepCode"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectPGroup"
          >
            <el-option
              v-for="item in pGroupList"
              :key="item.depCode"
              :label="item.depCode"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t(`GROUP_MANAGEMENT.PERSON_SYMBOL`)" prop="linkMan">
          <el-input
            class="g-w-340"
            v-model="ruleForm.linkMan"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>

        <el-form-item
          class="phone"
          prop="linkPhone"
          :label="$t(`USER_MANAGEMENT.CONTAC_TNUMBER_SYMBOL`)"
        >
          <el-form-item class="g_from_phone" prop="coreNumber">
            <el-input
              class="g-w-120"
              :disabled="isSubmit"
              v-model="ruleForm.coreNumber"
              :placeholder="$t(`COMMON.PLEASE_INPUT`)"
            ></el-input>
          </el-form-item>
          <div class="g-w-20">-</div>
          <el-form-item prop="liasPhone">
            <el-input
              class="g-w-200"
              :disabled="isSubmit"
              v-model="ruleForm.liasPhone"
              minlength="8"
              maxlength="11"
              :placeholder="$t(`COMMON.PLEASE_INPUT`)"
              onkeyup="value=value.replace(/[^\d\-]/g, '')"
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_ADDRESS_SYMBOL`)" prop="depAddress">
          <el-input
            class="g-w-340"
            v-model="ruleForm.depAddress"
            :placeholder="$t(`COMMON.PLEASE_INPUT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t(`GROUP_MANAGEMENT.GROUP_DESCRIBLE_SYMBOL`)" prop="depDescrible">
          <el-input
            type="textarea"
            rows="5"
            resize="none"
            v-model="ruleForm.depDescrible"
            class="g-w-340"
          ></el-input>
        </el-form-item>
      </el-form>
    </header>

    <footer class="g-btn" v-if="!isSubmit">
      <el-button class="f-cancel" @click="cancel">
        {{
        $t(`COMMON.CANCEL`)
        }}
      </el-button>
      <el-button class="f-confirm" @click="submitForm()">
        {{
        $t(`COMMON.SUBMIT`)
        }}
      </el-button>
    </footer>

    <footer class="g-btn" v-if="isSubmit">
      <el-button class="f-cancel" @click="perviousStep">
        {{
        $t(`COMMON.PREVIOUS_STEP`)
        }}
      </el-button>
      <el-button class="f-confirm" @click="confirm()">
        {{
        $t(`COMMON.CONFIRM`)
        }}
      </el-button>
    </footer>
  </div>
</template>

<script>
import {
  findOrganizationListInfo,
  updateOrganizationInfo
} from '@/api/mechanism/index.js';
import { retry } from 'statuses';
export default {
  name: 'OrganizationEdit',
  props: {
    ruleForm: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {},
  computed: {
    rules() {
      var validate_Type = (rules, value, callback) => {
        if (this.ruleForm.type == '') {
          callback(new Error(this.$t('message.rule.qxzdhzjlx')));
        }
        callback();
      };
      return {
        depCode: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_CODE'),
            trigger: 'blur'
          }
          //   {min: 3, max: 5, message: '长度在3到5个字符', trigger: 'blur'}
        ],
        depName: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_NAME'),
            trigger: 'blur'
          }
        ],
        depClazz: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_LEVEL'),
            trigger: 'blur'
          }
        ],
        depStatus: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_STATUS'),
            trigger: 'blur'
          }
        ],
        pDepCode: [
          {
            required: true,
            message: this.$t(
              'GROUP_MANAGEMENT.PLEASE_INPUT_BELONGING_GROUP_CODE'
            ),
            trigger: 'blur'
          }
        ],
        pDepName: [
          {
            required: true,
            message: this.$t(
              'GROUP_MANAGEMENT.PLEASE_INPUT_BELONGING_GROUP_NAME'
            ),
            trigger: 'blur'
          }
        ],
        liasPhone: [
          {
            required: false,
            message: this.$t('USER_MANAGEMENT.PLEASE_INPUT_CONTACT_NUMBER'),
            trigger: 'blur'
          },
          {
            min: 8,
            max: 11,
            message: this.$t('USER_MANAGEMENT.USER_PHONE_LENGTH_BETWEENL'),
            trigger: 'blur'
          }
        ],

        depAddress: [
          {
            required: true,
            message: this.$t('GROUP_MANAGEMENT.PLEASE_INPUT_GROUP_ADRESS'),
            trigger: 'blur'
          }
        ]
      };
    }
  },

  data() {
    return {
      // statusFlag: false, //机构状态判断描述是否为必填，停用为false，启用为true
      groupDepClazzFlag: false, //判断父级机构是否显示
      isSubmit: false, //是否提交，false未提交，true已提交
      groupTypeList: [
        //机构级别数组
        {
          value: '0',
          label: this.$t('GROUP_MANAGEMENT.TOTAL_BANK'),
          disabled: true
        },
        {
          value: '1',
          label: this.$t('GROUP_MANAGEMENT.OTHER_BANK')
        }
      ],
      pGroupList: [] //机构数组——下拉框
    };
  },
  watch: {},
  created() {},

  mounted() {
    if (this.ruleForm.depClazz === '0') {
      this.groupDepClazzFlag = false;
    } else {
      this.groupDepClazzFlag = true;
    }
  },

  methods: {
    //确认
    submitForm() {
      if (this.ruleForm.coreNumber && !this.ruleForm.liasPhone) {
        return this.$showMsg.error(
          this.$t('GROUP_MANAGEMENT.AREA_NUMBER_CONTACT_NUMBER')
        );
      }
      if (!this.ruleForm.coreNumber && this.ruleForm.liasPhone) {
        return this.$showMsg.error(
          this.$t('GROUP_MANAGEMENT.AREA_NUMBER_CONTACT_NUMBER')
        );
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isSubmit = true;
          if (this.ruleForm.coreNumber && this.ruleForm.liasPhone) {
            this.ruleForm.linkPhone =
              this.ruleForm.coreNumber + '-' + this.ruleForm.liasPhone;
          } else {
            this.ruleForm.linkPhone = '';
          }

          console.log('打印新增机构对象', this.ruleForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //取消
    cancel() {
      this.$emit('backIndex');
    },
    //确认
    confirm(formName) {
      updateOrganizationInfo(this.ruleForm).then(resp => {
        if (resp.body) {
          this.$showMsg({
            type: 'success',
            message: this.$t('GROUP_MANAGEMENT.EDIT_GROUP_SUCCESS')
          });
          this.cancel();
        } else {
        }
      });
    },

    //上一步
    perviousStep() {
      this.isSubmit = false;
    },
    //选择所属机构
    selectPGroup(e) {
      // console.log('打印机构编号：', e);
      this.ruleForm.pDepName = e.depName;
      this.ruleForm.pDepCode = e.depCode;
    },

    //选择级别
    selectGroupDepClazz(e) {
      if (e === '0') {
        this.groupDepClazzFlag = false;
      } else {
        let groupDepClazz = e - 1;
        // console.log('groupDepClazz', groupDepClazz);
        this.groupDepClazzFlag = true;
        this.pGroupList = [];
        findOrganizationListInfo().then(resp => {
          if (resp.body) {
            resp.body.forEach(item => {
              if (item.depClazz && parseInt(item.depClazz) === groupDepClazz) {
                this.pGroupList.push(item);
              }
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 20px;
  box-sizing: border-box;
  background: #fff;
  min-height: 100%;
  .g-btn {
    text-align: center;
    button {
      width: 210px;
      height: 40px;
      border-radius: 4px;
      font-size: 18px;
      text-align: center;
      border-color: #f06b00;
    }
    .f-cancel {
      color: #f06b00;
    }
    .f-confirm {
      background: #f06b00;
      color: #ffffff;
    }
  }
}
.g-w-340 {
  width: 340px;
}
.g-w-180 {
  width: 200px;
}
.g-w-20 {
  display: inline-block;
  text-align: center;
  width: 20px;
}
.g-w-120 {
  width: 120px;
}
.phone {
  ::v-deep .el-form-item__content {
    display: flex;
  }
}
</style>
