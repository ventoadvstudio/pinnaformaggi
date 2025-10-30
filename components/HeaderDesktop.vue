<template>
  <div
    class="header-desktop fixed top-0 left-0 right-0 z-100"
    :class="{
      'header-desktop--search-active': searchActive,
    }"
  >
    <div class="container relative z-100">
      <nuxt-link
        :to="localePath('/')"
        class="header-desktop__logo absolute top-0 left-0 ml-20"
      >
        <img
          src="@/assets/images/logo.svg"
          alt="Pinna"
          class="w-full"
          width="180"
          height="120"
        />
      </nuxt-link>
      <div
        class="header-desktop__content py-24 flex justify-between items-center"
      >
        <div class="header-desktop__logo-placeholder">&nbsp;</div>
        <ul class="header-desktop__menu flex items-center">
          <li
            v-for="(item, i) in items"
            :key="item.label"
            class="header-desktop__menu-entry"
            :class="{ 'mr-30': i < items.length - 1 }"
          >
            <button
              v-if="item.entries"
              class="flex items-center focus:outline-none"
              @click="toggleSection(item.label)"
            >
              <span
                class="font-title font-medium text-18 text-primary uppercase tracking-wide"
              >
                {{ item.label }}
              </span>
              <ChevronDown
                class="transition-transform duration-300 ml-6"
                :class="{
                  'transform -rotate-180': activeSection === item.label,
                }"
              ></ChevronDown>
            </button>
            <nuxt-link
              v-else
              :to="item.link"
              class="font-title font-medium text-18 text-primary uppercase tracking-wide"
            >
              {{ item.label }}
            </nuxt-link>
          </li>
        </ul>
        <div class="header-desktop__last flex items-center">
          <div
            class="header-desktop__languages flex justify-center items-center w-120"
          >
            <nuxt-link
              :to="switchLocalePath('it')"
              :class="{
                'text-primary': $i18n.locale === 'it',
                'text-gray-400': $i18n.locale !== 'it',
              }"
              class="flex-1 text-center py-8 font-bold uppercase text-primary"
            >
              IT
            </nuxt-link>
            <div class="w-2 h-30 bg-gray-100">&nbsp;</div>
            <nuxt-link
              :to="switchLocalePath('en')"
              :class="{
                'text-primary': $i18n.locale === 'en',
                'text-gray-400': $i18n.locale !== 'en',
              }"
              class="flex-1 text-center py-8 font-bold uppercase"
            >
              EN
            </nuxt-link>
          </div>
          <div class="ml-16">
            <button
              class="header-desktop__search-btn w-24 h-24 p-2 focus:outline-none"
              @click="toggleSearch"
            >
              <SearchIcon class="w-full h-full object-contain" />
            </button>
          </div>
        </div>
      </div>
      <div
        class="header-desktop__subheader relative mt-32 transition-opacity duration-300"
        :class="{
          'opacity-100 delay-300': activeSection,
          'opacity-0 pointer-events-none': !activeSection,
        }"
      >
        <template v-for="item in items">
          <div
            v-if="item.entries"
            :key="`${item.label}-entries`"
            class="header-desktop__entry absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center transition-all duration-300"
            :class="{
              'opacity-100 visible': activeSection === item.label,
              'opacity-0 invisible pointer-events-none':
                activeSection !== item.label,
            }"
          >
            <nuxt-link
              v-for="(entry, n) in item.entries"
              :key="`${item.label}-entry-${n}`"
              :to="entry.link"
              class="header-desktop__entry-item text-white"
              :class="{
                'text-center text-14 uppercase font-bold rounded border border-solid border-white px-22 py-6':
                  entry.special,
                'ml-24 xl:ml-40': n > 0,
              }"
              @click.native="
                activeSection = ''
                searchActive = false
              "
            >
              {{ entry.label }}
            </nuxt-link>
          </div>
        </template>
      </div>
    </div>
    <div
      class="header-desktop__search container absolute top-0 left-0 right-0 bg-white z-50 pt-115"
    >
      <div
        class="header-desktop__search-content"
        :class="{
          'visible opacity-100': searchActive,
          'invisible opacity-0': !searchActive,
        }"
      >
        <Search />
      </div>
    </div>
    <div
      ref="overlay"
      class="header-desktop__overlay fixed top-0 right-0 bottom-0 left-0 w-screen h-screen transition-opacity duration-300"
      :class="{
        'opacity-100 pointer-events-auto': activeSection,
        'opacity-0 pointer-events-none': !activeSection,
      }"
    >
      &nbsp;
    </div>
    <HeaderBackground class="header-desktop__background z-10" />
    <HeaderBackground
      type="secondary"
      class="header-desktop__subheader-bg transition-transform duration-300"
      :class="{
        'header-desktop__subheader-bg--hidden delay-300': !activeSection,
      }"
    />
  </div>
</template>
<script>
import Search from '@/components/Search'
import HeaderBackground from '@/components/HeaderBackground'
import ChevronDown from '@/assets/icons/chevron-down.svg?inline'
import SearchIcon from '@/assets/icons/search.svg?inline'
export default {
  components: {
    Search,
    HeaderBackground,
    ChevronDown,
    SearchIcon,
  },
  props: {
    items: {
      type: Array,
      required: true,
      validator: (arr) =>
        arr.filter(
          (el) =>
            ((Array.isArray(el.entries) && el.entries.length > 0) ||
              typeof el.link === 'string') &&
            typeof el.label === 'string'
        ).length === arr.length,
    },
  },
  data() {
    return {
      activeSection: '',
      searchActive: false,
    }
  },
  watch: {
    $route() {
      this.activeSection = ''
      this.searchActive = false
    },
  },
  mounted() {
    document.addEventListener('click', this.close)
    this.$root.$on('closeSearchMenu', () => {
      this.searchActive = false
      this.activeSection = ''
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close)
  },
  methods: {
    toggleSection(id) {
      this.searchActive = false
      if (this.activeSection === id) this.activeSection = ''
      else this.activeSection = id
    },
    toggleSearch() {
      this.activeSection = ''
      this.searchActive = !this.searchActive
    },
    close(e) {
      const vm = this
      if (
        !e.target.closest('.header-desktop') ||
        e.target === this.$refs.overlay
      ) {
        vm.activeSection = ''
        vm.searchActive = false
      }
    },
  },
}
</script>
<style>
.header-desktop {
  &__logo,
  &__logo-placeholder {
    width: 179px;
  }
  &__overlay {
    background-color: rgba(0, 0, 0, 0.2);
  }
  &__subheader-bg {
    &--hidden {
      transform: translateX(-50%) translateY(-100px);
    }
  }
  &__search,
  &__background {
    transition: transform 300ms 300ms ease-out;
  }
  &__search {
    transform: translateY(-100%);
  }
  &__search-content {
    transition: visibility 300ms, opacity 300ms;
  }
  &--search-active {
    .header-desktop__search {
      transform: translateY(0%);
    }
    .header-desktop__search-content {
      transition: visibility 300ms 300ms, opacity 300ms 300ms;
    }
    .header-desktop__background {
      transform: translateX(-50%) translateY(120px);
    }
  }
}
</style>
