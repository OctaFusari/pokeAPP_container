<template>
  <div class="container__generale__router profilo__container">
    <div>
      <div class="profilo__upper">
        <div class="profilo__upper__sez__uno"
          :style="{ backgroundImage: 'url(' + this.arrayUtenti.profile_picture_url + ')' }">

        </div>
        <div class="profilo__upper__sez__due">
          <div v-if="this.arrayUtenti != {}">
              <h1 style="margin-top: -20px;" >Benvenuto</h1>
              <h1 style="margin-top: -20px;" class="h1__big">{{ this.arrayUtenti.username }}</h1>
          </div>
          <div>
            <h4 
              v-if="user == (':' + user__local)" @click="$router.push({ name: 'modificaProfilo' })" style="cursor: pointer;">Modifica profilo</h4>
          </div>
<!--           <div>
            <h3>{{ this.arrayUtenti.bio }}</h3>
          </div> -->
        </div>
      </div>
      <div class="profilo__centro">
        <div class="gallery-image">
          <div v-for="post in this.arraySalvati" class="ods__card ods__card__little img-box" @click="$router.push({ path: '/opera:' + post.title__intero})"
            :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(201, 201, 201, 0.73)), url(' + post.image + ')' }">
            <div class="ods__card__inside">
              <div class="ods__card__inside__uno">
                <div>
                </div>
                <h3>{{ post.title }}</h3>
              </div>
              <div class="ods__card__inside__due">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gallery-image {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

.img-box {
  box-sizing: content-box;
  margin: 10px;
  height: 250px;
  width: 350px;
  position: relative;
}

.profilo__upper {
  display: flex;
}

.profilo__upper div {
  margin: 1vw;
}

.profilo__container {
  display: grid;
  grid-template-columns: 1fr .5fr;
  grid-template-rows: 1fr;
  grid-template-areas: ". .";
  margin-top: 3vw;
}

.profilo__upper__sez__uno {
  background-size: cover;
  border: 1px solid var(--color-text);
  width: 100px;
  height: 100px;
  border-radius: 100px;
}

@media only screen and (max-width: 600px) {
  .profilo__upper__sez__due div:first-of-type {
    display: block;
    align-items: center;
  }
}

@media only screen and (max-width: 1200px) {


  .profilo__upper__sez__due span {
    margin-left: 0vw !important;
  }


  .profilo__uppersez__due div:first-of-type {
    display: block;
    align-items: center;
  }
}
</style>

<script>
import DataService from "../dataservice";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as refFire } from 'firebase/storage';
import { onMounted } from 'vue';
import { ref as refVue } from 'vue';
import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  and,
  writeBatch,
  setDoc,
  getDoc,
} from "firebase/firestore";
export default {
  data() {
    return {
      commentotxt: "",
      arrayUtenti: {} = {},
      arraySalvati: [],
      user: this.$route.params.userId,
      user__local: localStorage.getItem("login"),
    };
  },
  methods: {

    takeUsers: async function () {
      const querySnapshot = await getDocs(collection(DataService.dbEx(), "utenti"));
      querySnapshot.forEach((doc) => {
        var route__dot = this.$route.params.userId;
        var route__nodot = route__dot.substring(1);
        if (doc.id == route__nodot) {
          this.arrayUtenti = { id: doc.id, ...doc.data() }
        }
      });
    },

    takeUserPost: async function () {
      const querySnapshot = await getDocs(collection(DataService.dbEx(), "likes"));
      querySnapshot.forEach((doc) => {
        var route__dot = this.$route.params.userId;
        var route__nodot = route__dot.substring(1);
        if (doc.data().userId == route__nodot) {
          this.artworkData(doc.data().postId)
        }
      });
      console.log(this.arraySalvati)
    },
    async artworkData(title) {
      try {
        const response = await DataService.getGene(title);
        this.arraySalvati.push(
        {
          id: response.data._embedded.results[0]._links.self.href.replace("https://www.artsy.net/artwork/", ""),
          title: response.data._embedded.results[0].title,
          desc: response.data._embedded.results[0].description,
          type: response.data._embedded.results[0].type,
          image: response.data._embedded.results[0]._links.thumbnail.href,
          title__intero: response.data._embedded.results[0]._links.permalink.href.replace("https://www.artsy.net/artwork/", ""),
        }

        )
      } catch (error) {

      }
    }
  },

  mounted() {
    this.takeUsers()
    this.takeUserPost()
  },


};
</script>