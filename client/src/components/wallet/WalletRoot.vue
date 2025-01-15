<template>
  <div class="container">
    <p>Balance: xx sats</p>
    <hr />
    <div class="tables">
      <button @click="() => (showTxTable = !showTxTable)" class="ion-button">
        <ion-icon v-if="!showTxTable" name="chevron-forward" />
        <ion-icon v-else name="chevron-down" />
        &nbsp;Transactions: 3
      </button>
    </div>
    <TxTable v-if="showTxTable" />
    <hr />
    <div class="tables">
      <button @click="() => (showUTXOTable = !showUTXOTable)" class="ion-button">
        <ion-icon v-if="!showUTXOTable" name="chevron-forward" />
        <ion-icon v-else name="chevron-down" />
        &nbsp;UTXOs: 5
      </button>
    </div>
    <UTXOTable v-if="showUTXOTable" />
  </div>
</template>

<script lang="ts">
import { defineComponent, type Ref, ref } from 'vue'
import TxTable from '../shared/TxTable.vue'
import UTXOTable from '../shared/UTXOTable.vue'
export default defineComponent({
  components: {
    TxTable,
    UTXOTable
  },
  setup() {
    const showTxTable: Ref<boolean> = ref(false)
    const showUTXOTable: Ref<boolean> = ref(false)

    return {
      showTxTable,
      showUTXOTable
    }
  }
})
</script>

<style scoped lang="css">
div {
  margin: 1rem 0;
}
hr {
  margin: 0.8rem 0;
}
.tables {
  display: flex;
  align-items: center;
}
.ion-button {
  font-size: 1.4rem;
  color: #060e06;
}
</style>
