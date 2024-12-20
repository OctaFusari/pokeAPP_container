<template>
    <div>
        <div style="margin: 4vh 2vw 4vh 2vw;">
            <div style="margin: 0 0 4vh 0 ;">
                <h1 class="h1__big">{{ this.artistObj.name }}</h1>
            </div>
            <div>
                <div class="ods__form__buttons">
          <button @click="this.sezione__centrale = 0"
            :class="{ 'buttonlight': this.sezione__centrale == 1, 'buttonheavy': this.sezione__centrale == 0 }">Bibliografia</button>
          <button @click="this.sezione__centrale = 1; this.artworkSearch()"
            :class="{ 'buttonlight': this.sezione__centrale == 0, 'buttonheavy': this.sezione__centrale == 1 }">Opere salvate</button>
        </div>
            </div>
        </div>
        <div>
            <div class="ods__mini__card" v-if="this.sezione__centrale == 0">
                <div class="ods__mini__card">
                    <h3>Periodo</h3>
                    <h2>{{ this.artistObj.birth }} - {{ this.artistObj.deathday }}</h2>
                </div>
                <div class="ods__mini__card">
                    <h3>Città natale</h3>
                    <h2>{{ this.artistObj.hometown }}</h2>
                </div>
                <div class="ods__mini__card">
                    <h3>Bibliografia</h3>
                    <p>{{ this.artistObj.desc }}</p>
                </div>
            </div>
            <div v-if="this.sezione__centrale == 1">
                <v-sheet class="mx-auto">
      <v-slide-group v-model="model" class="pa-4" selected-class="bg-success" show-arrows>
        <v-slide-group-item v-for="artwork in this.artByArtist" v-slot="{ isSelected, toggle, selectedClass }">
          <div class="ods__card ods__card__little" @click="$router.push({ path: '/opera:' + artwork.title__intero})"
            :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(201, 201, 201, 0.73)), url(' + artwork.image + ')' }">
            <div class="ods__card__inside">
              <div class="ods__card__inside__uno">
                <div>
                </div>
                <h3>{{ artwork.title }}</h3>
              </div>
              <div class="ods__card__inside__due">
              </div>
            </div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
            </div>
        </div>
    </div>

</template>

<script>
import DataService from "../dataservice";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

export default {
    data() {
        return {
            artistObj: {},
            artByArtist: [],
            sezione__centrale: 0
        };
    },
    methods: {

        async artworkSearch(){

            try {
          const response = await DataService.getArtbyArtist(this.$route.params.arId.substring(1));
          
          this.artByArtist = response.data._embedded.artworks.map((result) => (
          {
            id: result._links.self.href.replace("https://www.artsy.net/artwork/", ""),
            title: result.title,
            desc: result.description,
            type: result.type,
            image: result._links.thumbnail.href,
            title__intero: result._links.permalink.href.replace("https://www.artsy.net/artwork/", ""),
          })
        );

        console.log(this.artByArtist)

        } catch (error) {
          console.error(error);
        }

        },

        async artwSearch() {
            console.log(this.$route.params.arId)
            try {
                const response = await DataService.getArtist(this.$route.params.arId.substring(1));

                this.artistObj =
                {

                    name: response.data.name,
                    desc: response.data.biography,
                    birth: response.data.birthday,
                    deathday: response.data.deathday,
                    hometown: response.data.hometown,
                    title__intero: response.data._links.thumbnail.href,
                }

            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.artwSearch()
    }


};
</script>

<style></style>
