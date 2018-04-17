<template>
  <div class="column welcomePage">
    <h1>Budget Projection App</h1>
    <form v-on:submit.prevent="register">
      <p>1. Choose a user name (this is how you will be known by others on Red Bird).</p>
      <input class="wide" v-model="username" placeholder="User Name">
      <p>2. Create an account.</p>
      <input class="wide" v-model="name" placeholder="First and Last Name"><br/>
      <input class="wide" v-model="email" placeholder="Email Address">
      <input class="wide" type="password" v-model="password" placeholder="Password">
      <input class="wide" v-model.number="balance" placeholder="Starting Balance $0.00">
      <button class="alternate" type="submit">Register</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
 export default {
   name: 'WelcomePage',
   data () {
     return {
       username: '',
       email: '',
       password: '',
       name: '',
       balance: '',
     }
   },
   computed: {
     registerError: function() {
       return this.$store.getters.registerError;
     },
   },
   methods: {
     register: function() {
       this.$store.dispatch('register',{
   username: this.username,
         email: this.email,
         password: this.password,
   name: this.name,
   balance: this.balance,
       });
     }
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 img {
     width: 100px;
 }

 h1 {
     margin-bottom: 0px;
 }
 h2 {
     margin-top: 0px;
     font-size: 1.2em;
     font-weight: normal;
     margin-bottom: 50px;
 }
 .wide {
     width: 100%;
 }
</style>