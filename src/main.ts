
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import EmelentPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//导入 echarts 工具和echarts
import Echarts from 'vue-echarts'
import 'echarts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//全局组件
app.component("Echarts",Echarts) 
app.use(createPinia())
app.use(router)
app.use(EmelentPlus)
app.mount('#app')
