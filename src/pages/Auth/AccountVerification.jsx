import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  let [searchParams] = useSearchParams()

  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo một biến state để biết được đã verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  // Nếu URL có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá qua trang 404
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return (
      <PageLoadingSpinner caption="Verifying your email..." />
    )
  }

  // Cuối cùng nếu không gặp vấn đề gì và verify thành công thì điều hướng về trang login cùng giá trị verificationEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
