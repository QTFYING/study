import React, { useEffect } from 'react';
import './shared-counter.js';

function ReactExample() {
  useEffect(() => {
    const counter = document.querySelector('shared-counter');
    counter.addEventListener('count-change', (e) => {
      console.log('Count changed:', e.detail);
    });
  }, []);

  return (
    <div>
      <h2>React中使用共享组件</h2>
      <shared-counter></shared-counter>
    </div>
  );
}

export default ReactExample;