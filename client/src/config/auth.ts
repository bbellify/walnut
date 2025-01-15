import { ref, type Ref } from "vue"

export const authenticated: Ref<boolean> = ref(false)
export const initialized: Ref<boolean> = ref(false)

async function getInitialized() {
  // this might still be useful, but shouldn't need to ask for set up on every app load
  // if (data) {
  //   initialized.value = data.initialized
  //   // router.push(initialized.value ? "/login" : "/setup")
  // } else if (error) {
  //   router.push("/uhoh")
  // }
}
getInitialized()
