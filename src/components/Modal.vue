<template>
    <div class="o-modal">
        <div class="o-modal__wrapper">
            <div class="o-modal__dialog">
                <div class="o-modal__header"> 
                <h4 class="o-modal__title">Title</h4>
                    <div v-if="closable" class="o-modal__close" @click="$emit('close')">&#x2715</div>
                </div>
            <div class="o-modal__divider"></div>
            <div class="o-modal__content">
                <slot></slot>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Modal",
  props:{
      closable:{
          type:Boolean,
          default:true
      }
  },
};
</script>
