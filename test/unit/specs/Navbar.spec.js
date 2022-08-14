import Vue from 'vue'
import Navibar from '@/components/Navibar'

describe('Navibar.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Navibar)
    const vm = new Constructor().$mount()
    console.log(vm.$el)
    expect(vm.$el.querySelector('.navbar-text').tagName)
      .to.equal('P')
  })
})
