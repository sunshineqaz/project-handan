<template>
    <div class="signList">
        <div class="signList_title">
            签到结果
        </div>
        <div class="signList_titleEN">
            CHECK IN RESULTS
        </div>
        <div class="scroll_box" id="scroll_box">
            <ul class="signList_filters" id="signList_filters">
                <li v-for="(item, index) in signList" :key="index" @click="getDetailInfo(item)">
                    <div class="filters_photo">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="filters_contain">
                        <div class="filters_contain_name">{{ item.userName }} | {{ item.phone }}</div>
                        <div class="filters_contain_detail">
                            机构：{{ item.deptName }} &nbsp;&nbsp; 签到时间：{{ item.checkTime }}
                            <br>
                            签到地址： {{ item.addr }}
                        </div>
                        <div class="filters_contain_status" :class="'sign_' + item.checkStatus">
                            {{ checkoutDict[item.checkStatus] }}
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="signList_filters_copy" id="signList_filters_copy">
                <li v-for="(item, index) in signList" :key="index" @click="getDetailInfo(item)">
                    <div class="filters_photo">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="filters_contain">
                        <div class="filters_contain_name">{{ item.userName }} | {{ item.phone }}</div>
                        <div class="filters_contain_detail">
                            机构：{{ item.deptName }} &nbsp;&nbsp; 签到时间：{{ item.checkTime }}
                            <br>
                            签到地址： {{ item.addr }}
                        </div>
                        <div class="filters_contain_status" :class="'sign_' + item.checkStatus">
                            {{ checkoutDict[item.checkStatus] }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="signList_detail_dialog" v-if="isShow">
            <div class="portrait_container">
                <div class="portrait">
                    <img :src="detailData.photo" alt="">
                </div>
            </div>
            <div class="left_content">
                <div class="left_content_top">
                    <div class="left_content_top_container">
                        <div class="name">{{ detailData.userName }}</div>
                        <ul>
                            <li>
                                <span class="title">机构：</span>
                                <span class="info">{{ detailData.deptName }}</span>
                            </li>
                            <li>
                                <span class="title">证件号码：</span>
                                <span class="info">{{ detailData.idCardNo }}</span>
                            </li>
                            <li>
                                <span class="title">固定居住地：</span>
                                <span class="info">{{ detailData.homeAddr }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="left_content_bottom">
                    <div class="left_content_bottom_container">
                        <div class="type_info">
                            <span v-show="detailData.ccType" class="type">{{ getType(detailData.ccType) }}</span>
                            <span v-show="detailData.crime" class="fz_type">{{ detailData.crime }}</span>
                        </div>
                        <ul>
                            <li>
                                <span>最后一次签到结果：</span>
                                <span>{{ checkoutDict[personData.checkStatus] }}</span>
                            </li>
                            <li>
                                <span>最后一次签到地址：</span>
                                <span>{{ personData.addr }}</span>
                            </li>
                            <li>
                                <span>矫正开始时间：</span>
                                <span>{{ detailData.ccStartTime }}</span>
                            </li>
                            <li>
                                <span>矫正结束时间：</span>
                                <span>{{ detailData.ccEndTime }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="right_content">
                <span class="right_content_close" @click="handleClose"></span>
                <div class="right_content_container">
                    <ul>
                        <li>
                            <span>请假状态：</span>
                            <span>{{ detailData.isLeave == '1' ? '请假' : '未请假' }}</span>
                        </li>
                        <li>
                            <span>请假目的地：</span>
                            <span>{{ detailData.leaveDest }}</span>
                        </li>
                        <li>
                            <span>定位电话：</span>
                            <span>{{ detailData.phone }}</span>
                        </li>
                        <li>
                            <span>定位间隔：</span>
                            <span>{{ `${detailData.locationRate}分钟` }} </span>
                        </li>
                        <li>
                            <span>最后一次定位时间：</span>
                            <span>{{ personData.checkTime }}</span>
                        </li>
                        <li>
                            <span>定位地址：</span>
                            <span>{{ signAddr }}</span>
                        </li>
                    </ul>
                    <div class="track_path" id="track_path"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            isShow: false,
            detailData: {},
            user_id: '',
            signList: [],
            checkoutDict: {
                0: '签到失败',
                1: '签到成功',
                2: '等待签到',
                3: '过期未签到'
            },
            tempIndex: 1, // 默认选中签到成功
            personData: {},
            signAddr: '',
            tracingData: [],
            timer: null,
            timer1: null,
            dataAll: [] // 全量数据
        }
    },
    computed: {
        ...mapState(['actorId', 'orgId', 'isUpdateTime', 'typeStatus', 'isShowDetail']),
    },
    watch: {
        orgId(v) {
            if (v) {
                this.isShow = false
                this.getData()
                this.scrollAnimation()
            }
        },
        userId(id) {
            if (id) {
                this.isShow = false
                this.getData()
                this.scrollAnimation()
            }
        },
        isUpdateTime() {
            if (this.orgId) {
                this.getData()
            }
        },
        typeStatus(v) {
            this.changeSignData(v)
            this.scrollAnimation()
        },
        isShowDetail(v) {
            if (!v) {
                this.isShow = true
            } else {
                this.isShow = false
            }
        }
    },
    methods: {
        ...mapActions(['changeShowDetail']),
        // 滚动
        scrollAnimation() {
            clearInterval(this.timer)
            this.timer = null
            let ul1 = document.getElementById("signList_filters");
            let ulbox = document.getElementById("scroll_box");
            ulbox.scrollTop = 0; // 开始无滚动时设为0
            function Marquee(){ 
                if(ulbox.scrollTop >= ul1.offsetHeight){
                    ulbox.scrollTop=0; 
                }
                else{ 
                    ulbox.scrollTop = ulbox.scrollTop + 1;
                } 
            }
            this.timer = setInterval(Marquee, 40)
        },
        changeSignData(v) {
            if (v) {
                this.signList = this.dataAll.filter(item => {
                    return item && item.checkStatus == v
                })
            } else {
                this.signList = this.dataAll
            }
        },
        // 获取数据
        getData() {
            let baseUrl = '/api/v1/display/check/'
            let deptUrl = `dept?actorId=${this.actorId}&deptId=${this.orgId}&pageSize=9999&pageNum=1`
            let perUrl = `user?actorId=${this.actorId}&userId=${this.userId}`
            let extendUrl = this.userId ? perUrl : deptUrl
            this.$axios.get(baseUrl + extendUrl).then(res => {
                if (res.data.data) {
                    let data = res.data.data.list
                    let geocoder = new AMap.Geocoder({});
                    data.forEach(v => {
                        let latlan = JSON.parse(v.checkLbs).lng + ',' + JSON.parse(v.checkLbs).lat
                        geocoder.getAddress(latlan, function (status, result) {
                            if (status === "complete" && result.regeocode) {
                                v.addr = result.regeocode.formattedAddress;
                            } else {
                                console.log("根据经纬度查询地址失败");
                            }
                        })
                    })
                    setTimeout(() => {
                        this.dataAll = data
                        this.signList = this.dataAll
                    }, 2000)
                } else {
                    this.dataAll = []
                    this.signList = []
                }
            })
        },
        // 点击弹框下钻
        getDetailInfo(item) {
            this.isShow = true
            this.user_id = item.userId
            this.personData = item
            this.getDetaiData()
            this.getBorderData()
            this.changeShowDetail(false)
        },
        // 获取下钻数据
        getDetaiData() {
            this.$axios.get(`/api/v1/display/user/detail?actorId=${this.actorId}&userId=${this.user_id}`).then(res => {
                this.detailData = res.data.data
            })
            this.$axios.get(`/api/v1/display/location/user?actorId=${this.actorId}&userId=${this.user_id}`).then(res => {
                this.detailData = Object.assign(this.detailData, res.data.data)
                let latlan = this.detailData.lng + ',' + this.detailData.lat
                let _this = this
                let geocoder = new AMap.Geocoder({});
                geocoder.getAddress(latlan, function (status, result) {
                    if (status === "complete" && result.regeocode) {
                        _this.signAddr = result.regeocode.formattedAddress;
                    } else {
                        console.log("根据经纬度查询地址失败");
                    }
                })
                this.$forceUpdate()
            })
        },
        getBorderData() {
            this.tracingData = []
            this.$axios.get(`/api/v1/display/location/path?actorId=${this.actorId}&userId=${this.user_id}`).then(res => {
                let data = res.data.data
                data.forEach(v => {
                    this.tracingData.push([v.lng, v.lat])
                })
                this.initMap()
            })
        },
        //初始化地图
        initMap() {
            this.map = new AMap.Map("track_path", {
                mapStyle: "amap://styles/darkblue",
                center: [116.397559, 39.89621],
                zoom: 14
            });

            this.marker = new AMap.Marker({
                position: null
            })
            // this.map.add(this.marker);
            this.path = new AMap.Polyline({
                path: null,
                isOutline: false,     //线条是否带描边，默认false
                outlineColor: '#ffeeff',//线条描边颜色，此项仅在isOutline为true时有效，默认：#000000
                borderWeight: 1,    //描边的宽度，默认为1
                strokeColor: "#3366FF", //线条颜色，使用16进制颜色代码赋值。默认值为#006600
                strokeOpacity: 0.8,   //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                strokeWeight: 2,    //线条宽度，单位：像素
                strokeStyle: "solid",  //线样式，实线:solid，虚线:dashed
                strokeDasharray: [10, 5],//勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
                lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                zIndex: 50,       //折线覆盖物的叠加顺序。默认叠加顺序，先添加的线在底层，后添加的线在上层。通过该属性可调整叠加顺序，使级别较高的折线覆盖物在上层显示默认zIndex：50、
            })
            // 将折线添加至地图实例
            this.map.add(this.path);
            let tracingPath = []
            this.tracingData.forEach(v => {
                if (v[0] && v[1]) {
                    tracingPath.push(new AMap.LngLat(v[0], v[1]))
                }
            })
            this.path.setPath(tracingPath)
            this.path.show()
            let lastTrack = new AMap.LngLat(this.tracingData[0][0], this.tracingData[0][1])
            this.map.setCenter(lastTrack)
            this.marker.setPosition(lastTrack)
            this.marker.show()
            let _this = this
            AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }

                let pathSimplifierIns = new PathSimplifier({
                    zIndex: 25,
                    map: _this.map, //所属的地图实例
                    getPath: function(pathData, pathIndex) {
                        return pathData.path;
                    },
                    renderOptions: {
                        renderAllPointsIfNumberBelow: 1 //绘制路线节点，如不需要可设置为-1
                    },
                    getHoverTitle: function() {
                        return ''
                    }
                });
                window.pathSimplifierIns = pathSimplifierIns;
                //设置数据
                pathSimplifierIns.setData([{
                    name: '路线0',
                    path: _this.tracingData
                }]);

                //对第一条线路（即索引 0）创建一个巡航器
                let navg1 = pathSimplifierIns.createPathNavigator(0, {
                    loop: true, //循环播放
                    speed: 10 //巡航速度，单位千米/小时
                });

                navg1.start();
            });
            
            this.map.setFitView()
        },
        // 矫正类别
        getType(v) {
            if (v == 1) {
                return '管制'
            } else if (v == 2) {
                return '缓刑'
            } else if (v == 3) {
                return '假释'
            } else if (v == 4) {
                return '暂予监外执行'
            }
        },
        handleClose() {
            this.isShow = false
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    }
}
</script>

<style lang="less" scoped>
.signList {
    width: 100%;
    height: 70%;
    background: url(../../../assets/homePage/signList.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    &_title {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18%;
        height: 8%;
        font-size: 1rem;
        font-weight: bold;
        color: #A4C0FF;
        float: left;
    }
    &_titleEN {
        width: 35%;
        height: 8%;
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 400;
        color: #2557C7;
        float: left;
        margin-left: 0.5rem;
    }
    .scroll_box {
        width: 100%;
        height: 82%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
        overflow: hidden;
    }
    &_filters, &_filters_copy {
        margin: 0;
        padding: 0 1rem;
        > li {
            width: 100%;
            height: 8rem;
            margin-bottom: 0.5rem;
            position: relative;
            .filters_photo {
                width: 8rem;
                height: 8rem;
                margin-right: 0.5rem;
                background: url(../../../assets/homePage/photo.png) no-repeat center center;
                background-size: 100% 100%;
                float: left;
                > img {
                    width: 7rem;
                    height: 7rem;
                    margin: 0.5rem auto;
                }
            }
            .filters_contain {
                font-size: 1.1rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                background: url(../../../assets/homePage/signContain.png) no-repeat center center;
                background-size: 100% 100%;
                width: calc(100% - 9.5rem);
                height: calc(100% - 1rem);
                float: right;
                padding: 0.5rem;
                text-align: left;
                &_name {
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin-bottom: 0.2rem;
                }
                &_status {
                    width: 6rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-position: center center;
                    position: absolute;
                    top: 0.5rem;
                    right: 1rem;
                }
                .sign_1 {
                    background-image: url('../../../assets/homePage/successStatus.png');
                }
                .sign_2 {
                    background-image: url('../../../assets/homePage/waitStatus.png');
                }
                .sign_9 {
                    background-image: url('../../../assets/homePage/failedStatus.png');
                }
                .sign_3 {
                    background-image: url('../../../assets/homePage/outStatus.png');
                }
            }
        }
    }
    &_detail_dialog {
        position: fixed;
        z-index: 999;
        width: 40%;
        height: 60%;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        ul {
            margin: 0;
            padding: 0;
            li {
                line-height: 1.5rem;
            }
        }
        .portrait_container {
            display: inline-block;
            float: left;
            width: 7rem;
            height: 7rem;
            background: rgba(36, 73, 159, 0.8);
            border-top: 2px solid #2B69F8;
            border-bottom: 2px solid #2B69F8;
            .portrait {
                width: 6rem;
                height: 6rem;
                margin: 0.5rem;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .left_content {
            display: inline-block;
            float: left;
            width: 40%;
            height: 100%;
            margin-left: 0.5rem;
            &_top {
                width: 100%;
                font-size: 1.2rem;
                color: #fff;
                text-align: left;
                background: rgba(36, 73, 159, 0.8);
                border-top: 2px solid #2B69F8;
                border-bottom: 2px solid #2B69F8;
                &_container {
                    padding: 0.5rem;
                    background: #021F3F;
                    .name {
                        font-size: 1.2rem;
                        margin-bottom: 0.5rem;
                        padding-top: 0.5rem;
                    }
                }
            }
            &_bottom {
                width: 100%;
                font-size: 1.2rem;
                color: #fff;
                text-align: left;
                margin-top: 1rem;
                background: rgba(36, 73, 159, 0.8);
                border-top: 2px solid #2B69F8;
                border-bottom: 2px solid #2B69F8;
                &_container {
                    padding-left: 0.5rem;
                    padding-right: 0.5rem;
                    background: #021F3F;
                    .type_info {
                        padding-top: 0.5rem;
                        margin-bottom: 0.5rem;
                        span {
                            display: inline-block;
                        }
                        .type {
                            width: auto;
                            height: 2rem;
                            line-height: 2rem;
                            font-size: 1rem;
                            color: #FFFF59;
                            text-align: center;
                            margin-right: 0.5rem;
                            padding-left: 1rem;
                            padding-right: 1rem;
                            background: url(../../../assets/map/type_1.png) no-repeat;
                            background-size: 100% 100%;
                        }
                        .fz_type {
                            width: auto;
                            height: 2rem;
                            line-height: 2rem;
                            font-size: 1rem;
                            color: #2CFFC3;
                            text-align: center;
                            margin-right: 1rem;
                            padding-left: 1rem;
                            padding-right: 1rem;
                            background: url(../../../assets/map/type_3.png) no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }
        .right_content {
            display: inline-block;
            float: left;
            width: calc(60% - 8rem);
            margin-left: 0.5rem;
            background: rgba(36, 73, 159, 0.8);
            border-top: 2px solid #2B69F8;
            border-bottom: 2px solid #2B69F8;
            &_close {
                width: 1.5rem;
                height: 1.5rem;
                position: absolute;
                background: url(../../../assets/homePage/close.png) no-repeat center center;
                background-size: 100% 100%;
                top: -1.5rem;
                right: 0;
                cursor: pointer;
            }
            &_container {
                font-size: 1.2rem;
                color: #fff;
                text-align: left;
                padding-left: 0.5rem;
                padding-right: 0.5rem;
                background: #021F3F;
                ul {
                    padding-top: 1rem;
                }
                .track_path {
                    width: 100%;
                    height: 12.2rem;
                    border: 1px solid #2B69F8;
                    border-radius: 10px;
                    margin-top: 0.5rem;
                }
            }
        }
    }
}
</style>