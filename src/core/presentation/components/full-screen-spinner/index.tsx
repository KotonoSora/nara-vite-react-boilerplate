import { FC } from 'react'
import styles from './styles.module.css'

const FullScreenSpinner: FC = () => (
  <div className='fixed inset-0 flex items-center justify-center bg-gray-100 z-50'>
    <div className={styles.customSpinner} />
  </div>
)

export default FullScreenSpinner
