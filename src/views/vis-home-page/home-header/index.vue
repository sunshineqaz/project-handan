<template>
    <div class="vis-homeHeader">
        <div class="homeHeader_time">
            {{ timeData }}
        </div>
        <span class="homeHeader_title">
            邯郸区司法局指挥中心
        </span>
    </div>
</template>

<script>
import dayjs from 'dayjs'
console.log(dayjs, 'dayyyyyyyyyyy')
export default {
    name: 'homeHeader',
    data() {
        return {
            timeData: '' // 系统当前时间显示
        }
    },
    mounted() {
        this.getTimeData()
    },
    methods: {
        getTimeData() {

        }
    }
}
</script>

<style scoped>
.vis-homeHeader {
    width: 100%;
    height: 100%;
    background: url(../../../assets/homePage/header.png) no-repeat center center;
    background-size: 100% 100%;
}
.homeHeader_title {
    line-height: 100%;
    color: #fff;
    display: inline-block;
    margin: 0 auto;

}
</style>