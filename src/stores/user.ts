import {ref} from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('myuser', () => {
//全局变量，使用时需引用
  const username = ref("")
  const userpwd = ref("")
  return {username,userpwd}
})