<template>
    <div class="tracing">
        <p class="tracing_title">行动轨迹</p>
        <div class="tracing_content" id="container"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    mounted() {
        setTimeout(() => {
            this.initMap()
        }, 3 * 1000)
    },
    methods: {
           //初始化地图
        initMap() {
            let self = this
            this.map = new AMap.Map("container", {
                 mapStyle: "amap://styles/darkblue",
                center: [116.397559, 39.89621],
                zoom: 14
            });

            // 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
            let walkingOption = {}

            // 步行导航
            let walking = new AMap.Walking(walkingOption)

            //根据起终点坐标规划步行路线
            walking.search([116.399028, 39.845042], [116.436281, 39.880719], function(status, result) {
                // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
                if (status === 'complete') {
                    if (result.routes && result.routes.length) {
                        self.drawRoute(result.routes[0])
                        console.log('绘制步行路线完成')
                    }
                } else {
                    console.log('步行路线数据查询失败' + result)
                } 
            });
        },

        drawRoute(route) {
            let path = this.parseRouteToPath(route)

            let startMarker = new AMap.Marker({
                position: path[0],
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
                map: this.map,
                anchor: 'bottom-center',
            })

            let endMarker = new AMap.Marker({
                position: path[path.length - 1],
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                map: this.map,
                anchor: 'bottom-center',
            })

            let routeLine = new AMap.Polyline({
                path: path,
                isOutline: true,
                outlineColor: '#ffeeee',
                borderWeight: 2,
                strokeWeight: 5,
                strokeColor: '#0091ff',
                strokeOpacity: 0.9,
                lineJoin: 'round'
            })

            this.map.add(routeLine);

            // 调整视野达到最佳显示区域
            this.map.setFitView([ startMarker, endMarker, routeLine ])
        },

        // 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
        // WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
        parseRouteToPath(route) {
            let path = []

            for (let i = 0, l = route.steps.length; i < l; i++) {
                let step = route.steps[i]

                for (let j = 0, n = step.path.length; j < n; j++) {
                path.push(step.path[j])
                }
            }

            return path
        }
    }
}
</script>

<style lang="less">
    .tracing_title {
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
    .tracing_content {
        position: relative;
        width: 100%;
        height: calc(100% - 100px);
    }
</style>