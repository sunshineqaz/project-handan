<template>
    <div class="statics-list">
        <div v-for="(item, index) in dataList" :key="index" class="list__detail" :class="{'detail-active': index === tempIndex}" @click="changeMapPoints(item, index)">
            <div class="list__detail__number" :class="'number-' + index">{{ item.number }}</div>
            <div>{{ item.title }}</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            tempIndex: 0,
            dataList: [
                {
                    number: 0,
                    title: '正常人数',
                    es: 1
                },
                {
                    number: 0,
                    title: '请假人数',
                    es: 2
                },
                {
                    number: 0,
                    title: '关机人数',
                    es: 3
                },
                {
                    number: 0,
                    title: '失败人数',
                    es: 4
                },
                {
                    number: 0,
                    title: '脱区人数',
                    es: 5
                },
                {
                    number: 0,
                    title: '无边界人数',
                    es: 6
                },
                {
                    number: 0,
                    title: '总人数',
                    es: 100
                },
                {
                    number: 0,
                    title: '定位成功率'
                }
            ]
        }
    },
    computed: {
        ...mapState(['actorId', 'orgId']),
    },
    watch: {
        orgId() {
            this.getLocationData()
        }
    },
    mounted() {
        this.getLocationData()
    },
    methods: {
        ...mapActions(['changeMapStatus']),
        getLocationData() {
            this.$axios.get(`/api/v1/display/location/list?actorId=${this.actorId}&deptId=${this.orgId}`).then(res => {
                let data = res.data.data
                this.dataList.forEach((v, i) => {
                    if (i < 6) {
                        v.number = data.filter(item => {
                            return item.es == i + 1
                        }).length
                    }
                })
                this.dataList[6].number = data.length
                this.dataList[7].number = ((this.dataList[0].number + this.dataList[1].number + this.dataList[4].number + this.dataList[5].number) / this.dataList[6].number * 100).toFixed(2) + '%'
            })
        },
        changeMapPoints(item, index) {
            this.tempIndex = index
            if (index != this.dataList.length - 1) {
                this.changeMapStatus(item.es)
            } else {
                this.changeMapStatus(null)
            }
        }
    }
}
</script>

<style lang="less">
.statics-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    color: #fff;
    font-size: 1rem;
    .list__detail {
        width: 12%;
        height: 100%;
        background: url(../../../assets/homePage/statics.png) no-repeat center center;
        background-size: 100% 100%;
        cursor: pointer;
        &__number {
            width: 100%;
            font-size: 1.5rem;
            padding-top: 1rem;
        }
        .number-0 {
            color: #1bc1cd;
        }
        .number-1 {
            color: #d8b226;
        }
        .number-2, .number-3 {
            color: #c4151c;
        }
        .number-4 {
            color: #d96d1b;
        }
        .number-5 {
            color: #6b707b;
        }
    }
    .detail-active {
        background: #1f4bb1;
    }
}
</style>