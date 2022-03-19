<template>
  <div class="o-mainPage">
    <div class="o-mainPage__videosContainer">
      <div v-for="videoLink in videoLinks">
        <video class="o-mainPage__video" controls controlsList="nodownload">
          <source :src="videoLink" type="video/mp4" />
        </video>
      </div>
    </div>

    <Modal :closable="false" v-if="modalOpen" @close="modalOpen = !modalOpen">
      <div class="o-mainPage__noFilesWrapper">
        <div
          v-if="requestStatus === MoviesStatuses.LOADING"
          class="o-mainPage__noFilesWrapper"
        >
          <p>Pobieranie filmów...</p>
          <Loader />
        </div>
        <div v-else-if="requestStatus === MoviesStatuses.READY">
          <p>
            Filmy zaktualizowane poprawnie
          </p>
          <button class="a-button" @click="modalOpen = !modalOpen">
            Zamknij
          </button>
        </div>
        <div v-else-if="requestStatus === MoviesStatuses.ERROR">
          <p>
            Błąd podczas pobierania. Spróbuj ponownie później lub skontaktuj się
            z administratorem Serwisu
          </p>
          <button class="a-button" @click="downloadItems">
            Spróbuj ponownie
          </button>
        </div>
        <div v-else>
          <p>Zaktualizuj listę filmów</p>
          <button class="a-button" @click="downloadItems">
            Zaktualizuj
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal";
import Loader from "./Loader";
import axios from "axios";
import * as PouchDB from "pouchdb/dist/pouchdb";
let db = new PouchDB("sample");

const MoviesStatuses = {
  ERROR: "err",
  LOADING: "loading",
  READY: "ready",
  IDLE: "idle",
};
Object.freeze(MoviesStatuses);

export default {
  name: "MainPage",
  components: { Modal, Loader },
  mounted() {
    const self = this;
    this.fetchMoviesFromDb();
  },
  methods: {
    async fetchMoviesFromDb() {
      this.requestStatus = MoviesStatuses.LOADING;

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
        this.requestStatus = MoviesStatuses.READY;
      } catch (err) {
        this.modalOpen = true;
        this.requestStatus = MoviesStatuses.IDLE;
      }
    },
    async downloadItems() {
      this.modalOpen = true;
      this.requestStatus = MoviesStatuses.LOADING;
      const self = this;

      await db.destroy();
      db = new PouchDB("sample");

      const promises = this.fileNames.map((fileName) => {
        return new Promise(async (resolve, reject) => {
          try {
            const fileData = await axios.get(`./videos/${fileName}.mp4`, {
              responseType: "blob",
            });
            resolve({
              fileData,
              fileName,
            });
          } catch (err) {
            reject(err);
          }
        });
      });

      Promise.all(promises)
        .then(async (values) => {
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

            this.fetchMoviesFromDb();
            self.requestStatus = MoviesStatuses.READY;
          } catch (err) {
            self.requestStatus = MoviesStatuses.ERROR;
          }
        })
        .catch(() => {
          this.requestStatus = MoviesStatuses.ERROR;
        });
    },
  },
  data: () => ({
    MoviesStatuses,
    modalOpen: false,
    videoLinks: null,
    fileNames: [
      "videotest",
      "park",
      "park1",
      "park2",
      "park3",
      "park4",
      "park5",
      "park6",
      "park7",
      "park8",
    ],
    requestStatus: "idle",
  }),
};
</script>
