<template>
  <div class="home__desc">
    <h1 class="h1__big">Pokemon</h1>
    <h3>Scopri i vari tipi di pokemon</h3>
  </div>
  <div
    class="container__home__gene"
    v-for="(gene, index) in this.arrayPokeGeneres"
    :key="gene.id"
  >
    <h1 style="margin-left: 10vw">{{ this.ArrayGenes[index] }}</h1>
    <v-skeleton-loader
      v-if="this.arrayPokeGeneres[index] == 0"
      type="list-item-avatar"
    ></v-skeleton-loader>
    <v-sheet class="mx-auto">
      <v-slide-group
        v-model="model"
        class="pa-4"
        selected-class="bg-success"
        show-arrows
      >
        <v-slide-group-item
          v-for="pokeData in this.arrayPokeGeneres[index]"
          :key="pokeData.link"
          v-slot="{ isSelected, toggle, selectedClass }"
        >
          <div
            class="ods__card ods__card__little"
            @click="$router.push({ path: '/pokemon:' + pokeData.pokemon.name })"
            :style="{
              backgroundImage:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(201, 201, 201, 0.73)), url(' +
                pokeData.data.sprites.front_default +
                ')',
            }"
          >
            <div class="ods__card__inside">
              <div class="ods__card__inside__uno">
                <div></div>
                <h3>{{ pokeData.pokemon.name }}</h3>
              </div>
              <div class="ods__card__inside__due"></div>
            </div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import DataService from "../dataservice";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

export default {
  data() {
    return {
      arrayPokeGeneres: [],
      ArrayGenes: ["fire", "electric", "poison", "ground", "water"],
    };
  },
  watch: {},
  methods: {
    async fetchPokemon() {
      for (let i = 0; i < this.ArrayGenes.length; i++) {
        this.error = null;
        try {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/type/${this.ArrayGenes[i]}`
          );

          let varLengTemp = response.data.pokemon.slice(0, 10).length;

          for (let l = 0; l < varLengTemp; l++) {
            let responsePoke = await axios.get(
              `https://pokeapi.co/api/v2/pokemon/${response.data.pokemon[l].pokemon.name}`
            );
            response.data.pokemon[l] = {
              ...response.data.pokemon[l],
              ...responsePoke,
            };
          }
          this.arrayPokeGeneres.push(response.data.pokemon.slice(0, 10));
        } catch (err) {
          this.error = "Pokémon non trovato";
        }
      }
    },
  },

  mounted() {
    this.fetchPokemon();
  },
};
</script>

<style>
.home__desc {
  margin: 6vh 10vw 6vh 10vw;
}

.mx-auto {
  width: 90vw;
}
</style>
