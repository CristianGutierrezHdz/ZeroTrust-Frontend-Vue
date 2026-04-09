<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const $ = (window as any).$
  if (!$) return
  $('.gallery a').Chocolat()
})
</script>

<template>
  <!-- gallery -->
  <div class="gallery" id="gallery">
    <div class="container">
      <h3 class="w3_tittle">Our Gallery</h3>
      <div class="gallery-grids">
        <section>
          <ul id="da-thumbs" class="da-thumbs">
            <li>
              <a href="/images/g1.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g1.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g2.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g2.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g3.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g3.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g4.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g4.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g5.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g5.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g6.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g6.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g7.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g7.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g8.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g8.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
            <li>
              <a href="/images/g9.jpg" class="b-link-stripe b-animate-go thickbox">
                <img src="/images/g9.jpg" alt="" />
                <div><h5>Best Floor</h5></div>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
  <!-- //gallery -->
</template>
