<template>
    <div class="tracing">
        <p class="tracing_title">行动轨迹</p>
        <div class="tracing_content" id="container"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            borderData: []
        }
    },
    computed: {
        ...mapState(['actorId', 'userId']),
    },
    watch: {
        userId(v) {
            if (v) {
                this.getBorderData()
            }
        }
    },
    mounted() {
        this.getBorderData()
    },
    methods: {
        getBorderData() {
            this.tracingData = []
            this.$axios.get(`/api/v1/display/location/path?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                let data = res.data.data
                data.forEach(v => {
                    this.tracingData.push([v.lng, v.lat])
                })
                this.initMap()
            })
        },
           //初始化地图
        initMap() {
            this.map = new AMap.Map("container", {
                mapStyle: "amap://styles/darkblue",
                center: [116.397559, 39.89621],
                zoom: 11
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
                    zIndex: 20,
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
                setTimeout(() => {
                    navg1.start();
                }, 3000)
            });
            
            this.map.setFitView()
        }
    }
}
</script>

<style lang="less">
    .tracing_title {
        height: 13%;
        font-size: 1.2rem;
        color: #fff;
        text-align: left;
        margin: 0;
        padding: 0;
        padding-left: 1rem;
        background: #1F4BB1;
        display: flex;
        align-items: center;
    }
    .tracing_content {
        position: relative;
        width: 100%;
        height: 87%;
    }
</style>