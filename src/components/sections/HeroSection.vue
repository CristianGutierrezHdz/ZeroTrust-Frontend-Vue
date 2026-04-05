<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface HeroSlide {
  id: number
  backgroundClass: string
  lead: string
  title: string
  description: string
  ctaHref: string
}

interface HeroData {
  slides: HeroSlide[]
}

const props = defineProps<{
  hero?: Partial<HeroData>
}>()

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    backgroundClass: '',
    lead: 'Welcome to Our Best Floor',
    title: 'Ultimate Best Floor',
    description: 'Sed ut perspiciatis unde omnis iste natus error',
    ctaHref: '#about',
  },
  {
    id: 2,
    backgroundClass: 't2',
    lead: 'Welcome to Our Best Floor',
    title: 'Paving Services',
    description: 'Sed ut perspiciatis unde omnis iste natus error',
    ctaHref: '#about',
  },
  {
    id: 3,
    backgroundClass: 't3',
    lead: 'Welcome to Our Best Floor',
    title: 'Hardwood Best Floor',
    description: 'Sed ut perspiciatis unde omnis iste natus error',
    ctaHref: '#about',
  },
]

const slides = computed(() => (props.hero?.slides?.length ? props.hero.slides : defaultSlides))

onMounted(() => {
  const $ = (window as any).$
  if (!$) return

  $('#slider4').responsiveSlides({
    auto: true,
    pager: true,
    nav: false,
    speed: 500,
    namespace: 'callbacks',
  })
})
</script>

<template>
  <!-- banner -->
  <div id="home" class="w3ls-banner">
    <div class="slider">
      <div class="callbacks_container">
        <ul class="rslides callbacks callbacks1" id="slider4">
          <li v-for="slide in slides" :key="slide.id">
            <div class="w3layouts-banner-top" :class="slide.backgroundClass">
              <div class="agileits-banner-info">
                <div class="w3layouts-posi-1"></div>
                <div class="w3layouts-posi-2"></div>
                <h4>{{ slide.lead }}</h4>
                <h3>{{ slide.title }}</h3>
                <p>{{ slide.description }}</p>
                <div class="w3layouts-posi-3"></div>
                <div class="w3layouts-posi-4"></div>
                <div class="thim-click-to-bottom">
                  <a :href="slide.ctaHref" class="scroll">
                    <i class="fa fa-long-arrow-down" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <!-- //banner -->
</template>
