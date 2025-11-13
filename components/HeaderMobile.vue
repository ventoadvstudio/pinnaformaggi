<template>
  <div
    class="header-mobile fixed top-0 left-0 right-0 z-100"
    :class="{
      'header-mobile--active': menuActive,
      'header-mobile--search-active': searchActive,
    }"
  >
    <div
      class="header-mobile__header bg-white container flex justify-between items-center py-10 absolute top-0 left-0 right-0 z-10"
    >
      <HamburgerBtn :active="menuActive" :on-click="toggleMenu" />
      <nuxt-link
        :to="localePath('/')"
        class="absolute top-0 left-half transform -translate-x-1/2"
      >
        <img
          src="@/assets/images/logo.svg"
          alt="Pinna"
          class="header-mobile__logo"
          width="180"
          height="90"
        />
      </nuxt-link>
      <button
        class="header-mobile__search-btn w-24 h-24 p-2 focus:outline-none"
        @click="toggleSearch"
      >
        <SearchIcon class="w-full h-full object-contain" />
      </button>
    </div>
    <div
      class="header-mobile__menu absolute top-0 left-0 w-screen h-screen bg-white z-1 mt-44 flex flex-col"
    >
      <div class="flex-1 overflow-y-scroll">
        <div
          class="header-mobile__menu-content mt-78 pb-40"
          :class="{
            'visible opacity-100': menuActive,
            'invisible opacity-0': !menuActive,
          }"
        >
          <div
            v-for="item in items"
            :key="item.label"
            class="header-mobile__item border-b-2 border-gray-100"
          >
            <button
              v-if="item.entries"
              class="header-mobile__item-label flex justify-between items-center container py-20 focus:outline-none"
              @click="toggleItem(item.label)"
            >
              <span
                class="font-title uppercase text-24 font-medium text-primary"
              >
                {{ item.label }}
              </span>
              <Plus v-show="!itemsState[item.label]" class="w-24 h-24" />
              <Minus v-show="itemsState[item.label]" class="w-24 h-24" />
            </button>
            <nuxt-link
              v-else
              :to="item.link"
              class="header-mobile__item-label flex justify-between items-center container py-20 focus:outline-none"
            >
              <span
                class="font-title uppercase text-24 font-medium text-primary"
              >
                {{ item.label }}
              </span>
              <ChevronRight class="w-24 h-24" />
            </nuxt-link>
            <ul
              class="header-mobile__item-entries overflow-hidden"
              :class="{
                'header-mobile__item-entries--active': itemsState[item.label],
              }"
            >
              <li
                v-for="(entry, n) in item.entries"
                :key="`${item.label}-${entry.label}`"
                class="bg-cream-100"
                :class="{
                  'border-b border-white': n < item.entries.length - 1,
                }"
              >
                <nuxt-link
                  :to="entry.link"
                  class="block container text-20 py-20"
                  :class="{
                    'text-gray-600': !entry.special,
                    'text-primary': entry.special,
                  }"
                >
                  {{ entry.label }}
                </nuxt-link>
              </li>
            </ul>
          </div>
          <div
            class="header-mobile__languages mt-40 container flex justify-center items-center"
          >
            <nuxt-link
              :to="switchLocalePath('it')"
              :class="{
                'text-primary': $i18n.locale === 'it',
                'text-gray-400': $i18n.locale !== 'it',
              }"
              class="flex-1 text-center py-8 font-bold uppercase border-r-2 border-gray-100"
            >
              Italiano
            </nuxt-link>
            <nuxt-link
              :to="switchLocalePath('en')"
              :class="{
                'text-primary': $i18n.locale === 'en',
                'text-gray-400': $i18n.locale !== 'en',
              }"
              class="flex-1 text-center py-8 font-bold uppercase"
            >
              English
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div
      class="header-mobile__search container absolute top-0 left-0 right-0 bg-white z-1 pt-90"
    >
      <div
        class="header-mobile__search-content"
        :class="{
          'visible opacity-100': searchActive,
          'invisible opacity-0': !searchActive,
        }"
      >
        <Search />
      </div>
    </div>
    <HeaderBackground class="header-mobile__background" />
  </div>
</template>
<script>
import HeaderBackground from '@/components/HeaderBackground'
import HamburgerBtn from '@/components/HamburgerBtn'
import Search from '@/components/Search'
import SearchIcon from '@/assets/icons/search.svg?inline'
import Minus from '@/assets/icons/minus.svg?inline'
import Plus from '@/assets/icons/plus.svg?inline'
import ChevronRight from '@/assets/icons/chevron-right-2.svg?inline'
export default {
  components: {
    HeaderBackground,
    HamburgerBtn,
    Search,
    SearchIcon,
    Minus,
    Plus,
    ChevronRight,
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
      menuActive: false,
      searchActive: false,
      itemsState: {},
    }
  },
  watch: {
    $route() {
      if (this.menuActive || this.searchActive) {
        this.toggleMenu()
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.closeSearch)
    this.$root.$on('closeSearchMenu', () => {
      this.searchActive = false
    })
    const itemsState = {}
    this.items.forEach((item) => {
      itemsState[item.label] = false
    })
    this.itemsState = { ...itemsState }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeSearch)
  },
  methods: {
    closeSearch(e) {
      const vm = this
      if (!e.target.closest('.header')) {
        vm.searchActive = false
      }
    },
    toggleItem(label) {
      const newValue = !this.itemsState[label]
      this.itemsState = {
        ...this.itemsState,
        [label]: newValue,
      }
    },
    toggleMenu() {
      this.closeItems()
      this.searchActive = false
      if (this.menuActive) {
        document.body.classList.remove('overflow-hidden')
      } else {
        document.body.classList.add('overflow-hidden')
      }
      this.menuActive = !this.menuActive
    },
    toggleSearch() {
      this.menuActive = false
      document.body.classList.remove('overflow-hidden')
      this.searchActive = !this.searchActive
    },
    closeItems() {
      const itemsState = {}
      for (const item in this.itemsState) {
        itemsState[item] = false
      }
      this.itemsState = { ...itemsState }
    },
  },
}
</script>
<style>
.header-mobile {
  /* GENERAL STYLING */
  &__logo {
    min-width: 134px;
    width: calc(0.044834307992203 * 100vw + 115px);
    max-width: 179px;
  }
  &__item-entries {
    max-height: 0;
    transition: max-height 300ms ease-in-out;
    &--active {
      max-height: 1000px;
    }
  }
  &__search {
    transform: translateY(-100%);
  }
  &__search-content {
    transition: visibility 300ms, opacity 300ms;
  }

  &__languages {
    width: 262px;
  }

  &__menu {
    transform: translateY(-100vh);
    max-height: calc(100vh - 44px);
  }
  &__menu-content {
    transition: visibility 300ms, opacity 300ms;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__menu,
  &__search,
  &__background {
    transition: transform 300ms 300ms ease-out;
  }
  &--active {
    .header-mobile__menu {
      transform: translateY(0);
    }
    .header-mobile__background {
      transform: translateX(-50%) translateY(100vh);
    }
    .header-mobile__menu,
    .header-mobile__background {
      transition: transform 300ms ease-out;
    }
    .header-mobile__menu-content {
      transition: visibility 300ms 300ms, opacity 300ms 300ms;
    }
  }
  &--search-active {
    .header-mobile__search {
      transform: translateY(0%);
    }
    .header-mobile__search-content {
      transition: visibility 300ms 300ms, opacity 300ms 300ms;
    }
    .header-mobile__background {
      transform: translateX(-50%) translateY(120px);
    }
  }
}
</style>
