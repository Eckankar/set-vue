<template>
    <div class="card" v-bind:class="{ selected: card.selected, error: card.error }"
        @click="$emit('click')">
        <div class="inner-card">
            <div class="card.symbol"
                v-for="sym in parseInt(card.number)" :key="sym">
                <svg preserveAspectRatio="none"
                viewBox="0 0 10 10">

                    <pattern v-bind:id="shadedPatternName" patternUnits="userSpaceOnUse"
                            width="1" height="1">
                    <path d="M 0.1 0    L 0.1 1
                            M 0.6 0    L 0.6 1
                        "
                        stroke-width="0.1" v-bind:stroke="drawColor"/>
                    </pattern>

                    <g v-bind:fill="shadePattern" v-bind:stroke="drawColor">

                        <!-- Diamond -->
                        <path v-if="card.symbol === 'diamond'" d="
                            M 1 5
                            L 5 9
                            L 9 5
                            L 5 1
                            L 1 5
                            L 5 9
                        "/>

                        <!-- Circle -->
                        <path v-if="card.symbol === 'circle'" d="
                        M 2 1 L 8 1
                        C 10 1, 10 9, 8 9
                        M 8 9 L 2 9
                        C 0 9, 0 1, 2 1
                        "/>

                        <!-- Squiggle -->
                        <path v-if="card.symbol === 'squiggle'" d="
                        M 1 6
                        C 1 4, 1 1, 3 1
                        S 5 4, 7 3
                        S 9 0, 9 4

                        C 9 6, 9 9, 7 9
                        S 5 6, 3 7
                        S 1 10, 1 6
                        "/>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: Object,
  },
  computed: {
    drawColor() {
      if (this.card.color === 'green')  return '#00FF00';
      if (this.card.color === 'red')    return '#FF0000';
      if (this.card.color === 'purple') return '#3714a3';
      return '#FFFFFF';
    },
    symbolClass() {
      return `col-${this.color}`;
    },
    shadePattern() {
      if (this.card.shading === 'shaded') return `url(#shaded-${this.drawColor})`;
      if (this.card.shading === 'filled') return this.drawColor;
      if (this.card.shading === 'empty')  return this.card.error ? '#C00' :
                                                 this.card.selected ? '#CCC' :
                                                                      '#FFFFFF';
      return '';
    },
    shadedPatternName() {
      return 'shaded-' + this.drawColor;
    }
  },
};
</script>

<style scoped lang="scss">
    @mixin cardSizes($card-size) {
        width: $card-size;
        height: $card-size * 4/3;
        padding: $card-size / 10;

        .inner-card {
            padding: 2px + $card-size / 20;
        }

        svg {
            width: $card-size * 0.8;
            height: $card-size * 0.4;
        }

    }

    .card {
        @include cardSizes(150px);

        &.mini {
            @include cardSizes(75px);
        }

        @media only screen and (max-device-width : 767px) {
            @include cardSizes(70px);

            &.mini {
                @include cardSizes(40px);
            }
        }
    }

    .inner-card {
        display: inline-block;
        border: 1px solid black;
        margin: 0px;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .selected & {
            background-color: #CCC;
        }

        .error & {
            background-color: #C00;
            transition: background-color 0.5s ease;
        }
    }

    .symbol {
        padding: 0;
        display: flex;
        flex-direction: both;
        justify-content: space-around;
    }

    .col-green {
        color: #00FF00;
    }

    .col-red {
        color: #FF0000;
    }

    .col-purple {
        color: #3714a3;
    }
</style>
