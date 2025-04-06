// Initialize wishlist in localStorage if it doesn't exist
if (!localStorage.getItem("wishlist")) {
  localStorage.setItem("wishlist", JSON.stringify([]));
}

// Update wishlist count
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistCount = document.getElementById("wishlist-count");
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
  }
}

// Add to wishlist function
function addToWishlist(productId, productName, productPrice, productImage) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Check if product is already in wishlist
  if (!wishlist.some((item) => item.id === productId)) {
    wishlist.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();

    // Show success message with SweetAlert2
    Swal.fire({
      title: "Added to Wishlist",
      icon: "success",
      timer: 2000,
      toast: true, 
      position: "top-end", 
      showConfirmButton: false,
      customClass: {
        title: "text-xl font-bold",
      },
    });
  }
}



// Function to display wishlist items
function displayWishlistItems() {
  const wishlistContainer = document.getElementById("wishlist-items");
  const emptyWishlist = document.getElementById("empty-wishlist");
  const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlistItems.length === 0) {
    wishlistContainer.style.display = "none";
    emptyWishlist.style.display = "block";
    return;
  }

  wishlistContainer.style.display = "grid";
  emptyWishlist.style.display = "none";
  wishlistContainer.innerHTML = "";

  wishlistItems.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "border rounded-lg p-4 flex flex-col";
    itemElement.innerHTML = `
            <div class="relative">
                <img src="${item.image}" alt="${item.name}" class="w-full h-64 object-cover rounded-lg">
                <button onclick="removeFromWishlist('${item.id}')" class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                    <i class="ri-delete-bin-line text-red-500"></i>
                </button>
            </div>
            <h3 class="mt-4 text-lg font-semibold">${item.name}</h3>
            <p class="text-primary font-bold mt-2">${item.price} Egp</p>
            <a href="index.html" class="mt-4 bg-primary text-center text-white py-2 px-4 rounded-md hover:bg-opacity-90">
                See More
            </a>
        `;
    wishlistContainer.appendChild(itemElement);
  });
}

// Function to remove item from wishlist
function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((item) => item.id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  displayWishlistItems();
  updateWishlistCount();

  // Show success message
  Swal.fire({
    title: "Deleted",
    icon: "success",
    toast: true,
    position: "top-end", 
    showConfirmButton: false,
    background: "#fdecea",
    iconColor: "#e3342f",  
    timer: 2000,
    customClass: {
      title: "text-xl font-bold text-[#000]",
    },
  });
}


// Initialize wishlist functionality
document.addEventListener("DOMContentLoaded", function () {
  // Update wishlist count initially
  updateWishlistCount();

  // Add click handlers to heart icons
  const heartIcons = document.querySelectorAll(".ri-heart-line");
  heartIcons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      function toggleWishlistIcon(iconElement) {
        if (iconElement.classList.contains("ri-heart-line")) {
          iconElement.classList.remove("ri-heart-line");
          iconElement.classList.add("ri-heart-fill", "text-red-500");
        } else {
          iconElement.classList.remove("ri-heart-fill", "text-red-500");
          iconElement.classList.add("ri-heart-line");
        }
      }
      e.preventDefault();
      e.stopPropagation();  // دا بيمنع امن الكليك يوصل للكارت 

      const card = this.closest(".car");
      if (!card) return;

      // Generate a unique ID if not exists
      if (!card.dataset.productId) {
        card.dataset.productId = Date.now().toString();
      }

      const productId = card.dataset.productId;
      const productName =
        card.querySelector(".course-title")?.textContent || "";
      const productPrice =
        card.querySelector(".course-price")?.textContent.split(" ")[0] || "0";
      const productImage = card.querySelector(".course-image")?.src || "";

      addToWishlist(productId, productName, productPrice, productImage);
      toggleWishlistIcon(this);
    });
  });

  // Display wishlist items if we're on the wishlist page
  if (document.getElementById("wishlist-items")) {
    displayWishlistItems();
  }
});
