<template>
  <section :class="{ columns: !$props.tableData }">
    <div class="title">
      <h1>{{ $props.name }}</h1>
      <button v-if="$props.url" @click="handleRefresh($props.url)" :class="{ refresh: refresh }">
        <ion-icon name="refresh" />
      </button>
    </div>
    <div v-if="$props.data" class="data">
      <div v-for="(row, index) in Object.entries($props.data)" :key="index">
        <span>{{ Case.upper(row[0]) }}</span>
        <span v-highlight-change>{{ row[1] }}</span>
      </div>
    </div>

    <table v-else-if="$props.tableData">
      <thead>
        <tr>
          <td v-for="(header, index) in headers" :key="index">
            {{ Case.upper(header) }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in $props.tableData.slice(0, -4)" :key="index">
          <td v-for="(entry, index) in Object.entries(row)" :key="index">
            {{ entry[1] }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, type Ref } from "vue"
import Case from "case"
import dashboardApi, { DASHBOARD } from "../../api/dashboard.api"
import { state } from "../../model/state"

export type DashboardSectionData = {}
export type DashboardSectionTableData = {}[]

export default defineComponent({
  props: {
    name: { type: String, required: true },
    url: { type: String, required: false },
    data: { type: {} as PropType<DashboardSectionData>, required: false },
    tableData: { type: Array as PropType<DashboardSectionTableData>, required: false }
  },
  setup(props) {
    const refresh: Ref<boolean> = ref(false)

    function handleRefresh(url: string) {
      refresh.value = true
      setTimeout(() => {
        refresh.value = false
      }, 500)

      dashboardApi.value.get(DASHBOARD + url).then((res) => {
        if (res.status === 200) {
          state.updateDashboard(res)
        } else {
          // need a little jiggle animation for failed request
          // need a catch here?
          console.log(`${res.type} request failed, error: ${res?.errors}`)
        }
      })
    }
    return {
      Case,
      refresh,
      handleRefresh,
      headers: ref(props.tableData ? Object.keys(props.tableData[0]) : undefined)
    }
  }
})
</script>

<style scoped lang="css">
section {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
  margin: 0 1rem 2rem 0;
  font-size: 1.4rem;
  background-color: var(--section-gray);
  color: var(--text-gray);
  /* height: fit-content; */

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--section-border-green) !important;
    padding: 1rem;

    h1 {
      font-weight: 600;
      letter-spacing: 0.7rem;
      font-size: 1.9rem;
      color: var(--text-white);
    }

    button {
      padding: 0;
      margin: 0;
      display: flex;

      &:hover {
        background-color: transparent;
      }
    }
    ion-icon {
      padding: 0;
      margin: 0;
      font-size: 1.4rem;
      color: var(--text-white);
    }
  }

  /* all elements inside section need padding so borders work right*/
  div {
    padding: 0.5rem;
  }

  &.columns {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    min-width: fit-content;
    max-width: 50rem;

    div > div {
      display: flex;
      justify-content: space-between;
      letter-spacing: 0.2rem;

      > span:first-child {
        font-weight: 100;
      }

      > span:last-child {
        margin-left: 9rem;
        font-weight: 800;
      }
    }
  }

  div:not(:last-child) {
    border-bottom: 1px solid var(--section-border-gray);
  }

  table {
    border-collapse: collapse;
  }

  thead {
    border-bottom: 2px solid var(--section-border-gray);
  }
  tr {
    border-top: 1px solid var(--section-border-gray);
    border-bottom: 1px solid var(--section-border-gray);
    &:last-child {
      border-bottom: none;
    }
    &:first-child {
      border-top: none;
    }
  }
  td {
    letter-spacing: 0.1rem;
    border-collapse: collapse;
    padding: 1rem 3rem;
    text-align: center;
    font-weight: 100;
  }
  td:first-child {
    padding-left: 1rem;
  }
  td:last-child {
    padding-right: 1rem;
  }

  /* still not sure if I want every other table row formatting */
  /* tbody tr:nth-child(odd) {
    background-color: #2a2a2a;
  } */

  thead > tr > td {
    font-weight: 800;
    letter-spacing: 0.2rem;
  }
}

.refresh {
  animation: rotateOnce 500ms linear forwards;
}

@keyframes rotateOnce {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.highlight {
  color: var(--text-update-green);
  transition: color 0.5s;
}
</style>
