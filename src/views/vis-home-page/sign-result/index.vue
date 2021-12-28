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
            <ul class="signList_filters_copy" id="signList_filters_copy"></ul>
        </div>
        <div class="signList_detail_dialog">
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
                                <span class="info">130628199009098899</span>
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
                            <span v-show="detailData.ccType" class="type">{{ detailData.ccType }}</span>
                            <span v-show="detailData.ccLevel" class="gz">{{ detailData.ccLevel }}</span>
                            <span v-show="detailData.crime" class="fz_type">{{ detailData.crime }}</span>
                        </div>
                        <ul>
                            <li>
                                <span>最后一次签到结果：</span>
                                <span>签到成功</span>
                            </li>
                            <li>
                                <span>最后一次签到地址：</span>
                                <span>河北省邯郸市XX区河北省邯郸市XX区河北省邯郸市XX区</span>
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
                            <span>2021-11-20</span>
                        </li>
                        <li>
                            <span>定位地址：</span>
                            <span>2021-11-30</span>
                        </li>
                    </ul>
                    <div class="track_path" id="track_path"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            isShow: false,
            detailData: {},
            user_id: '',
            borderData: [],
            signList: [],
            checkoutDict: {
                0: '签到失败',
                1: '签到成功',
                2: '等待签到',
                3: '过期未签到'
            },
            tempIndex: 1, // 默认选中签到成功
        }
    },
    mounted() {
        this.getData()
        this.scrollAnimation()
        this.getDetaiData() // 联调之后删除掉
        this.getBorderData()
    },
    computed: {
        ...mapState(['actorId', 'orgId', 'userId']),
    },
    watch: {
        orgId() {
            this.getData()
        },
        userId(id) {
            if (id) {
                this.getData()
                this.getDetaiData() // 联调之后要删除掉
                this.getBorderData()
            }
        }
    },
    methods: {
        // 滚动
        scrollAnimation() {
            let ul1 = document.getElementById("signList_filters");
            let ul2 = document.getElementById("signList_filters_copy");
            let ulbox = document.getElementById("scroll_box");
            ul2.innerHTML = ul1.innerHTML;
            ulbox.scrollTop = 0; // 开始无滚动时设为0
            function Marquee(){ 
                if(ulbox.scrollTop >= ul1.offsetHeight){
                    ulbox.scrollTop=0; 
                }
                else{ 
                    ulbox.scrollTop = ulbox.scrollTop + 1;
                } 
            }
            setInterval(Marquee, 40)
        },
        // 获取数据
        getData() {
            let baseUrl = '/api/v1/display/check/'
            let extendUrl = this.userId ? `user?actorId=${this.actorId}&userId=${this.userId}` : `dept?actorId=${this.actorId}&deptId=${this.orgId}&pageSize=9999&pageNum=1`
            this.$axios.get(baseUrl + extendUrl).then(res => {
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
                    this.signList = data
                }, 3 * 1000)
            })
        },
        // 点击弹框下钻
        getDetailInfo(item) {
            this.isShow = true
            this.user_id = item.userId
            this.getDetaiData()
            this.getBorderData()
        },
        // 获取下钻数据
        getDetaiData() {
            // this.$axios.get(`/api/v1/display/user/detail?actorId=${this.actorId}&userId=${this.user_id}`).then(res => {
            //     this.detailData = res.data.data
            // })
            this.$axios.get(`/api/v1/display/user/detail?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                this.detailData = res.data.data
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
                this.initMap()
            })
        },
        //初始化地图
        initMap() {
            this.map = new AMap.Map("track_path", {
                mapStyle: "amap://styles/darkblue",
                center: [116.397559, 39.89621],
                zoom: 11
            });
            this.marker = new AMap.Marker({
                position: null
            })
            this.map.add(this.marker);
            this.path = new AMap.Polyline({
                path: null,
                isOutline: false,     //线条是否带描边，默认false
                outlineColor: '#ffeeff',//线条描边颜色，此项仅在isOutline为true时有效，默认：#000000
                borderWeight: 1,    //描边的宽度，默认为1
                strokeColor: "#3366FF", //线条颜色，使用16进制颜色代码赋值。默认值为#006600
                strokeOpacity: 1,   //线条透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                strokeWeight: 4,    //线条宽度，单位：像素
                strokeStyle: "solid",  //线样式，实线:solid，虚线:dashed
                strokeDasharray: [10, 5],//勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
                lineJoin: 'round',    //折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                lineCap: 'round',   //折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                zIndex: 50,       //折线覆盖物的叠加顺序。默认叠加顺序，先添加的线在底层，后添加的线在上层。通过该属性可调整叠加顺序，使级别较高的折线覆盖物在上层显示默认zIndex：50、
            })
            // 将折线添加至地图实例
            this.map.add(this.path);
            let borderPath = []
            this.borderData.forEach(v => {
                if (v[0] && v[1]) {
                    borderPath.push(new AMap.LngLat(v[0], v[1]))
                }
            })
            this.path.setPath(borderPath)
            this.path.show()
            let lastTrack = new AMap.LngLat(this.borderData[0][0], this.borderData[0][1])
            this.map.setCenter(lastTrack)
            this.marker.setPosition(lastTrack)
            this.marker.show()
        }
    }
}
</script>

<style lang="less" scoped>
.signList {
    width: 100%;
    height: 1038px;
    background: url(../../../assets/homePage/signList.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
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
    .scroll_box {
        width: 1896px;
        height: 840px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
        overflow: hidden;
    }
    &_filters, &_filters_copy {
        > li {
            width: 100%;
            height: 245px;
            margin-bottom: 20px;
            position: relative;
            .filters_photo {
                width: 245px;
                height: 245px;
                margin-right: 32px;
                background: url(../../../assets/homePage/photo.png) no-repeat center center;
                background-size: 100% 100%;
                float: left;
                > img {
                    width: 219px;
                    height: 219px;
                    margin: 13px auto;
                }
            }
            .filters_contain {
                font-size: 36px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                background: url(../../../assets/homePage/signContain.png) no-repeat center center;
                background-size: 100% 100%;
                width: calc(100% - 381px);
                height: calc(100% - 64px);
                float: left;
                padding: 32px 52px 32px 52px;
                text-align: left;
                &_name {
                    font-size: 50px;
                    font-weight: bold;
                    margin-bottom: 30px;
                }
                &_status {
                    width: 294px;
                    height: 147px;
                    line-height: 147px;
                    padding-left: 81px;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-position: center center;
                    position: absolute;
                    top: 50%;
                    right: 68px;
                    transform: translateY(-50%);
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
        width: 2672px;
        height: auto;
        top: 730px;
        left: 50%;
        margin-left: -1336px;
        ul {
            margin: 0;
            padding: 0;
            li {
                line-height: 60px;
            }
        }
        .portrait_container {
            display: inline-block;
            float: left;
            width: 350px;
            height: 400px;
            background: rgba(36, 73, 159, 0.8);
            border-top: 4px solid #2B69F8;
            border-bottom: 4px solid #2B69F8;
            .portrait {
                width: 350px;
                height: 350px;
                margin-top: 25px;
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
            width: 1000px;
            height: 100%;
            margin-left: 31px;
            &_top {
                width: 100%;
                height: 400px;
                font-size: 36px;
                color: #fff;
                text-align: left;
                background: rgba(36, 73, 159, 0.8);
                border-top: 4px solid #2B69F8;
                border-bottom: 4px solid #2B69F8;
                &_container {
                    height: 350px;
                    margin-top: 25px;
                    padding-left: 37px;
                    padding-right: 37px;
                    background: #021F3F;
                    .name {
                        font-size: 50px;
                        margin-bottom: 30px;
                        padding-top: 20px;
                    }
                }
            }
            &_bottom {
                width: 100%;
                height: 560px;
                font-size: 36px;
                color: #fff;
                text-align: left;
                margin-top: 72px;
                background: rgba(36, 73, 159, 0.8);
                border-top: 4px solid #2B69F8;
                border-bottom: 4px solid #2B69F8;
                &_container {
                    height: 500px;
                    margin-top: 30px;
                    padding-left: 37px;
                    padding-right: 37px;
                    background: #021F3F;
                    .type_info {
                        padding-top: 27px;
                        margin-bottom: 62px;
                        span {
                            display: inline-block;
                        }
                        .type {
                            width: auto;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #FFFF59;
                            text-align: center;
                            margin-right: 26px;
                            padding-left: 16px;
                            padding-right: 16px;
                            background: url(../../../assets/map/type_1.png) no-repeat;
                            background-size: 100% 100%;
                        }
                        .gz {
                            width: auto;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #FF7E15;
                            text-align: center;
                            margin-right: 26px;
                            padding-left: 16px;
                            padding-right: 16px;
                            background: url(../../../assets/map/type_2.png) no-repeat;
                            background-size: 100% 100%;
                        }
                        .fz_type {
                            width: auto;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #2CFFC3;
                            text-align: center;
                            margin-right: 26px;
                            padding-left: 16px;
                            padding-right: 16px;
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
            width: 1000px;
            height: 1032px;
            margin-left: 291px;
            background: rgba(36, 73, 159, 0.8);
            border-top: 4px solid #2B69F8;
            border-bottom: 4px solid #2B69F8;
            &_container {
                height: 972px;
                font-size: 36px;
                color: #fff;
                text-align: left;
                margin-top: 30px;
                padding-left: 37px;
                padding-right: 37px;
                background: #021F3F;
                ul {
                    padding-top: 32px;
                }
                .track_path {
                    width: 100%;
                    height: 480px;
                    border: 2px solid #2B69F8;
                    border-radius: 10px;
                    margin-top: 12px;
                }
            }
        }
    }
}
</style>