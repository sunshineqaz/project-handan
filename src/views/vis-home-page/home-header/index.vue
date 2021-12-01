<template>
    <div class="vis-homeHeader">
        <div class="homeHeader-left">
            <div class="homeHeader-left_time">
                {{ timeData }}
            </div>
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
        setInterval(() => {
            this.getTimeData()
        }, 1000)
    },
    methods: {
        getTimeData() {
            let tempTime = dayjs(new Date()).valueOf()
            this.timeData = moment(tempTime).format('YYYY-MM-DD HH:mm:ss')
        }
    }
}
</script>

<style scoped lang="less">
.vis-homeHeader {
    width: 100%;
    height: 100%;
    color: #fff;
    padding: 0 44px;
}
.homeHeader-left {
    /* width: ; */
    &_time {
        width: 1000px;
        height: 100px;
    }
}
.homeHeader_title {
    color: #fff;
    display: inline-block;
    margin: auto;
    font-size: 140px;
    font-weight: bold;
    letter-spacing: 15px;

}
</style>