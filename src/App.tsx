// src/App.tsx
import React from "react";
import { useOrderStore } from "./store";
import time12Compact from "./helper";

const App: React.FC = () => {
  const today = new Date().toLocaleDateString("en-CA").split("T")[0];
  const todaysEntry = useOrderStore
    .getState()
    .dailies.find((entry) => entry.date === today);
  const {
    index,
    filledOnce,
    submitOrder,
    declineOrder,
    getAcceptanceRate,
    getTotalOrders,
    dailies,
    endDay,
    lastAccept,
    lastDecline,
  } = useOrderStore();
  //localStorage.removeItem("order-storage");
  let store = useOrderStore.getState();
  let daily = store.dailies;
  console.log("filled once", filledOnce, useOrderStore.getState(), daily);

  return (
    <div className="container">
      <h1>Order Tracker</h1>

      <p>
        Current Position: <strong>{index}</strong>
      </p>

      <button onClick={submitOrder} className="accept">
        Accept Order
      </button>
      {lastAccept !==0 && (<p><strong>Acc:</strong> {time12Compact(lastAccept)} <strong>Dec: </strong>{lastDecline !== 0 ? time12Compact(lastDecline) : ""}</p>)}
      <button className="decline" onClick={declineOrder}>
        Decline Order
      </button>

      <div className="stats">
        <p>
          <strong>Todays Rate:</strong>{" "}
          {todaysEntry && todaysEntry.rate ? todaysEntry.rate + "%" : "0%"}
        </p>
        <p>
          Total Orders Accepted: <strong>{getTotalOrders()}</strong>
        </p>
        {!filledOnce && (
          <p>
            Initial Rate:{" "}
            <strong>
              {(index > 0 ? (getTotalOrders() / index) * 100 : 0).toFixed(2)}%
            </strong>
          </p>
        )}
        {filledOnce &&<p>
          Acceptance Rate:{" "}
          <strong>{(getAcceptanceRate() * 100).toFixed(2)}%</strong>
        </p>
        }
      </div>

      <div>
        <button onClick={endDay} className="daily">
          End Day
        </button>
      </div>

      <div className="daily-log">
        <h2>Daily Log</h2>
        <ul>
          {dailies
            .slice()
            .reverse()
            .map((entry, i) => (
              <li key={i}>
                {entry.date}: {entry.start ?? "-"} to{" "}
                {entry.end || "in progress"}
              </li>
            ))}
        </ul>
      </div>
      <div className="orders-grid">
        {useOrderStore.getState().orders.map((val, i) => (
          <div
            key={i}
            className={`order-cell ${i === index ? "current" : ""}`}
            title={`Index ${i}`}
          >
            {val}
          </div>
        ))}
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
