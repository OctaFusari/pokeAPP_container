<template>
    <div class="container__interno" v-if="this.PokeObj != undefined">
      <section v-if="PokeObj.sprites" class="container__immagini">
        <div v-if="PokeObj.sprites.front_default" :style="{ backgroundImage: 'url(' + PokeObj.sprites.front_default + ')' }">
          
        </div>
        <div v-if="PokeObj.sprites.front_shiny" :style="{ backgroundImage: 'url(' + PokeObj.sprites.front_shiny + ')' }">
          
        </div>
        <div v-if="PokeObj.sprites.back_default" :style="{ backgroundImage: 'url(' + PokeObj.sprites.back_default + ')' }">

        </div>
        <div v-if="PokeObj.sprites.back_shiny" :style="{ backgroundImage: 'url(' + PokeObj.sprites.back_shiny + ')' }">
          
        </div>
      </section>
      <section class="ods__mini__card" >
        <div>
          
          <svg @click="likeScrittura" style="cursor: pointer" width="30" height="34" viewBox="0 0 30 34"
                        fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.333008 31.5339V3.69854C0.333008 2.7417 0.659397 1.92258 1.31217 1.2412C1.96495 0.55981 2.74967 0.219116 3.66634 0.219116H20.333C21.2497 0.219116 22.0344 0.55981 22.6872 1.2412C23.34 1.92258 23.6663 2.7417 23.6663 3.69854V31.5339L11.9997 26.3148L0.333008 31.5339ZM3.66634 26.2278L11.9997 22.4874L20.333 26.2278V3.69854H3.66634V26.2278Z"
                            :style="{'fill': liked ? '#FF5400': 'var(--color-text)'}" />
                    </svg>
        </div>
        <div>
          <h4>Titolo</h4>
          <h1 class="h1__large">{{ PokeObj.name}}</h1>
        </div>
        <div>
          <h4>Esperienza base</h4>
          <h2>{{ PokeObj.base_experience}}</h2>
        </div>
        <div>
          <h4>Abilità</h4>
          <div class="ods__mini__card" v-for="ability in PokeObj.abilities">
            <h2>{{ability.ability.name}}</h2>
          </div>
        </div>
      </section>
    </div>
</template>

<script>
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
import DataService from "../dataservice";
import { useRouter, useRoute } from 'vue-router'
import axios from "axios";

const router = useRouter()
const route = useRoute()

export default {

  data() {
    return {
        PokeObj:{},
        user: localStorage.getItem("login"),
        liked: false,
        pokeName:null,
    }
  },
  watch: {
    '$route.params.opId': {
      immediate: true,
      handler() {
        this.PokeSearch()
      },
    },
  },
  methods: {
    async PokeSearch() {
      this.pokeName = this.$route.params.opId
        try {
          let responsePoke = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${this.pokeName.substring(1)}`
            );
          this.PokeObj = responsePoke.data
        } catch (error) {
            console.log(error)
        }
    }, 
    

    checkIfLiked: async function () {
            const docRefUt = doc(DataService.dbEx(), 'likes_poke', this.user + "_oppla_" + this.pokeName.substring(1));
            const docSnap = await getDoc(docRefUt);

            if (docSnap.exists()) {
                this.liked = true;
            }else{
                this.liked = false;
            }
        },
        likeScrittura: async function () {
            if (this.user) {
                if (this.liked) {
                    await this.unlikeImage();
                } else {
                    await this.likeImage();
                }
            } 
        },
        unlikeImage: async function () {
            deleteDoc(doc(DataService.dbEx(), 'likes_poke', this.user + "_oppla_" + this.pokeName.substring(1))).then(() =>{
                this.checkIfLiked()
            });
            
        },
        likeImage: async function () {
            const docRef = await setDoc(doc(DataService.dbEx(), 'likes_poke', this.user + "_oppla_" + this.pokeName.substring(1)), {
                userId: this.user,
                postId: this.pokeName.substring(1)
            })
            this.checkIfLiked()
        } 
  },

  mounted() {
    this.PokeSearch()
  },
}
</script>

<style>

  .container__immagini{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: ". ." ". .";
  }

  .container__immagini div{
    background-size: contain;
  }

  .container__interno {
    margin: 10vh;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: fit-content;
    grid-template-areas: ". .";
  }

  .container__interno section:first-of-type{
    background-repeat: no-repeat;
    background-size: cover;
    margin: 4vh;
    height: 100vh;
  }

  .container__interno section:last-of-type div{
    margin: 3vh 1vw 3vh 1vw
  }

  @media only screen and (max-width: 800px) {
    .container__interno {
    margin: 4vh;
    display: block
  }
  .container__interno section:first-of-type{
    height: 50vh;
  }
  }

</style>
