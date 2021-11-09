const cardsMenu = document.querySelector(".cards-menu");

const getStoreValue = (name) => localStorage.getItem(name);
const setStoreValue = (name, value) => localStorage.setItem(name, value);

const addToCart = (cartItem) => {
  const cartArray = getStoreValue("cart")
    ? JSON.parse(getStoreValue("cart"))
    : [];

  if (cartArray.some((item) => item.id === cartItem.id)) {
    cartArray.map((item) => {
      if (item.id === cartItem.id) {
        item.count++;
      }
    });
  } else {
    cartArray.push(cartItem);
  }

  setStoreValue("cart", JSON.stringify(cartArray));
};

const renderItems = (data) => {
  data.forEach(({ description, id, image, name, price }) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
        <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
            <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
            <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
        </div>
    </div>
    `;
    card.querySelector(".button-card-text").addEventListener("click", () => {
      addToCart({ name, price, id, count: 1 });
    });
    cardsMenu.append(card);
  });
};

const changeTitle = (restaurant) => {
  const { kitchen, price, name, stars } = restaurant;
  const restaurantSectionHeading = document.querySelector(".item-name");
  restaurantSectionHeading.innerHTML = `
      <h2 class="section-title restaurant-title">${name}</h2>
        <div class="card-info">
        <div class="rating">${stars}</div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    `;
};

if (localStorage.getItem("restaurant")) {
  const restaurant = JSON.parse(localStorage.getItem("restaurant"));
  changeTitle(restaurant);

  fetch(`./db/${restaurant.products}`)
    .then((res) => res.json())
    .then((data) => {
      renderItems(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
// else {
//   window.location.href = "/Delivery-food/index.html";
// }
