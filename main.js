let localProducts = JSON.parse(localStorage.getItem("products"));
let localProductsCart = JSON.parse(localStorage.getItem("productsCart"));
let localProductsWish = JSON.parse(localStorage.getItem("productsWishList"));
if (Array.isArray(localProducts)) {
  products = localProducts;
} else {
  products = [];
}
if (Array.isArray(localProductsCart)) {
  productsCart = localProductsCart;
} else {
  productsCart = [];
}
if (Array.isArray(localProductsWish)) {
  productsWishList = localProductsWish;
} else {
  productsWishList = [];
}
var dialogAddProduct = document.getElementById("DialogAddProduct");
var openBtn = document.getElementById("openDialog");
var closeBtn = document.getElementById("closeDialog");
var closeBtn2 = document.getElementById("closeDialog2");
openBtn.addEventListener("click", () => {
  dialogAddProduct.showModal();
  document.querySelectorAll('[name="error-msg"]').forEach(function (msg) {
    msg.remove();
  });
});
closeBtn.addEventListener("click", () => dialogAddProduct.close());
closeBtn2.addEventListener("click", () => dialogAddProduct.close());
let productQuantity = document.getElementById("productQuantity");
let detailsAdd = document.getElementById("detailsAdd");
let dialogDetails = document.getElementById("dialogDetails");
function saveCart() {
  localStorage.setItem("productsCart", JSON.stringify(productsCart));
}
function saveWish() {
  localStorage.setItem("productsWishList", JSON.stringify(productsWishList));
}
function renderCartFromState() {
  const list = document.getElementById("aa");
  list.innerHTML = "";
  document.getElementById("finalTotal").innerHTML = fSToN(0);
  let runningTotal = 0;

  productsCart.forEach((p) => {
    const row = document.createElement("div");
    row.setAttribute("id", `c${p.id}`);
    row.innerHTML = `
      <div class="flex items-center gap-4 p-4 border rounded-lg mb-4">
        <img alt="${p.title}" class="w-16 h-16 object-cover rounded" src="${
      p.thumbnail
    }" />
        <div class="flex-1">
          <h4 class="font-medium">${p.title}</h4>
          <p class="text-sm text-gray-600">${fSToN(unitPrice(p))} each</p>
        </div>
        <div class="flex items-center gap-2">
          <button id="bd${
            p.id
          }" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all border size-9">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-minus h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
          </button>
          <span id="count${p.id}" class="w-8 text-center">${
      p.numberOfProducts
    }</span>
          <button id="bi${
            p.id
          }" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all border size-9">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-plus h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
        <div class="text-right">
          <p id="total${p.id}" class="font-medium">${fSToN(
      Number(p.numberOfProducts) * unitPrice(p)
    )}</p>
        </div>
      </div>
    `;
    list.append(row);

    runningTotal += Number(p.numberOfProducts) * unitPrice(p);
    document.getElementById("finalTotal").innerHTML = fSToN(runningTotal);

    // minus
    document.getElementById(`bd${p.id}`).addEventListener("click", function () {
      const idx = productsCart.findIndex((x) => x.id === p.id);
      const newQty = Number(productsCart[idx].numberOfProducts || 0) - 1;

      if (newQty <= 0) {
        productsCart.splice(idx, 1);
        document.getElementById(`c${p.id}`)?.remove();
      } else {
        productsCart[idx].numberOfProducts = newQty;
        document.getElementById(`count${p.id}`).innerHTML = String(newQty);
        document.getElementById(`total${p.id}`).innerHTML = fSToN(
          newQty * unitPrice(p)
        );
      }

      saveCart();
      updateCountersAndTotals();
    });

    // plus
    document.getElementById(`bi${p.id}`).addEventListener("click", function () {
      const idx = productsCart.findIndex((x) => x.id === p.id);
      let newQty = Number(productsCart[idx].numberOfProducts || 0) + 1;

      if (newQty > Number(p.stock)) {
        Toastify({
          text: "You’ve reached the stock limit for this product.",
          duration: 2500,
          gravity: "top",
          position: "right",
          close: true,
        }).showToast();
      }
      newQty = Math.min(newQty, Number(p.stock));

      productsCart[idx].numberOfProducts = newQty;
      document.getElementById(`count${p.id}`).innerHTML = String(newQty);
      document.getElementById(`total${p.id}`).innerHTML = fSToN(
        newQty * unitPrice(p)
      );

      saveCart();
      updateCountersAndTotals();
    });
  });
}

async function getProducts() {
  const response = await fetch("https://dummyjson.com/products");
  const data = await response.json();

  if (products.length == 0) {
    products = data.products.concat(products);
  }

  print(products);
  for (let index = 0; index < products.length; index++) {
    console.log(products[index].category);
  }
}

getProducts();

function unitPrice(p) {
  return (
    Number(p.price) -
    (Number(p.price) * Math.round(Number(p.discountPercentage))) / 100
  );
}

function fSToN(n) {
  return `$${Number(n).toFixed(2)}`;
}

function updateCountersAndTotals() {
  let basketCounter = document.getElementById("basketCounter");
  let totalProducts = document.getElementById("totalProducts");
  let totalQty = productsCart.reduce(
    (s, p) => s + Number(p.numberOfProducts || 0),
    0
  );
  totalProducts.innerHTML = String(totalQty);
  if (totalQty > 9) {
    basketCounter.innerHTML = "+9";
  } else {
    basketCounter.innerHTML = String(totalQty);
  }
  basketCounter.classList.toggle("hidden", totalQty === 0);

  document
    .getElementById("footerCart")
    .classList.toggle("hidden", totalQty === 0);
  document
    .getElementById("emptyCart")
    .classList.toggle("hidden", totalQty != 0);

  let sum = productsCart.reduce(
    (s, p) => s + Number(p.numberOfProducts || 0) * unitPrice(p),
    0
  );
  document.getElementById("finalTotal").innerHTML = fSToN(sum);
}

function detailsEdite(i) {
  dialogDetails.dataset.productIndex = String(i);
  document.getElementById("productQuantity").innerHTML = "1";
  document.getElementById("detailsStock").classList.remove("!bg-red-500");
  document.getElementById("detailsStock").classList.remove("!text-white");
  document.getElementById("counterFoot").classList.remove("!hidden");
  document
    .getElementById("detailsImg")
    .setAttribute("alt", `${products[i].title}`);
  document
    .getElementById("detailsImg")
    .setAttribute("src", `${products[i].images[0]}`);
  document
    .getElementById("detailsImg1")
    .setAttribute("src", `${products[i].images[0]}`);
  document
    .getElementById("detailsImg2")
    .setAttribute("src", `${products[i].images[1]}`);
  document
    .getElementById("detailsImg3")
    .setAttribute("src", `${products[i].images[2]}`);
  document.getElementById("detailsTitle").innerHTML = `${products[i].title}`;
  document.getElementById(
    "detailsDescription"
  ).innerHTML = `${products[i].description}`;
  document.getElementById("detailsPrice").innerHTML = `${fSToN(
    unitPrice(products[i])
  )}`;
  document.getElementById(
    "detailsPriceBeforDiscount"
  ).innerHTML = `$${products[i].price}`;
  document.getElementById("detailsRating").innerHTML = `${products[
    i
  ].rating.toFixed(1)}`;
  document.getElementById(
    "detailsBrand"
  ).innerHTML = `Brand: ${products[i].brand}`;
  document.getElementById(
    "detailsCategory"
  ).innerHTML = `Category: ${products[i].category}`;
  document.getElementById("detailsStock").innerHTML = `${products[i].stock}`;
  if (products[i].stock == 0) {
    document.getElementById("detailsStock").innerHTML = "Out of stock";
    document.getElementById("detailsStock").classList.add("!bg-red-500");
    document.getElementById("detailsStock").classList.add("!text-white");
    document.getElementById("counterFoot").classList.add("!hidden");
  }
  let stars1 = [...document.querySelectorAll(".star")];
  let count = Math.round(products[i].rating.toFixed(1));
  for (let i = 0; i < 5; i++) {
    stars1[i].classList.remove("text-yellow-400");
    stars1[i].classList.remove("fill-yellow-400");
  }

  for (let i = 0; i < count; i++) {
    stars1[i].classList.add("text-yellow-400");
    stars1[i].classList.add("fill-yellow-400");
  }

  let closeBtn1 = document.getElementById("closeDialog1");
  closeBtn1.addEventListener("click", () => dialogDetails.close());
  detailsAdd.innerHTML = `Add to Cart - ${fSToN(1 * unitPrice(products[i]))}`;

  // /////////
}

document
  .getElementById("reduceQuantity")
  .addEventListener("click", function () {
    let i = Number(dialogDetails.dataset.productIndex || 0);
    let current = Number(productQuantity.innerHTML);
    if (current > 1) {
      let newQty = current - 1;
      productQuantity.innerHTML = String(newQty);

      detailsAdd.innerHTML = `Add to Cart - ${fSToN(
        newQty * unitPrice(products[i])
      )}`;
    }
  });

document
  .getElementById("increaseQuantity")
  .addEventListener("click", function () {
    let i = Number(dialogDetails.dataset.productIndex || 0);
    let current = Number(productQuantity.innerHTML);

    let inCart = Number(
      productsCart.find((x) => x.id === products[i].id)?.numberOfProducts || 0
    );
    let maxAllowed = Number(products[i].stock) - inCart;

    if (current < maxAllowed) {
      let newQty = current + 1;
      productQuantity.innerHTML = String(newQty);
      detailsAdd.innerHTML = `Add to Cart - ${fSToN(
        newQty * unitPrice(products[i])
      )}`;
    } else {
      const host = dialogDetails?.open ? dialogDetails : document.body;
      Toastify({
        text: "You’ve reached the stock limit for this product.",
        duration: 2500,
        gravity: "top",
        position: "right",
        close: true,
        selector: host,
        style: {
          zIndex: 9999, // or "9999"
        },
        className: "toast-z-top",
      }).showToast();
    }
  });

document.getElementById("detailsImg1").addEventListener("click", function () {
  let src1 = document.getElementById("detailsImg1").getAttribute("src");
  document.getElementById("detailsImg").setAttribute("src", `${src1}`);
});
document.getElementById("detailsImg2").addEventListener("click", function () {
  let src2 = document.getElementById("detailsImg2").getAttribute("src");
  document.getElementById("detailsImg").setAttribute("src", `${src2}`);
});
document.getElementById("detailsImg3").addEventListener("click", function () {
  let src3 = document.getElementById("detailsImg3").getAttribute("src");
  document.getElementById("detailsImg").setAttribute("src", `${src3}`);
});

detailsAdd.addEventListener("click", function () {
  let i = Number(dialogDetails.dataset.productIndex || 0);
  let requested = Number(productQuantity.innerHTML);
  let stock = Number(products[i].stock);

  let idx = productsCart.findIndex((p) => p.id === products[i].id);

  if (idx > -1) {
    var inCart = Number(productsCart[idx].numberOfProducts || 0);
  } else {
    var inCart = 0;
  }

  let available = Math.max(0, stock - inCart);
  if (available === 0) {
    Toastify({
      text: "You’ve reached the stock limit for this product.",
      duration: 2500,
      gravity: "top",
      position: "right",
      close: true,
    }).showToast();
    dialogDetails.close();
    return;
  }

  let toAdd = Math.min(requested, available);

  if (idx > -1) {
    productsCart[idx].numberOfProducts = inCart + toAdd;
  } else {
    const copy = structuredClone(products[i]);
    copy.numberOfProducts = toAdd;
    productsCart.push(copy);
    saveCart();
  }
  updateCountersAndTotals();
  document.getElementById("aa").innerHTML = "";
  document.getElementById("finalTotal").innerHTML = fSToN(0);
  let runningTotal = 0;
  productsCart.forEach((p) => {
    let productCart = document.createElement("div");
    productCart.setAttribute("id", `c${p.id}`);
    productCart.innerHTML = `
    <div class="flex items-center gap-4 p-4 border rounded-lg mb-4">
          <img
            alt="${p.title}"
            class="w-16 h-16 object-cover rounded"
            src="${p.images[0]}"
          />
          <div class="flex-1">
            <h4 class="font-medium">${p.title}</h4>
            <p class="text-sm text-gray-600">$${unitPrice(fSToN(p))} each</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              id="bd${p.id}"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border size-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-minus h-4 w-4"
              >
                <path d="M5 12h14"></path>
              </svg></button
            ><span id="count${p.id}" class="w-8 text-center">${
      p.numberOfProducts
    }</span
            ><button
              id="bi${p.id}"

              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border size-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-plus h-4 w-4"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
          </div>
          <div class="text-right">
         <p id="total${p.id}" class="font-medium">
  ${fSToN(Number(p.numberOfProducts) * unitPrice(p))}
</p>
    </div>
        </div>
    `;
    runningTotal += Number(p.numberOfProducts) * unitPrice(p);
    document.getElementById("finalTotal").innerHTML = fSToN(runningTotal);

    document.getElementById("aa").append(productCart);
    document.getElementById(`bd${p.id}`).addEventListener("click", function () {
      const idx = productsCart.findIndex((x) => x.id === p.id);
      const newQty = Number(productsCart[idx].numberOfProducts || 0) - 1;

      if (newQty <= 0) {
        productsCart.splice(idx, 1);
        document.getElementById(`c${p.id}`).remove();
      } else {
        productsCart[idx].numberOfProducts = newQty;
        document.getElementById(`count${p.id}`).innerHTML = String(newQty);
        document.getElementById(`total${p.id}`).innerHTML = fSToN(
          newQty * unitPrice(p)
        );
      }

      updateCountersAndTotals();
    });

    document.getElementById(`bi${p.id}`).addEventListener("click", function () {
      const idx = productsCart.findIndex((x) => x.id === p.id);
      let newQty = Number(productsCart[idx].numberOfProducts || 0) + 1;
      if (newQty > Number(p.stock)) {
        Toastify({
          text: "You’ve reached the stock limit for this product.",
          duration: 2500,
          gravity: "top", // "top" or "bottom"
          position: "right", // "left", "center" or "right"
          close: true,
        }).showToast();
      }
      newQty = Math.min(newQty, Number(p.stock));

      productsCart[idx].numberOfProducts = newQty;
      document.getElementById(`count${p.id}`).innerHTML = String(newQty);
      document.getElementById(`total${p.id}`).innerHTML = fSToN(
        newQty * unitPrice(p)
      );

      updateCountersAndTotals();
    });
  });
  dialogDetails.close();
});

function print(products) {
  let cards = document.querySelector(".cards");
  cards.innerHTML = "";

  products.forEach((product) => {
    cards.innerHTML += `
    <div
            class="card bg-white max-w-3xs bg-card text-card-foreground gap-6 rounded-xl py-6  hover:shadow-xl transition-all border-0 shadow-md pt-0 h-[480px] flex flex-col opacity-100 translate-y-0 "
            id="${product.id}"
            >
            <div
              
              class="grid auto-rows-min items-start gap-1.5 "
            >
              <div class="relative imgcont">
                <img
                  src="${product.images[0]}"
                  alt="${product.title}"
                  class=" w-full h-48 object-fit rounded-t-lg cursor-pointer "
                />
                <div class="absolute imageProduct cursor-pointer inset-0 bg-black/3 rounded-xl "></div>
                <span
                  id="badgeNoStock-${product.id}"
                  class="absolute top-2 left-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-red-500 text-white !hidden"
                  >
                  No Stock
  </span>
                <div class="absolute top-2 right-2 flex gap-1">
                  <button
                    id="e${product.id}"
                    class="edite inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium  bg-base hover:bg-slate-200 hover:cursor-pointer size-9"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-square-pen h-4 w-4 text-gray-600"
                    >
                      <path
                        d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      ></path>
                      <path
                        d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                      ></path>
                    </svg>
                    </button>
                    
                </div>
                <span
                  id="percentageBadge${product.id}"
                  class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent absolute bottom-2 left-2 bg-orange-500"
                  >-${Math.round(product.discountPercentage)}%</span
                >
              </div>
            </div>
            <div class="mainCard p-4 flex-1 flex flex-col">
              <div
                class="font-semibold text-lg mb-2 truncate text-neutral"
              >
                ${product.title}
              </div>
              <p class="text-sm text-gray-600 mb-2 truncate">
                ${product.description}
              </p>
              <div class="flex items-center mb-2">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                    </svg><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star h-4 w-4 text-gray-300"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-600 ml-2"
                  >(${product.rating.toFixed(1)})</span
                >
              </div>
              <div class="flex items-center justify-between mt-auto flex-wrap">
                <div>
                  <span class="text-2xl font-bold text-neutral">
                  ${fSToN(unitPrice(product))}
                  </span
                  ><span class="text-sm text-gray-500 line-through ml-2"
                    >$${product.price}</span
                  >
                </div>
                <span
                  
                  class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit  border-transparent bg-base"
                  >${product.stock}
                  left</span
                >
              </div>
            </div>
            <div
              
              class="p-4 flex gap-2"
            >
              <button
                id="o${product.id}"
                class="view cursor-pointer inline-flex items-center justify-center   rounded-md text-sm font-medium transition-all  bg-neutral text-base shadow-xs hover:bg-slate-900 h-9 px-4 py-2  w-full"
              >
                View Details
              </button>
              <button
                    id="${product.id}"
                    
                    class="like inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium size-9 bg-neutral hover:bg-slate-900 hover:cursor-pointer px-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-heart h-4 w-5 text-white"
                    >
                      <path
                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                      ></path>
                    </svg>
                  </button>
            </div>
          </div>
  
  
  
          `;
    let stars = [
      ...document.getElementById(`${product.id}`).children[1].children[2]
        .children[0].children,
    ];

    for (let i = 0; i < Math.round(product.rating.toFixed(1)); i++) {
      stars[i].classList.add("text-yellow-400");
      stars[i].classList.add("fill-yellow-400");
    }
    if (product.stock == 0) {
      document.getElementById(`o${product.id}`).innerHTML = "Out of Stock";
      document.getElementById(`o${product.id}`).classList.add("!bg-red-500");
      document
        .getElementById(`badgeNoStock-${product.id}`)
        .classList.remove("!hidden");
      document
        .getElementById(`percentageBadge${product.id}`)
        .classList.add("!hidden");
    }
  });

  var productsView = document.querySelectorAll(".view");
  var productsView2 = document.querySelectorAll(".imageProduct");

  for (let i = 0; i < productsView.length; i++) {
    productsView[i].addEventListener("click", function () {
      dialogDetails.showModal();

      detailsEdite(i);
    });
    productsView2[i].addEventListener("click", function () {
      const dialogDetails = document.getElementById("dialogDetails");

      dialogDetails.showModal();
      detailsEdite(i);
    });
  }

  let likes = document.querySelectorAll(".like");
  let edites = document.querySelectorAll(".edite");
  var DialogEditeProduct = document.getElementById("DialogEditeProduct");
  const closeBtnEdite = document.getElementById("CloseDialogEditeProduct");
  const closeBtnEdite1 = document.getElementById("closeDialogEdite");
  closeBtnEdite.addEventListener("click", () => DialogEditeProduct.close());
  closeBtnEdite1.addEventListener("click", () => DialogEditeProduct.close());

  for (let i = 0; i < likes.length; i++) {
    likes[i].addEventListener("click", function () {
      if (likes[i].children[0].classList.contains("!fill-red-500")) {
        likes[i].children[0].classList.remove("!fill-red-500");
        likes[i].children[0].classList.remove("!text-red-500");
        document.getElementById("likesCounter").innerHTML =
          Number(document.getElementById("likesCounter").innerHTML) - 1;
        if (Number(document.getElementById("likesCounter").innerHTML) == 0) {
          document.getElementById("likesCounter").classList.add("hidden");
          document.getElementById("heart").classList.remove("!fill-red-500");
          document.getElementById("heart").classList.remove("!text-red-500");
          document.getElementById("empty").classList.remove("hidden");
        }
      } else {
        document.getElementById("empty").classList.add("hidden");

        document.getElementById("likesCounter").classList.remove("hidden");
        document.getElementById("heart").classList.add("!fill-red-500");
        document.getElementById("heart").classList.add("!text-red-500");

        likes[i].children[0].classList.add("!fill-red-500");
        likes[i].children[0].classList.add("!text-red-500");
        document.getElementById("likesCounter").innerHTML =
          Number(document.getElementById("likesCounter").innerHTML) + 1;
        if (Number(document.getElementById("likesCounter").innerHTML) > 9) {
          document.getElementById("likesCounter").innerHTML = "+9";
        }
      }
      var productNumber = document
        .querySelectorAll(".like")
        [i].getAttribute("id");

      const pid = Number(productNumber);
      const inWish = productsWishList.some((p) => p.id === pid);

      if (inWish) {
        productsWishList = productsWishList.filter((p) => p.id !== pid);
      } else {
        productsWishList.push(products[pid - 1]);
      }

      printWish(productsWishList);
      saveWish();
    });
    edites[i].addEventListener("click", function () {
      DialogEditeProduct.showModal();
      document.querySelectorAll('[name="error-msg"]').forEach(function (msg) {
        msg.remove();
      });
      DialogEditeProduct.dataset.productIndex = String(i);

      document.getElementById("titleEdite").value = products[i].title;
      document.getElementById("descriptionEdite").value =
        products[i].description;
      document.getElementById("priceEdite").value = products[i].price;
      document.getElementById("stockEdite").value = products[i].stock;
      document.getElementById("categoryEdite").value = products[i].category;
      document.getElementById("brandEdite").value = products[i].brand;
      document.getElementById("url1Edite").value = products[i].thumbnail;
      document.getElementById("discountPercentageEdite").value =
        products[i].discountPercentage;
      document.getElementById("ratingEdite").value = products[i].rating;
    });
  }
  hydrateWishlistHearts();
}

renderCartFromState();
printWish(productsWishList);
updateCountersAndTotals();
hydrateWishlistHearts();

function printWish(productsWishList) {
  document.getElementById("productsWishlistCount").innerHTML = Number(
    productsWishList.length
  );
  document
    .getElementById("empty")
    .classList.toggle("hidden", productsWishList.length > 0);
  document.getElementById("productCardWishList").innerHTML = "";
  productsWishList.forEach((product) => {
    let wishListCard = document.createElement("div");
    wishListCard.classList.add("space-y-4");
    wishListCard.setAttribute("id", `a${product.id}`);
    wishListCard.innerHTML = `
            
              <div class="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  alt="${product.title}"
                  class="w-16 h-16 object-cover rounded"
                  src="${product.thumbnail}"
                />
                <div class="flex-1">
                  <h4 class="font-medium">${product.title}</h4>
                  <p class="text-sm text-gray-600 line-clamp-2">
                    ${product.description}
                  </p>
                  <p class="text-lg font-bold text-purple-600">$${(
                    product.price -
                    (product.price * Math.round(product.discountPercentage)) /
                      100
                  ).toFixed(2)}</p>
                </div>
                <div class="flex gap-2">
                  <button
                  id="close${product.id}"
                    class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all  border shadow-xs h-9 px-4 py-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-x h-4 w-4"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                    </button>
                  
                  <button
                  id="view${product.id}"
                    class="rounded-md text-sm font-medium transition-all bg-neutral text-base shadow-xs hover:bg-slate-900 h-9 px-4 py-2 has-[&gt;svg]:px-3"
                  >
                    View
                  </button>
                </div>
              </div>
            
            `;
    document.getElementById("productCardWishList").append(wishListCard);
  });
  for (let i = 0; i < productsWishList.length; i++) {
    document
      .getElementById(`view${productsWishList[i].id}`)
      .addEventListener("click", function () {
        detailsEdite(Number(productsWishList[i].id) - 1);
        dialogDetails.showModal();
      });

    document
      .getElementById(`close${productsWishList[i].id}`)
      .addEventListener("click", function () {
        const id = Number(this.id.replace("close", ""));

        const cardEl = document.getElementById(`a${id}`);
        if (cardEl) cardEl.remove();
        // productsWishList = productsWishList.filter((p) => p.id !== id);
        let index = productsWishList.indexOf(
          productsWishList.find((p) => p.id == id)
        );
        productsWishList.splice(index, 1);
        printWish(productsWishList);
        saveWish();

        const count = productsWishList.length;
        const counterEl = document.getElementById("likesCounter");
        const heartEl = document.getElementById("heart");
        const emptyEl = document.getElementById("empty");

        counterEl.innerHTML = String(count);
        counterEl.classList.toggle("hidden", count === 0);
        heartEl.classList.toggle("!fill-red-500", count > 0);
        heartEl.classList.toggle("!text-red-500", count > 0);
        emptyEl.classList.toggle("hidden", count > 0);

        const likeBtn = document.querySelector(`.like[id="${id}"]`);
        if (likeBtn) {
          likeBtn.children[0].classList.remove("!fill-red-500");
          likeBtn.children[0].classList.remove("!text-red-500");
        }
      });
  }
}

function hydrateWishlistHearts() {
  const count = productsWishList.length;
  const likesCounter = document.getElementById("likesCounter");
  const heartEl = document.getElementById("heart");
  likesCounter.innerHTML = count > 9 ? "+9" : String(count);
  likesCounter.classList.toggle("hidden", count === 0);
  heartEl.classList.toggle("!fill-red-500", count > 0);
  heartEl.classList.toggle("!text-red-500", count > 0);

  // color individual product hearts that are already in wishlist
  document.querySelectorAll(".like").forEach((btn) => {
    const id = Number(btn.id);
    if (productsWishList.some((p) => p.id === id)) {
      btn.children[0].classList.add("!fill-red-500", "!text-red-500");
    }
  });
}

function dialogWishlists() {
  const dialogWishlist = document.getElementById("dialogWishlist");
  const openBtn = document.getElementById("openDialog2");
  const closeBtn = document.getElementById("closeDialog3");

  openBtn.addEventListener("click", () => {
    dialogWishlist.showModal();
    printWish(productsWishList);
    hydrateWishlistHearts();
  });
  closeBtn.addEventListener("click", () => dialogWishlist.close());
}

dialogWishlists();

function dialogCarts() {
  const dialogCart = document.getElementById("dialogCart");
  const openBtn = document.getElementById("openDialog3");
  const closeBtn = document.getElementById("closeDialog4");

  openBtn.addEventListener("click", () => {
    dialogCart.showModal();
    renderCartFromState();
    updateCountersAndTotals();
  });
  closeBtn.addEventListener("click", () => dialogCart.close());
}

dialogCarts();
let urlArray = [];
document.getElementById("addProduct").addEventListener("click", function () {
  let titlev = document.getElementById("title").value;
  let descriptionv = document.getElementById("description").value;
  let pricev = document.getElementById("price").value;
  let stockv = document.getElementById("stock").value;
  let categoryv = document.getElementById("category").value;
  let brandv = document.getElementById("brand").value;
  // let url1v = document.getElementById("url1").value;
  let urls = document.querySelectorAll(".url");

  for (let i = 0; i < urls.length; i++) {
    urlArray.push(urls[i].value);
  }

  let discountPercentagev = document.getElementById("discountPercentage").value;
  let ratingv = document.getElementById("rating").value;
  var inputsElements = document.querySelectorAll(`#DialogAddProduct input`);
  let priceInput = document.getElementById("price");
  let stockInput = document.getElementById("stock");
  if (!validate(inputsElements, priceInput, stockInput)) return;

  let newProduct = {
    id: products.length + 1,
    title: titlev,
    description: descriptionv,
    price: Number(pricev),
    stock: Number(stockv),
    category: categoryv,
    brand: brandv,
    images: urlArray,
    discountPercentage: Number(discountPercentagev),
    rating: Number(ratingv),
  };

  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  print(products);
  dialogAddProduct.close();
});

document.getElementById("updateProduct").addEventListener("click", function () {
  let titleEdite = document.getElementById("titleEdite").value;
  let descriptionEdite = document.getElementById("descriptionEdite").value;
  let priceEdite = document.getElementById("priceEdite").value;
  let stockEdite = document.getElementById("stockEdite").value;
  let categoryEdite = document.getElementById("categoryEdite").value;
  let brandEdite = document.getElementById("brandEdite").value;
  let url1Edite = document.getElementById("url1Edite").value;
  var inputsElements = document.querySelectorAll(`#DialogEditeProduct input`);
  let priceInput = document.getElementById("priceEdite");
  let stockInput = document.getElementById("stockEdite");
  if (!validate(inputsElements, priceInput, stockInput)) return;

  let i = Number(DialogEditeProduct.dataset.productIndex || 0);
  products[i].title = titleEdite;
  products[i].description = descriptionEdite;
  products[i].price = priceEdite;
  products[i].stock = stockEdite;
  products[i].category = categoryEdite;
  products[i].brand = brandEdite;
  products[i].thumbnail = url1Edite;
  localStorage.setItem("products", JSON.stringify(products));

  print(products);
  if (document.querySelector(".cards").classList.contains("flex-col")) {
    rowLayout();
  }
  DialogEditeProduct.close();
});

function search(userInput, arr, fun) {
  var filteredProducts = arr.filter(function (product) {
    return product.title.toLowerCase().includes(userInput.toLowerCase().trim());
  });
  fun(filteredProducts);
}

document
  .getElementById("searchInputProduct")
  .addEventListener("input", function () {
    let userInput = document.getElementById("searchInputProduct").value;
    search(userInput, products, print);
  });

document
  .getElementById("searchInputWishList")
  .addEventListener("input", function () {
    let userInput = document.getElementById("searchInputWishList").value.trim();
    search(userInput, productsWishList, printWish);
  });

function validate(inputsElements, priceInput, stockInput) {
  document.querySelectorAll('[name="error-msg"]').forEach(function (msg) {
    msg.remove();
  });
  var requiredElements = [...inputsElements].filter(function (item) {
    if (item.getAttribute("data-validation") == "required") return true;
    return false;
  });
  var isValidate = true;

  requiredElements.forEach(function (item) {
    var itemName = item.getAttribute("name");

    if (item.value.trim().length == 0) {
      var errorMsg = document.createElement("div");
      errorMsg.textContent = `${itemName} is required`;
      errorMsg.classList.add("text-red-500");
      errorMsg.classList.add("text-xs");
      errorMsg.setAttribute("name", "error-msg");

      item.after(errorMsg);

      isValidate = false;
    }
  });
  if (priceInput.value.trim().length != 0) {
    if (Number(priceInput.value) <= 0) {
      var errorMsg = document.createElement("div");
      errorMsg.textContent = `${priceInput.getAttribute(
        "name"
      )} must be greater than 0`;
      errorMsg.classList.add("text-red-500");
      errorMsg.classList.add("text-xs");
      errorMsg.setAttribute("name", "error-msg");
      priceInput.after(errorMsg);
      isValidate = false;
    }
  }
  if (stockInput.value.trim().length != 0) {
    if (Number(stockInput.value) < 0) {
      var errorMsg = document.createElement("div");
      errorMsg.textContent = `${stockInput.getAttribute(
        "name"
      )} must be 0 or greater`;
      errorMsg.classList.add("text-red-500");
      errorMsg.classList.add("text-xs");
      errorMsg.setAttribute("name", "error-msg");
      stockInput.after(errorMsg);
      isValidate = false;
    }
  }

  return isValidate;
}

let addImages = document.getElementById("addImages");
let url11 = document.getElementById("url1");
let k = 1;
addImages.addEventListener("click", function () {
  k++;

  let newImage = document.createElement("div");
  newImage.innerHTML = `<input id="url${k}" class="h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] md:text-sm focus:border-primary focus:ring-1 focus:ring-accent focus:outline-none border-secondary url" placeholder="Image URL ${k}" value="">`;
  containerImages.append(newImage);
});

const toggle = document.getElementById("menuToggle");
const panel = document.getElementById("mobileMenu");

toggle?.addEventListener("click", () => {
  const expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!expanded));
  panel.style.maxHeight = expanded ? "0px" : panel.scrollHeight + "px";
});

panel?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = "0px";
  });
});

document.getElementById("toggleLayout").addEventListener("click", rowLayout);

function rowLayout() {
  document.querySelector(".cards").classList.add("flex-col");
  let cards = document.querySelectorAll(".card");
  let mainCard = document.querySelectorAll(".mainCard");
  let imgcont = document.querySelectorAll(".imgcont");
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove("h-[480px]");
    cards[i].classList.remove("max-w-3xs");
    cards[i].classList.remove("py-6");
    cards[i].classList.add("md:flex-row");
    cards[i].classList.add("md:max-w-3xxl");
    cards[i].classList.add("w-[80%]");
    mainCard[i].classList.add("md:w-[30%]");

    imgcont[i].classList.add("md:w-[192px]");
  }
}

function gridLayout() {
  document.querySelector(".cards").classList.remove("flex-col");
  let cards = document.querySelectorAll(".card");
  let mainCard = document.querySelectorAll(".mainCard");
  let imgcont = document.querySelectorAll(".imgcont");
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.add("h-[480px]");
    cards[i].classList.add("max-w-3xs");
    cards[i].classList.add("py-6");
    cards[i].classList.remove("md:flex-row");
    cards[i].classList.remove("md:max-w-3xxl");
    cards[i].classList.remove("w-[80%]");
    mainCard[i].classList.remove("md:w-[30%]");

    imgcont[i].classList.remove("md:w-[192px]");
  }
}
document.getElementById("gridLayout").addEventListener("click", gridLayout);

const btn = document.getElementById("dropdownBtn");
const menu = document.getElementById("dropdownMenu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

let all = document.getElementById("all");
let beauty = document.getElementById("beauty");
let fragrances = document.getElementById("fragrances");
let furniture = document.getElementById("furniture");
let groceries = document.getElementById("groceries");

all.addEventListener("click", function () {

  print(products);
  menu.classList.add("hidden");
});
beauty.addEventListener("click", function () {
  let beautyArr = products.filter(function (p) {
    return p.category == "beauty";
  });
  print(beautyArr);
  menu.classList.add("hidden");
});
fragrances.addEventListener("click", function () {
  let fragrancesArr = products.filter(function (p) {
    return p.category == "fragrances";
  });
  print(fragrancesArr);
  menu.classList.add("hidden");
});
furniture.addEventListener("click", function () {
  let furnitureArr = products.filter(function (p) {
    return p.category == "furniture";
  });
  print(furnitureArr);
  menu.classList.add("hidden");
});
groceries.addEventListener("click", function () {
  let groceriesArr = products.filter(function (p) {
    return p.category == "groceries";
  });
  print(groceriesArr);
  menu.classList.add("hidden");
});
