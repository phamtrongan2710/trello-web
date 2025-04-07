import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

// Hành động gọi API (bất đồng bộ))
export const fetchInvitationAPI = createAsyncThunk(
  'notifications/fetchInvitationAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(
      `${API_ROOT}/v1/invitations`
    )
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/invitations/board/${invitationId}`,
      { status }
    )
    return response.data
  }
)

// Khởi tạo một slice trong kho lưu trữ Redux
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: state => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingNotification = action.payload
      state.currentNotifications.unshift(incomingNotification)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInvitationAPI.fulfilled, (state, action) => {
        let incomingNotifications = action.payload
        // Đảo ngược mảng invitations nhận được để hiển thị thông báo mới nhất ở đầu danh sách
        state.currentNotifications = Array.isArray(incomingNotifications) ? incomingNotifications.reverse() : []
      })
      .addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
        const incomingNotifications = action.payload
        const index = state.currentNotifications.findIndex(i => i._id === incomingNotifications._id)
        if (index !== -1) {
          state.currentNotifications[index] = incomingNotifications
        }
      })
  }
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

export const selectCurrentNotifications = state => { return state.notifications.currentNotifications }

export const notificationsReducer = notificationsSlice.reducer