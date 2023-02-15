<!--
 * @Author: your name
 * @Date: 2022-01-06 19:25:49
 * @LastEditTime: 2022-09-16 17:28:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\common\Prompt.vue
-->
<template>
    <div class="prompt-box">
        <p class="title">{{ title }}</p>
        <p v-for="(item,index) in desc" :key="index" class="desc">
            {{ index + 1 + '.' + item }}
        </p>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        desc: {
            type: Array,
            default: ()=>[]
        }
    },
    data() {
        return {
          
        }
    }
}
</script>
<style lang="scss" scoped>
.prompt-box {
    margin: 36px 0;
		 
		font-size: 14px;
		letter-spacing: 0;
		line-height: 22px;
		font-weight: 400;
    .title {
			margin-bottom: 16px;
			color: rgba(0,0,0,0.85);
    }
		.desc {
			color: rgba(0,0,0,0.45);
		}
}
</style>