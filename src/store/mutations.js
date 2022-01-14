// 司法所
export const changeActorId = (state, actorId) => {
    state.actorId = actorId
}

// 司法所
export const changeDeptId = (state, deptId) => {
    state.deptId = deptId
}

// 司法局
export const changeOrgId = (state, orgId) => {
    state.orgId = orgId
}

// 人员姓名
export const changeUserId = (state, userId) => {
    state.userId = userId
}

// 刷新倒计时
export const changeTime = (state, isUpdateTime) => {
    state.isUpdateTime = isUpdateTime
}

// 统计状态
export const changeType = (state, typeStatus) => {
    state.typeStatus = typeStatus
}

// 详情
export const changeShowDetail = (state, isShowDetail) => {
    state.isShowDetail = isShowDetail
}

// 地图打点状态
export const changeMapStatus = (state, mapStatus) => {
    state.mapStatus = mapStatus
}