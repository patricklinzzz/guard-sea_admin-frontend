<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useOrderStore } from '@/stores/order_store'

  const route = useRoute()
  const orderStore = useOrderStore()

  const paymentMethodMap = {
    credit_card: '信用卡',
    linepay: 'Line Pay',
    cash_on_delivery: '貨到付款',
  }

  const getPaymentMethodName = (method) => {
    return paymentMethodMap[method] || method
  }

  watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        orderStore.fetchOrderDetails(Number(newId))
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    if (route.params.id) {
      orderStore.fetchOrderDetails(Number(route.params.id))
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
          <li>訂單編號:{{ orderStore.currentOrder.order_id }}</li>
          <li>訂單日期:{{ orderStore.currentOrder.order_date }}</li>
          <li>訂單狀態:{{ orderStore.currentOrder.status }}</li>
          <li>付款方式:{{ getPaymentMethodName(orderStore.currentOrder.payment_method) }}</li>
          <li>付款狀態:{{ orderStore.currentOrder.payment_status }}</li>
          <li>總金額:NT$ {{ orderStore.currentOrder.final_amount }}</li>
        </ul>
      </section>

      <section class="info-section">
        <h3>購買人資訊</h3>
        <ul>
          <li>購買人姓名:{{ orderStore.currentOrder.receiver_name }}</li>
          <li>聯絡電話:{{ orderStore.currentOrder.receiver_phone }}</li>
          <li>電子郵件:{{ orderStore.currentOrder.member_email }}</li>
          <li>收件地址:{{ orderStore.currentOrder.receiver_address }}</li>
        </ul>
      </section>

      <section class="info-section">
        <h3>商品明細</h3>
        <ul>
          <li v-for="item in orderStore.currentOrder.order_items" :key="item.product_id">
            {{ item.product_name }}:{{ item.price_at_purchase }} x {{ item.quantity }} =
            {{ item.price_at_purchase * item.quantity }}
          </li>
          <li>總計:NT$ {{ orderStore.currentOrder.final_amount }}</li>
        </ul>
      </section>

      <section class="info-section">
        <h3>訂單狀態</h3>
        <ul>

          <li>{{ orderStore.currentOrder.status }}</li>
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
