<template>
  <main class="recipe-book-page overflow-hidden">
    <div class="relative pb-100 pt-110 md:pb-140 lg:pt-180 lg:pb-420">
      <datocms-image
        class="absolute inset-0 object-cover w-full h-full"
        :data="heroBackground.responsiveImage"
        :alt="heroBackground.alt"
        layout="fill"
        object-fit="cover"
      />
      <div
        class="relative z-20 container flex flex-col items-center justify-center text-center text-white"
      >
        <h1 class="uppercase text-50 lg:text-80 font-heading">
          {{ title }}
        </h1>
      </div>
    </div>
    <div class="relative">
      <datocms-image
        :data="bottomImage.responsiveImage"
        class="object-contain w-full"
        layout="intrinsic"
      />
    </div>
  </main>
</template>

<script>
import ApiService from '@/services/api.service';
import { handleAltText } from '@/utils';
import BasePage from '@/components/BasePage';

export default {
  extends: BasePage,
  async asyncData({ app }) {
    const locale = app.i18n.locale;
    const { recipeBook } = await ApiService.getRecipeBookPage(locale);
    return {
      ...recipeBook,
      heroBackground: handleAltText(recipeBook.heroBackground),
      bottomImage: handleAltText(recipeBook.bottomImage),
    };
  },
  data() {
    return {
      title: '',
      heroBackground: {
        responsiveImage: {},
      },
      bottomImage: {
        responsiveImage: {},
      },
    };
  },
  nuxtI18n: {
    paths: {
      it: '/ricettari/',
      en: '/recipe-books/',
    },
  },
};
</script>