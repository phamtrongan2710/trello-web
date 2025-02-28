import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
 * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizedAxios hiện tại
 * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
*/
let axiosReduxStore

export const injectStore = mainStore => { axiosReduxStore = mainStore }

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình interceptor (Bộ đánh chặn giữa mọi request và response)
 * https://axios-http.com/docs/interceptors
 */

// request interceptor: can thiệp vào giữa các request api gửi đi
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click (mô tả function ở file formatters)
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Khởi tạo một cái Promise cho việc gọi API refresh_token
// Mục đích tạo Promise này để khi nào gọi API refresh_token xong xuôi thì mới retry lại nhiều API bị lỗi trước đó
// https://www.thedutchlab.com/insights/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null

// response interceptor: can thiệp vào giữa các response nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Kỹ thuật chặn spam click (mô tả function ở file formatters)
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger

  // Kỹ thuật chặn spam click (mô tả function ở file formatters)
  interceptorLoadingElements(false)

  /** Quan trọng: Xử lý refresh token tự động */
  // Trường hợp 1: Nếu như nhận mã 401 từ BE thì gọi API đăng xuất luôn
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Trường hợp 2: Nếu như nhận mã 410 từ BE thì gọi API refresh_token để làm mới lại accessToken
  // Đầu tiên lấy được cá request API đang bị lỗi thông qua error config
  const originalRequests = error.config
  // console.log('🚀 ~ authorizedAxiosInstance.interceptors.response.use ~ originalRequests:', originalRequests)
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Gán thêm một cái giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn lại điều kiện if ở phía trên)
    // UPDATE: không cần dùng cái _retry như hướng dẫn trên mạng cũng được vì chúng ta sẽ dùng cái refreshTokenPromise để check là đủ.
    // originalRequests._retry = true

    // Kiểm tra nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // đồng thời cái accessToken đã nằm trong httpOnly cookie (xử lý phía backend)
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kỳ lỗi nào từ api refresh_token thì cứ logout luôn
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error) // tránh gọi lại api của originalRequests bị lỗi
        })
        .finally(() => {
          // Dù api có OK hay lỗi thì vẫn luôn gán lại refreshTokenPromise = null như ban đầu
          refreshTokenPromise = null
        })
    }

    // cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
       * Bước 1: Đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây
       * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi gọi api refreshToken được gọi thành công
       */

      // Bước 2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần - clean code)
  // console.log(error) ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - ngoài trừ mã 410 - GONE phục vụ việc tự động refresh lại token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance