// src/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DailyEntry {
  date: string;
  start: number;
  end?: number;
  rate?: number;
}

interface OrderStore {
  orders: number[];
  dailies: DailyEntry[];
  index: number;
  filledOnce: boolean;
  submitOrder: () => void;
  declineOrder: () => void;
  getAcceptanceRate: () => number;
  getTotalOrders: () => number;
  startNewDay: () => void;
  endDay: () => void;
  getTodaysRate: (startIndex: number, endIndex: number) => number;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: Array(100).fill(0),
      dailies: [],
      index: 0,
      filledOnce: false,
      
      submitOrder: () => {
        const newOrders = [...get().orders]
        const currentIndex = get().index % 100
        const nextIndex = (currentIndex + 1) % 100
        newOrders[currentIndex] = 1
        set({ orders: newOrders, index: nextIndex, filledOnce: get().filledOnce || nextIndex === 0, })
      },

      declineOrder: () => {
        const newOrders = [...get().orders]
        const currentIndex = get().index % 100
        const nextIndex = (currentIndex + 1) % 100
        newOrders[currentIndex] = 0
        set({ orders: newOrders, index: nextIndex, filledOnce: get().filledOnce || nextIndex === 0, })
      },

      getAcceptanceRate: () => {
        const total = get().orders.reduce((a, b) => a + b, 0);
        return total / 100;
      },

      getTodaysRate: (startIndex: number, endIndex: number) => {
        const state = get();
        //const today = new Date().toString().split("T")[0];
        let total = 0;
        for(let i = startIndex; i < endIndex; i++){
          total = total + state.orders[i];
        }
        //const total = get().orders.map(order => order[] += );
        /*const total = state.dailies.map(entry =>
          entry.date === today ?  state.index - 1 - entry.start : entry);*/
        const rate = parseFloat((total / (state.index - startIndex) * 100).toFixed(1));
        return rate;
      },
      
      getTotalOrders: () => get().orders.reduce((a, b) => a + b, 0),

      startNewDay: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        const alreadyExists = state.dailies.some(entry => entry.date === today);
        if (!alreadyExists) {
          const newEntry: DailyEntry = { date: today, start: state.index };
          const updated = [...state.dailies, newEntry].slice(-28); // cap at 28 entries
          set({ dailies: updated });
        }
      },

      endDay: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        const updated = state.dailies.map(entry =>
          entry.date === today ? { ...entry, end: state.index - 1, rate: get().getTodaysRate(Number(entry.start), state.index - 1)} : entry
        );
        set({ dailies: updated });
      },
    }),
    {
      name: 'order-storage',
    }
  )
)

// Automatically start a new day on app load
useOrderStore.getState().startNewDay();
