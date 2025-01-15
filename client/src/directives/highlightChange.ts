export const highlightChange = {
  beforeMount(el: HTMLElement) {
    let previousText = el.textContent || ""

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData" || mutation.type === "childList") {
          const currentText = el.textContent || ""
          if (previousText !== currentText) {
            previousText = currentText
            el.classList.add("highlight")

            setTimeout(() => {
              el.classList.remove("highlight")
            }, 2000)
          }
        }
      })
    })

    observer.observe(el, {
      characterData: true,
      childList: true,
      subtree: true
    })

    // Store the observer on the element for cleanup
    ;(el as any)._observer = observer
  },

  unmounted(el: HTMLElement) {
    // Cleanup the observer when the directive is unmounted
    if ((el as any)._observer) {
      ;(el as any)._observer.disconnect()
    }
  }
}
