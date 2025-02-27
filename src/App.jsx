import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Board from '~/pages/Boards/_id'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

/**
 * Giải pháp clean code trong việc xác định các routes nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của 'react-router-dom' để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://api.reactrouter.com/v7/functions/react_router.Outlet.html
 * Một bài hướng dẫn khá đầy đủ
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/** Redirect route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route '/', có thể hiểu là route '/' không còn nằm trong lịch sử trình duyệt
        // Thực hành dễ hiểu hơn bằng cách nhấn go home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có
        <Navigate to='/boards/67a3963c7fc4e7ceb018e44c' replace={true} />
      } />

      {/** Protected Route: hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi login */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/** <Outlet /> của react-router-dom sẽ chạy vào các child route trong này  */}

        {/** Board details */}
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>

      {/** Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/** 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
