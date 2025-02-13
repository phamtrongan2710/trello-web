import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Lưu ý:
 * Các function bên dưới chỉ request và lấy data luôn mà không có try catch gì để bắt lỗi
 * Lý do là vì ở FE chúng ta không cần bắt lỗi với mọi request bởi nó gây ra dư thừa code catch lỗi quá nhiều
 * Giải pháp clean code là catch lỗi tập trung tại một nơi bằng cách tận dụng một thứ cực kỳ mạnh mẽ trong axios là Interceptors
 * Hiểu đơn giản Interceptors là cách chúng ta đánh chặn giữa request và response để xử lý logic mà chúng ta muốn
 * Đọc thêm về Interceptors tại: https://axios-http.com/docs/interceptors
 */

// Board
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios trả về thông qua property là data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

// Column
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

// Card
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}