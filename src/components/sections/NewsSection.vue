<script setup lang="ts">
import { computed } from 'vue'

interface NewsItem {
  id: number
  title: string
  date: string
  followers: string
  summary: string
  image: string
  link: string
  modalTarget: string
}

interface NewsletterData {
  title: string
  subtitle: string
  placeholder: string
  buttonLabel: string
}

interface ModalData {
  heading: string
  subheading: string
  image: string
  content: string
}

interface NewsData {
  sectionTitle: string
  items: NewsItem[]
  newsletter: NewsletterData
  modal: ModalData
}

const props = defineProps<{
  news?: Partial<NewsData>
}>()

const defaultNews: NewsData = {
  sectionTitle: 'Latest News',
  items: [
    {
      id: 1,
      title: 'conse ctetur adipisi',
      date: 'May 11, 2017',
      followers: '7685',
      summary: 'Lorem ipsum dolor sit amet, Lorem ipsum Lorem ipsum.',
      image: '/images/n3.jpg',
      link: '#',
      modalTarget: '#myModal',
    },
    {
      id: 2,
      title: 'dolor sit amet',
      date: 'May 15, 2017',
      followers: '2546',
      summary: 'Lorem ipsum dolor sit amet, Lorem ipsum Lorem ipsum.',
      image: '/images/n1.jpg',
      link: '#',
      modalTarget: '#myModal',
    },
    {
      id: 3,
      title: 'sit Lorem ipsum',
      date: 'May 17, 2017',
      followers: '7485',
      summary: 'Lorem ipsum dolor sit amet, Lorem ipsum Lorem ipsum.',
      image: '/images/n2.jpg',
      link: '#',
      modalTarget: '#myModal',
    },
  ],
  newsletter: {
    title: 'News Letter',
    subtitle: 'Never Miss Any Update From Us!',
    placeholder: 'Email...',
    buttonLabel: 'Subscribe',
  },
  modal: {
    heading: 'Best Floor',
    subheading: 'Our Top News',
    image: '/images/n1.jpg',
    content:
      'Lorem ipsum dolor sit amet, Sed ut perspiciatis unde omnis iste natus error sit voluptatem , eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.accusantium doloremque laudantium, totam rem aperiamconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
}

const newsData = computed<NewsData>(() => ({
  ...defaultNews,
  ...props.news,
  items: props.news?.items?.length ? props.news.items : defaultNews.items,
  newsletter: {
    ...defaultNews.newsletter,
    ...props.news?.newsletter,
  },
  modal: {
    ...defaultNews.modal,
    ...props.news?.modal,
  },
}))
</script>

<template>
  <!-- News -->
  <div class="w3l-news-content" id="news">
    <div class="container">
      <h3 class="w3_tittle">{{ newsData.sectionTitle }}</h3>
      <div class="col-md-6 w3l-news">
        <div class="media response-info" v-for="item in newsData.items" :key="item.id">
          <div class="media-left response-text-left">
            <a :href="item.link" data-toggle="modal" :data-target="item.modalTarget">
              <img class="media-object" :src="item.image" alt="news" />
            </a>
          </div>
          <div class="media-body response-text-right">
            <h5>{{ item.title }}</h5>
            <ul>
              <li><i class="fa fa-calendar" aria-hidden="true"></i>{{ item.date }}</li>
              <li><i class="fa fa-users" aria-hidden="true"></i>Followers : {{ item.followers }}</li>
            </ul>
            <p>{{ item.summary }}</p>
            <a :href="item.link" class="view resw3" data-toggle="modal" :data-target="item.modalTarget"
              >Read More</a
            >
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="col-md-6 wthree_events_grid_right">
        <div class="wthree_events_grid_right1">
          <h3>{{ newsData.newsletter.title }}</h3>
          <p>{{ newsData.newsletter.subtitle }}</p>
          <div class="w3layouts_newsletter_right">
            <form action="#" method="post">
              <input type="email" name="Email" :placeholder="newsData.newsletter.placeholder" required />
              <input type="submit" :value="newsData.newsletter.buttonLabel" />
            </form>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <!-- Modal1 -->
  <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4>{{ newsData.modal.heading }}</h4>
          <h5>{{ newsData.modal.subheading }}</h5>
          <img :src="newsData.modal.image" alt="blog-image" />
          <span>{{ newsData.modal.content }}</span>
        </div>
      </div>
    </div>
  </div>
  <!-- //Modal1 -->
  <!-- //News -->
</template>
