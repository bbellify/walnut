<template>
  <nav @mouseleave="handleHover" @mouseenter="handleHover">
    <div v-if="showNav" class="link-container">
      <RouterLink
        v-for="(link, index) in navLinks"
        :key="index"
        class="link"
        :class="{ active: useRoute().path === link.path }"
        :to="link.path"
        >{{ link.name }}</RouterLink
      >
    </div>
    <WalnutSvg :size="WalnutSvgSizes.Nav" :strokeWidth="'10'" />
  </nav>
</template>

<script lang="ts">
import { defineComponent, type Ref, ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import WalnutSvg, { WalnutSvgSizes } from "../shared/WalnutSvg.vue"

export const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Explorer", path: "/explorer" },
  { name: "Wallet", path: "/wallet" },
  { name: "Settings", path: "/settings" }
]

export default defineComponent({
  components: {
    RouterLink,
    WalnutSvg
  },

  setup() {
    const showNav: Ref<boolean> = ref(false)
    function handleHover() {
      showNav.value = !showNav.value
    }

    return {
      showNav,
      navLinks,
      useRoute,
      handleHover,
      WalnutSvgSizes
    }
  }
})
</script>

<style scoped lang="css">
nav {
  display: flex;
  align-items: center;
}

.link-container {
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  padding-right: 2rem;
}

.link {
  padding: 0.5rem 1rem;
  color: var(--text-white);

  &:hover,
  &.active {
    font-weight: bold;
  }
}
</style>
