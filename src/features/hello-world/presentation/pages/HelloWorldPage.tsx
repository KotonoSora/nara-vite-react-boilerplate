import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import reactLogo from '#assets/icons/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import './styles.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div id='hello-world-root'>
      <Helmet>
        <title>Hello World Page</title>
      </Helmet>
      <div className='flex flex-row'>
        <a
          href='https://vitejs.dev'
          target='_blank'
        >
          <img
            src={viteLogo}
            className='logo'
            alt='Vite logo'
          />
        </a>
        <a
          href='https://react.dev'
          target='_blank'
        >
          <img
            src={reactLogo}
            className='logo react'
            alt='React logo'
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </div>
  )
}

export default App
