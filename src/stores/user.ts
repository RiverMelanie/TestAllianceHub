import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  
  let userName = ref("")
  

  return {userName}

  
})