<template>
  <div>
    <ul>
      <li v-for="(link, index) in links" :key="index">
        <router-link :to="link.to">{{ link.name }}</router-link>
      </li>
    </ul>
    <img src="/static/192.png"/>
    <video width="400" controls>
  <source src="/static/test.mp4" type="video/mp4">
</video>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<style scoped>
  ul {
    list-style: none;
    display: flex;
    padding: 0;
  }

  li {
    padding: 5px 15px 5px 0;
  }

  li a {
    text-decoration: none;
    color: black;
  }

  li a:hover {
    color: #404040;
  }
</style>

<script>
export default {
  data: () => ({
    links: [
      {
        name: 'Home',
        to: '/'
      },
      {
        name: 'Page 1',
        to: '/page-1'
      },
      {
        name: 'Bad Link',
        to: '/random-bad-url'
      }
    ]
  })
}
</script>
