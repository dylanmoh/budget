<template>
  <div class="activity-wrap">
  <form v-on:submit.prevent="transaction" class="transactionForm">
        <input v-model.number="amount" placeholder="$0.00" />
        <input type="checkbox" v-model="isWithdraw" />
            <span v-if="isWithdraw">Withdraw</span>
            <span v-else>Deposit</span><br/>
        <textarea v-model="text" placeholder="Enter transaction description"/><br/>
        <div class="buttonWrap">
          <button class="primary" type="submit">Add Transaction</button>
        </div>
  </form>
  <h1 class="accountBalance">Account Balance: ${{currentBalance}}</h1>
  <div style="width: 100%;">
    <ul class="activity-transaction-list">
      <li class="activity-transaction-list-item activity-transaction-list-item-label"><span class="activity-description">Description</span><span class="activity-date">Date</span><span class="activity-withdraw">Withdraw</span><span class="activity-deposit">Deposit</span><span class="activity-accountId"></span></li>
      <li class="activity-transaction-list-item" v-for="item in feed">
        <span class="activity-description">{{item.description}}</span><span class="activity-date">{{item.created | since}}</span><span class="activity-withdraw"><p v-if="item.isWithdraw==1">${{item.amount}}</p></span><span class="activity-deposit"><p v-if="item.isWithdraw==0">${{item.amount}}</p></span>
        <span class="activity-accountId">
            <div class="buttonWrap">
              <button class="primary deleteButton" v-on:click="deleteTransaction(item)">Delete</button>
            </div>
        </span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
 import moment from 'moment';
 export default {
   name: 'UserFeed',
   data () {
     return {
       amount: '',
       text: '',
       isWithdraw: true,
     }
   },
   created: function() {
     this.$store.dispatch('getFeed');
   },
   filters: {
     since: function(datetime) {
      let date = new Date(datetime);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
     },
   },
   computed: {
     feed: function() {
       return this.$store.getters.feed;
     },
     user: function() {
       return this.$store.getters.user;
     },
     currentBalance: function() {
        let startingBalance = parseFloat(this.$store.getters.user.balance);
        for (let transaction of this.$store.getters.feed) {
          if (transaction.isWithdraw == 1) {
            startingBalance -= parseFloat(transaction.amount);
          }
          else {
            startingBalance += parseFloat(transaction.amount);
          }
        }
        console.log(startingBalance)
       return startingBalance.toFixed(2);
     },
   },
   methods: {
     transaction: function() {
       this.$store.dispatch('addTransaction',{
         amount: this.amount,
         description: this.text,
         isWithdraw: this.isWithdraw,
       }).then(transaction => {
   this.amount = "";
   this.text = "";
       });
     },
     deleteTransaction: function(transItem) {
       this.$store.dispatch('deleteTransaction',transItem.id);
     },
   }
 }
</script>

<style scoped>
.activity-transaction-list {
  list-style: none;
  font-size: 9px;
  margin: 0 20px;
  padding: 0;
  background: #efefef;
    border: solid 1px #afafaf;
    border-radius: 20px;
}

@media(min-width: 650px) {
  .activity-transaction-list-item-label {
    font-size: 16px;
  }

  .activity-transaction-list{
    font-size: 16px;
  }
  .activity-wrap{
    width: 75%;
  }
}

.activity-wrap{
  padding-top: 15px;
  display: block;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 80px;
}

.activity-transaction-list-item {
  height: 36px;
}

.activity-transaction-list li:last-child span {
  border-bottom: none;
}

.activity-transaction-list-item span {
  width: calc(20% - 1px);
    display: block;
    float: left;
    border-right: solid 1px #afafaf;
    border-bottom: solid 1px #afafaf;
    height: 35px;
    line-height: 35px;
    overflow: hidden;
}

.activity-transaction-list-item span:last-child {
  border-right: none;
}

.activity-transaction-list-item span p {
  margin: 0;
}

.activity-withdraw {
  color: red;
}

.activity-deposit {
  color: green;
}

.transactionForm {
     background: #eee;
     padding: 10px;
     margin-bottom: 10px;
     border: solid 1px #ddd;
 }
 .buttonWrap {
     width: 100%;
     display: flex;
 }
 .deleteButton {
  height: 100%;
  width: 100%;
 }
 button {
     margin-left: auto;
     height: 2em;
     font-size: 0.9em;
 }
 textarea {
     width: 100%;
     height: 5em;
     padding: 2px;
     margin-bottom: 5px;
     resize: none;
     box-sizing: border-box;
 }
 .accountBalance {
  text-align: center;
 }
 ul {
  text-align: center;
 }
 .activity-transaction-list-item:first-child .activity-description {
  font-size: 16px;
 }
 .activity-description {
  font-size: 10px;
 }
</style>