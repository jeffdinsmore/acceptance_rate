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
  isAlreadyStarted: () => boolean;
  submitOrder: () => void;
  declineOrder: () => void;
  getAcceptanceRate: () => number;
  getTotalOrders: () => number;
  startNewDay: () => void;
  updateRate: () => void;
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
        if(!get().isAlreadyStarted()) {
          get().startNewDay();
          console.log("Today has been set");
        }
        /*const daily = get().dailies.slice(0,1);
        console.log("daily", daily);
        set({ dailies: daily });*/
        const newOrders = [...get().orders]
        const currentIndex = get().index % 100
        const nextIndex = (currentIndex + 1) % 100
        newOrders[currentIndex] = 1
        set({ orders: newOrders, index: nextIndex, filledOnce: get().filledOnce || nextIndex === 0, })
        get().updateRate();
      },

      declineOrder: () => {

        if (!get().isAlreadyStarted()) {
          get().startNewDay(); // only trigger on first action of the day
          console.log("Today has been set");
        }

        const newOrders = [...get().orders]
        const currentIndex = get().index % 100
        const nextIndex = (currentIndex + 1) % 100
        newOrders[currentIndex] = 0
        set({ orders: newOrders, index: nextIndex, filledOnce: get().filledOnce || nextIndex === 0, })
        get().updateRate();
      },

      getAcceptanceRate: () => {
        const total = get().orders.reduce((a, b) => a + b, 0);
        return total / 100;
      },

      getTodaysRate: (startIndex: number, endIndex: number) => {
        const state = get();

        let total = 0;
        for(let i = startIndex; i < endIndex; i++){
          total = total + state.orders[i];
        }

        const rate = (endIndex - startIndex) !== 0 ? parseFloat((total / (endIndex - startIndex) * 100).toFixed(1)) : 0;
        return rate;
      },
      
      getTotalOrders: () => get().orders.reduce((a, b) => a + b, 0),

      startNewDay: () => {
        const state = get();
        const today = new Date().toLocaleDateString('en-CA').split("T")[0];

        const alreadyExists = state.dailies.some(entry => entry.date === today);
        if (!alreadyExists) {
          const newEntry: DailyEntry = { date: today, start: state.index };
          const updated = [...state.dailies, newEntry].slice(-28); // cap at 28 entries
          set({ dailies: updated });
        }
      },

      isAlreadyStarted: () => {
        const state = get();
        const today = new Date().toLocaleDateString('en-CA');
        const alreadyStarted = state.dailies.some(entry => entry.date === today);
        return alreadyStarted;
      },

      updateRate: () => {
        const state = get();
        const today = new Date().toLocaleDateString('en-CA').split("T")[0];

        const updated = state.dailies.map(entry =>
          entry.date === today ? { ...entry, rate: get().getTodaysRate(Number(entry.start), state.index - 1)} : entry
        );
        set({ dailies: updated });
      },

      endDay: () => {
        const state = get();
        const today = new Date().toLocaleDateString('en-CA').split("T")[0];

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

