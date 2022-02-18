<template>
  <div>
    <ul>
      <li v-for="(link, index) in links" :key="index">
        <router-link :to="link.to">{{ link.name }}</router-link>
      </li>
    </ul>
    <img src="/static/192.png" />
    <video v-if="blobFile" width="400" controls>
      <source :src="blobFile" type="video/mp4" />
    </video>
    <a
      href="https://kamilgawron.pl/testvideo.mp4"
      v-text="'click'"
      @click.prevent="downloadItem"
    />
    <main>
      <router-view />
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
import axios from "axios";
import * as PouchDB from "pouchdb/dist/pouchdb";
let db = new PouchDB("sample");
export default {
  mounted() {
    const self = this;
    db.getAttachment("image", "file")
      .then(function (blobOrBuffer) {
        if (blobOrBuffer) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blobOrBuffer);
          self.blobFile = link.href;
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  },
  methods: {
    downloadItem() {
      const url =
        "src/assets/videotest.mp4";
      axios
        .get(url, { responseType: "blob" })
        .then(async (response) => {
          const blob = new Blob([response.data], { type: "video/mp4" });
          // const link = document.createElement("a");
          // link.href = URL.createObjectURL(blob);
          // link.download = "label";
          // link.click();
          // URL.revokeObjectURL(link.href);
          await db.destroy();
          db = new PouchDB("sample");
          db.put({
            _id: "image",
            _attachments: {
              file: {
                type: "video/mp4",
                data: blob,
              },
            },
          })
            .then(function (res) {
              console.log("save to db");
            })
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch(console.error);
    },
  },
  data: () => ({
    blobFile: null,
    links: [
      {
        name: "Home",
        to: "/",
      },
      {
        name: "Page 1",
        to: "/page-1",
      },
      {
        name: "Bad Link",
        to: "/random-bad-url",
      },
    ],
  }),
};
</script>