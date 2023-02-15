<template>
  <div class="contain">
    <div class="conent">
      <el-form>
        <el-form-item class="title" label="特殊天气设定：" props="depCode">
          <el-radio-group v-model="weathSetting" @change="changeWeath">
            <el-radio label="1">开启</el-radio>
            <el-radio label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="conent_button">
        <el-button
          style="width: 160px;color: #FFF;background: #f06b00;border-radius: 5px;font-size: 18px"
          @click="submit"
        >提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTyphoonFlag,
  updateTyphoonFlag
} from '@/api/user-management/index.js';

export default {
  name: 'userManage',

  data() {
    return {
      weathSetting: '1'
    };
  },

  created() {},

  mounted() {
    this.queryWeather();
  },

  methods: {
    //提交
    submit() {
      if (this.oldWeathStting === this.weathSetting) {
        // return this.$showMsg({
        //   type: 'error',
        //   message: '您还未修改特殊天气，请确认'
        // });
        this.$showBox({
          // title: '提示',
          content: '您还未修改特殊天气状态，请确认。',
          showCancelButton: false
        });
        return;
      }

      let titile = '';
      if (this.weathSetting === '1') {
        titile = '确定开启特殊天气吗？';
      }

      if (this.weathSetting === '0') {
        titile = '确定关闭特殊天气吗？';
      }

      this.$showBox({
        content: titile,
        confirm: () => {
          this.confirm();
        }
      });
    },
    //确定——提交
    confirm() {
      let params = {
        flag: this.weathSetting
      };
      updateTyphoonFlag(params).then(resp => {
        if (resp) {
          this.queryWeather();
          this.$showMsg({
            type: 'success',
            message: this.$t('COMMON.OPERATE_SUCCESS')
          });
        }
      });
    },
    //查询天气
    queryWeather() {
      getTyphoonFlag().then(resp => {
        this.oldWeathStting = resp.body.flag;
        this.weathSetting = resp.body.flag;
      });
    },
    changeWeath(e) {
      this.weathSetting = e;
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  box-sizing: border-box;
  min-height: 100%;
  background: #fff;
  .conent {
    margin-top: 120px;
  }
  .title {
    position: relative;
    left: 41%;
  }
  .conent_button {
    text-align: center;
    margin-top: 200px;
  }
}
</style>
