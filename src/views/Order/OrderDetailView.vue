<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useOrderStore } from '@/stores/order_store'

  const route = useRoute()
  const orderStore = useOrderStore()

  watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        orderStore.fetchOrderById(newId)
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    if (route.params.id) {
      orderStore.fetchOrderById(route.params.id)
    }
  })
</script>

<template>
  <div class="order-detail-page">
    <h1>訂單詳情</h1>

    <div v-if="orderStore.isDetailLoading" class="loading">
      <p>正在載入訂單詳情...</p>
    </div>

    <div v-else-if="orderStore.error" class="error-message">
      <p>{{ orderStore.error }}</p>
    </div>

    <div v-else-if="orderStore.currentOrder" class="order-details-container">
      <section class="info-section">
        <h3>基本資訊</h3>
        <ul>
          <li>訂單編號:{{ orderStore.currentOrder.id }}</li>
          <li>訂單日期:{{ orderStore.currentOrder.orderDate }}</li>
          <li>訂單狀態:{{ orderStore.currentOrder.status }}</li>
          <li>付款方式:{{ orderStore.currentOrder.paymentMethod }}</li>
          <li>付款狀態:{{ orderStore.currentOrder.paymentStatus }}</li>
          <li>總金額:NT$ {{ orderStore.currentOrder.total }}</li>
        </ul>
      </section>

      <section class="info-section">
        <h3>購買人資訊</h3>
        <ul>
          <li>購買人姓名:{{ orderStore.currentOrder.customerName }}</li>
          <li>聯絡電話:{{ orderStore.currentOrder.customerPhone }}</li>
          <li>電子郵件:{{ orderStore.currentOrder.customerEmail }}</li>
          <li>收件地址:{{ orderStore.currentOrder.shippingAddress }}</li>
        </ul>
      </section>

      <section class="info-section">
        <h3>商品明細</h3>
        <ul>
          <li v-for="item in orderStore.currentOrder.items" :key="item.productId">
            {{ item.productName }}:{{ item.price }} x {{ item.quantity }} =
            {{ item.price * item.quantity }}
          </li>
          <li>總計:NT$ {{ orderStore.currentOrder.total }}</li>
        </ul>
      </section>

      <section class="info-section">
        <h3>訂單狀態</h3>
        <ul>
          <li v-for="history in orderStore.currentOrder.statusHistory" :key="history.timestamp">
            {{ history.status }} - {{ history.timestamp }}
          </li>
        </ul>
      </section>

      <section class="info-section">
        <h3>備註</h3>
        <p>{{ orderStore.currentOrder.notes || '無特別備註' }}</p>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .order-detail-page {
    padding: 2rem;

    h1 {
      margin-bottom: 1rem;
    }

    .order-details-container {
      margin-top: 2rem;
    }

    .info-section {
      margin-bottom: 2rem;

      h3 {
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
        font-weight: bold;
      }

      ul {
        list-style-type: none;
        padding-left: 0;
      }

      li {
        margin-bottom: 0.5rem;
      }
    }
  }
</style>
