<template>
    <div :class="[userId ? 'abnormalTable' : 'abnormalTableUser']">
        <template v-if="userId">
            <div class="abnormalTable_title">
                异常列表
            </div>
            <div class="abnormalTable_titleEN">
                EXCEPTION LIST
            </div>
        </template>
        <div class="abnormalTable_filters">
            <el-table :data="tableData" ref="abnormalTable">
                <el-table-column label="序号" type="index" width="60"></el-table-column>
                <el-table-column label="姓名" prop="userName" width="80"></el-table-column>
                <el-table-column label="机构" prop="deptName" width="125"></el-table-column>
                <el-table-column label="异常信息" prop="exceName" width="125"></el-table-column>
                <el-table-column label="异常开始时间" prop="createTime"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            tableData: []
        }
    },
    computed: {
        ...mapState(['actorId', 'orgId', 'userId', 'isUpdateTime']),
    },
    watch: {
        orgId() {
            this.getData()
        },
        isUpdateTime() {
            this.getData()
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        // 获取数据
        getData() {
            this.$axios.get(`/api/v1/display/location/exception/dept?actorId=${this.actorId}&deptId=${this.orgId}`).then(res => {
                let data = res.data.data
                this.tableData = data
            })
        }
    }
}
</script>

<style lang="less" scoped>
.abnormalTableUser {
    width: 100%;
    height: 91%;
    background: url(../../../assets/homePage/abnormalUser.png) no-repeat center center;
    background-size: 100% 100%;
    margin-bottom: 0.5rem;
    .abnormalTable_filters {
        width: 96%;
        height: 90%;
        padding: 0;
        overflow: hidden;
        float: left;
        margin-top: 3.5rem;
        margin-left: 1rem;
    }
}
.abnormalTable {
    width: 100%;
    height: 48%;
    background: url(../../../assets/homePage/abnormal.png) no-repeat center center;
    background-size: 100% 100%;
    margin-bottom: 0.5rem;
    .abnormalTable_filters {
        width: 96%;
        height: 82%;
        padding: 0;
        overflow: hidden;
        float: left;
        margin-top: 1.5rem;
        margin-left: 1rem;
    }
}
.abnormalTable_title {
    width: 18%;
    height: 10%;
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #A4C0FF;
    float: left;
}
.abnormalTable_titleEN {
    width: 35%;
    height: 10%;
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 400;
    color: #2557C7;
    float: left;
    margin-left: 0.5rem;
}
</style>
<style lang="less">
.el-table--enable-row-hover .el-table__body tr:hover {
    background: url(../../../assets/homePage/tr-selected.png) no-repeat center center;
    background-size: 100% 100%;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background: none !important;
}
.el-table tr.el-table__row.current-row {
    background: url(../../../assets/homePage/tr-selected.png) no-repeat center center;
    background-size: 100% 100%;
}
.el-table--enable-row-hover .el-table__body tr.el-table__row.current-row > td.el-table__cell {
    background: none !important;
}
</style>