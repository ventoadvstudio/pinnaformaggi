<template>
  <div
    class="flex flex-row flex-wrap items-center justify-between gap-x-8 gap-y-16"
  >
    <div
      :class="
        difficulty ? 'flex flex-row items-center w-full sm:w-auto' : 'hidden'
      "
    >
      <ChefHat />
      <span class="text-gray-500 font-normal ml-6 md:ml-8 text-14 md:text-16">{{
        $t('recipe.info.difficulty')
      }}</span>
      <span class="text-gray-500 font-bold ml-6 md:ml-12 text-14 md:text-16">{{
        difficulty
      }}</span>
    </div>

    <div
      :class="
        prepTime ? 'flex flex-row items-center w-full sm:w-auto' : 'hidden'
      "
    >
      <Flatware />
      <span class="text-gray-500 font-normal ml-6 md:ml-8 text-14 md:text-16">{{
        $t('recipe.info.prepTime')
      }}</span>
      <span class="text-gray-500 font-bold ml-6 md:ml-12 text-14 md:text-16">{{
        prepTime
      }}</span>
    </div>

    <div
      :class="
        cookingTime ? 'flex flex-row items-center w-full sm:w-auto' : 'hidden'
      "
    >
      <Pot />
      <span class="text-gray-500 font-normal ml-6 md:ml-8 text-14 md:text-16">{{
        $t('recipe.info.cookTime')
      }}</span>
      <span class="text-gray-500 font-bold ml-6 md:ml-12 text-14 md:text-16">{{
        cookingTime
      }}</span>
    </div>

    <div
      :class="
        totalTime ? 'flex flex-row items-center w-full sm:w-auto' : 'hidden'
      "
    >
      <Clock />
      <span class="text-gray-500 font-normal ml-6 md:ml-8 text-14 md:text-16">{{
        $t('recipe.info.totalTime')
      }}</span>
      <span class="text-gray-500 font-bold ml-6 md:ml-12 text-14 md:text-16">{{
        totalTime
      }}</span>
    </div>

    <div
      :class="notes ? 'flex flex-row items-center w-full sm:w-auto' : 'hidden'"
    >
      <PinGray />
      <span class="text-gray-500 font-normal ml-6 md:ml-8 text-14 md:text-16">{{
        $t('recipe.info.restTime')
      }}</span>
      <span class="text-gray-500 font-bold ml-6 md:ml-12 text-14 md:text-16">{{
        notes
      }}</span>
    </div>
  </div>
</template>

<script>
import Flatware from 'assets/icons/flatware.svg?inline'
import Pot from 'assets/icons/pot.svg?inline'
import PinGray from 'assets/icons/pin-gray.svg?inline'
import Clock from 'assets/icons/clock.svg?inline'
import ChefHat from 'assets/icons/chef-hat.svg?inline'

export default {
  components: { ChefHat, Clock, Flatware, Pot, PinGray },
  props: {
    difficulty: {
      type: String,
      default: '',
    },
    prepTime: {
      type: String,
      default: '',
    },
    cookingTime: {
      type: String,
      default: '',
    },
    totalTime: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
}
</script>
