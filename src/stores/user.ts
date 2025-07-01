
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  
  let userName = ref("")

  const userId = ref(0)
  const userInfo = ref<any>(null) // 或者定义具体的用户接口类型
  
  function setUserInfo(info: any) {
    userInfo.value = info
    userId.value = info.user_id
    userName.value = info.username
  }
  
  function clearUser() {
    userName.value = ''
    userId.value = 0
    userInfo.value = null
  }
  
  return { userName, userId, userInfo, setUserInfo, clearUser }


})