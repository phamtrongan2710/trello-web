import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationsReducer } from './notifications/notificationsSlice'

/**
 * Cấu hình redux-persist
 * https://www.npmjs.com/package/redux-persist
 * Bài viết hướng dẫn dễ hiểu hơn
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */
import { combineReducers } from 'redux' // Có sẵn redux trong node_modules bởi vì khi cài @redux/toolkit là đã có luôn
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // key của cái persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // biến storage ở trên - lưu vào local storage
  whitelist: ['user'] // định nghĩa các slice dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
  // blacklist: ['user'] // định nghĩa các slice dữ liệu KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần F5 trình duyệt
}

// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer
})

// Thực hiện persist reducers
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // Fix warning error when implement redux-pesist: (Không tương thích version giữa redux/toolkit và redux-pesist)
  // https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})