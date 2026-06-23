import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  weightOption: string
  stock: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, weightOption: string) => void
  updateQuantity: (productId: string, weightOption: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.weightOption === item.weightOption
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.weightOption === item.weightOption
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },
      removeItem: (productId, weightOption) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.weightOption === weightOption)
          ),
        }))
      },
      updateQuantity: (productId, weightOption, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.weightOption === weightOption
              ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock) }
              : i
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    { name: 'flavours-cart' }
  )
)
