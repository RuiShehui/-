<!--
 * @Autor: 赵霖
 * @Date: 2021-10-25 10:16:24
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-27 14:59:13
 * @Description: 银行公告管理--银行公告添加
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\announcement\announcement-add.vue
-->
<template>
  <div class="contain">
    <el-form
      class="m-form"
      ref="submitForm"
      :model="formData"
      :rules="submitRules"
      label-width="calc(50% - 170px)"
    >
      <el-form-item :label="$t('BUSINESS_MANAGEMENT.RELEASE_TIME')" prop="timespan">
        <el-date-picker
          v-model="formData.timespan[0]"
          type="date"
          :picker-options="startOptions"
          :placeholder="$t('COMMON.START_TIME')"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <span>{{$t('COMMON.DATESPAN_TO')}}</span>
        <el-date-picker
          v-model="formData.timespan[1]"
          type="date"
          :picker-options="startOptions"
          :placeholder="$t('COMMON.END_TIME')"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <!-- date-picker全部用一个options -->
      </el-form-item>
      <!-- language-tabs -->
      <el-form-item :label="`${$t('COMMON.SELECT_LANGS')}:`">
        <el-radio-group v-model="lang">
          {{ lang }}
          <div v-show="lang === 'en'">
            <el-radio-button label="zhCN">{{ $t('lang.simplify') }}</el-radio-button>
            <el-radio-button label="zhXG">{{ $t('lang.traditional') }}</el-radio-button>
            <el-radio-button label="en">{{ $t('lang.english') }}</el-radio-button>
          </div>
          <div v-show="lang === 'zhCN'">
            <el-radio-button label="zhCN">{{ $t('lang.simplify') }}</el-radio-button>
            <el-radio-button label="zhXG">{{ $t('lang.traditional') }}</el-radio-button>
            <el-radio-button label="en">{{ $t('lang.english') }}</el-radio-button>
          </div>
          <div v-show="lang === 'zhXG'">
            <el-radio-button label="zhCN">{{ $t('lang.simplify') }}</el-radio-button>
            <el-radio-button label="zhXG">{{ $t('lang.traditional') }}</el-radio-button>
            <el-radio-button label="en">{{ $t('lang.english') }}</el-radio-button>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-for="prop in inputs"
        v-show="filterInputs.includes(prop)"
        :key="prop"
        :label="$t(`BUSINESS_MANAGEMENT.${transToHighCamel(prop)}`)"
        :prop="prop"
      >
        <el-input
          class="submit-input"
          v-model="formData[prop]"
          :placeholder="$t(`COMMON.PLEASE_INPUT`, { label: $t(`BUSINESS_MANAGEMENT.${transToHighCamel(prop)}`) })"
          :type="prop.toLowerCase().includes('content') ? 'textarea' : 'text'"
          :rows="4"
          :maxlength="prop.toLowerCase().includes('content') ? 5000 : 100"
        />
      </el-form-item>
    </el-form>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="handleCancel">{{ $t('COMMON.CANCEL') }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{ $t('COMMON.SUBMIT') }}</el-button>
    </div>
    <article class="article">
      <p>
        <span class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</span>
        {{$t('BUSINESS_MANAGEMENT.MERCHANT_MAINTAIN_TIP')}}
      </p>
    </article>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import mapValidators from '@/utils/stategies';
import { deepClone, transToHighCamel } from '@/utils/tools';
import dateTools from '@/utils/dateTools';
import { getHead } from '@/utils/user';
// import { saveAnnounce } from '@/api/business-management/announcement';

const { mapMutations } = createNamespacedHelpers('tabs');
const { formatDate } = dateTools;

export default {
  name: 'AnnouncementAddPage',
  components: {},
  data() {
    const self = this;
    const { STR_NOT_EMPTY, TIMESPAN_VALIDATOR } = mapValidators(self);

    return {
      pickerStartOptions: {
        disabledDate(time) {
          const dayTimeStamp = 1000 * 60 * 60 * 24;

          const current = new Date().getTime();
          const selected = time.getTime();
          //  - (1 * dayTimeStamp)
          return selected <= current || selected > current + 90 * dayTimeStamp;
        }
      },

      formData: {
        // 简体中文
        cnAnnouncementTitle: '',
        cnAnnouncementContent: '',
        // 繁体中文
        tcAnnouncementTitle: '',
        tcAnnouncementContent: '',
        // 英文
        enAnnouncementTitle: '',
        enAnnouncementContent: '',
        timespan: ['', ''],
        inputEndTime: '', //结束时间
        inputStartTime: '' //开始时间
      },
      submitRules: {
        cnAnnouncementTitle: STR_NOT_EMPTY(self.$t('BUSINESS_MANAGEMENT.CN_TITLE')),
        cnAnnouncementContent: STR_NOT_EMPTY(self.$t('BUSINESS_MANAGEMENT.CN_CONTENT')),
        tcAnnouncementTitle: STR_NOT_EMPTY(self.$t('BUSINESS_MANAGEMENT.TC_TITLE')),
        tcAnnouncementContent: STR_NOT_EMPTY(self.$t('BUSINESS_MANAGEMENT.TC_CONTENT')),
        enAnnouncementTitle: STR_NOT_EMPTY(self.$t('BUSINESS_MANAGEMENT.EN_TITLE')),
        enAnnouncementContent: STR_NOT_EMPTY(self.$t('BUSINESS_MANAGEMENT.EN_CONTENT')),
        // timespan: TIMESPAN_VALIDATOR()
      },
      startOptions: {
        disabledDate(date) {
          return !(new Date(date).getTime() > new Date().getTime());
        }
      },
      inputs: [
        'cnAnnouncementTitle',
        'cnAnnouncementContent',
        'tcAnnouncementTitle',
        'tcAnnouncementContent',
        'enAnnouncementTitle',
        'enAnnouncementContent'
      ],
      lang: 'zhXG'
    };
  },
  computed: {
    pickerEndOptions() {
      const ctx = this;
      // this.pickerEndOptions this.formData.timespan[0]
      return {
        disabledDate(time) {
          const dayTimeStamp = 1000 * 60 * 60 * 24;
          const [startTime] = ctx.formData.timespan;

          const current =
            (startTime && startTime.length) ? new Date(startTime).getTime() : new Date().getTime();
          const selected = time.getTime();

          return selected <= current || selected > new Date().getTime() + 90 * dayTimeStamp;
        }
      }
    },
    currentLang() {
      const head = getHead();
      if (head && head.lang) {
        return head.lang;
      }
      return '';
    },
    submitData() {
      const formData = deepClone(this.formData);
      const [start, end] = formData.timespan || ['', ''];
      delete formData.timespan;

      return {
        ...formData,
        announcementCode: Math.ceil(Math.random() * 1000)
      };
    },
    filterInputs() {
      switch (this.lang) {
        case 'zhCN':
          return ['cnAnnouncementTitle', 'cnAnnouncementContent'];
        case 'zhXG':
          return ['tcAnnouncementTitle', 'tcAnnouncementContent'];
        case 'en':
          return ['enAnnouncementTitle', 'enAnnouncementContent'];
        default:
          return [];
      }
    }
  },
  mounted() {
    this.lang = this.currentLang;
    console.log(this.lang);
  },
  created() {
    // console.log(this.$route.query);
    if (this.$route.query.submitData) {
      const data = this.$route.query.submitData;
      this.formData.cnAnnouncementTitle = data.cnAnnouncementTitle;
      this.formData.cnAnnouncementContent = data.cnAnnouncementContent;
      this.formData.tcAnnouncementTitle = data.tcAnnouncementTitle;
      this.formData.tcAnnouncementContent = data.tcAnnouncementContent;
      this.formData.enAnnouncementTitle = data.enAnnouncementTitle;
      this.formData.enAnnouncementContent = data.enAnnouncementContent;
      this.formData.timespan = [data.inputStartTime, data.inputEndTime];
    }
  },
  methods: {
    ...mapMutations(['DELETE_TABS']),
    transToHighCamel,
    // 取消
    handleCancel() {
      this.$router.push('/businessMangament/announcement');
    },

    handleSubmit() {
      let [inputStartTime, inputEndTime] = this.formData.timespan;

      if (!inputStartTime) {
        inputStartTime = formatDate(new Date());
      }
      if (inputEndTime) {
        if (inputEndTime < inputStartTime) {
          return this.$showMsg({
            type: 'error',
            message: this.$t('BUSINESS_MANAGEMENT.END_TIME_AND_START_TIME')
          });
        }
      }

      this.$refs['submitForm'].validate(valid => {
        if (valid) {
          const formData = deepClone(this.formData);

          this.$router.push({
            path: '/businessMangament/announcement/add-confirm',
            query: {
              ...formData,
              inputStartTime,
              inputEndTime
            }
          });
        } else {
          if (
            this.inputs.some(
              k => !this.submitData[k] || !this.submitData[k].length
            )
          ) {
            this.$showBox({
              content: this.$t(
                'BUSINESS_MANAGEMENT.PLEASE_INPUT_THREE_TYPE_ANNOUNCE'
              )
            });
          } else
            this.$showMsg({
              type: 'error',
              message: this.$t('COMMON.CHECK_FAIL')
            });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  min-height: 100%;
  background: #fff;
  padding: 32px 24px;
  box-sizing: border-box;
  position: relative;
}
.m-form {
  .submit-input,
  .submit-range {
    width: 340px;
  }
}
.g-bottom {
  margin-top: 40px;
  margin-bottom: 50px;
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
.article {
  position: absolute;
  bottom: 32px;
  left: 24px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
