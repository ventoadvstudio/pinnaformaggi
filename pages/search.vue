<template>
  <div class="search-results">
    <div
      class="search-results__header pt-100 md:pt-160 bg-orange pb-50 md:pb-90 overflow-hidden z-2 relative"
    >
      <div class="container flex justify-center items-center text-center">
        <div class="relative flex flex-col items-center z-2">
          <h1 class="font-title font-medium text-32 text-white uppercase">
            Risultato della ricerca
          </h1>
          <span class="text-white uppercase mt-16"
            >{{ totalResults }} Risultati</span
          >
        </div>
      </div>
      <div class="bg-radial bg-radial--top"></div>
    </div>
    <div class="search-results__body md:mt-50 mt-30 md:mb-90 mb-40 container">
      <div class="grid gap-30 grid-cols-12">
        <div class="lg:col-span-8 lg:col-start-3 col-span-12">
          <form
            class="search-results__form flex items-center justify-between overflow-hidden"
            @submit.prevent="handleSubmit"
          >
            <input
              v-model="query"
              type="text"
              name="search"
              class="outline-none focus:outline-none text-primary mx-20 relative z-2"
              required
            />
            <button
              type="submit"
              class="bg-primary text-14 py-10 md:py-14 rounded-r-none outline-none text-cream uppercase font-semibold focus:outline-none relative z-2"
            >
              <span class="hidden md:block">Cerca ancora</span>
              <SearchIcon class="md:hidden w-20 h-20 mx-auto" />
            </button>
          </form>
          <div class="search-results__list mt-40 md:mt-60">
            <div
              v-for="(entry, index) of entries"
              :key="entry.title + index"
              class="search-results__list__item md:mb-40 mb-25 cursor-pointer"
              @click="onClick(entry.url)"
            >
            <div>
              <img
                v-if="entry.image"
                :src="entry.image"
                alt="Search Result Image"
                class="w-full h-200 object-cover rounded-lg mb-10"
              />
              <div
                v-else
                class="w-full h-200 bg-gray-200 rounded-lg mb-10"
              ></div>
            </div>
              <p class="text-20 font-semibold mb-6 text-primary">
                {{ entry.title }}
              </p>
              <div
                class="text-12 md:text-14 text-gray-300 truncate"
                v-html="entry.body"
              ></div>
              <span class="text-12 md:text-14 text-gray-300">
                {{ entry.url }}
              </span>
            </div>
            <Spinner v-if="loading" />
            <infinite-loading
              v-if="entries.length > 0"
              ref="infiniteLoading"
              @infinite="loadMore"
            ></infinite-loading>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchIcon from '@/assets/icons/search-cream.svg?inline'
import BasePage from '@/components/BasePage'
import Spinner from '@/components/Spinner'

export default {
  components: {
    SearchIcon,
    Spinner,
  },
  extends: BasePage,
  data() {
    return {
      query: '',
      title: 'Ricerca',
      page: 0,
      limit: 10,
      entries: [],
      loading: false,
      totalResults: 0,
      client: null,
    }
  },
  mounted() {
    this.client = new window.DatoCmsSearch(
      process.env.NUXT_ENV_CMS_DATOCMS_API_TOKEN,
      'production'
    )
    if (this.$route.query.query) {
      this.query = this.$route.query.query
      this.entries = []
      this.page = 0
      this.performSearch()
    }
  },
  methods: {
    handleSubmit() {
      this.entries = []
      this.page = 0
      this.performSearch()
    },
    async loadMore($state) {
      this.page++
      await this.performSearch()
      $state.loaded()
      if (this.entries.length === this.totalResults) {
        $state.complete()
      }
    },
    async performSearch() {
      if (this.query.length < 3) return
      if (!this.client) {
        console.warn('Client DatoCMS Null')
      }
      this.loading = true

      try {
        const { results, total } = await this.client.search(this.query, {
          offset: this.page * this.limit,
          limit: this.limit,
          locale: this.$i18n.locale,
        })
        this.entries.push(
          ...results.map((el) => ({
            title: el.raw.title,
            body: el.raw.body,
            url: el.url,
            image:el.raw.image ? el.raw.image.url : null,
          }))
        )
        this.totalResults = total
      } catch (e) {
        console.warn('Error on request DatoCMS', e)
      } finally {
        this.loading = false
      }
    },
    onClick(url) {
      window.open(url, '_blank')
    },
  },
  nuxtI18n: {
    paths: {
      it: '/ricerca/',
      en: '/search/',
    },
  },
}
</script>
<style>
.search-results {
  .bg-radial {
    position: absolute;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
    background: radial-gradient(
      circle,
      theme('colors.orange.100') 0%,
      theme('colors.orange.100') 22%,
      theme('colors.orange.default') 70%
    );
    &--top {
      top: 15%;
      width: 300px;
      height: 300px;
      @screen sm {
        top: 27%;
      }
    }
  }
  .infinite-loading-container .infinite-status-prompt .loading-default {
    display: none;
  }
  &__form {
    position: relative;
    border-radius: 4px;
    @screen md {
      border-radius: 6px;
    }
    &::before {
      content: '';
      border-radius: 4px;
      @screen md {
        border-radius: 6px;
      }
      @apply absolute inset-0 w-full h-full border border-primary;
    }
    input {
      width: calc(100% - 70px);
      @screen md {
        width: 75%;
      }
    }
    button {
      width: 70px;
      border-radius: 4px;
      @screen md {
        width: 25%;
        border-radius: 6px;
      }
    }
  }
}
</style>
