import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

// Khởi tạo một slice trong kho lưu trữ redux store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // reducers: nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Lưu ý: luôn cần cặp ngoặc nhọn cho function trong reducer cho dù bên trong chỉ có 1 dòng. Đây là rule của rudex
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const card = action.payload

      // xử lý dữ liệu nếu cần thiết
      // ...

      // update lại dữ liệu của current active card
      state.currentActiveCard = card
    }
  },
  // extraReducers: nơi xử lý dữ liệu bất đồng bộ
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => { }
})

// Action creators are generated for each case reducer function
// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được redux tạo tự động theo tên của reducer
export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard
} = activeCardSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy đầy đủ dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

// Note: cái file này tên là activeCardSlice NHƯNG chúng ta sẽ export một thứ tên là reducer
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer