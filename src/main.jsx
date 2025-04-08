import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { createRoot } from 'react-dom/client'
import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'

// Cấu hình react toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Cấu hình MUI dialog
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

// Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình redux persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
let persistor = persistStore(store)

// Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from '~/utils/authorizedAxios'
injectStore(store)

// Cấu hình socket.io phía client tại đây và export ra biến socketIoInstance
// https://socket.io/how-to/use-with-react
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'
export const socketIoInstance = io(API_ROOT)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename="/">
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: {
                color: 'inherit',
                variant: 'outlined'
              },
              cancellationButtonProps: { color: 'inherit' }
            }}
          >
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer
              position="bottom-left"
              theme="colored"
              autoClose={5000}
            />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
