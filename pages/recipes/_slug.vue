<template>
  <main class="recipe pb-16 md:pb-30">
    <RecipePresentation
      :img="presentation.img"
      :title="presentation.title"
      :back-label="presentation.backLabel"
      :back-url="presentation.backUrl"
      :tags="presentation.tags"
      :info="info"
      :categories="categories"
    />
    <div class="container lg:grid lg:grid-cols-12 lg:gap-30">
      <div class="lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
        <div
          v-if="
            sanitizedRecipeDescription && sanitizedRecipeDescription.length > 0
          "
          class="recipe__description mt-60"
        >
          <h2
            class="font-title font-medium text-24 uppercase mb-8 text-primary"
          >
            {{ presentationLabel }}
          </h2>
          <div
            class="text-cream-700 markdown"
            v-html="sanitizedRecipeDescription"
          ></div>
        </div>
        <RecipeFeaturedProduct
          v-if="featuredProduct"
          :title="featuredProduct.title"
          :image="featuredProduct.image"
          :cta-label="featuredProduct.ctaLabel"
          :cta-url="featuredProduct.ctaUrl"
          class="mt-40"
        />
        <div
          v-if="video && video.sources.length"
          class="mt-40 md:mt-80 text-center"
        >
          <h3 class="font-title font-medium text-24 md:text-30 text-primary">
            {{ watchVideoLabel }}
          </h3>
          <VideoPlayer
            :sources="video.sources"
            :thumbnail="video.thumbnail"
            class="w-full mt-16 focus:outline-none"
          />
        </div>
      </div>
    </div>
    <RecipeIngredients
      :title="ingredients.title"
      :servings="ingredients.servings"
      :sections="ingredients.sections"
      class="mt-40 md:mt-80"
    />

    <RecipeCaloriesSummary v-if="calorie" :total="calorie" class="mt-60" />

    <div class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-60 md:mt-60">
      <div
        class="md:px-0 md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
      >
        <RecipeMethod :title="method.title" :sections="method.items" />

        <RecipeConsigli
          v-if="consigli && consigli.length > 0"
          :title="consigli[0].title"
          :description="consigli[0].description"
          :author="consigli[0].author"/>
      </div>

      <!--       <div
        class="md:px-0 md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6"
      >
        <RecipeAdvice
          description="lorem ipsum"
          title="Suggerimenti"
          :author="author"
        />
      </div> -->
    </div>
    <div v-if="questionsAndAnswers.items.length > 0">
      <QuestionsAndAnswers
        :title="questionsAndAnswers.title"
        :items="questionsAndAnswers.items"
      />
    </div>
    <div v-if="author" class="container mt-40 md:mt-50 lg:text-center">
      <p class="text-14 font-medium text-primary">{{ author }}</p>
    </div>
    <RecipeShare
      :title="recipeShare.title"
      :facebook="recipeShare.facebook"
      :pinterest="recipeShare.pinterest"
      :twitter="recipeShare.twitter"
      class="mt-70"
    />
    <RatingStars
      :status="ratingStatus"
      :average="ratingAverage"
      :total="ratingTotal"
      :loading="loading"
      class="mt-70"
      @click="onRating"
    />
    <RelatedProducts
      v-if="
        relatedProducts &&
        relatedProducts.items &&
        relatedProducts.items.length > 0
      "
      :title="relatedProducts.title"
      :description="relatedProducts.description"
      :products="relatedProducts.items"
      class="mt-48 md:mt-80"
    />
    <div
      v-if="relatedRecipes && relatedRecipes.items"
      class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-50 md:mt-80"
    >
      <div class="lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
        <h2 class="uppercase text-primary font-medium font-title text-24">
          {{ relatedRecipes.title }}
        </h2>
      </div>
    </div>
    <div
      v-if="relatedRecipes && relatedRecipes.items"
      class="container px-0 md:px-20 mt-16"
    >
      <RecipeGrid :items="relatedRecipes.items" title-h3 />
    </div>
    <script type="application/ld+json" v-html="jsonld" />
  </main>
</template>
<script>
import RecipePresentation from '@/components/RecipePresentation'
import RecipeFeaturedProduct from '@/components/RecipeFeaturedProduct'
import RecipeIngredients from '@/components/RecipeIngredients'
import RecipeMethod from '@/components/RecipeMethod'
import RecipeGrid from '@/components/RecipeGrid'
import RecipeShare from '@/components/RecipeShare'
import RelatedProducts from '@/components/RelatedProducts'
import BasePage from '@/components/BasePage'
import VideoPlayer from '@/components/VideoPlayer'
import ApiService from '@/services/api.service'
import RatingStars from '@/components/RatingStars.vue'
import QuestionsAndAnswers from '@/components/QuestionsAndAnswers'
import { handleSlug, handleAltText, handleSlugLocales } from '@/utils'
import RecipeConsigli from '@/components/RecipeConsigli'

const mapRecipeGroupedLists = (items) => {
  const final = []
  let temp = {
    title: '',
    items: [],
  }
  items.forEach((item) => {
    switch (item._modelApiKey) {
      case 'group_title':
        if (temp.items.length === 0) {
          temp.title = item.content
        } else {
          final.push(temp)
          temp = {
            title: item.content,
            items: [],
          }
        }
        break
      case 'ingredient':
        temp.items.push(item)
        break
      case 'recipe_step':
        temp.items.push({
          content: item.content,
          images: item.images,
        })
        break
    }
  })
  final.push(temp)
  return final
}

const getRating = async (id) => {
  const ratingsQuery = await ApiService.getRecipeRatings(id)
  const ratings = ratingsQuery[Object.keys(ratingsQuery)[0]]

  const ratingSum = ratings.reduce((acc, el) => acc + el.value, 0)
  const ratingAverage = ratings.length === 0 ? 0 : ratingSum / ratings.length
  const ratingTotal = ratings.length

  return { ratingAverage, ratingTotal }
}

const getRelatedRecipes = (
  recipe,
  common,
  locale,
  originalRecipes,
  recipesByProduct
) => {
  const baseArr = []
  if (originalRecipes) {
    baseArr.push(...originalRecipes)
  }
  if (recipesByProduct.length > 0) {
    baseArr.push(...recipesByProduct)
  }

  return baseArr.length > 0
    ? {
        title: recipe.relatedRecipesTitle,
        items: baseArr.map((recipe) => ({
          img: recipe.picture ? handleAltText(recipe.picture) : '',
          title: recipe.name,
          time: recipe.duration + ` ${common.minutesLabel}`,
          ctaLabel: common.visitRecipeLabel,
          ctaUrl: handleSlug(locale, 'recipe', recipe.slug),
          categories: recipe.categories ? recipe.categories[0].name : '',
          calories: Number(recipe.calories),
          difficulty: recipe.effort?.name,
          description: recipe.description,
        })),
      }
    : {}
}

export default {
  name: 'RecipePage',
  components: {
    RecipePresentation,
    RecipeFeaturedProduct,
    RecipeIngredients,
    RecipeMethod,
    RecipeGrid,
    RecipeShare,
    RelatedProducts,
    VideoPlayer,
    RatingStars,
    QuestionsAndAnswers,
    RecipeConsigli
  },
  extends: BasePage,
  async asyncData({ app, params, store }) {
    const locale = app.i18n.locale
    const { recipe } = await ApiService.getRecipe(locale, params.slug)
    const slugLocales = recipe._allSlugLocales
    if (slugLocales && slugLocales.length > 0) {
      await store.dispatch(
        'i18n/setRouteParams',
        handleSlugLocales(slugLocales)
      )
    }
    let recipesByProduct = []
    const tags = []
    const categories = recipe.categories.map((category) => ({
      backUrl: category.slug
        ? handleSlug(locale, 'recipeCategory', category.slug)
        : '',
      backLabel: category.name,
    }))
    if (recipe.cuisine) {
      categories.push({
        backUrl: '',
        backLabel: recipe.cuisine,
      })
    }

    if (recipe.keywords) {
      recipe.keywords.split(',').forEach((keyword) => {
        const singleKeyword = keyword.trim()
        if (singleKeyword) {
          categories.push({
            backUrl: '',
            backLabel: singleKeyword,
          })
        }
      })
    }

    if (recipe.featuredProduct) {
      const { allRecipes } = await ApiService.getRecipesByProduct(
        locale,
        recipe.featuredProduct.id
      )
      recipesByProduct = allRecipes
    }

    if (recipe.effort) tags.push(recipe.effort.name)
    else if (recipe.categories && recipe.categories.length > 0) {
      recipe.categories.forEach((category) => {
        tags.push(category.name)
      })
    }
    const common = store.state.common[locale]

    if (recipe.duration) tags.push(`${recipe.duration} ${common.minutesLabel}`)

    const { ratingAverage, ratingTotal } = await getRating(recipe.id)

    return {
      id: recipe.id,
      ratingAverage,
      ratingTotal,
      presentationLabel: common.recipeIntroductionLabel,
      watchVideoLabel: common.watchVideoLabel,
      presentation: {
        title: recipe.name,
        img: recipe.picture ? handleAltText(recipe.picture) : '',
        description: recipe.description,
        backLabel: recipe.categories ? recipe.categories[0].name : '',
        backUrl: recipe.categories
          ? handleSlug(locale, 'recipeCategory', recipe.categories[0].slug)
          : '',
        tags,
      },
      info: {
        difficulty: recipe.effort.name,
        prepTime: recipe.prepTime
          ? `${recipe.prepTime}  ${store.state.common[locale].minutesLabel}`
          : undefined,
        cookTime: `${recipe.duration}  ${store.state.common[locale].minutesLabel}`,
        totalTime: `${recipe.prepTime + recipe.duration} ${
          store.state.common[locale].minutesLabel
        }`,
        notes: recipe.note ? recipe.note : '',
      },
      categories,
      author: recipe.author,
      video:
        recipe.video && Array.isArray(recipe.video) && recipe.video.length > 0
          ? {
              sources: recipe.video,
              thumbnail: recipe.videoThumbnail
                ? handleAltText(recipe.videoThumbnail)
                : recipe.video[0].video.thumbnailUrl,
            }
          : null,
      videoSources: recipe.video,
      featuredProduct: recipe.featuredProduct
        ? {
            title:
              common.featuredProductTitle + ' ' + recipe.featuredProduct.name,
            image:
              recipe.featuredProduct.pictures &&
              recipe.featuredProduct.pictures.length > 0
                ? handleAltText(recipe.featuredProduct.pictures[0].image)
                : '',
            ctaLabel: common.discoverMoreLabel,
            ctaUrl: handleSlug(locale, 'product', recipe.featuredProduct.slug),
          }
        : null,
      ingredients: {
        title: common.ingredientsLabel,
        servings: `${recipe.servings} ${common.servingsLabel}`,
        sections: mapRecipeGroupedLists(recipe.ingredients),
      },
      method: {
        title: common.methodLabel,
        items: mapRecipeGroupedLists(recipe.recipeMethod),
      },
      recipeShare: {
        title: common.shareRecipeLabel,
        facebook: '',
        pinterest: '',
        twitter: '',
      },
      relatedRecipes: getRelatedRecipes(
        recipe,
        common,
        locale,
        recipe.relatedRecipes,
        recipesByProduct
      ),
      duration: recipe.duration,
      publishedAt: recipe._firstPublishedAt,
      relatedProducts: {
        title: common.relatedProductsTitle,
        description: common.relatedProductsDescription,
        items:
          recipe.relatedProducts.length > 0
            ? recipe.relatedProducts.map((product) => ({
                img:
                  product.pictures.length > 0
                    ? handleAltText(product.pictures[0].image)
                    : '',
                title: product.name,
                ctaLabel: store.state.common[locale].discoverMoreLabel,
                tags: product.tags.map((tag) => tag.label),
                ctaUrl: handleSlug(locale, 'product', product.slug),
              }))
            : [],
      },
      questionsAndAnswers: {
        title: recipe.questionAndAnswersTitle,
        items: recipe.questionsAndAnswers,
      },
      originalRecipe: recipe,
      seo: recipe.seo,
      calorie: recipe.calories,
      consigli: recipe.consigli,
    }
  },
  data() {
    return {
      id: '',
      loading: false,
      ratingAverage: 0,
      ratingTotal: 0,
      ratingStatus: '',
      presentationLabel: '',
      watchVideoLabel: '',
      presentation: {},
      info: {},
      categories: [],
      video: {},
      featuredProduct: {},
      ingredients: {},
      method: {},
      recipeShare: {},
      relatedRecipes: {},
      relatedProducts: {},
      author: '',
      authorType: '',
      keywords: '',
      calories: '',
      cuisine: '',
      prepTime: '',
      originalRecipe: {},
      seo: {},
      calorie: '',
    }
  },
  computed: {
    sanitizedRecipeDescription() {
      return this.$sanitize(this.presentation.description)
    },
    jsonld() {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        author: {
          '@type': this.authorType ? this.authorType : '@Organization',
          name: this.author,
        },
        recipeCuisine: this.originalRecipe.cuisine,
        name: this.originalRecipe.name,
        cookTime: `PT${this.originalRecipe.duration}M`,
        prepTime: this.originalRecipe.prepTime
          ? `PT${this.originalRecipe.prepTime}M`
          : undefined,
        keywords: this.originalRecipe.keywords,
        description: this.seo ? this.seo.description : undefined,
        recipeYield: this.ingredients.servings,
        image: this.presentation.img.url,
        nutrition: this.originalRecipe.calories
          ? {
              '@type': 'NutritionInformation',
              calories: `${this.originalRecipe.calories} calories`,
            }
          : undefined,
        recipeIngredient: this.originalRecipe.ingredients
          .filter((el) => el._modelApiKey === 'ingredient')
          .map((el) => `${el.name} ${el.quantity}`),
        recipeInstructions: this.originalRecipe.recipeMethod.map(
          (el) => el.content
        ),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: this.ratingAverage.toFixed(1),
          ratingCount: this.ratingTotal.toString(),
        },
        video:
          this.video && this.video.sources.length > 0
            ? {
                '@type': 'VideoObject',
                name: this.originalRecipe.name,
                thumbnailUrl: this.video.thumbnail
                  ? [this.video.thumbnail.url]
                  : undefined,
                contentUrl: this.video.sources[0].url,
              }
            : undefined,
      }
      if (this.publishedAt) {
        data.datePublished = new Date(this.publishedAt)
          .toISOString()
          .split('T')[0]
      }
      if (
        this.originalRecipe.categories &&
        this.originalRecipe.categories.length > 0
      ) {
        data.recipeCategory = this.originalRecipe.categories[0].name
      }
      return data
    },
  },
  async mounted() {
    this.recipeShare.facebook = `https://www.facebook.com/sharer/sharer.php?u=${document.URL}`
    this.recipeShare.pinterest = `https://pinterest.com/pin/create/link/?url=${document.URL}&media=${this.presentation.img.url}=&description=${this.presentation.title}`
    this.recipeShare.twitter = `https://twitter.com/intent/tweet?url=${document.URL}&text=${this.presentation.title}`

    const data = await getRating(this.id)
    this.ratingAverage = data.ratingAverage
    this.ratingTotal = data.ratingTotal
  },
  methods: {
    async onRating(rating) {
      try {
        this.loading = true
        await this.$axios.post('.netlify/functions/rating', {
          rating,
          recipeId: this.id,
        })
        this.ratingStatus = 'voteSuccess'

        const data = await getRating(this.id)
        this.ratingAverage = data.ratingAverage
        this.ratingTotal = data.ratingTotal
      } catch (error) {
        switch (error.response.status) {
          case 409:
            this.ratingStatus = 'alreadyVoted'
            break

          default:
            this.ratingStatus = 'error'
            break
        }
      } finally {
        this.loading = false
      }
    },
  },
  nuxtI18n: {
    paths: {
      it: '/ricette/:slug/',
      en: '/recipes/:slug/',
    },
  },
}
</script>
