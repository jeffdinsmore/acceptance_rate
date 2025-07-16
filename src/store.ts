// src/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OrderStore {
  orders: number[]
  index: number
  filledOnce: boolean
  submitOrder: () => void
  declineOrder: () => void
  getAcceptanceRate: () => number
  getTotalOrders: () => number
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: Array(100).fill(0),
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
        const total = get().orders.reduce((a, b) => a + b, 0)
        console.log("ORders", get().orders);
        return total / 100
      },

      getTotalOrders: () => get().orders.reduce((a, b) => a + b, 0),
    }),
    {
      name: 'order-storage',
    }
  )
)
