<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface ServiceItem {
  id: number
  icon: string
  title: string
  description: string
}

interface ServicesData {
  sectionTitle: string
  items: ServiceItem[]
}

const props = defineProps<{
  services?: Partial<ServicesData>
}>()

const defaultServices: ServicesData = {
  sectionTitle: 'Services',
  items: [
    {
      id: 1,
      icon: 'fa-gears',
      title: 'Adipis Cing',
      description: 'Phasellus at placerat ante nulla adipiscing elit',
    },
    {
      id: 2,
      icon: 'fa-group',
      title: 'Fugiat Nul',
      description: 'Phasellus at placerat ante nulla adipiscing elit',
    },
    {
      id: 3,
      icon: 'fa-briefcase',
      title: 'Quo Gugiat',
      description: 'Phasellus at placerat ante nulla adipiscing elit',
    },
    {
      id: 4,
      icon: 'fa-clone',
      title: 'Secte Tedr',
      description: 'Phasellus at placerat ante nulla adipiscing elit',
    },
  ],
}

const servicesData = computed<ServicesData>(() => ({
  ...defaultServices,
  ...props.services,
  items: props.services?.items?.length ? props.services.items : defaultServices.items,
}))

onMounted(() => {
  const $ = (window as any).$
  if (!$) return
  $('.jarallax').jarallax({ speed: 0.5, imgWidth: 1366, imgHeight: 768 })
})
</script>

<template>
  <!-- services -->
  <div class="services jarallax" id="services">
    <div class="container">
      <h3 class="w3_tittle">{{ servicesData.sectionTitle }}</h3>
      <div class="services-w3lsrow agileits-w3layouts">
        <div class="col-md-3 col-sm-3 col-xs-6 services-grids" v-for="item in servicesData.items" :key="item.id">
          <div class="w3agile-servs-img">
            <i class="fa" :class="item.icon" aria-hidden="true"></i>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
  <!-- //services -->
</template>
