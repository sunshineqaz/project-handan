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