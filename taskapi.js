let productCont = document.getElementById("products");
let searchInput = document.getElementById("product");
let spanEl = document.getElementById('count')
let cartSec = document.getElementById('cartDiv')
let currentData = [];
let cartItems = []


cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
updateCartDisplay();

function AddToCart(itemId,button) {

    console.log("Adding to cart:", itemId);
    
    const product = currentData.find(p => p.id === itemId);
    
    if (product) {
        cartItems.push(product);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCartDisplay(); 
        
        const originalText = button.innerHTML;

        button.innerHTML = `Added to cart <i class="fa-solid fa-check" style="color: white;"></i>`;
        button.style.backgroundColor = "green"; 
        button.style.color = "#ffffff"
        button.style.border = "none"
        button.style.borderRadius="8px"

        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = ""
            button.style.color="blue"; 
        }, 2000);
}
}

function updateCartDisplay(){
    spanEl.textContent = cartItems.length
}


function createAndAppend(data) {
    productCont.className = "product-grid";
    productCont.textContent = "";
    cartSec.textContent = "";

    for (let item of data) {
        let cont = document.createElement("div");
        cont.classList.add("item-container","shadow");

        cont.innerHTML = `<h6>${item.title}</h6>
                          <img src="${item.image}" alt="Product Image" style="width: 150px; height: auto; background-color:transparent;">
                          
                          <p>Price: $ ${item.price}</p>
                          <p style="color:blue; align-self:flex-start;">Brand:  ${item.brand}</p>
                          <p style="color:orange; align-self:flex-start;">color:  ${item.color}</p>
                          <p style="color:black; align-self:flex-start;">category: ${item.category}</p>
                          <button class="add" onclick="AddToCart(${item.id}, this)" >Add to Cart</button>`;

        productCont.appendChild(cont);
    }
}


function sort() {
    let sortValue = document.getElementById("pricesort").value;
    let sorted = [...currentData];

    if (sortValue === "Low to High") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === "High to Low") {
        sorted.sort((a, b) => b.price - a.price);
    }

    createAndAppend(sorted);
}

function fetchProducts() {
    let searchEl = searchInput.value.toLowerCase();
    productCont.textContent = "Loading...";
    productCont.className = "loading-state";

    let options = {
        method: "GET"
    };
    let url = "https://fakestoreapi.in/api/products";

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data.products);
            
            let filteredData = data.products.filter(item =>
                item.title.toLowerCase().includes(searchEl)
            );

            currentData = filteredData;
            if (filteredData.length === 0) {
                productCont.textContent = "No Products found";
                productCont.style.height = "100vh"
                productCont.classList.add("d-flex","justify-content-center","align-items-center")
                 
            } else {
                sort()
            }
        })
        .catch(error => {
            productCont.textContent = "Something Went Wrong";
            console.error("Fetch Error:", error);
        });
}

function displayCart(){
    productCont.textContent=""
    cartSec.classList.add("grid");
    cartSec.textContent = "";


    if (cartItems.length === 0) {
        cartSec.className = "loading-state";
        cartSec.innerHTML = `<div class="text-center">
                            <p class="d-block mb-2">No items in cart</p><br/>
                            <button onclick="showProducts()" class="btn btn-light text-primary">Browse Products</button>
                            </div>`;
        
        return;
    }

    for (let item of cartItems) {
        let cont = document.createElement("div");
        cont.classList.add("item-container","shadow");

        cont.innerHTML = `<h6>${item.title}</h6>
                          <img src="${item.image}" alt="Product Image" style="width: 150px; height: auto; background-color:transparent;">
                          
                          <p>Price: $ ${item.price}</p>
                          <p style="color:blue; align-self:flex-start;">Brand:  ${item.brand}</p>
                          <p style="color:orange; align-self:flex-start;">color:  ${item.color}</p>
                          <p style="color:black; align-self:flex-start;">category: ${item.category}</p>
                          <button style="color:blue; border:none;color:white; background-color:red; border-radius:10px; padding:5px;" onclick="Remove(${item.id})">Remove</button>`;

        cartSec.appendChild(cont);
    }
}



function Remove(itemId) {

    const index = cartItems.findIndex(item => item.id === itemId);

    if (index !== -1) {
        cartItems.splice(index, 1);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        updateCartDisplay();
        displayCart(); 
    }
}

fetchProducts()

function showProducts() {
    fetchProducts();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}