import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialUser = {
  name: '',
  username: '',
  email: '',
  mobile: '',
};

export const useStore = create(
  persist(
    (set, get) => ({
      user: initialUser,
      categories: [],
      notes: '',
      notesUpdatedAt: null,
      isRegistered: false,
      isAuthenticated: false,
      weatherCity: 'London',
      toasts: [],
      toastSeq: 0,

      setUser: (userData) => set({ user: userData, isRegistered: true }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setCategories: (categoryArray) => set({ categories: categoryArray }),
      setNotes: (noteText) => set({ notes: noteText, notesUpdatedAt: Date.now() }),
      setWeatherCity: (city) => set({ weatherCity: city }),
      pushToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            {
              id: state.toastSeq + 1,
              tone: toast.tone || 'info',
              title: toast.title,
              message: toast.message,
            },
          ],
          toastSeq: state.toastSeq + 1,
        })),
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
      clearToasts: () => set({ toasts: [] }),
      logoutSession: () => set({ isAuthenticated: false, toasts: [], toastSeq: 0 }),
      resetStore: () => set({
        user: initialUser,
        categories: [],
        notes: '',
        notesUpdatedAt: null,
        isRegistered: false,
        isAuthenticated: false,
        weatherCity: 'London',
        toasts: [],
        toastSeq: 0,
      }),
      hasMinimumCategories: () => get().categories.length >= 3,
    }),
    {
      version: 2,
      migrate: (persistedState, version) => {
        if (!persistedState) {
          return persistedState;
        }

        if (version < 2) {
          return {
            ...persistedState,
            categories: [],
          };
        }

        return persistedState;
      },
      partialize: (state) => ({
        user: state.user,
        categories: state.categories,
        notes: state.notes,
        notesUpdatedAt: state.notesUpdatedAt,
        isRegistered: state.isRegistered,
        isAuthenticated: state.isAuthenticated,
        weatherCity: state.weatherCity,
      }),
    },
  ),
);