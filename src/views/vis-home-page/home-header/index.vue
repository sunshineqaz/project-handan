<template>
    <div class="vis-homeHeader">
        <div class="homeHeader-left">
            <el-row>
                <el-col :span="7" class="homeHeader-left_time">
                    {{ timeData }}
                </el-col>
                <el-col :span="4" v-for="(tab, index) in tabData" :key="index" :class="{ activeTab: activeTab == tab.name }">
                    {{ tab.text }}
                </el-col>
            </el-row>
        </div>
        <span class="homeHeader_title">
            邯郸区司法局指挥中心
        </span>
        <div class="homeHeader-right">

        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    name: 'homeHeader',
    data() {
        return {
            timeData: '', // 系统当前时间显示
            tabData: [
                {
                    name: 'first',
                    text: '定位签到监督'
                },
                {
                    name: 'second',
                    text: '矫正综合数据'
                },
                {
                    name: 'third',
                    text: '执法工作监督'
                },
                {
                    name: 'forth',
                    text: '系统运行监控'
                }
            ],
            activeTab: 'first'
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
            this.timeData = dayjs(tempTime).format('YYYY-MM-DD HH:mm:ss')
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
    .homeHeader-left {
        width: 35%;
        height: 150px;
        margin: auto;
        margin-top: 43px;
        float: left;
        .el-row {
            width: 100%;
            height: 100%;
            .el-col {
                height: 100%;
                font-weight: 400;
                line-height: 25px;
                font-size: 50px;
                line-height: 150px;
                font-weight: bold;
                color: #18A1F4;
                text-align: center;
                margin-right: 35px;
                background: url(../../../assets/homePage/signTab.png) no-repeat center center;
                background-size: 100% 100%;
            }
            .el-col:nth-child(1) {
                font-size: 72px;
                text-align: left;
                color: #18A1F4;
                font-family: zcoolqingkehuangyouti;
                background: none;
                margin-right: 0;
            }
            .el-col:nth-child(5) {
                margin-right: 0;
            }
            .activeTab {
                color: #fff;
            }
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
    .homeHeader-right {
        width: 35%;
        height: 150px;
        background: #fff;
        float: right;
        margin-top: 43px;
    }
}
</style>