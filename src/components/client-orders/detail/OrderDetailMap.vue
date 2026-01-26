<template>
  <div class="order-map">
    <div class="order-map__surface">
      <div class="order-map__marker"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-map {
  border-radius: 16px;
  overflow: hidden;
  background: #eef2e6;
}

.order-map__surface {
  position: relative;
  height: 140px;
  background:
    linear-gradient(115deg, rgba(197, 220, 206, 0.6), rgba(244, 241, 220, 0.8)),
    repeating-linear-gradient(0deg, rgba(164, 196, 180, 0.35) 0 6px, rgba(255, 255, 255, 0) 6px 18px),
    repeating-linear-gradient(90deg, rgba(161, 193, 180, 0.35) 0 6px, rgba(255, 255, 255, 0) 6px 18px);
}

.order-map__surface::after {
  content: '';
  position: absolute;
  inset: 18px 22px 30px;
  border-radius: 18px;
  border: 2px solid rgba(103, 140, 126, 0.35);
}

.order-map__marker {
  position: absolute;
  top: 50%;
  left: 60%;
  width: 20px;
  height: 20px;
  background: #ff8a2a;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 6px 12px rgba(255, 138, 42, 0.35);
}

.order-map__marker::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -14px;
  width: 10px;
  height: 14px;
  background: #ff8a2a;
  border-radius: 0 0 10px 10px;
  transform: translateX(-50%);
}
</style>
