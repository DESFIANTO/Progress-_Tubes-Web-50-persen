<template>
  <div class="chart">
    <canvas :id="id"></canvas>
  </div>
</template>

<script>
import {v4 as uuid} from 'uuid';
import Chart from 'chart.js';

export default {
  name: 'app-home-chart',

  props: ['config'],

  data() {
    return {
      id: uuid(),
    };
  },

  mounted() {
    const ctx = document.getElementById(this.id);
    const card = new Chart(ctx, this.config);
    card;
  },
};
</script>

<style>
.chart {
  background-color: white;
  padding: 24px;
  border: 1px solid #e8e8e8;
}
</style>
