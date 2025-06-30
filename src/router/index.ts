import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: ()=>import('../views/Login.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: ()=>import('../views/Home.vue'),
      children:[
        {
          path: '/UserManagement',
          name: 'UserManagement',
          component: ()=>import('../views/UserManagement.vue'),
        },
        {
          path: '/IndustryDynamicsManagement',
          name: 'IndustryDynamicsManagement',
          component: ()=>import('../views/IndustryDynamicsManagement.vue'),
        },
        {
          path: '/CourseManagement',
          name: 'CourseManagement',
          component: ()=>import('../views/CourseManagement.vue'),
        },
        {
          path: '/MeetingManagement',
          name: 'MeetingManagement',
          component: ()=>import('../views/MeetingManagement.vue'),
        },
      ]
    },
    {
      path: '/Managerhome',
      name: 'Managerhome',
      component: ()=>import('../views/ManagerHome.vue'),
      children:[
        {
          path: '/ManagerUserManagement',
          name: 'ManagerUserManagement',
          component: ()=>import('../views/ManagerUserManagement.vue'),
        },
        {
          path: '/ManagerIndustryDynamicsManagement',
          name: 'ManagerIndustryDynamicsManagement',
          component: ()=>import('../views/ManagerIndustryDynamicsManagement.vue'),
        },
        {
              path: '/ManagerReviewDynamics',
              name: 'ManagerReviewDynamics',
              component: ()=>import('../views/ManagerReviewDynamicsManagement.vue'),
        },
        {
          path: '/ManagerCourseManagement',
          name: 'ManagerCourseManagement',
          component: ()=>import('../views/ManagerCourseManagement.vue'),
        },
        {
          path: '/ManagerMeetingManagement',
          name: 'ManagerMeetingManagement',
          component: ()=>import('../views/ManagerMeetingManagement.vue'),
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
