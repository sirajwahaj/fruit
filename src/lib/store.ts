import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item, qty = 1) => {
                const existing = get().items.find((i) => i.id === item.id);
                if (existing) {
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) }
                                : i
                        ),
                    }));
                } else {
                    set((state) => ({ items: [...state.items, { ...item, quantity: Math.min(qty, item.stock) }] }));
                }
            },
            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            total: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        { name: "luxe-cart" }
    )
);

interface WishlistStore {
    items: string[];
    toggle: (id: string) => void;
    has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggle: (id) =>
                set((state) => ({
                    items: state.items.includes(id)
                        ? state.items.filter((i) => i !== id)
                        : [...state.items, id],
                })),
            has: (id) => get().items.includes(id),
        }),
        { name: "luxe-wishlist" }
    )
);
