<template>
  <div>
    <div v-for="videoLink in videoLinks">
      <video width="400" controls>
        <source :src="videoLink" type="video/mp4" />
      </video>
    </div>

    <button v-text="'click'" @click.prevent="downloadItems" />
    {{ requestStatus }}
  </div>
</template>

<script>
import axios from "axios";
import * as PouchDB from "pouchdb/dist/pouchdb";
let db = new PouchDB("sample");

export default {
  async mounted() {
    const self = this;
    try {
      const getFilesPromises = this.fileNames.map((fileName) => {
        return db.getAttachment("videos", fileName);
      });

      const blobs = await Promise.all(getFilesPromises);

      const videoLinks = blobs.map((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        return link.href;
      });

      this.videoLinks = videoLinks;
    } catch (err) {
      console.log("fetch from db error");
    }
  },
  methods: {
    async downloadItems() {
      this.requestStatus = "pending";
      const self = this;

      await db.destroy();
      db = new PouchDB("sample");

      const promises = this.fileNames.map((fileName) => {
        return new Promise(async (resolve, reject) => {
          const fileData = await axios.get(`./${fileName}.mp4`, {
            responseType: "blob",
          });
          resolve({
            fileData,
            fileName,
          });
        });
      });

      Promise.all(promises).then(async (values) => {
        const attachments = {};

        values.forEach((file) => {
          attachments[file.fileName] = {
            type: "video/mp4",
            data: file.fileData.data,
          };
        });

        try {
          await db.put({
            _id: "videos",
            _attachments: attachments,
          });
          self.requestStatus = "ready";
        } catch (err) {
          self.requestStatus = "err";
        }
      });
    },
  },
  data: () => ({
    videoLinks: null,
    fileNames: ["videotest", "park"],
    requestStatus: "idle",
  }),
};
</script>
