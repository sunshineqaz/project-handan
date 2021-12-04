<template>
    <div class="china_map_container">
        <div id="chinaChart"></div>
        <div class="supervise_personal">
            <div class="supervise_personal_info">
                <p class="supervise_personal_info_title">个人信息</p>
                <div class="supervise_personal_info_content">
                    <div class="portrait"></div>
                    <div class="content">
                        <div class="name_info">
                            <span class="name">张三</span>
                            <span class="type">矫正类别</span>
                            <span class="gz">管制</span>
                        </div>
                        <ul class="info_list">
                            <li>
                                <span>机构：</span>
                                <span>XXXX司法所</span>
                            </li>
                            <li>
                                <span>电话：</span>
                                <span>18912341234</span>
                            </li>
                            <li>
                                <span>签到地址：</span>
                                <span>河北省邯郸市邯山区XX街道XX小区X楼</span>
                            </li>
                            <li>
                                <span>定位时间：</span>
                                <span>2021-08-08 12:00:00</span>
                            </li>
                            <li>
                                <span>定位方式：</span>
                                <span>电信基站</span>
                            </li>
                        </ul>
                        <div class="sign_result">签到失败</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import JSON from './china.json';
export default {
    data() {
        return {
            dataValue: [
                {name: '海门', value: 9},
                {name: '鄂尔多斯', value: 12},
            ],
            geoCoordMap: {
                '海门':[121.15,31.89],
                '鄂尔多斯':[109.781327,39.608266],
            }
        }
    },
    methods: {
        drawMap() {
            let myChart = echarts.init(document.getElementById('chinaChart'));
            echarts.registerMap('china', JSON, {})//引入地图文件
            let convertData = (data) => {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = this.geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
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
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'image://' + require('../../../../assets/map/point.png'),
                        symbolSize: [32, 41],
                        symbolOffset: [0, -20],
                        z: 9999,
                        data: convertData(this.dataValue),
                    },
                    {
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        // tooltip: {
                        //     show: true,
                        //     formatter: (params) => {
                        //         console.log(params, '...')
                        //         var tipHtml = ''
                        //         tipHtml = ' <div class="tooltip" style="word-wrap:break-word; white-space:pre-wrap !important;">'+
                        //                 '<div class="horn">'+
                        //                 '<div class="lt"></div>'+
                        //                 '<div class="rb"></div>'+
                        //                 '</div>'+
                        //                 '<div class="phoneData">'+'用户'+params.data.name+'在'+params.data.name+'联网成功</div>'+
                        //                 '</div>';
                        //             return tipHtml
                        //     }
                        // },
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         formatter: function (params) {
                        //             var tipHtml = '';
                        //             tipHtml = ' <div class="tooltip" style="word-wrap:break-word; white-space:pre-wrap !important;">'+
                        //                 '<div class="horn">'+
                        //                 '<div class="lt"></div>'+
                        //                 '<div class="rb"></div>'+
                        //                 '</div>'+
                        //                 '<div class="phoneData">'+'用户'+params.name+'在'+params.name+'联网成功</div>'+
                        //                 '</div>';
                        //             return tipHtml
                        //             // var name = params.name;
                        //             // var text = `{fline|${name}}\n{tline|${name}}`;
                        //             // return text;
                        //         },
                        //         color: '#fff',
                        //         rich: {
                        //             fline: {
                        //                 padding: [0, 0],
                        //                 color: '#fff',
                        //                 fontSize: 44,
                        //                 fontWeight: 400,
                        //             },
                        //             tline: {
                        //                 padding: [0, 0],
                        //                 color: '#fff',
                        //                 fontSize: 40,
                        //             },
                        //         },
                        //     },
                        //     emphasis: {
                        //         show: true,
                        //     },
                        // },
                        itemStyle: {
                            color: '#00FFF6',
                        },
                        symbol: 'image://' + require('../../../../assets/map/signPop.png'),
                        symbolSize: [648, 246],
                        symbolOffset: [0, -60],
                        z: 999,
                        data: convertData(this.dataValue),
                    }
                ]
            };
            myChart.setOption(option);
        }
    },
    mounted() {
        this.drawMap();
    }
}
</script>
<style lang="less" scoped>
.china_map_container {
    position: relative;
    width: 100%;
    height: 100%;
    #chinaChart {
        width: 100%;
        height: 100%;
    }
    .supervise_personal {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 100%;
        height: 660px;
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
    }
}
</style>
