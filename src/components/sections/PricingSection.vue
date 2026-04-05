<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface PricingPlan {
  id: number
  price: string
  title: string
  features: string[]
  buttonLabel: string
  cardClass: string
  priceClass: string
  cartClass: string
  listItemHighlightClass: string
}

interface PricingData {
  sectionTitle: string
  plans: PricingPlan[]
}

const props = defineProps<{
  pricing?: Partial<PricingData>
}>()

const defaultPricing: PricingData = {
  sectionTitle: 'Pricing Tables',
  plans: [
    {
      id: 1,
      price: '$425',
      title: 'HEALTHCARE',
      features: [
        'Interior and exterior painting',
        'Fireline Plasterboard',
        'Secure even surface',
        'Associated building repairs',
        'Specialist coatings',
      ],
      buttonLabel: 'Book Now',
      cardClass: 'pricing-grid1',
      priceClass: '',
      cartClass: 'cart1',
      listItemHighlightClass: 'whyt',
    },
    {
      id: 2,
      price: '$ 856',
      title: 'LAMINATE Best Floor',
      features: [
        'Repairing the existent Best Floor',
        'Gap filling',
        'Disposal of old Best Floor covering',
        'Associated building repairs',
        'Sanding',
      ],
      buttonLabel: 'Book Now',
      cardClass: 'pricing-grid2',
      priceClass: 'two',
      cartClass: 'cart2',
      listItemHighlightClass: 'whyt',
    },
    {
      id: 3,
      price: '$ 768',
      title: 'PLASTERBOARD',
      features: [
        'Plain plasterboard',
        'SoundBloc Plasterboard',
        'Duraline Plasterboard',
        'Secure even surface',
        'Fireline Plasterboard',
      ],
      buttonLabel: 'Book Now',
      cardClass: 'pricing-grid3',
      priceClass: 'three',
      cartClass: 'cart3',
      listItemHighlightClass: 'whyt',
    },
  ],
}

const pricingData = computed<PricingData>(() => ({
  ...defaultPricing,
  ...props.pricing,
  plans: props.pricing?.plans?.length ? props.pricing.plans : defaultPricing.plans,
}))

onMounted(() => {
  const $ = (window as any).$
  if (!$) return

  $('.popup-with-zoom-anim').magnificPopup({
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in',
  })

  $('.jarallax').jarallax({ speed: 0.5, imgWidth: 1366, imgHeight: 768 })
})
</script>

<template>
  <!-- pricing -->
  <div data-vide-bg="video/floor" id="pricing">
    <div class="pricing-plans center-container">
      <div class="container">
        <h3 class="w3_tittle">{{ pricingData.sectionTitle }}</h3>
        <div class="pricing-grids">
          <div :class="plan.cardClass" v-for="plan in pricingData.plans" :key="plan.id">
            <div class="price-value" :class="plan.priceClass">
              <h3><a href="#">{{ plan.price }}</a></h3>
              <h5>{{ plan.title }}</h5>
            </div>
            <div class="price-bg">
              <ul>
                <li
                  v-for="(feature, index) in plan.features"
                  :key="`${plan.id}-${index}`"
                  :class="index % 2 === 0 ? plan.listItemHighlightClass : ''"
                >
                  <a href="#">{{ feature }}</a>
                </li>
              </ul>
              <div :class="plan.cartClass">
                <a class="popup-with-zoom-anim" href="#small-dialog">{{ plan.buttonLabel }}</a>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>

  <!-- Popup-Box -->
  <div id="popup">
    <div id="small-dialog" class="mfp-hide agileinfo">
      <div class="pop_up">
        <div class="payment-online-form-left w3-agileits">
          <form action="#" method="post">
            <h4>Personal Details</h4>
            <ul>
              <li><input type="text" name="First Name" placeholder="First Name" required /></li>
              <li><input type="text" name="Last Name" placeholder="Last Name" required /></li>
            </ul>
            <ul>
              <li>
                <input type="email" class="email" name="Email" placeholder="Email" required />
              </li>
              <li>
                <input type="text" name="Number" placeholder="Mobile Number" required />
              </li>
            </ul>
            <textarea name="Message" placeholder="Address..." required></textarea>
            <div class="clearfix"></div>
            <ul class="payment-sendbtns">
              <li><input type="reset" value="Reset" /></li>
              <li><input type="submit" name="Send" value="Send" /></li>
            </ul>
            <div class="clearfix agile"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <button title="Close (Esc)" type="button" class="mfp-close w3-agileits">×</button>
  <!-- //Popup-Box -->
  <!-- //pricing -->
</template>
