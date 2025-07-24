// src/App.tsx
import React from "react";
import { useOrderStore } from "./store";

const App: React.FC = () => {
  const {
    index,
    filledOnce,
    submitOrder,
    declineOrder,
    getAcceptanceRate,
    getTotalOrders,
    dailies,
    endDay,
  } = useOrderStore();
console.log("filled once", filledOnce, useOrderStore.getState());
  return (
    <div className="container">
      <h1>Order Tracker</h1>

      <p>
        Current Position: <strong>{index}</strong>
      </p>

      <button onClick={submitOrder} className="accept">
        Accept Order
      </button>
      <button className="decline" onClick={declineOrder}>
        Decline Order
      </button>

      <div className="stats">
        <p>
          Total Orders Accepted: <strong>{getTotalOrders()}</strong>
        </p>
        {!filledOnce && (
          <p>
            Initial Rate: {" "}
            <strong>
              {(index > 0 ? (getTotalOrders() / index) * 100 : 0).toFixed(2)}%
            </strong>
          </p>
        )}
        <p>
          Acceptance Rate: {" "}
          <strong>{(getAcceptanceRate() * 100).toFixed(2)}%</strong>
        </p>
      </div>

      <div>
        <button onClick={endDay} className="daily">End Day</button>
      </div>

      <div className="daily-log">
        <h2>Daily Log</h2>
        <ul>
          {dailies.map((entry, i) => (
            <li key={i}>
              {entry.date}: {entry.start ?? "-"} to {entry.end || "in progress"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
/*<div className="orders-grid">
        {useOrderStore.getState().orders.map((val, i) => (
          <div
            key={i}
            className={`order-cell ${i === index ? "current" : ""}`}
            title={`Index ${i}`}
          >
            {val}
          </div>
        ))}
      </div>*/
export default App;
