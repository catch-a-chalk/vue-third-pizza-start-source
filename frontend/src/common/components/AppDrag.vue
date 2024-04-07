<template>
  <div
    :draggable="true"
    @dragstart.self="onDragStart"
    @dragover.prevent
    @dragenter.prevent
  >
    <slot/>
  </div>
</template>

<script setup>
import { DATA_TRANSFER_PAYLOAD } from "@/common/constants";

const props = defineProps({
  transferData: {
    type: Object,
    required: true,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
});

const onDragStart = ({ dataTransfer }) => {
  const data = JSON.stringify(props.dataTransfer);
  dataTransfer.setData(DATA_TRANSFER_PAYLOAD, data);
};
</script>