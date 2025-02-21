<template>
  <div class="collapsible-boxes md:grid md:grid-cols-2">
    <CollapsibleBox
      v-for="(item, i) in items"
      :key="`item-${i}`"
      :title="item.title"
      :background-image="item.backgroundImage"
      :open-label="item.openLabel"
      :close-label="item.closeLabel"
      :items="item.items"
      :is-open="state[`box-${i}`]"
      :is-odd="i % 2 !== 0"
      @toggle="toggle(i)"
    />
  </div>
</template>
<script>
import CollapsibleBox from '@/components/CollapsibleBox'

export default {
  components: {
    CollapsibleBox,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    const state = {}
    for (let i = 0; i < this.items.length; i++) {
      state[`box-${i}`] = false
    }
    return {
      state,
      previousWindowWidth: undefined,
    }
  },
  mounted() {
    window.addEventListener('resize', this.closeOnScreenChange)
    // const vm = this
    // this.$root.$on('collapsibleHeroToggled', () => {
    //   vm.toggle(-1)
    // })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.closeOnScreenChange)
  },
  methods: {
    toggle(i) {
      this.state[`box-${i}`] = !this.state[`box-${i}`]
      if (window.matchMedia('(min-width: 640px)').matches) {
        if (i % 2 === 0) this.state[`box-${i + 1}`] = false
        else this.state[`box-${i - 1}`] = false
      }
      // if (this.state[`box-${i}`]) this.state[`box-${i}`] = false
      // else {
      //   for (const box in this.state) {
      //     this.state[box] = box === `box-${i}`
      //   }
      // }
    },
    closeOnScreenChange(e) {
      if (!this.previousWindowWidth) {
        this.previousWindowWidth = e.currentTarget.innerWidth
      } else if (this.previousWindowWidth !== e.currentTarget.innerWidth) {
        for (const box in this.state) {
          this.state[box] = false
        }
      }
    },
  },
}
</script>
