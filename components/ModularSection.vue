<template>
  <section class="modular-section">
    <div class="modular-section__content">
      <div
        v-for="(item, i) in items"
        :key="`row-${i}`"
        class="modular-section__row relative"
      >
        <div
          v-if="item._modelApiKey === 'modular_section' && i === 0 && title(i)"
          class="lg:hidden mt-50 mb-35 md:mb-0 px-20"
        >
          <h2
            class="font-heading leading-none text-46 md:text-50 text-center"
            :class="{
              'text-primary': item.theme.toLowerCase() === 'primary',
              'text-cocoa-500': item.theme.toLowerCase() === 'brown',
            }"
            v-html="title(i)"
          ></h2>
        </div>
        <div
          v-if="item._modelApiKey === 'modular_section'"
          class="flex flex-col-reverse md:flex-col"
        >
          <div
            class="modular-section__entries-container container lg:px-0 lg:grid lg:grid-cols-12 lg:gap-x-30"
          >
            <div
              class="modular-section__entries lg:col-span-5 lg:flex lg:justify-center lg:items-center pt-35 pb-12 lg:py-48"
              :class="{
                'lg:col-start-8': item.inverted,
                'lg:col-start-1': !item.inverted,
              }"
            >
              <div>
                <template v-for="(entry, n) in item.content">
                  <h2
                    v-if="entry._modelApiKey === 'title'"
                    :key="`item-${i}-content-${n}`"
                    class="modular-section__title markdown font-heading leading-none text-46 md:text-50 text-center mb-35 md:mb-45"
                    :class="{
                      'text-primary': item.theme.toLowerCase() === 'primary',
                      'text-cocoa-500': item.theme.toLowerCase() === 'brown',
                      'hidden lg:block': i === 0 && n === 0,
                    }"
                    v-html="sanitizeTitle(entry.content)"
                  ></h2>
                  <div
                    v-else-if="entry._modelApiKey === 'paragraph'"
                    :key="`item-${i}-content-${n}`"
                    class="modular-section__paragraph mb-32"
                  >
                    <h3
                      v-if="entry.title"
                      class="modular-section__paragraph-title font-bold uppercase mb-8"
                      :class="{
                        'text-primary': item.theme.toLowerCase() === 'primary',
                        'text-cocoa-500': item.theme.toLowerCase() === 'brown',
                      }"
                    >
                      {{ entry.title }}
                    </h3>
                    <p class="modular-section__paragraph-content text-gray-500">
                      {{ entry.content }}
                    </p>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div
            class="modular-section__images lg:absolute lg:top-0 lg:bottom-0 flex flex-col overflow-hidden"
            :class="{
              'lg:left-half lg:right-0': !item.inverted,
              'lg:left-0 lg:right-half': item.inverted,
            }"
          >
            <div
              v-for="(image, n) in item.images"
              :key="`image-${n}`"
              class="modular-section__image-container flex-1"
              :class="{
                'modular-section__image-container--half':
                  item.images.length === 2,
                'hidden md:block': n === 1,
              }"
            >
              <img
                :src="image.url"
                :alt="image.alt"
                class="modular-section__image w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <Timeline
          v-else-if="item._modelApiKey === 'timeline'"
          :title="item.title"
          :items="item.items"
        />
      </div>
    </div>
  </section>
</template>
<script>
import Timeline from '@/components/Timeline'
export default {
  components: {
    Timeline,
  },
  props: {
    items: {
      type: Array,
      required: true,
      validator: (arr) =>
        arr.filter((el) => typeof el._modelApiKey === 'string').length ===
        arr.length,
    },
  },
  methods: {
    title(i) {
      const item = this.items[i]
      const title = item.content.find((el) => el._modelApiKey === 'title')
      return title ? this.sanitizeTitle(title.content) : false
    },
    sanitizeTitle(string) {
      const str = string.replace(/(?:\r\n|\r|\n)/g, '<br>')
      return this.$sanitize(str, {
        allowedTags: ['br'],
        allowedAttributes: {},
      })
    },
  },
}
</script>
<style>
.modular-section {
  &__entries {
    @screen lg {
      min-height: 50vw;
    }
    @media only screen and (min-width: 1920px) {
      min-height: 960px;
    }
  }
  &__images {
    background-color: #f1eeec;
  }
  &__image-container {
    &--half {
      height: 50%;
    }
  }
  .font-heading {
    @media screen and (max-width: 640px) {
      letter-spacing: -2px;
    }
    @media screen and (max-width: 414px) {
      font-size: 44px;
    }
    @media screen and (max-width: 380px) {
      font-size: 34px;
    }
  }
}
</style>
