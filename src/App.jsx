import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Board from '~/pages/Boards/_id'
import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/** Redirect route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route '/', có thể hiểu là route '/' không còn nằm trong lịch sử trình duyệt
        // Thực hành dễ hiểu hơn bằng cách nhấn go home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có
        <Navigate to='/boards/67a3963c7fc4e7ceb018e44c' replace={true} />
      } />

      {/** Board details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/** Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/** 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
