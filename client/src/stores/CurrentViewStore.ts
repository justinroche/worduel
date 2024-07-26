import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrentViewStore = defineStore('currentView', () => {
  const currentView = ref('home')
  const loading = ref(false)

  const setCurrentView = (newCurrentView: string) => {
    currentView.value = newCurrentView
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  return {
    currentView,
    loading,
    setCurrentView,
    setLoading,
  }
})
