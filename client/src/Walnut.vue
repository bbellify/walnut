<template>
  <div v-if="showLanding" class="landing center">
    <WalnutSvg :size="WalnutSvgSizes.Large" :strokeWidth="'8'" />
  </div>
  <div v-else>
    <div class="title-and-nav">
      <h1>{{ title }}</h1>
      <DesktopNav />
    </div>
    <RouterView />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, type Ref } from "vue"
import { RouterView, useRoute } from "vue-router"
import WalnutSvg, { WalnutSvgSizes } from "./components/shared/WalnutSvg.vue"
import DesktopNav from "./components/nav/DesktopNav.vue"
import Case from "case"

export default defineComponent({
  components: {
    RouterView,
    WalnutSvg,
    DesktopNav
  },
  setup() {
    const route = useRoute()
    const title = computed(() => Case.capital(route.path.slice(1)))
    const showLanding: Ref<boolean> = ref(true)

    onMounted(() => {
      setTimeout(() => {
        showLanding.value = false
      }, 2000)
    })

    return {
      title,
      showLanding,
      WalnutSvgSizes
    }
  }
})
</script>

<style scoped lang="css"></style>
