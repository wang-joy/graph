const state = {
  width: 0,
  height: 0,
  minWidth: 1200,
  minHeight: 800,
  status: 'normal' // 三个状态 normal、create、edit
}

const mutations = {
  WIN_RESIZE (state, size) {
    state.height = Math.max(size[1], state.minHeight)
    state.width = Math.max(size[0], state.minWidth)
  },
  CHANGE_STATUS (state, status) {
    state.status = status
  }
}

const actions = {
  winResize (ctx, size) {
    ctx.commit('WIN_RESIZE', size)
  }
}

export default {
  state,
  mutations,
  actions
}
