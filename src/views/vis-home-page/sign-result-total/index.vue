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
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            signDict: [],
            depthDict: [
                {
                    text: '签到成功',
                    count: 0,
                    status: 'success'
                },
                {
                    text: '等待签到',
                    count: 0,
                    status: 'wait'
                },
                {
                    text: '签到失败',
                    count: 0,
                    status: 'failed'
                },
                {
                    text: '过期未签到',
                    count: 0,
                    status: 'delay'
                }
            ],
            personDict: [
                {
                    text: '请假次数',
                    count: 0,
                    status: 'success'
                },
                {
                    text: '定位失败次数',
                    count: 0,
                    status: 'wait'
                },
                {
                    text: '关机次数',
                    count: 0,
                    status: 'failed'
                },
                {
                    text: '脱区次数',
                    count: 0,
                    status: 'delay'
                }
            ],
            tempIndex: 1, // 默认选中签到成功
        }
    },
    computed: {
        ...mapState(['actorId', 'orgId', 'userId', 'isUpdateTime']),
    },
    watch: {
        orgId() {
            this.signDict = this.depthDict
            this.getData()
        },
        userId(id) {
            if (id) {
                this.signDict = this.personDict
                this.getData()
            }
        },
        isUpdateTime() {
            this.getData()
            this.handleFilter(0)
        }
    },
    mounted() {
        this.signDict = this.depthDict
        this.getData()
    },
    methods: {
        ...mapActions(['changeType']),
        handleFilter(params) {
            this.tempIndex = params + 1
            this.changeType(this.tempIndex)
        },
        // 获取数据
        getData() {
            let baseUrl = '/api/v1/display/check/summary/'
            let extendUrl = this.userId ? `user?actorId=${this.actorId}&userId=${this.userId}` : `dept?actorId=${this.actorId}&deptId=${this.orgId}`
            this.$axios.get(baseUrl + extendUrl).then(res => {
                let data = res.data.data
                this.signDict[0].count = data.success
                this.signDict[1].count = data.waiting
                this.signDict[2].count = data.failed
                this.signDict[3].count = data.expired
                this.drawCharts()
            })
        },
        // 右侧图表
        drawCharts() {
            let dataArr = [
                { name: "签到成功", value: this.signDict[0].count },
                { name: "等待签到", value: this.signDict[1].count },
                { name: "签到失败", value: this.signDict[2].count },
                { name: "过期未签到", value: this.signDict[3].count }
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
    height: 30%;
    background: url(../../../assets/homePage/signResult.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    &_title {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 19%;
        height: 10%;
        font-size: 1rem;
        font-weight: bold;
        color: #A4C0FF;
        float: left;
    }
    &_titleEN {
        width: 50%;
        height: 10%;
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 400;
        color: #2557C7;
        float: left;
        margin-left: 0.5rem;
    }
    &_total {
        width: 15%;
        height: 10%;
        background: #071D51;
        font-size: 1rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #18A1F4;
        background: url(../../../assets/homePage/resultAll.png) no-repeat center center;
        background-size: 100% 100%;
        float: right;
        margin-right: 1rem;
        margin-top: 2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &_filters {
        width: 72%;
        height: 80%;
        float: left;
        margin-top: 0.5rem;
        padding-left: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        > li {
            padding: 0.5rem;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center center;
            display: flex;
            justify-content: center;
            .filters_key {
                font-size: 1.2rem;
                font-family: Microsoft YaHei;
                font-weight: bold;
            }
            .filters_value {
                font-size: 1.5rem;
                font-family: zcoolqingkehuangyouti;
                font-weight: 400;
            }
        }
        > li:nth-child(odd) {
            width: 39%;
            height: auto;
            margin-right: 0.3rem;
        }
        > li:nth-child(even) {
            width: 49.5%;
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
        width: 30%;
        height: 35%;
        float: left;
        position: absolute;
        right: 0;
        top: 52%;
        transform: translateY(-50%);
        .charts_container {
            width: 100%;
            height: 100%;
        }
        .charts_photo {
            width: 9rem;
            height: 11rem;
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