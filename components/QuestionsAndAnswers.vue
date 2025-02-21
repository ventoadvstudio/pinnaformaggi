<template>
  <div id="question-and-answers" class="questions-and-answers container pt-40">
    <h2
      class="uppercase font-medium text-24 font-title text-primary text-center"
    >
      {{ title }}
    </h2>
    <div class="items mt-20">
      <div
        v-for="(item, index) of items"
        :key="index.toString()"
        class="item border-t border-solid border-gray-50"
        :class="{ 'item--opened': opened[index] === true }"
      >
        <div
          class="flex justify-between py-10 items-center cursor-pointer"
          @click="onClick(index)"
        >
          <div class="text-gray-500 text-16">{{ item.question }}</div>
          <ChevronDown class="icon w-10 h-6" />
        </div>
        <div class="answer">
          <div
            class="pb-20 pt-10 markdown"
            v-html="$sanitize(item.answer)"
          ></div>
        </div>
      </div>
    </div>
    <script type="application/ld+json" v-html="jsonld" />
  </div>
</template>
<script>
import ChevronDown from '@/assets/icons/chevron-down.svg?inline'
export default {
  components: {
    ChevronDown,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      opened: this.items.map(() => false),
    }
  },
  computed: {
    jsonld() {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: this.items.map((el) => ({
          '@type': 'Question',
          name: el.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: this.$md.render(el.answer).replace('\n', ''),
          },
        })),
      }
    },
  },
  methods: {
    onClick(index) {
      this.$set(this.opened, index, !this.opened[index])
    },
  },
}
</script>
<style>
.questions-and-answers {
  .items {
    .item {
      .answer {
        max-height: 0;
        overflow: hidden;
        transition: opacity 300ms, visibility 300ms, max-height 0.5s 300ms;
        opacity: 0;
        visibility: hidden;
      }
      .icon {
        transition: transform 0.3s ease-in;
      }
      &--opened {
        .answer {
          transition: opacity 300ms 500ms, visibility 300ms 500ms, max-height 1s;
          max-height: 1000px;
          opacity: 1;
          visibility: visible;
        }
        .icon {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
