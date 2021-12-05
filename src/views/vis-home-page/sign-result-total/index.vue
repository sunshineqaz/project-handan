<template>
    <div class="signResult">
        <div class="signResult_title">
            签到结果统计
        </div>
        <div class="signResult_titleEN">
            CHECK IN RESULT STATISTICS
        </div>
        <div class="signResult_total" @click="handleFilter()">
            查看全部
        </div>
        <ul class="signResult_filters">
            <li v-for="(item, index) in signDict" :key="index" :class="['sign_' + item.status, {'signActive': tempIndex == index + 1}]" @click="handleFilter(index)">
                <div class="filters_key">{{ item.text }}</div>
                <div class="filters_value">{{ item.count }}</div>
            </li>
        </ul>
        <div class="signResult_charts">
            <div id="charts_container" class="charts_container" ref="chartsContainer"></div>
            <div class="charts_photo"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
console.log(echarts, ';;;;;;;;;;')
export default {
    data() {
        return {
            signDict: [
                {
                    text: '签到成功',
                    count: '1111111',
                    status: 'success'
                },
                {
                    text: '等待签到',
                    count: '1122222',
                    status: 'wait'
                },
                {
                    text: '签到失败',
                    count: '14444',
                    status: 'failed'
                },
                {
                    text: '过期未签到',
                    count: '1545',
                    status: 'delay'
                }
            ],
            tempIndex: 1, // 默认选中签到成功
        }
    },
    mounted() {
        this.drawCharts()
    },
    methods: {
        handleFilter(params) {
            console.log(params)
            this.tempIndex = params + 1
        },
        drawCharts() {
            let dataArr = [
                { name: "签到成功", value: 90 },
                { name: "等待签到", value: 80 },
                { name: "签到失败", value: 50 },
                { name: "过期未签到", value: 30 }
            ];
            let seriseData = [];
            dataArr.forEach((el, index) => {
                let color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                        offset: 0,
                        color: "#5CF9FE" // 0% 处的颜色
                    },
                    {
                        offset: 1,
                        color: "#468EFD" // 100% 处的颜色
                    }
                ]);
                if (el.value > 60) {
                    color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                            offset: 0,
                            color: "#ae2829" // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: "#b57c35" // 100% 处的颜色
                        }
                    ]);
                }
                let colorSet = [[el.value / 100, color], [1, "rgba(255,255,255,0.1)"]];
                seriseData[index] = {
                    type: "gauge",
                    radius: "98%",
                    center: ["50%", "50%"],
                    splitNumber: 14,
                    startAngle: "-" + 90 * index - 270,
                    endAngle: "-" + (90 * (index + 1) - 5) - 270,
                    pointer: {
                        show: false
                    },
                    data: [el],
                    detail: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colorSet,
                            width: 50
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    title:{
                        show:false
                    },
                    splitLine: {
                        show: true,
                        length: 50,
                        lineStyle: {
                            color: "transprant",
                            width: 10,
                        }
                    },
                    axisLabel: {
                        show: false
                    }
                };
            });
            let option = {
                series: seriseData
            };
            let chartDom = document.getElementById('charts_container');
            let myChart = echarts.init(chartDom);
            myChart.setOption(option);
        }
    }
}
</script>

<style lang="less" scoped>
.signResult {
    width: 100%;
    height: 750px;
    background: url(../../../assets/homePage/signResult.png) no-repeat center center;
    background-size: 100% 100%;
    &_title {
        width: 370px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 44px;
        font-weight: bold;
        color: #A4C0FF;
        display: inline-block;
        float: left;
        letter-spacing: 5px;
    }
    &_titleEN {
        width: 450px;
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        font-weight: 400;
        color: #2557C7;
        display: inline-block;
        float: left;
        text-align: left;
        margin-left: 20px;
    }
    &_total {
        width: 300px;
        height: 70px;
        background: #071D51;
        font-size: 32px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #18A1F4;
        line-height: 60px;
        background: url(../../../assets/homePage/resultAll.png) no-repeat center center;
        background-size: 100% 100%;
        float: right;
        margin-right: 48px;
        margin-top: 45px;
        cursor: pointer;
    }
    &_filters {
        width: 1196px;
        height: 544px;
        float: left;
        margin-top: 30px;
        display: flex;
        flex-wrap: wrap;
        > li {
            padding: 34px 40px;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center center;
            .filters_key {
                font-size: 36px;
                font-family: Microsoft YaHei;
                font-weight: bold;
            }
            .filters_value {
                font-size: 80px;
                font-family: zcoolqingkehuangyouti;
                font-weight: 400;
            }
        }
        > li:nth-child(odd) {
            width: 440px;
            height: auto;
            margin-right: 35px;
        }
        > li:nth-child(even) {
            width: 561px;
            height: auto;
        }
        .signActive {
            color: #fff;
        }
        .sign_success {
            background-image: url(../../../assets/homePage/success.png);
        }
        .sign_success.signActive {
            background-image: url(../../../assets/homePage/successActive.png);
        }
        .sign_wait {
            background-image: url(../../../assets/homePage/wait.png);
            .filters_key {
                color: #2CFFC3;
            }
        }
        .sign_wait.signActive {
            background-image: url(../../../assets/homePage/waitActive.png);
        }
        .sign_failed {
            background-image: url(../../../assets/homePage/failed.png);
            .filters_key {
                color: #FEAE48;
            }
        }
        .sign_failed.signActive {
            background-image: url(../../../assets/homePage/failedActive.png);
        }
        .sign_delay {
            background-image: url(../../../assets/homePage/delay.png);
            .filters_key {
                color: #EB5A1D;
            }
        }
        .sign_delay.signActive {
            background-image: url(../../../assets/homePage/delayActive.png);
        }
    }
    &_charts {
        width: 496px;
        height: 496px;
        float: left;
        margin-left: 58px;
        margin-top: 16px;
        position: relative;
        .charts_container {
            width: 100%;
            height: 100%;
        }
        .charts_photo {
            width: 350px;
            height: 350px;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: url(../../../assets/homePage/signPhoto.png) no-repeat center center;
            background-size: 100% 100%;
        }
    }
}
</style>