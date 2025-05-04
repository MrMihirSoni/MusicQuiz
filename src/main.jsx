import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext.jsx'
import { TestProvider } from './TestContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TestProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TestProvider>
    </AuthProvider>
  </StrictMode>,
)
