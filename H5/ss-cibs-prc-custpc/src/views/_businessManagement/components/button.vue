<!--
 * @Author: your name
 * @Date: 2021-12-08 15:05:22
 * @LastEditTime: 2022-09-17 11:26:23
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\components\button.vue
-->
<template>
    <div class="reset">
        <el-button type="primary">{{ textBtn }}</el-button>
    </div>
</template>
<script>
export default {
    props: {
        textBtn: {
            type: String,
            default: this.$t('COMMON.SEARCH')
        }
    },
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.reset {
    font-size: 16px;
    
}
</style>