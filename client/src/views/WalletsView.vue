<template>
  <div class="fade">
    <h2 class="balance">Balance: xx sats</h2>
    <WalletRoot v-for="(wallet, index) in allWallets" :key="index" :wallet />
  </div>
</template>

<script lang="ts">
import { defineComponent, type Ref, ref } from "vue"
import WalletRoot from "../components/wallet/WalletRoot.vue"

export default defineComponent({
  components: {
    WalletRoot
  },
  setup() {
    const allWallets: Ref<Object[]> = ref([{}, {}])

    return {
      allWallets
    }
  }
})
</script>

<style scoped lang="css">
.balance {
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}
</style>
