<template>
  <div class="fade">
    <section>
      <h2 class="subtitle">Wallet</h2>
      <p>Setting 1</p>
      <p>Setting 2</p>
      <p>Setting 3</p>
    </section>
    <section>
      <h2 class="subtitle">Explorer</h2>
      <p>Setting 1</p>
      <p>Setting 2</p>
      <p>Setting 3</p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, type Ref, ref } from "vue"

export default defineComponent({
  setup() {
    const blockCount: Ref<number | undefined> = ref(undefined)

    return {
      blockCount
    }
  }
})
</script>

<style scoped lang="css">
/* should this go into main.css? */
.subtitle {
  font-size: 2rem;
}
</style>
