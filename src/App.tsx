// src/App.tsx
import React from 'react'
import { useOrderStore } from './store'

const App: React.FC = () => {
  const {
    index,
    submitOrder,
    declineOrder,
    getAcceptanceRate,
    getTotalOrders,
  } = useOrderStore()

  return (
    <div className="container">
      <h1>Order Tracker</h1>

      <p>Current Position: <strong>{index}</strong></p>

      <button onClick={submitOrder} className="accept">Accept Order</button>
      <button className="decline" onClick={declineOrder}>Decline Order</button>

      <div className="stats">
        <p>Total Orders Accepted: <strong>{getTotalOrders()}</strong></p>
        <p>Initial Rate: <strong>{(getTotalOrders() / index * 100).toFixed(2)}%</strong></p>
        <p>Acceptance Rate: <strong>{(getAcceptanceRate() * 100).toFixed(2)}%</strong></p>
      </div>
    </div>
  )
}

export default App
