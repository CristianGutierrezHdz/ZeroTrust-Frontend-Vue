<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const $ = (window as any).$
  if (!$) return

  $('#owl-demo').owlCarousel({
    items: 3,
    itemsDesktop: [768, 2],
    itemsDesktopSmall: [414, 1],
    lazyLoad: true,
    autoPlay: true,
    navigation: true,
    navigationText: false,
    pagination: true,
  })

  $('.jarallax').jarallax({ speed: 0.5, imgWidth: 1366, imgHeight: 768 })
})
</script>

<template>
  <!-- feedback -->
  <div class="feedback_dot jarallax">
    <div class="feedback">
      <div class="container">
        <h3 class="w3_tittle">Feedback</h3>
        <div class="agileits-feedback-grids">
          <div id="owl-demo" class="owl-carousel owl-theme">
            <div class="item">
              <div class="icon-w3l">
                <i class="fa fa-quote-left" aria-hidden="true"></i>
              </div>
              <div class="feedback-info">
                <div class="feedback-top">
                  <p>Sed semper leo metus, a lacinia eros semper at. Etiam sodales orci sit amet vehicula pellentesque.</p>
                </div>
                <div class="feedback-grids">
                  <div class="feedback-img">
                    <img src="/images/t1.jpg" alt="" />
                  </div>
                  <div class="feedback-img-info">
                    <h5>Mary Jane</h5>
                    <p>Vestibulum</p>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="icon-w3l">
                <i class="fa fa-quote-left" aria-hidden="true"></i>
              </div>
              <div class="feedback-info">
                <div class="feedback-top">
                  <p>Sed semper leo metus, a lacinia eros semper at. Etiam sodales orci sit amet vehicula pellentesque.</p>
                </div>
                <div class="feedback-grids">
                  <div class="feedback-img">
                    <img src="/images/t2.jpg" alt="" />
                  </div>
                  <div class="feedback-img-info">
                    <h5>Peter guptill</h5>
                    <p>Vestibulum</p>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="icon-w3l">
                <i class="fa fa-quote-left" aria-hidden="true"></i>
              </div>
              <div class="feedback-info">
                <div class="feedback-top">
                  <p>Sed semper leo metus, a lacinia eros semper at. Etiam sodales orci sit amet vehicula pellentesque.</p>
                </div>
                <div class="feedback-grids">
                  <div class="feedback-img">
                    <img src="/images/t3.jpg" alt="" />
                  </div>
                  <div class="feedback-img-info">
                    <h5>Steven Wilson</h5>
                    <p>Vestibulum</p>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="icon-w3l">
                <i class="fa fa-quote-left" aria-hidden="true"></i>
              </div>
              <div class="feedback-info">
                <div class="feedback-top">
                  <p>Sed semper leo metus, a lacinia eros semper at. Etiam sodales orci sit amet vehicula pellentesque.</p>
                </div>
                <div class="feedback-grids">
                  <div class="feedback-img">
                    <img src="/images/t7.jpg" alt="" />
                  </div>
                  <div class="feedback-img-info">
                    <h5>Mary Jane</h5>
                    <p>Vestibulum</p>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="icon-w3l">
                <i class="fa fa-quote-left" aria-hidden="true"></i>
              </div>
              <div class="feedback-info">
                <div class="feedback-top">
                  <p>Sed semper leo metus, a lacinia eros semper at. Etiam sodales orci sit amet vehicula pellentesque.</p>
                </div>
                <div class="feedback-grids">
                  <div class="feedback-img">
                    <img src="/images/t6.jpg" alt="" />
                  </div>
                  <div class="feedback-img-info">
                    <h5>Peter guptill</h5>
                    <p>Vestibulum</p>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="icon-w3l">
                <i class="fa fa-quote-left" aria-hidden="true"></i>
              </div>
              <div class="feedback-info">
                <div class="feedback-top">
                  <p>Sed semper leo metus, a lacinia eros semper at. Etiam sodales orci sit amet vehicula pellentesque.</p>
                </div>
                <div class="feedback-grids">
                  <div class="feedback-img">
                    <img src="/images/t4.jpg" alt="" />
                  </div>
                  <div class="feedback-img-info">
                    <h5>Steven Wilson</h5>
                    <p>Vestibulum</p>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- //feedback -->
</template>
