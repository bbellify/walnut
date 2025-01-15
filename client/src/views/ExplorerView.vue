<template>
  <div class="fade">
    <h2>Block count: {{ blockCount }}</h2>
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

<style scoped lang="css"></style>
