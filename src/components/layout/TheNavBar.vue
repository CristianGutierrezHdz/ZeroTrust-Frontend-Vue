<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface NavbarItem {
  id: number
  label: string
  href: string
  active?: boolean
}

interface NavbarData {
  brandPrefix: string
  brandHighlight: string
  brandSuffix: string
  menu: NavbarItem[]
  phone: string
}

const props = defineProps<{
  navbar?: Partial<NavbarData>
}>()

const defaultNavbar: NavbarData = {
  brandPrefix: 'Best',
  brandHighlight: 'F',
  brandSuffix: 'loor',
  menu: [
    { id: 1, label: 'Home', href: '#home', active: true },
    { id: 2, label: 'About Us', href: '#about' },
    { id: 3, label: 'Services', href: '#services' },
    { id: 4, label: 'Latest News', href: '#news' },
    { id: 5, label: 'Pricing', href: '#pricing' },
  ],
  phone: '+012 345 6789',
}

const navbarData = computed<NavbarData>(() => ({
  ...defaultNavbar,
  ...props.navbar,
  menu: props.navbar?.menu?.length ? props.navbar.menu : defaultNavbar.menu,
}))

onMounted(() => {
  const $ = (window as any).$
  if (!$) return

  // Smooth scroll for navbar links
  $('.scroll').on('click', function (this: HTMLElement, event: Event) {
    event.preventDefault()
    const hash = (this as HTMLAnchorElement).hash
    $('html,body').animate({ scrollTop: $(hash).offset().top }, 1000)
  })

  // Move to top
  $().UItoTop({ easingType: 'easeOutQuart' })
})
</script>

<template>
  <!-- header -->
  <div class="header">
    <nav class="navbar navbar-default">
      <div class="navbar-header navbar-left">
        <button
          type="button"
          class="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#bs-example-navbar-collapse-1"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <h1>
          <a class="navbar-brand" href="#"
            >{{ navbarData.brandPrefix }} <span>{{ navbarData.brandHighlight }}</span
            >{{ navbarData.brandSuffix }}</a
          >
        </h1>
      </div>
      <div class="collapse navbar-collapse navbar-right" id="bs-example-navbar-collapse-1">
        <nav class="cl-effect-6" id="cl-effect-6">
          <ul class="nav navbar-nav">
            <li v-for="item in navbarData.menu" :key="item.id" :class="{ active: item.active }">
              <a :href="item.href" class="scroll">{{ item.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
    <div class="w3l-phone">
      <img src="/images/mo.png" alt="call" />
      <div class="w3l-sub-right">
        <p>{{ navbarData.phone }}</p>
      </div>
    </div>
    <div class="clearfix"></div>
  </div>
  <!-- //header -->
</template>
