<template>
    <div class="card" v-bind:class="{ selected: selected }" @click="$emit('click')">
        <div class="inner-card">
            <div class="symbol"
                v-for="sym in parseInt(number)" :key="sym">
                <svg preserveAspectRatio="none"
                viewBox="0 0 10 10">

                    <pattern v-bind:id="shadedPatternName" patternUnits="userSpaceOnUse"
                            width="1" height="1">
                    <path d="M 0.1 0    L 0.1 1
                            M 0.35 0   L 0.35 1
                            M 0.6 0    L 0.6 1
                            M 0.85 0   L 0.85 1
                        "
                        stroke-width="0.1" v-bind:stroke="drawColor"/>
                    </pattern>

                    <g v-bind:fill="shadePattern" v-bind:stroke="drawColor">

                        <!-- Diamond -->
                        <path v-if="symbol === 'diamond'" d="
                            M 1 5
                            L 5 9
                            L 9 5
                            L 5 1
                            L 1 5
                            L 5 9
                        "/>

                        <!-- Circle -->
                        <path v-if="symbol === 'circle'" d="
                        M 2 1 L 8 1
                        C 10 1, 10 9, 8 9
                        M 8 9 L 2 9
                        C 0 9, 0 1, 2 1
                        "/>

                        <!-- Squiggle -->
                        <path v-if="symbol === 'squiggle'" d="
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
    symbol: String,
    number: Number,
    shading: String,
    color: String,
    selected: Boolean,
  },
  computed: {
    drawColor() {
      if (this.color === 'green')  return '#00FF00';
      if (this.color === 'red')    return '#FF0000';
      if (this.color === 'purple') return '#3714a3';
      return '#FFFFFF';
    },
    symbolClass() {
      return `col-${this.color}`;
    },
    shadePattern() {
      if (this.shading === 'shaded') return `url(#shaded-${this.drawColor})`;
      if (this.shading === 'filled') return this.drawColor;
      if (this.shading === 'empty')  return this.selected ? '#CCC' : '#FFFFFF';
      return '';
    },
    shadedPatternName() {
      return 'shaded-' + this.drawColor;
    }
  },
};
</script>

<style scoped lang="scss">
    .card {
        width: 150px;
        height: 200px;
        padding: 5px;

        &.mini {
            width: 75px;
            height: 100px;

            svg {
                width: 60px;
                height: 30px;
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
    }

    svg {
        width: 120px;
        height: 60px;
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
