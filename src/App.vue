<template>
    <div id="app">
        <div id="info-panel">
            <h1>SET</h1>

            <ul id="toplinks">
                <li><a href="http://magliery.com/Set/SetRules.html">Rules</a></li>
                <li><a href="https://github.com/Eckankar/set-vue">GitHub</a></li>
            </ul>

            <h2>Current score: {{ score }}</h2>
            <h2>SETs available: {{ availableSets.length }}</h2>

            <button @click="restartGame">Restart</button>

            <div v-if="sets.length > 0" id="found-sets-container-top">
                <h2>Found sets:</h2>
                <ul class="found-sets">
                    <li v-for="set in sets" v-bind:key="set[0].id">
                        <Card class="mini"
                            v-for="card in set" v-bind:key="card.id"
                            v-bind:card="card"
                        />
                    </li>
                </ul>
            </div>
        </div>
        <transition-group name="visible-cards" mode="out-in" id="card-grid" tag="div">
            <Card
                v-for="card in visibleCards" v-bind:key="card.id"
                v-bind:card="card"
                @click="toggleSelect(card)"
            />
        </transition-group>
        <div v-if="sets.length > 0" id="found-sets-container-bottom">
            <h2>Found sets:</h2>
            <ul class="found-sets">
                <li v-for="set in sets" v-bind:key="set[0].id">
                    <Card class="mini"
                        v-for="card in set" v-bind:key="card.id"
                        v-bind:card="card"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Card from './components/Card.vue';
import { Deck } from './deck.js';
import { combinations } from './utils.js';
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
    availableSets () {
        let possibleSets = combinations(this.visibleCards, 3);
        return _.filter(possibleSets, (s) => this.verifySet(s));
    },
    selectedCards() {
        return _.filter(this.visibleCards, (c) => c.selected);
    },
    score() {
        return this.sets.length;
    },
  },
  methods: {
    checkForSet () {
        if (this.selectedCards.length != 3) return;

        if (! this.verifySet(this.selectedCards)) {
            let that = this;
            for (let card of this.selectedCards) {
                that.$set(card, 'error', true);
            }
            setTimeout( () => {
                for (let card of that.visibleCards) {
                    that.$set(card, 'error', false);
                    card.selected = false;
                }
            }, 500 );
            return;
        }

        this.registerSet(this.selectedCards);
        this.refillCards();
    },
    verifySet (cards) {
        if (cards.length != 3) return;

        var complies = true;
        for (let attribute of ['symbol', 'number', 'shading', 'color']) {
            let values = _.map(cards, (c) => c[attribute]);
            let uniqCount = _.uniq(values).length;

            complies = complies && (uniqCount == 1 || uniqCount == 3);
        }

        return complies;
    },
    refillCards () {
        let newCards = 12 - this.visibleCards.length;
        if (newCards > 0) {
            this.visibleCards = [ ...this.visibleCards, ...this.deck.draw(newCards) ];
        }
        while (this.availableSets.length == 0 && ! this.deck.empty()) {
            this.visibleCards = [ ...this.visibleCards, ...this.deck.draw(3) ];
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

    @media only screen and (min-device-width : 768px) {
        display: grid;
        grid-template-columns: 1fr 3fr;

        #found-sets-container-bottom {
            display: none;
        }
    }

    @media only screen and (max-device-width : 767px) {
        #found-sets-container-top {
            display: none;
        }
    }
}

#card-grid {
    -webkit-column-count: 4;
       -moz-column-count: 4;
            column-count: 4;

    .card {
        transition: background-color 0.2s;

        -webkit-column-break-inside: avoid;
                  page-break-inside: avoid;
                       break-inside: avoid;
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
    h1, h2 {
        margin: 0;
        margin-bottom: 0.3rem;
    }

    #toplinks {
        margin: .4em 0;

        padding: 0;
        list-style: none;
        font-size: smaller;

        & > li {
            display: inline;

            a {
                padding: 0px .3rem;
            }

            // https://blog.sapegin.me/all/accessible-inline-list/
            & + li::before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                margin: 0 0.5ch;
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background-color: currentColor;
            }
        }
    }

}

.found-sets {
    list-style: none;

    & > li {
        display: flex;
        justify-content: center;
    }
}

</style>
