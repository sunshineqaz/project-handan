<template>
    <div class="china_map_container">
        <div id="chinaChart"></div>
        <div class="map_position" v-for="(item, index) in geoInfoData" :key="index" :style="{left: item[0] + 'px', top: item[1] + 'px'}" v-if="isShowPosition"></div>
        <div class="supervise_personal">
            <div class="supervise_personal_info">
                <p class="supervise_personal_info_title">个人信息</p>
                <div class="supervise_personal_info_content">
                    <div class="portrait">
                        <img :src="personInfo.photo" alt="" style="width: 100%; height: 100%">
                    </div>
                    <div class="content">
                        <div class="name_info">
                            <span class="name">{{ personInfo.userName }}</span>
                            <span class="type">矫正类别</span>
                            <span class="gz">管制</span>
                        </div>
                        <ul class="info_list">
                            <li>
                                <span>机构：</span>
                                <span>{{ personInfo.deptName }}</span>
                            </li>
                            <li>
                                <span>电话：</span>
                                <span>{{ personInfo.phone }}</span>
                            </li>
                            <li>
                                <span>签到地址：</span>
                                <span>{{ personInfo.homeAddr }}</span>
                            </li>
                            <li>
                                <span>定位时间：</span>
                                <span>{{ personInfo.ccStartTime }} - {{ personInfo.ccEndTime }}</span>
                            </li>
                            <li>
                                <span>定位方式：</span>
                                <span>{{ personInfo.operator }}</span>
                            </li>
                        </ul>
                        <div class="sign_result">签到失败</div>
                    </div>
                </div>
            </div>
            <tracing class="supervise_tracing"></tracing>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import JSON from './china.json';
import { mapState } from 'vuex';
import tracing from '../tracing.vue'
export default {
    components: {
        tracing
    },
    data() {
        return {
            isShowPosition: false,
            locationData: [],
            geoInfoData: [],
            personInfo: {}
        }
    },
    computed: {
        ...mapState(['actorId', 'orgId', 'userId']),
    },
    watch: {
        orgId(v) {
            this.getLocationData()
        },
        userId(v) {
            if (v) {
                this.getPersonInfo()
            }
        }
    },
    mounted() {
        this.getLocationData()
    },
    methods: {
        drawMap() {
            let myChart = echarts.init(document.getElementById('chinaChart'));
            echarts.registerMap('china', JSON, {})//引入地图文件
            let convertData = (data) => {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    res.push({
                        value: [data[i].lng, data[i].lat]
                    });
                }
                return res;
            };
            let option = {
                title: {
                    show: false
                },
                tooltip: {},
                geo: {
                    map: 'china',
                    show: true,
                    roam: false,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#052A4A',
                            borderColor: '#1773c3',
                            shadowColor: '#1773c3',
                            shadowBlur: 20
                        }
                    }
                },
                series: [
                    {
                        type: 'map',
                        map: 'china',
                        geoIndex: 1,
                        aspectScale: 0.75, //长宽比
                        showLegendSymbol: true, // 存在legend时显示
                        label: {
                            normal: {
                                show: false,
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        roam: false,
                        itemStyle: {
                            normal: {
                                areaColor: '#052A4A',
                                borderColor: '#0FA4FF',
                                borderWidth: 1
                            },
                            emphasis: {
                                areaColor: '#0f2c70'
                            }
                        },
                        data:[]
                    },
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        symbol: 'image://' + require('../../../../assets/map/point.png'),
                        symbolSize: [32, 41],
                        symbolOffset: [0, -20],
                        z: 9999,
                        data: convertData(this.locationData),
                    }
                ]
            };
            myChart.setOption(option);

            // 获取系列
            let seriesModel = myChart.getModel().getSeriesByIndex(option.series.length - 1)
            // 获取地理坐标系实例
            let coordSys = seriesModel.coordinateSystem;
            // dataToPoint 相当于 getPosByGeo
            this.locationData.forEach(v => {
                let point = coordSys.dataToPoint([v.lng, v.lat]);
                this.geoInfoData.push(point)
            })
        },
        getLocationData() {
            this.$axios.get(`/api/v1/display/location/list?actorId=${this.actorId}&deptId=${this.orgId}`).then(res => {
                this.locationData = res.data.data
                this.drawMap();
            })
        },
        getPersonInfo() {
            this.$axios.get(`/api/v1/display/user/detail?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                let data = res.data.data
                this.personInfo = data
            })
        }
    }
}
</script>
<style lang="less" scoped>
.china_map_container {
    position: relative;
    width: 100%;
    height: 100%;
    position: relative;
    #chinaChart {
        width: 100%;
        height: 100%;
    }
    .map_position {
        width: 648px;
        height: 246px;
        background: url(../../../../assets/map/signPop.png) no-repeat center center;
        background-size: 100% 100%;
        position: absolute;
    }
    .supervise_personal {
        position: absolute;
        bottom: 25px;
        display: flex;
        width: 100%;
        height: 660px;
        display: none;
        &_info {
            width: 70%;
            height: 100%;
            background: #0C1823;
            border: 2px solid #2B69F8;
            border-radius: 10px;
            &_title {
                height: 100px;
                line-height: 100px;
                font-size: 36px;
                color: #fff;
                text-align: left;
                margin: 0;
                padding: 0;
                padding-left: 35px;
                background: #1F4BB1;
            }
            &_content {
                position: relative;
                width: 100%;
                height: calc(100% - 100px);
                padding-left: 35px;
                padding-top: 28px;
                .portrait {
                    float: left;
                    width: 506px;
                    height: 506px;
                    background: url(../../../../assets/map/portrait.png) no-repeat;
                    background-size: 100% 100%;
                }
                .content {
                    float: left;
                    margin-left: 48px;
                    text-align: left;
                    .name_info {
                        margin-bottom: 67px;
                        span {
                            display: inline-block;
                        }
                        .name {
                            font-size: 50px;
                            color: #fff;
                            margin-right: 57px;
                        }
                        .type {
                            width: 200px;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #FFFF59;
                            text-align: center;
                            margin-right: 26px;
                            background: url(../../../../assets/map/type_1.png) no-repeat;
                            background-size: 100% 100%;
                        }
                        .gz {
                            width: 200px;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #FF7E15;
                            text-align: center;
                            margin-right: 26px;
                            background: url(../../../../assets/map/type_2.png) no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                    .info_list {
                        margin: 0;
                        padding: 0;
                        li {
                            font-size: 36px;
                            color: #fff;
                            margin-bottom: 20px;
                        }
                    }
                    .sign_result {
                        position: absolute;
                        top: 59px;
                        right: 52px;
                        width: 314.3px;
                        height: 147px;
                        line-height: 147px;
                        font-size: 36px;
                        color: #fff;
                        text-align: center;
                        background: url(../../../../assets/map/result_fail.png) no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
        }
        .supervise_tracing {
            width: 30%;
            height: 660px;
            float: right;
            background: #0C1823;
            border: 2px solid #2B69F8;
            border-radius: 10px;
            // overflow: hidden;
        }
    }
}
</style>
