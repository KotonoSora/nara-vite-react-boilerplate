import reactLogo from '#assets/icons/react.svg'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './index.css'
import './styles.css'
import viteLogo from '/vite.svg'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      id='hello-world-root'
      data-testid='app-root'
    >
      <Helmet>
        <title>Hello World Page</title>
      </Helmet>
      <div
        className='flex flex-row'
        data-testid='logos-container'
      >
        <a
          href='https://vitejs.dev'
          target='_blank'
          data-testid='vite-link'
        >
          <img
            src={viteLogo}
            className='logo'
            alt='Vite logo'
            data-testid='vite-logo'
          />
        </a>
        <a
          href='https://react.dev'
          target='_blank'
          data-testid='react-link'
        >
          <img
            src={reactLogo}
            className='logo react'
            alt='React logo'
            data-testid='react-logo'
          />
        </a>
      </div>
      <h1 data-testid='title'>Vite + React</h1>
      <div
        className='card'
        data-testid='card'
      >
        <button
          onClick={() => setCount(count => count + 1)}
          data-testid='counter-button'
        >
          count is {count}
        </button>
        <p data-testid='edit-code'>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p
        className='read-the-docs'
        data-testid='footer-text'
      >
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}
