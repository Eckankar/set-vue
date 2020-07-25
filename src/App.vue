<template>
    <div id="app">
        <div id="card-grid">
            <transition-group name="visible-cards" mode="out-in">
                <Card
                    v-for="card in visibleCards" v-bind:key="card.id"
                    v-bind:symbol="card.symbol" v-bind:number="card.number"
                    v-bind:shading="card.shading" v-bind:color="card.color"
                    v-bind:selected="card.selected"
                    @click="toggleSelect(card)"
                />
            </transition-group>
        </div>
        <div id="info-panel">
            <h1>SET</h1>

            <h2>Current score: {{ score }}</h2>

            <div v-if="sets.length > 0">
                <h2>Found sets:</h2>
                <ul class="found-sets">
                    <li v-for="set in sets" v-bind:key="set[0].id">
                        <Card class="mini"
                            v-for="card in set" v-bind:key="card.id"
                            v-bind:symbol="card.symbol" v-bind:number="card.number"
                            v-bind:shading="card.shading" v-bind:color="card.color"
                        />
                    </li>
                </ul>
            </div>

            <button @click="restartGame">Restart</button>

        </div>
    </div>
</template>

<script>
import Card from './components/Card.vue';
import { Deck } from './deck.js';
import _ from 'lodash';

let deck = new Deck();
let visibleCards = deck.draw(12);

export default {
  name: 'SET',
  data: function () {
    return {
        deck: deck,
        visibleCards: visibleCards,
        sets: [],
    };
  },
  computed: {
    selectedCards() {
        return _.filter(this.visibleCards, (c) => c.selected);
    },
    score() {
        return this.sets.length;
    }
  },
  methods: {
    checkForSet () {
        if (this.selectedCards.length != 3) return;

        var complies = true;
        for (let attribute of ['symbol', 'number', 'shading', 'color']) {
            let values = _.map(this.selectedCards, (c) => c[attribute]);
            let uniqCount = _.uniq(values).length;

            complies = complies && (uniqCount == 1 || uniqCount == 3);
        }

        if (complies) {
            this.registerSet(this.selectedCards);
            this.refillCards();
        }
    },
    refillCards () {
        let newCards = 12 - this.visibleCards.length;
        if (newCards > 0) {
            this.visibleCards = [ ...this.visibleCards, ...this.deck.draw(newCards) ];
        }
    },
    removeCard (card) {
        this.visibleCards = _.filter(this.visibleCards, (c) => c.id != card.id);
    },
    registerSet (cards) {
        for (var card of cards) {
            card.selected = false;
            this.removeCard(card);
        }
        this.sets.push(cards);
    },
    restartGame () {
        this.sets = [];
        this.deck = new Deck();
        this.visibleCards = this.deck.draw(12);

    },
    toggleSelect (card) {
        if (this.selectedCards.length >= 3 && ! card.selected) return;

        card.selected = ! card.selected;

        this.checkForSet();
    }
  },
  components: {
    Card,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  display: grid;
  grid-template-columns: 3fr 1fr;
}

#card-grid {
    -webkit-column-count: 4;
       -moz-column-count: 4;
            column-count: 4;

    .card {
        transition: background-color 0.2s;
    }

    .visible-cards-enter-active, .visible-cards-leave-active {
        transition: opacity 0.5s ease;
    }

    .visible-cards-enter, .visible-cards-leave-to {
        opacity: 0;
    }

    .visible-cards-move {
        transition: transform 0.2s ease;
    }
}

#info-panel {
    .found-sets {
        list-style: none;
    }

    .found-sets > li {
        display: flex;
        justify-content: center;
    }
}

</style>
