<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TheNavBar from '@/components/layout/TheNavBar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import NewsSection from '@/components/sections/NewsSection.vue'
import PricingSection from '@/components/sections/PricingSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
import FeedbackSection from '@/components/sections/FeedbackSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

interface HomeContent {
  navbar?: Record<string, unknown>
  hero?: Record<string, unknown>
  about?: Record<string, unknown>
  services?: Record<string, unknown>
  news?: Record<string, unknown>
  pricing?: Record<string, unknown>
}

const landingData = ref<HomeContent>({})

const API_CONTENT_URL = 'http://10.1.1.115/api/content'
const JSON_FALLBACK_URL = '/json/mock-requets.json'

const fetchContent = async (url: string): Promise<HomeContent> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error loading content from ${url}: ${response.status}`)
  }
  return response.json()
}

onMounted(async () => {
  try {
    landingData.value = await fetchContent(API_CONTENT_URL)
  } catch (error) {
    console.warn('Could not load API content. Falling back to local JSON.', error)

    try {
      landingData.value = await fetchContent(JSON_FALLBACK_URL)
    } catch (fallbackError) {
      console.error('Could not load fallback landing content JSON', fallbackError)
    }
  }
})
</script>

<template>
  <div class="main-agile">
    <HeroSection :hero="landingData.hero" />
  </div>
  <TheNavBar :navbar="landingData.navbar" />
  <AboutSection :about="landingData.about" />
  <ServicesSection :services="landingData.services" />
  <NewsSection :news="landingData.news" />
  <PricingSection :pricing="landingData.pricing" />
  <TeamSection />
  <FeedbackSection />
  <GallerySection />
  <ContactSection />
  <TheFooter />
</template>
