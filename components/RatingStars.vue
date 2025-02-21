<template>
  <div class="rating-stars flex flex-col justify-center items-center mb-10">
    <p class="text-14">{{ `${total} ${$t('vote')}` }}</p>
    <div class="stars flex items-center">
      <span
        v-for="(star, index) of stars"
        :key="index"
        class="star cursor-pointer"
        :class="{ active: index <= activeIndex || index <= clickedIndex }"
        @mouseover="onHover(index)"
        @mouseleave="onLeave"
        @click="onClick(index)"
      >
        {{ star }}
      </span>
      <p class="text-18 font-medium ml-10">{{ average.toFixed(1) }}</p>
    </div>
    <Spinner v-if="loading" class="mt-10" />
    <p
      v-if="status"
      class="text-16 mt-10"
      :class="{
        'text-primary': status === 'voteSuccess',
        'text-red': status !== 'voteSuccess',
      }"
    >
      {{ $t(status) }}
    </p>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'

export default {
  components: {
    Spinner,
  },
  props: {
    total: {
      type: Number,
      required: true,
    },
    average: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeIndex: -1,
      clickedIndex: -1,
    }
  },
  computed: {
    stars() {
      return Array(5).fill('★')
    },
  },
  methods: {
    onHover(index) {
      if (this.clickedIndex !== -1) return
      this.activeIndex = index
    },
    onLeave() {
      if (this.clickedIndex !== -1) return
      this.activeIndex = -1
    },
    onClick(index) {
      if (this.clickedIndex !== -1) return
      this.clickedIndex = index
      this.$emit('click', index + 1)
    },
  },
}
</script>

<style scoped>
.stars {
  .star {
    font-size: 25px;
    color: #ebeef2;
    &.active {
      color: #ffd34f;
    }
  }
}
</style>
