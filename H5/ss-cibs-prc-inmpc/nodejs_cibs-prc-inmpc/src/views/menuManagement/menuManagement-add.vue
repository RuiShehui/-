<template>
  <div class="g-menuManagement-add">
    <header class="g-form">
      <el-form
        :disabled="confirmFlag"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
      >
        <!-- <el-form-item label="菜单编号:" prop="menuCode">
          <el-input v-model="ruleForm.menuCode" placeholder="请输入"></el-input>
        </el-form-item>-->
        <el-form-item :label="$t(`MENU_MANAGEMENT.MENU_NAME_SYMBOL`)" prop="menuName">
          <el-input
            v-model="ruleForm.menuName"
            maxlength="50"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t(`MENU_MANAGEMENT.MENU_LEVEL_SYMBOL`)" prop="menuLevel">
          <el-select
            v-model="ruleForm.menuLevel"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectMenuLevel"
          >
            <el-option
              v-for="item in menuClazzList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t(`MENU_MANAGEMENT.MENU_STATUS_SYMBOL`)" prop="status">
          <el-select
            v-model="ruleForm.status"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectStatus"
          >
            <el-option
              v-for="item in menuStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="menuLevelFlag"
          :label="$t(`MENU_MANAGEMENT.P_MENU_CODE_SYMBOL`)"
          prop="pMenuCode"
        >
          <el-select
            v-model="ruleForm.pMenuCode"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectPMenuCode"
          >
            <el-option
              v-for="item in pMenuList"
              :key="item.menuCode"
              :label="item.menuCode"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="menuLevelFlag"
          :label="$t(`MENU_MANAGEMENT.P_MENU_NAME_SYMBOL`)"
          prop="pMenuName"
        >
          <el-select
            v-model="ruleForm.pMenuName"
            :placeholder="$t(`COMMON.PLEASE_SELECT`)"
            :style="{ width: '340px' }"
            @change="selectPMenuName"
          >
            <el-option
              v-for="item in pMenuList"
              :key="item.menuCode"
              :label="item.menuName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t(`MENU_MANAGEMENT.URL_SYMBOL`)" prop="url">
          <el-input v-model="ruleForm.url" :placeholder="$t(`COMMON.PLEASE_SELECT`)"></el-input>
        </el-form-item>
        <el-form-item :label="$t(`MENU_MANAGEMENT.MENU_DESCRIBLE_SYMBOL`)" prop="menuDescrible">
          <el-input
            type="textarea"
            maxlength="300"
            v-model="ruleForm.menuDescrible"
            :style="{ width: '370px', height: '120px' }"
          ></el-input>
        </el-form-item>
      </el-form>
    </header>

    <footer v-if="!confirmFlag" class="g-btn">
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

    <footer v-if="confirmFlag" class="g-btn">
      <el-button class="f-cancel" @click="previousStep">
        {{
        $t(`COMMON.PREVIOUS_STEP`)
        }}
      </el-button>
      <el-button :disabled="loading" class="f-confirm" @click="confirm()">
        {{
        $t(`COMMON.DETERMINE`)
        }}
      </el-button>
    </footer>
  </div>
</template>

<script>
import { menuAdd, getMenuInfoList } from '@/api/menu-management/index.js';
export default {
  components: {},
  computed: {
    rules() {
      // var validate_Type = (rules, value, callback) => {
      //   if (this.ruleForm.type == '') {
      //     callback(new Error(this.$t('message.rule.qxzdhzjlx')));
      //   }
      //   callback;
      // };
      return {
        // menuCode: [
        //   { required: true, message: '请输入菜单编号', trigger: 'blur' }
        // ],
        menuName: [
          {
            required: true,
            message: this.$t('MENU_MANAGEMENT.PLEASE_INPUT_MENU_NAME'),
            trigger: 'blur'
          },
          {
            max: 50,
            message: this.$t('MENU_MANAGEMENT.MANY_CHARACTER'),
            trigger: 'blur'
          }
        ],
        menuLevel: [
          {
            required: true,
            message: this.$t('MENU_MANAGEMENT.PLEASE_SELECT_MENU_LEVEL'),
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('MENU_MANAGEMENT.PLEASE_SELECT_MENU_STATUS'),
            trigger: 'blur'
          }
        ],
        pMenuCode: [
          {
            required: true,
            message: this.$t('MENU_MANAGEMENT.PLEASE_SELECT_P_MENU_CODE'),
            trigger: 'blur'
          }
        ],
        pMenuName: [
          {
            required: true,
            message: this.$t('MENU_MANAGEMENT.PLEASE_SELECT_P_MENU'),
            trigger: 'blur'
          }
        ],
        url: [
          {
            required: true,
            message: this.$t('MENU_MANAGEMENT.PLEASE_INPUT_URL'),
            trigger: 'blur'
          }
        ],
        menuDescrible: [
          {
            required: this.statusFlag,
            message: this.$t('MENU_MANAGEMENT.PLEASE_INPUT_MENU_DESCRIBLE'),
            trigger: 'blur'
          }
        ]
      };
    }
  },
  data() {
    return {
      statusFlag: false, //菜单状态判断描述是否为必填，停用为false，启用为true
      confirmFlag: false, //是否提交状态
      menuLevelFlag: false, //根据菜单级别是否显示 一级菜单不显示
      loading: false, //新增后防止重复新增
      ruleForm: {
        // menuCode: '', //菜单编号
        menuName: '', //菜单名称
        menuLevel: '', //菜单级别
        status: '', //菜单状态
        pMenuCode: '', //所属菜单编号
        pMenuName: '', //所属菜单
        url: '', //URL
        menuDescrible: '' //菜单描述
      },
      menuClazzList: [
        //菜单级别数组
        {
          value: '1',
          label: '一级'
        },
        {
          value: '2',
          label: '二级'
        },
        {
          value: '3',
          label: '三级'
        },
        {
          value: '4',
          label: '四级'
        },
        {
          value: '5',
          label: '五级'
        }
      ],
      menuStatusList: [
        //菜单状态数组\
        {
          value: '0',
          label: '停用'
        },
        {
          value: '1',
          label: '启用'
        }
      ],
      pMenuList: [
        //所属菜单数组数据
        {
          value: '1',
          label: '菜单编号1'
        },
        {
          value: '2',
          label: '菜单编号2'
        }
      ]
      // pMenuNameList: [
      //   //所属菜单数组
      //   {
      //     value: '1',
      //     label: '所属菜单1'
      //   },
      //   {
      //     value: '2',
      //     label: '所属菜单2'
      //   }
      // ]
    };
  },
  watch: {},
  created() {},

  mounted() {},

  methods: {
    //提交
    submitForm() {
      // let self = this;
      // let obj = {
      //   url: '/menuManagement/add'
      // };
      // self.$router.push({ path: '/menuManagement/submit', query: obj });
      let self = this;
      self.$refs.ruleForm.validate(valid => {
        if (valid) {
          self.confirmFlag = true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      // let params = {
      //   menuCode: '20211110',
      //   menuDescrible: '描述',
      //   menuName: '新增测试',
      //   pMenuCode: '01',
      //   pMenuName: '一级菜单',
      //   menuLevel: '2',
      //   status: '1',
      //   url: 'xxxxddd'
      // };
      // menuAdd(params).then(resp => {
      //   console.log('resp:', resp);
      // });
    },

    //取消
    cancel() {
      this.$router.push('/systemManagement/menuManagement');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/menuManagement/add'
      );
    },

    //确定
    confirm() {
      let self = this;
      self.loading = true;
      console.log('打印，，，，，，，', this.ruleForm);
      menuAdd(self.ruleForm)
        .then(resp => {
          console.log('resp:', resp);
          if (resp.head) {
            // self.$showMsg.success('操作成功！');
            // self.$showMsg.success(self.$t('MENU_MANAGEMENT.ADD_MENU_SUCCESS'));
            this.$showMsg({
              type: 'success',
              message: this.$t('MENU_MANAGEMENT.ADD_MENU_SUCCESS')
            });
            self.cancel();
          } else {
            // self.$showMsg.error('操作失败！');
          }
        })
        .finally(() => {
          self.loading = false;
        });
    },

    //选择菜单状态
    selectStatus(e) {
      console.log('e', e);
      if (e === '0') {
        this.statusFlag = true;
      } else {
        this.statusFlag = false;
      }
    },

    //上一步
    previousStep() {
      let self = this;
      self.confirmFlag = false;
    },

    //选择菜单级别
    selectMenuLevel(e) {
      let self = this;
      if (e === '1') {
        self.menuLevelFlag = false;
        self.ruleForm.pMenuCode = '';
        self.ruleForm.pMenuName = '';
      } else {
        let newMenuLevel = e - 1;
        self.menuLevelFlag = true;
        self.pMenuList = [];
        getMenuInfoList().then(resp => {
          resp.body.forEach(item => {
            if (item.menuLevel == newMenuLevel) {
              self.pMenuList.push(item);
            }
          });
          console.log('打印过滤后菜单：', self.pMenuList);
        });
      }
    },

    //选择上级菜单编号
    selectPMenuCode(e) {
      console.log('打印e', e);
      this.ruleForm.pMenuCode = e.menuCode;
      this.ruleForm.pMenuName = e.menuName;
    },

    //选择上级菜单名称
    selectPMenuName(e) {
      this.ruleForm.pMenuCode = e.menuCode;
      this.ruleForm.pMenuName = e.menuName;
    }
  }
};
</script>

<style lang="scss" scoped>
.g-menuManagement-add {
  margin: 0;
  background: #fff;
  min-height: 100%;
  .g-form {
    padding: 20px;
    margin: 0 32%;
    /deep/ .el-input {
      width: 340px;
    }
    /deep/ .el-input__inner {
      width: 340px;
    }
  }
  .g-btn {
    display: flex;
    justify-content: center;
    align-content: center;
    // margin-top: 3.6%;
    padding-bottom: 30px;
    margin-left: 3%;
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
  /deep/.el-textarea__inner {
    height: 120px;
    width: 340px;
  }
}
</style>
