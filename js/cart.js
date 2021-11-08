const buttonCart = document.getElementById("cart-button");
const modalCart = document.querySelector(".modal-cart");
const body = modalCart.querySelector(".modal-body");
const close = modalCart.querySelector(".close");
const modalFooter = modalCart.querySelector(".modal-footer");

const getFromStore = (name) => localStorage.getItem(name);
const setFromStore = (name, value) => localStorage.setItem(name, value);
const removeFromStore = (name) => localStorage.removeItem(name);

const openModal = () => modalCart.classList.add("is-open");
const closeModal = () => modalCart.classList.remove("is-open");

const totalPrice = (data) => {
  const price = modalCart.querySelector(".modal-pricetag");

  price.textContent = `${[...data].reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.count,
    0
  )} ₽`;
};

const resetCart = () => {
  body.innerHTML = "";
  removeFromStore("cart");
  closeModal();
};

const incrementCount = (id) => {
  const cartArray = JSON.parse(getFromStore("cart"));
  cartArray.map((item) => {
    if (item.id === id) {
      item.count++;
    }
  });

  setFromStore("cart", JSON.stringify(cartArray));
  renderItems(cartArray);
};

const decrementCount = (id) => {
  const cartArray = JSON.parse(getFromStore("cart"));
  cartArray.map((item) => {
    if (item.id === id) {
      item.count = item.count > 0 ? item.count - 1 : 0;
    }
  });

  setFromStore("cart", JSON.stringify(cartArray));
  renderItems(cartArray);
};

const renderFooter = () => {
  modalFooter.innerHTML = `
      <span class="modal-pricetag"></span>
      <div class="footer-buttons">
        <button class="button button-primary submit">Оформить заказ</button>
        <button class="button clear-cart">Отмена</button>
      </div>
    `;

  const buttonSend = modalCart.querySelector(".submit");
  const buttonCancel = modalCart.querySelector(".clear-cart");

  buttonSend.addEventListener("click", () => {
    const cartArray = getFromStore("cart");

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: cartArray,
    })
      .then((response) => {
        if (response.ok) {
          resetCart();
        }
      })
      .catch((e) => console.error(e));
  });

  buttonCancel.addEventListener("click", resetCart);
};

const renderItems = (data) => {
  body.innerHTML = "";

  if (data) {
    data.forEach((cartItem) => {
      const { id, name, price, count } = cartItem;
      const cartElem = document.createElement("div");
      cartElem.classList.add("food-row");
      cartElem.innerHTML = `
          <span class="food-name">${name}</span>
          <strong class="food-price">${price} ₽</strong>
          <div class="food-counter">
            <button class="counter-button btn-dec" data-index="${id}">-</button>
            <span class="counter">${count}</span>
            <button class="counter-button btn-inc" data-index="${id}">+</button>
          </div>
      `;

      body.append(cartElem);
      renderFooter();
    });

    totalPrice(data);
  } else {
    modalFooter.innerHTML = "";

    const cartElem = document.createElement("div");
    cartElem.classList.add("food-row");

    cartElem.innerHTML = `
        <span class="food-name">Продуктов нет!!!</span>
      `;

    body.append(cartElem);
  }
};

body.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btn-inc")) {
    incrementCount(e.target.dataset.index);
  } else if (e.target.classList.contains("btn-dec")) {
    decrementCount(e.target.dataset.index);
  }
});

buttonCart.addEventListener("click", () => {
  renderItems(JSON.parse(getFromStore("cart")));

  openModal();
  console.log("fghijo;klghcgfhcjgkjlo;ojlhuhjgvjhgkl");
});

close.addEventListener("click", closeModal);
