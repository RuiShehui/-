<!--
 * @Author: zhangcheng
 * @Date: 2022-01-27 16:11:31
 * @LastEditTime: 2022-09-16 17:28:16
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \webbank-pc\src\components\common\operateResult\index.vue
-->
<template>
  <div class="resultWapper" v-if="status && status.length > 0">
    <div class="result-container">
      <div class="result-img">
        <img v-if="!bankCancle"  :src="require(`@/images/common/${status}@2x.png`)" alt />
        <img v-else class="image"  :src="require(`@/images/common/dsq.png`)" alt />
      </div>
      <div class="result-title">
        <p v-if="!bankCancle">{{title}}</p>
         <p v-else>{{$t('AUTHORIZE.BANK_CHU')}}</p>
      </div>
      <div class="result-describe" v-show="order.length">
         <p>{{order}}</p>
      </div>
      <div class="result-describe" v-show="desc.length">
        <p>{{desc}}</p>
        <p v-show="content.length > 0">{{content}}</p>
      </div>
      <div class="result-comfirm">
        <p>{{comfirm}}</p>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'OperateResult',
  props: {
    status: {
      type: String,
      default: 'success'
    },
    title: {
      type: String,
      default:''
    },
    desc: {
      type: String,
      default: ''
    },
    order:{
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    comfirm: {
      type: String,
      default: ''
    },
    // true展示银行处理中图标
    bankCancle:{
      type:Boolean,
      default:false
    },
    authResultState:{
      type: String,
      default:''
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.resultWapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .result-container {
    .result-img {
      img {
        width: 120px;
        height: 120px;
      }
      .image{
        width: 50px;
        height: 50px;
        margin: 10px 0;
      }
    }
    .result-title {
      margin-bottom: 12px;
      p {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 500;
      }
    }
    .result-describe {
      max-width: 320px;
      padding: 0 24px;
      p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
        line-height: 22px;
        word-break: break-all;
      }
    }
    .result-comfirm {
      max-width: 280px;
      // padding: 0 24px;
      margin-top: 24px;
      p {
        font-size: 14px;
        color: rgba(61, 23, 23, 0.65);
        letter-spacing: 0;
        line-height: 22px;
        word-break: break-all;
      }
    }
  }
}
</style>