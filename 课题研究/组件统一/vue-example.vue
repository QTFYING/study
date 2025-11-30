<template>
  <div>
    <h2>Vue中使用共享组件</h2>
    <shared-counter @count-change="handleCountChange"></shared-counter>
  </div>
</template>

<script>
import './shared-counter.js';

export default {
  methods: {
    handleCountChange(e) {
      console.log('Count changed:', e.detail);
    }
  }
}
</script>