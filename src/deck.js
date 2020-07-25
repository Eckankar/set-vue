import _ from 'lodash';
import { cartesianProduct } from './utils.js';

export class Deck {
    constructor () {
        this.initializeDeck();
        this.shuffle();
    }

    initializeDeck() {
        this.cards = cartesianProduct(
            ['red', 'green', 'purple'],
            ['circle', 'diamond', 'squiggle'],
            [1, 2, 3],
            ['empty', 'shaded', 'filled'],
        );

        var id = 0;
        this.cards = _.map(this.cards, (a) => {
            return {
                id: id++,
                color: a[0],
                symbol: a[1],
                number: a[2],
                shading: a[3],
                selected: false,
            };
        });
    }

    shuffle() {
        this.cards = _.shuffle(this.cards);
    }

    draw(n) {
        var res = this.cards.slice(0, n);
        this.cards = this.cards.slice(n);
        return res;
    }
}
