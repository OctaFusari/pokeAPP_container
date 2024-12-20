<template>
    <div class="container__generale__router ">
        <div>
            <h1>Modifica profilo {{ this.arrayUtenti.username }}</h1>
            <h3>{{ this.arrayUtenti.email }}</h3>
            <div class=" ods__mini__card__upmodify">
                <div class="ods__mini__card">
                    <div :style="{ backgroundImage: 'url(' + imageUrl + ')' }" class="ods__previewImg" for="actual-btn">
                        <label for="actual-btn"></label>
                        <input hidden type="file" accept="image/*" id="actual-btn" @change="onFileChange" />
                    </div>
                    <button class="buttonlight__little" @click="uploadImage()">Cambia immagine</button>
                </div>
                <div style="    display: flex;
    align-items: center;
    justify-content: center;">
                    <button class="buttonlight__little" @click="logOut()">Logout</button>
                </div>
                </div>
            <div class="ods__mini__card" style="margin: 6vh 0 6vh 0;">

                <div>
                    <v-form @submit.prevent="updateUtente" v-model="valid">
                        <v-text-field v-model="this.arrayUtenti.username" :rules="rules"
                            label="username"></v-text-field>
                        <!-- <v-text-field v-model="this.arrayUtenti.bio" label="bio"></v-text-field> -->

                        <button class="buttonheavy" type="submit" block>Salva modifiche</button>
                    </v-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
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
import DataService from "../dataservice";
export default {
    data() {
        return {
            bio: "",
            email: "",
            idutente: "",
            profile_picture_url: "",
            username: "",
            arrayUtenti: {} = {},
            image: null,
            imageUrl: null,
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
                    this.imageUrl = doc.data().profile_picture_url
                }
            });
        },
        updateUtente: function () {
            console.log(this.arrayUtenti.profile_picture_url)
            let user = localStorage.getItem("login")
            setDoc(doc(DataService.dbEx(), "utenti", user), {
                bio: this.arrayUtenti.bio,
                email: this.arrayUtenti.email,
                idutente: this.arrayUtenti.idutente,
                profile_picture_url: this.arrayUtenti.profile_picture_url,
                username: this.arrayUtenti.username,
            });
        },

        logOut: function () {
            DataService.logout()
            window.location.reload();
        },

        onFileChange(e) {
            const file = e.target.files[0];
            this.image = file;
            this.imageUrl = URL.createObjectURL(file);
        },
        async uploadImage() {
            if (!this.image) {
                alert('Scegli una immagine');
                return;
            }

            const storage = getStorage();
            const storageRef = ref(storage, 'profile_images/' + localStorage.getItem("login"));

            let user = localStorage.getItem("login")
            const uploadTask = uploadBytesResumable(storageRef, this.image);
            uploadTask.on('state_changed',

                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                        setDoc(doc(DataService.dbEx(), "utenti", user), {
                            bio: this.arrayUtenti.bio,
                            email: this.arrayUtenti.email,
                            idutente: this.arrayUtenti.idutente,
                            profile_picture_url: downloadURL,
                            username: this.arrayUtenti.username,
                        });
                    });
                }
            );

        },
    },
    mounted() {
        this.takeUsers()
    },

}

</script>

<style>
.ods__previewImg {
    background-size: cover;
    border: 1px solid var(--color-text);
    width: 200px;
    height: 200px;
    border-radius: 200px;
}

.ods__previewImg label {
    display: block;
    width: 200px;
    height: 200px;
    border-radius: 200px;
}

.ods__mini__card__upmodify{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: ". .";
}

</style>