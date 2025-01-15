import { watchEffect } from "vue"
import { createWebHistory, createRouter, useRoute, type RouteLocationNormalized } from "vue-router"

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue")
    },
    { path: "/wallet", name: "wallet", component: () => import("../views/WalletsView.vue") },
    // Will need lots of explorer subroutes, like tx or block, etc
    { path: "/explorer", name: "explorer", component: () => import("../views/ExplorerView.vue") },
    { path: "/settings", name: "settings", component: () => import("../views/SettingsView.vue") },
    { path: "/uhoh", name: "uhoh", component: () => import("../views/UhOhView.vue") },
    { path: "/:catchAll(.*)", redirect: "/dashboard" }
  ]
})

router.beforeEach((to: RouteLocationNormalized) => {
  console.log(`navigating to ${to.path}`)
  // const checkPath = () => {
  //   if (to.path !== "/uhoh") {
  //     if (!initialized.value) {
  //       if (to.path !== "/setup") {
  //         router.push("/setup")
  //       }
  //       return
  //     }
  //     if (!authenticated.value) {
  //       if (to.path !== "/login") {
  //         router.push("/login")
  //       }
  //       return
  //     }
  //   }
  // }
  // checkPath()
})

export function watchParam(param: string, handler: Function): void {
  const route = useRoute()
  watchEffect(() => {
    const value = route.params[param]
    if (value !== undefined) {
      handler(value)
    }
  })
}

export default router
