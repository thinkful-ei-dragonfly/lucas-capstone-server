const faker = require('faker')

const posts = [
  {
    id: 1,
    title: 'Title 1',
    post_type: 'text',
    caption: '',
    text_headline: faker.lorem.slug(),
    text_content: faker.lorem.paragraphs(),
    image_url: '',
    video_id: '',
    audio_url: ''
  },
  {
    id: 2,
    title: 'Title 2',
    post_type: 'image',
    caption: '',
    text_headline: '',
    text_content: '',
    image_url: 'http://ryanlowry.s3.amazonaws.com/gallery/63/w1400_ryanlowry-7.jpg',
    video_id: '',
    audio_url: ''
  },
  {
    id: 3,
    title: 'Title 3',
    post_type: 'image',
    caption: '',
    text_headline: faker.lorem.slug(),
    text_content: faker.lorem.paragraphs(),
    image_url: 'http://ryanlowry.s3.amazonaws.com/gallery/63/w800_ryanlowry-81.jpg',
    video_id: '',
    audio_url: ''
  },
  {
    id: 4,
    title: 'Title 4',
    post_type: 'text',
    caption: '',
    text_headline: faker.lorem.slug(),
    text_content: faker.lorem.paragraphs(),
    image_url: '',
    video_id: '',
    audio_url: ''
  },
  {
    id: 5,
    title: 'Title 5',
    post_type: 'image',
    caption: '',
    text_headline: faker.lorem.slug(),
    text_content: faker.lorem.paragraphs(),
    image_url: 'http://ryanlowry.s3.amazonaws.com/gallery/54/w600_Ryan_Lowry77.jpg',
    video_id: '',
    audio_url: ''
  },
  {
    id: 6,
    title: 'Title 6',
    post_type: 'image',
    caption: '',
    text_headline: faker.lorem.slug(),
    text_content: faker.lorem.paragraphs(),
    image_url: 'http://images.xhbtr.com/v2/uploads/images/256101/xhbtr_74d6a8d4-eb8f-41f7-8844-4436038c0c12_w800.jpg',
    video_id: '',
    audio_url: ''
  },
  {
    id: 7,
    title: 'Title 7',
    post_type: 'video',
    caption: '',
    text_headline: '',
    text_content: '',
    image_url: '',
    video_id: '310236095',
    audio_url: ''
  },
  {
    id: 8,
    title: 'Title 8',
    post_type: 'video',
    caption: '',
    text_headline: '',
    text_content: '',
    image_url: '',
    video_id: '341842996',
    audio_url: ''
  },
  {
    id: 9,
    title: 'Title 9',
    post_type: 'image',
    caption: '',
    text_headline: '',
    text_content: '',
    image_url: 'http://images.xhbtr.com/v2/uploads/images/256115/xhbtr_7c85ef74-797d-4aae-a268-8c9836348265_w1600.jpg',
    video_id: '',
    audio_url: ''
  },
  {
    id: 10,
    title: 'Title 10',
    post_type: 'image',
    caption: '',
    text_headline: '',
    text_content: '',
    image_url: 'http://images.xhbtr.com/v2/uploads/images/256084/xhbtr_5226e5bb-218f-40bb-a1b6-3a7e1767fe62_w1000.jpg',
    video_id: '',
    audio_url: ''
  }
]

module.exports = posts
