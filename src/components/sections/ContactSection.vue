<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const $ = (window as any).$
  if (!$) return
  $('.jarallax').jarallax({ speed: 0.5, imgWidth: 1366, imgHeight: 768 })
})
</script>

<template>
  <!-- Contact -->
  <div class="contact jarallax" id="contact">
    <div class="container">
      <h3 class="w3_tittle">Mail Us</h3>
      <div class="contact-grid1">
        <form action="#" method="post">
          <input type="text" name="Name" placeholder="Name" required />
          <input type="text" name="Subject" placeholder="Subject" required />
          <input type="email" name="E-mail" placeholder="E-mail" required />
          <textarea placeholder="Write a Message......" name="Message" required></textarea>
          <div class="grid-w3l">
            <p>
              <i class="fa fa-angle-double-right" aria-hidden="true"></i> Lorem ipsum dolor sit
              amet, consectetur adipiscing elit,dolore magna aliqua.
            </p>
            <h4>Fill in The Form And We'll get back to you within 24hours.</h4>
          </div>
          <input type="submit" value="Send" />
        </form>
      </div>
    </div>
  </div>
  <!-- //Contact -->

  <div class="contact-w3lsleft map">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424143.0428986048!2d150.65177630482995!3d-33.847973034849154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney+NSW%2C+Australia!5e0!3m2!1sen!2sin!4v1488261232220"
      class="map"
      style="border: 0"
      allowfullscreen
    ></iframe>
  </div>

  <!-- contact address -->
  <div class="contact-row agileits-w3layouts">
    <div class="container">
      <div class="contact-w3lsright">
        <div class="col-xs-4 address-row">
          <div class="col-xs-2 address-left">
            <span class="glyphicon glyphicon-home" aria-hidden="true"></span>
          </div>
          <div class="col-xs-10 address-right">
            <h5>Visit Us</h5>
            <p>Canada usju</p>
            <p>8907/2, Sydney.</p>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="col-xs-4 address-row w3-agileits">
          <div class="col-xs-2 address-left">
            <span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>
          </div>
          <div class="col-xs-10 address-right">
            <h5>Mail Us</h5>
            <p><a href="mailto:mail@example1.com">mail@example1.com</a></p>
            <p><a href="mailto:mail@example2.com">mail@example2.com</a></p>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="col-xs-4 address-row">
          <div class="col-xs-2 address-left">
            <span class="glyphicon glyphicon-phone" aria-hidden="true"></span>
          </div>
          <div class="col-xs-10 address-right">
            <h5>Call Us</h5>
            <p>+01 222 333 4444</p>
            <p>+01 222 666 7777</p>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
  <!-- //contact address -->
</template>
