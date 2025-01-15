<template>
  <table>
    <tr>
      <th>Date</th>
      <th>Value</th>
      <th>Balance</th>
      <th>Notes</th>
    </tr>
    <tr v-for="(row, index) in dummyRows" :key="index">
      <td>{{ row.date }}</td>
      <td>{{ row.value }}</td>
      <td>{{ row.balance }}</td>
      <td>{{ row.notes }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const dummyRows = [
  {
    date: new Date(Date.now()).toLocaleString(),
    value: 100,
    balance: 250,
    notes: 'this notes will require BE support'
  },
  {
    date: new Date(Date.now() - 100000000000).toLocaleString(),
    value: 100,
    balance: 150,
    notes: 'these as well'
  },
  {
    date: new Date(Date.now() - 80000000000).toLocaleString(),
    value: 50,
    balance: 50,
    notes: 'these too'
  }
]
export default defineComponent({
  setup() {
    return {
      dummyRows
    }
  }
})
</script>

<style scoped lang="css">
table {
  width: 100%;
  border-collapse: collapse;
}
table,
tr {
  border: 1px solid black;
}
th {
  text-align: left;
  background-color: aquamarine;
  font-weight: 800;
}
</style>
