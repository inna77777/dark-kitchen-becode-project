import menu from "./menu.js";
let isDarkMode = false;

function updateDarkMode() {
  const body = document.body;
  const header = document.querySelector("header");
  let cardItems = document.querySelectorAll(".card");
  const countButtons = document.querySelectorAll(".count-button");
  const textColor = isDarkMode ? "white" : "black";

  if (isDarkMode) {
    body.style.backgroundColor = "#333";
    header.style.backgroundColor = "#444";
    cardItems.forEach((card) => {
      card.style.backgroundColor = "#434242";
    });
    countButtons.forEach((button) => {
      button.style.backgroundColor = "#434242";
      button.style.border = "1px solid #fff";
    });
  } else {
    body.style.backgroundColor = "#fff";
    header.style.backgroundColor = "#cedcc3";
    cardItems.forEach((card) => {
      card.style.backgroundColor = "#eff7d3";
    });
    countButtons.forEach((button) => {
      button.style.backgroundColor = "#fff";
      button.style.border = "1px solid black";
    });
  }

  body.style.color = textColor;
  header.style.color = textColor;
  cardItems.forEach((card) => {
    card.style.color = textColor;
  });
  countButtons.forEach((button) => {
    button.style.color = textColor;
  });
}
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  updateDarkMode();
}

const lightbulbIcon = document.querySelector(".fa-lightbulb");
lightbulbIcon.addEventListener("click", toggleDarkMode);

let category = "all";
let cartItems = [];
let itemQuantities = {};

const displayCart = () => {
  const menuCardsSec = document.querySelector(".menu");
  const basketSec = document.querySelector(".cart");
  basketSec.style.display = "flex";
  menuCardsSec.style.display = "none";

  basketSec.innerHTML = cart();

  const returnToMenu = document.querySelector(".return-to-menu");
  if (returnToMenu) {
    returnToMenu.addEventListener("click", () => {
      console.log("dbf");
      basketSec.style.display = "none";
      menuCardsSec.style.display = "block";
    });
  }

  const minusButtons = document.querySelectorAll(".minus");
  minusButtons.forEach((button) => {
    const id = button.getAttribute("id");
    button.addEventListener("click", () => {
      itemQuantities[id]--;
      if (itemQuantities[id] == 0) {
        cartItems = cartItems.filter((item) => item.id != id);
      }
      countAllItems();
      displayCart();
    });
  });

  const plusButtons = document.querySelectorAll(".plus");
  plusButtons.forEach((button) => {
    const id = button.getAttribute("id");
    button.addEventListener("click", () => {
      itemQuantities[id]++;
      countAllItems();
      displayCart();
    });
  });
  const trash = document.querySelectorAll(".trash");
  trash.forEach((trashIcon) => {
    const id = trashIcon.getAttribute("id");
    trashIcon.addEventListener("click", () => {
      cartItems = cartItems.filter((item) => item.id != id);
      itemQuantities[id] = 0;
      countAllItems();
      displayCart();
    });
  });

  let basketTotal = 0;
  const subtotalItems = document.querySelectorAll(".subtotal-item");
  subtotalItems.forEach((item) => {
    const id = item.getAttribute("id");
    const price = menu.find((item) => item.id == id).price;
    const subtotal = itemQuantities[id] * price;
    item.innerHTML = `${subtotal}$`;
    basketTotal += subtotal;
  });

  const basketSubtotal = document.querySelector(".subtotal");
  if (basketSubtotal) {
    basketSubtotal.textContent = `${basketTotal}$`;
  }
};
function countAllItems() {
  const countItems = document.querySelector(".count");
  let totalCount = 0;
  for (const id in itemQuantities) {
    totalCount += itemQuantities[id];
  }
  countItems.textContent = totalCount;
  if (totalCount != 0) {
    countItems.style.display = "block";
  } else {
    countItems.style.display = "none";
  }
  console.log(countItems);
  console.log(totalCount);
}
const addToBasket = (element) => {
  if (cartItems.find((item) => item.id == element.id)) {
    cartItems.forEach((item) => {
      if (item.id == element.id) {
        itemQuantities[item.id] += 1;
      }
    });
  } else {
    cartItems.push(element);
    itemQuantities[element.id] = 1;
  }
  countAllItems();
};

const displayMenu = () => {
  const menuSec = document.querySelector(".cards");
  menuSec.innerHTML = "";
  const cards = menu
    .filter((item) => {
      if (category === "all") {
        return true;
      }
      return category == item.category;
    })
    .map(menuCards)
    .join("");
  menuSec.innerHTML = cards;
  const addToCart = document.querySelectorAll(".add-to-cart");

  addToCart.forEach((button) => {
    const id = button.getAttribute("id");
    button.addEventListener("click", () => {
      addToBasket(menu.find((item) => item.id == id));
    });
  });
};

let all = document.querySelector(".all");
all.addEventListener("click", () => {
  category = "all";
  displayMenu();
});
let veg = document.querySelector(".vegetarian");
veg.addEventListener("click", () => {
  category = "vegetarian";
  displayMenu();
});

let nonVeg = document.querySelector(".non-vegetarian");
nonVeg.addEventListener("click", () => {
  category = "non-vegetarian";
  displayMenu();
});

let drinks = document.querySelector(".drinks");
drinks.addEventListener("click", () => {
  category = "drinks";
  displayMenu();
});

const menuCards = (menu) => {
  return `<div class="card">
            <div class="image-constainer">
              <img src="${menu.image}" alt="film-image" />
            </div>
            <div class="text-content">
              <div>
                  <h2>${menu.name}</h2>
                  <p class="ingredients">${menu.ingredients}</p> 
                  <p class="price">${menu.price}$</p>
                  <p class="category-item">${menu.category}</p>
                  
              </div>
              <button id="${menu.id}" class="add-to-cart">Add to cart</button>
            </div>
        </div>`;
};
displayMenu();

const cartIcon = document.querySelector(".cart-icon");

cartIcon.addEventListener("click", displayCart);

const itemsData = () => {
  const newArr = new Set(cartItems);
  return Array.from(newArr).map(
    (cartItem) => `    <tr>
              <td>
                <div class="basket-item">
                  <img src="${cartItem.image}" alt="cart-items" />
                  <p>${cartItem.name}</p>
                </div>
              </td>
              <td>${cartItem.price}$</td>
              <td>
                <button class="minus count-button" id="${
                  cartItem.id
                }">-</button>
                <span class="quantity">${itemQuantities[cartItem.id]}</span>
                <button class="plus count-button" id="${cartItem.id}">+</button>
              </td>
              <td class="subtotal-item" id="${cartItem.id}"></td>
              <td id="${
                cartItem.id
              }" class="trash"><i class="fa-solid fa-trash"></i></td>
            </tr>`
  );
};

const cart = () => {
  if (cartItems.length != 0) {
    return `  
        <div class="basket">
          <table class="cart-table">
            <tr>
              <th>Items</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
            ${itemsData()}
          </table>
          <div class="subtotal-sec">
            <p>Basket Subtotal: <span class="subtotal"></span></p>
          </div>
          <button class="return-to-menu">Return to menu</button>
        </div>
      </section>`;
  } else {
    return `
    <div class="empty-cart">
      <h2>Your cart is empty</h2>
      <button class="return-to-menu">Return to menu</button>
    </div>`;
  }
};
