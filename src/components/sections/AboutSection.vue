<script setup lang="ts">
import { computed } from 'vue'

interface AboutData {
  sectionTitle: string
  image: string
  imageAlt: string
  overlayTitle: string
  overlayDescription: string
  headline: string
  paragraphs: string[]
  signatureImage: string
  signatureName: string
}

const props = defineProps<{
  about?: Partial<AboutData>
}>()

const defaultAbout: AboutData = {
  sectionTitle: 'About Us',
  image: '/images/ab.jpg',
  imageAlt: 'Image-2',
  overlayTitle: 'Best Floor',
  overlayDescription: 'Lorem ipsum dolor sit amet adipiscing.',
  headline: 'sit amet consectetur elit',
  paragraphs: [
    'Lorem ipsum dolor sit ame sectetur felvel iaculis id dolor eu bibendum. Integer gravida diam ut quam eleifend, sed tristiqu diam laoreet. Donec ac gravida urna. Sed ut nibh posuere euismod est',
    'Duis aute irure dolor in reprehenderit dolore eu fugiat nulla pariatur. Lorem ipsum dolor. reprehenderit',
  ],
  signatureImage: '/images/sign.png',
  signatureName: 'MK.John Son- CEO',
}

const aboutData = computed<AboutData>(() => ({
  ...defaultAbout,
  ...props.about,
  paragraphs: props.about?.paragraphs?.length ? props.about.paragraphs : defaultAbout.paragraphs,
}))
</script>

<template>
  <!-- About -->
  <div class="content-agileits" id="about">
    <div class="welcome-w3">
      <div class="container">
        <h3 class="w3_tittle">{{ aboutData.sectionTitle }}</h3>
        <div class="welcome-grids">
          <div class="col-md-5 wel-grid1">
            <div class="port-7 effect-2">
              <div class="image-box">
                <img :src="aboutData.image" :alt="aboutData.imageAlt" />
              </div>
              <div class="text-desc">
                <h4>{{ aboutData.overlayTitle }}</h4>
                <p>{{ aboutData.overlayDescription }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-7 wel-grid">
            <h4>{{ aboutData.headline }}</h4>
            <p v-for="(paragraph, index) in aboutData.paragraphs" :key="index">
              {{ paragraph }}
            </p>
            <div class="right-sign-grid">
              <img :src="aboutData.signatureImage" alt="signature" />
              <h5>{{ aboutData.signatureName }}</h5>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- //About -->
</template>
