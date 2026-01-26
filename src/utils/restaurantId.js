export const waitForRestaurantId = async (attempts = 5, delayMs = 200) => {
  let restaurantId = localStorage.getItem('restaurant_id')

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (restaurantId !== null && restaurantId !== undefined && restaurantId !== '') {
      return restaurantId
    }

    await new Promise(resolve => setTimeout(resolve, delayMs))
    restaurantId = localStorage.getItem('restaurant_id')
  }

  return null
}
