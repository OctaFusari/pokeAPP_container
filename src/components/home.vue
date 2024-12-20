<template>
  <div class="home__desc">
  <h1 class="h1__big">Pokemon</h1>
  <h3>Scopri i vari tipi di pokemon</h3>
  </div>
  <div class="container__home__gene" v-for="(gene, index) in this.arrayPokeGeneres" :key="gene.id">
    <h1 style="margin-left: 10vw;">{{ this.ArrayGenes[index] }}</h1>
    <v-skeleton-loader
          v-if="this.arrayPokeGeneres[index] == 0"
          type="list-item-avatar"
        ></v-skeleton-loader>
    <v-sheet class="mx-auto">
      <v-slide-group v-model="model" class="pa-4" selected-class="bg-success" show-arrows>
        <v-slide-group-item v-for="pokeData in this.arrayPokeGeneres[index]" :key="pokeData.link" v-slot="{ isSelected, toggle, selectedClass }">
          <div class="ods__card ods__card__little" @click="$router.push({ path: '/opera:' + pokeData.pokemon.name})"
            :style="{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(201, 201, 201, 0.73)), url(' + pokeData.image + ')' }">
            <div class="ods__card__inside">
              <div class="ods__card__inside__uno">
                <div>
                </div>
                <h3>{{ pokeData.pokemon.name }}</h3>
              </div>
              <div class="ods__card__inside__due">
              </div>
            </div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>

import DataService from "../dataservice";
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';

const router = useRouter()
const route = useRoute()

export default {

  data() {
    return {
      arrayPokeGeneres:[],
      ArrayGenes:["fire", "electric", "poison", "ground", "water"]
    }
  },
  watch: {

  },
  methods: {

    async fetchPokemon() {
      for (let i = 0; i < this.ArrayGenes.length; i++) {
      this.error = null;
      this.pokemon = null;
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/type/${this.ArrayGenes[i]}`);
        this.pokemon = response.data;

        const responsePoke = await axios.get(`https://pokeapi.co/api/v2/pokemon/pikachu`);


        console.log(responsePoke.data)
        this.arrayPokeGeneres.push(response.data.pokemon, responsePoke.data.name) 
      } catch (err) {
        this.error = 'Pokémon not found. Please check the name and try again.';
      }
    }
    },
/*     async geneSearch() {
      for (let i = 0; i < this.ArrayGenes.length; i++) {
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/type/${this.ArrayGenes[i]}`);
          console.log(response)
          this.arrayPokeGeneres[i] = response.data._embedded.results.map((result) => (
          {
            id: result._links.self.href.replace("https://www.artsy.net/pokeData/", ""),
            title: result.title,
            desc: result.description,
            type: result.type,
            image: result._links.thumbnail.href,
            style: this.ArrayGenes[i],
            title__intero: result._links.permalink.href.replace("https://www.artsy.net/pokeData/", ""),
          })
        );

        } catch (error) {
          console.error(error);
        }

      }
    }, */
    async checkArt(art){
      await console.log((await DataService.getGene(art)).data.total_count)
/*           if(DataService.getGene(art.title__intero).total_count >0){
            this.arrayPokeGeneres[i].push({
              id: element._links.self.href.replace("https://www.artsy.net/pokeData/", ""),
              title: element.title,
              desc: element.description,
              type: element.type,
              image: element._links.thumbnail.href,
              style: this.ArrayGenes[i],
              title__intero: element._links.permalink.href.replace("https://www.artsy.net/pokeData/", ""),
            })
          } */
    }
  },

  mounted() {
    this.fetchPokemon()
  },
}
</script>

<style>

.home__desc{
  margin: 6vh 10vw 6vh 10vw; 
}

.mx-auto {
  width: 90vw;
}
</style>
