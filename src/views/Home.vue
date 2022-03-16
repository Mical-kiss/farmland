<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="这里应该种点什么东西的"/>
    <div id="root1"></div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

import { createElement, render, renderDom } from './virtualDom/element';
import diff from './virtualDom/diff';
import patch from './virtualDom/patch';

let virtualDom = createElement('ul', {class: 'list'}, ['abc', '111']);

let el = render(virtualDom); // 渲染虚拟DOM得到真实的DOM结构
console.log(el);

export default {
  name: 'Home',
  mounted() {
    renderDom(el, document.getElementById('root1'));
    let virtualDom2 = createElement('ul', {class: 'list'}, ['abc']);
    // diff一下两个不同的虚拟DOM
    let patches = diff(virtualDom, virtualDom2);
    console.log(patches);
    // 将变化打补丁，更新到el
    patch(el, patches);

  },
  components: {
    HelloWorld
  }
}
</script>
