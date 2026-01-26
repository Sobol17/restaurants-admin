<script setup>
import AppSwitch from '@/components/ui/AppSwitch.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconDelete from '@/components/icons/IconDelete.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  active: Boolean,
  showDelete: Boolean,
})

const emit = defineEmits(['toggle', 'edit', 'delete'])

const handleToggle = (value) => emit('toggle', props.id, value)
const handleEdit = () => emit('edit', props.id)
const handleDelete = () => emit('delete', props.id)
</script>

<template>
  <article class="menu-dish">
    <img class="menu-dish__image" :src="image" :alt="title"/>
    <div class="menu-dish__content">
      <div class="menu-dish__title">{{ title }}</div>
      <div class="menu-dish__price">{{ price }}</div>
    </div>
    <div class="menu-dish__controls">
      <AppSwitch :model-value="active" @update:modelValue="handleToggle"/>
      <button type="button" class="menu-dish__edit" @click="handleEdit">
        <IconEdit/>
      </button>
      <button v-if="showDelete" type="button" class="menu-dish__delete" @click="handleDelete">
        <IconDelete/>
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use "@/assets/layout/colors" as *;

.menu-dish {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 16px;
  background-color: #ffffff;
  border: 1px solid #ededed;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
}

.menu-dish__image {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  object-fit: cover;
  background-color: $color-bg-muted;
  flex-shrink: 0;
}

.menu-dish__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.menu-dish__title {
  font-size: 13px;
  font-weight: 600;
  color: #2c2c2c;
  line-height: 1.3;
}

.menu-dish__price {
  font-size: 12px;
  font-weight: 600;
  color: #6b6b6b;
}

.menu-dish__controls {
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-dish__edit {
  border: 1px solid #e6e6e6;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background-color: #ffffff;
  color: #2c2c2c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.menu-dish__delete {
  border: 1px solid rgba(219, 82, 84, 0.25);
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background-color: #ffffff;
  color: $color-danger;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
