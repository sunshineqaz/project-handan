<template>
    <div class="china_map_container">
        <div id="mapContainer" class="mapContainer" ref="mapContainer"></div>
        <div class="supervise_personal" v-if="isShowPosition">
            <span class="supervise_personal_info_close" @click="handleClose"></span>
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
                            <span class="gz">{{ ccTypeDict[personInfo.ccType] }}</span>
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
                                <span>{{ userData.updateTime }}</span>
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
            <tracing class="supervise_tracing" @close="handleClose"></tracing>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import tracing from '../tracing.vue'
export default {
    components: {
        tracing
    },
    data() {
        return {
            map: null,
            isShowPosition: false,
            locationData: [],
            personInfo: {},
            zoomIndex: 3,
            zoomArray: [18, 14, 10, 6],
            borderData: [], // 边界数据
            userData: {},
            ccTypeDict: {
                1: '管制',
                2: '缓刑',
                3: '假释',
                4: '暂予监外执行'
            },
            timer: null,
            colorDict: {
                1: '#1bc1cd',
                2: '#d8b226',
                3: '#c4151c',
                4: '#c4151c',
                5: '#d96d1b',
                6: '#6b707b',
            }
        }
    },
    computed: {
        ...mapState(['actorId', 'orgId', 'userId', 'isShowDetail', 'mapStatus']),
    },
    watch: {
        orgId(v) {
            if (v) {
                clearInterval(this.timer)
                this.timer = null
                this.zoomIndex = 2
                this.getLocationData()
                // this.getMapAct()
                this.initMap()
            }
        },
        userId(v) {
            if (v) {
                this.isShowPosition = true
                this.zoomIndex = 1
                this.getMapAct()
                this.initMap()
                this.getUserPosition()
                this.getPersonInfo()
                this.getBorderData()
            } else {
                this.isShowPosition = false
            }
        },
        isUpdateTime() {
            this.getMapAct()
            this.initMap()
        },
        isShowDetail(v) {
            if (!v) {
                this.isShowPosition = false
            } else {
                this.isShowPosition = true
            }
        },
        mapStatus(es) {
            this.zoomIndex = 2
            if (!es || es == 100) {
                this.getLocationData()
            }
            if (es) {
                this.getLocationData(es)
            }
            this.getMapAct()
            this.initMap()
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.getMapAct()
            setTimeout(() => {
                this.initMap()
                this.getLocationData() // 地图打点
            }, 3000)
        })
    },
    methods: {
        ...mapActions(['changeUserId', 'changeShowDetail']),
        getMapAct() {
            clearInterval(this.timer)
            this.timer = null
            this.timer = setInterval(() => {
                this.initMap()
                this.zoomIndex++
                this.getLocationData() // 地图打点
                if ( this.zoomIndex > 3) {
                    return this.zoomIndex = 0
                }
            }, 30 * 1000)
        },
        initMap() {
            this.map = new AMap.Map('mapContainer', {
                mapStyle: "amap://styles/darkblue",
                center: [115.97, 39.48],
                zoom: this.zoomArray[this.zoomIndex]
            });
            this.map.clearMap()
        },
        getLocationData(es) {
            this.locationData = []
            this.$axios.get(`/api/v1/display/location/list?actorId=${this.actorId}&deptId=${this.orgId}`).then(res => {
                let _this = this
                let positionData = []
                if (es) {
                    positionData = res.data.data.filter(item => {
                        return item.es == es
                    })
                } else {
                    positionData = res.data.data
                }
                positionData.forEach(v => {
                    if (v.lng !== 0 && v.lat !== 0) {
                        let circleMarker = new AMap.CircleMarker({
                            center: [v.lng, v.lat.toFixed(14)],
                            radius: 20,
                            strokeColor: 'white',
                            strokeWeight: 1,
                            strokeOpacity: 0.5,
                            fillColor: this.colorDict[v.es],
                            fillOpacity: 0.5,
                            zIndex: 10,
                            bubble: true,
                            cursor:'pointer',
                            clickable: true,
                            map: this.map
                        })
                        circleMarker.on('click', function(e) {
                            _this.changeUserId(v.uId)
                            _this.changeShowDetail(true)
                        })
                    }
                })
                // this.map.setFitView()
            })
        },
        getBorderData() {
            this.borderData = []
            this.$axios.get(`/api/v1/display/user/border?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                let data = res.data.data
                data.border.split(';').forEach(v => {
                    let temp = v.split(',').reverse()
                    this.borderData.push([Number(temp[0]), Number(temp[1])])
                })
                this.drawBorder()
            })
        },
        //初始化地图
        drawBorder() {
            // 绘制边界
            let borderData = []
            this.borderData.forEach(v => {
                if (v[0] && v[1]) {
                    borderData.push(v)
                }
            })
            this.polyline = new AMap.Polyline({
                path: borderData,
                strokeColor: '#2CFFC3',
                fillColor: "#1791fc", //填充色
                fillOpacity: 0.35,//填充透明度
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeStyle: 'solid',
                // strokeDasharray: [10,5],
                // geodesic: true

            });
            this.polyline.setMap(this.map);

            this.path = new AMap.Polyline({
                path: null,
                isOutline: false,     //线条是否带描边，默认false
                outlineColor: '#ffeeff',//线条描边颜色，此项仅在isOutline为true时有效，默认：#000000
                borderWeight: 1,    //描边的宽度，默认为1
                strokeColor: "#3366FF", //线条颜色，使用16进制颜色代码赋值。默认值为#006600
                strokeOpacity: 1,   //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                strokeWeight: 6,    //线条宽度，单位：像素
                strokeStyle: "solid",  //线样式，实线:solid，虚线:dashed
                strokeDasharray: [10, 5],//勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
                lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                zIndex: 50,       //折线覆盖物的叠加顺序。默认叠加顺序，先添加的线在底层，后添加的线在上层。通过该属性可调整叠加顺序，使级别较高的折线覆盖物在上层显示默认zIndex：50、
            })
            // 将折线添加至地图实例
            this.map.add(this.path);
        },
        getUserPosition() {
            this.$axios.get(`/api/v1/display/location/user?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                let data = res.data.data
                let marker = new AMap.Marker({
                    icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
                    size: [45, 55],
                    position: [data.lng, data.lat.toFixed(14)],
                    map: this.map
                })
            })
            
        },
        getPersonInfo() {
            this.$axios.get(`/api/v1/display/user/detail?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                let data = res.data.data
                this.personInfo = data
            })
            this.$axios.get(`/api/v1/display/location/user?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                this.userData = res.data.data
            })
        },
        handleClose() {
            this.isShowPosition = false
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    }
}
</script>
<style lang="less" scoped>
.china_map_container {
    position: relative;
    width: 100%;
    height: 100%;
    position: relative;
    #mapContainer {
        width: 100%;
        height: 100%;
        .amap-labels {
            font-size: 2rem;
        }
    }
    .supervise_personal {
        position: absolute;
        bottom: 1rem;
        display: flex;
        width: 100%;
        height: 35%;
        &_info_close {
            width: 1.2rem;
            height: 1.2rem;
            position: absolute;
            background: url(../../../../assets/homePage/close.png) no-repeat center center;
            background-size: 100% 100%;
            top: -1.2rem;
            right: 0;
            cursor: pointer;
        }
        &_info {
            width: 70%;
            height: 100%;
            background: #0C1823;
            border: 2px solid #2B69F8;
            border-radius: 10px;
            &_title {
                height: 13%;
                font-size: 1.2rem;
                color: #fff;
                text-align: left;
                margin: 0;
                padding: 0;
                padding-left: 0.5rem;
                background: #1F4BB1;
                display: flex;
                align-items: center;
            }
            &_content {
                position: relative;
                width: calc(100% - 1rem);
                height: calc(87% - 1rem);
                padding: 0.5rem;
                .portrait {
                    float: left;
                    width: 7rem;
                    height: 7rem;
                    background: url(../../../../assets/map/portrait.png) no-repeat;
                    background-size: 100% 100%;
                }
                .content {
                    width: calc(100% - 8rem);
                    margin-left: 8rem;
                    text-align: left;
                    .name_info {
                        margin-bottom: 0.5rem;
                        span {
                            display: inline-block;
                        }
                        .name {
                            font-size: 1.5rem;
                            color: #fff;
                            margin-right: 0.5rem;
                        }
                        .type {
                            width: 25%;
                            font-size: 1.2rem;
                            color: #FFFF59;
                            text-align: center;
                            background: url(../../../../assets/map/type_1.png) no-repeat;
                            background-size: 100% 100%;
                        }
                        .gz {
                            width: 25%;
                            font-size: 1.2rem;
                            color: #FF7E15;
                            text-align: center;
                            background: url(../../../../assets/map/type_2.png) no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                    .info_list {
                        margin: 0;
                        padding: 0;
                        li {
                            font-size: 1.2rem;
                            color: #fff;
                            margin-bottom: 0.5rem;
                        }
                    }
                    .sign_result {
                        position: absolute;
                        top: 2rem;
                        right: 2rem;
                        width: 20%;
                        height: 30%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 1.2rem;
                        color: #fff;
                        background: url(../../../../assets/map/result_fail.png) no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
        }
        .supervise_tracing {
            width: 30%;
            height: 100%;
            float: right;
            background: #0C1823;
            border: 2px solid #2B69F8;
            border-radius: 10px;
            // overflow: hidden;
        }
    }
}
</style>
