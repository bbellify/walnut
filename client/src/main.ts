import "./assets/main.css"

import { createApp } from "vue"
import Walnut from "./Walnut.vue"
import router from "./config/router"

import { highlightChange } from "./directives/highlightChange"

const app = createApp(Walnut)
app.directive("highlight-change", highlightChange)

app.use(router)

app.mount("#app")
