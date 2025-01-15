<template>
  <table>
    <tr>
      <th>Date</th>
      <th>Output</th>
      <th>Address</th>
      <th>Notes</th>
      <th>Value</th>
    </tr>
    <tr v-for="(row, index) in dummyRows" :key="index">
      <td>{{ row.date }}</td>
      <td>{{ row.output }}</td>
      <td>{{ row.address }}</td>
      <td>{{ row.notes }}</td>
      <td>{{ row.value }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const dummyRows = [
  {
    date: new Date(Date.now()).toLocaleString(),
    output: 100,
    address: 'address111',
    notes: 'this notes will require BE support',
    value: 100
  },
  {
    date: new Date(Date.now() - 100000000000).toLocaleString(),
    output: 100,
    address: 'address222',
    notes: 'this notes too',
    value: 100
  },
  {
    date: new Date(Date.now() - 80000000000).toLocaleString(),
    output: 100,
    address: 'address333',
    notes: 'and these as well',
    value: 100
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
