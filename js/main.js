const mobileNav = document.querySelector(".view");
const closeBtn = document.querySelector(".close-btn");
const closeBtnIcn = document.querySelector(".close-btn-icon");

// mobile nav
const arrowLeftClass = 'ri-roadster-fill';
const arrowRightClass = 'ri-close-large-fill';

closeBtn.addEventListener("click", () => {
    if (mobileNav.style.left === "-300px" || mobileNav.style.left === "" || mobileNav.style.transition === "") {
        mobileNav.style.left = "0";
        mobileNav.style.transition = "0.4s ease"
        closeBtnIcn.classList.toggle(arrowLeftClass);
        closeBtnIcn.classList.toggle(arrowRightClass);
    } else {
        mobileNav.style.left = "-300px";
        closeBtnIcn.classList.toggle(arrowLeftClass);
        closeBtnIcn.classList.toggle(arrowRightClass);
    }
});




//cart popup
document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.getElementById('cart-button');
    const cartPopup = document.getElementById('cart-popup');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartItemCount = cartButton.querySelector('span:last-child');
    let isCartOpen = false;
    let cartItems = [];

    // Load cart items from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            cartItems.forEach(item => {
                if (!item.quantity) item.quantity = 1;
            });
            cartItemCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            updateCartDisplay();
        }
    }

    // Save cart items to localStorage
    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Load cart on page load
    loadCartFromStorage();

    // Toggle cart popup
    cartButton.addEventListener('click', function(e) {
        e.stopPropagation();
        isCartOpen = !isCartOpen;
        cartPopup.classList.toggle('hidden');
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (isCartOpen && !cartPopup.contains(e.target) && e.target !== cartButton) {
            isCartOpen = false;
            cartPopup.classList.add('hidden');
        }
    });

    // Prevent popup from closing when clicking inside it
    cartPopup.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Add to cart functionality
    function initializeAddToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const courseCard = this.closest('.course-card');
                const courseImage = courseCard.querySelector('.course-image').src;
                const courseTitle = courseCard.querySelector('.course-title').textContent;
                const coursePriceText = courseCard.querySelector('.course-price').textContent;
                const coursePrice = parseInt(coursePriceText); // Extract first number from text

                // Get the image filename only for comparison
                const imageUrl = new URL(courseImage);
                const imagePath = imageUrl.pathname;

                // Check if course is already in cart by comparing image paths
                const isInCart = cartItems.some(item => {
                    const itemUrl = new URL(item.image);
                    return itemUrl.pathname === imagePath;
                });

                if (isInCart) {
                    Swal.fire({
                        title: 'Already in Cart!',
                        text: 'This course is already in your cart',
                        icon: 'warning',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3B82F6'
                    });
                    return;
                }

                // Create cart item object
                const cartItem = {
                    image: courseImage,
                    title: courseTitle,
                    price: coursePrice,
                    quantity: 1
                };

                // Add to cart array
                cartItems.push(cartItem);

                // Save to localStorage
                saveCartToStorage();

                // Update cart count
                cartItemCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

                // Update cart display
                updateCartDisplay();

                // Show success message with SweetAlert2
                Swal.fire({
                    title: 'Added to Cart!',
                    icon: 'success',
                    confirmButtonText: 'Continue Shopping',
                    confirmButtonColor: '#593e26',
                    showDenyButton: true,
                    denyButtonText: 'View Cart',
                    denyButtonColor: '#6B7280'
                }).then((result) => {
                    if (result.isDenied) {
                        isCartOpen = true;
                        cartPopup.classList.remove('hidden');
                    }
                });
            });
        });
    }

    // Initialize add to cart buttons
    initializeAddToCartButtons();

    function updateCartDisplay() {
        // Clear current display
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<img src="/Assets/collection/cart-empty.png" alt="" class="w-[100px] mx-auto">';
            return;
            
        }
        // Calculate total

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Update items display
        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4 p-2 border-b';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="w-[150px]  object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.title}</h4>
                    <p class="text-primary font-semibold">${item.price} EGP</p>
                    <div class="flex items-center justify-around border">
                        <button class="decrease-quantity text-red-500 text-2xl font-bold ">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="increase-quantity text-red-500 text-2xl font-bold">+</button>
                    </div>
                </div>
                <button  class=" text-red-500 hover:text-red-600  p-2 rounded-full" onclick="removeFromCart(${index})">
                    <i  class ="  ri-delete-bin-line text-xl text-red-500" style="color:red;"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);

            // Add event listeners for quantity buttons
            itemElement.querySelector('.increase-quantity').addEventListener('click', () => {
                item.quantity++;
                saveCartToStorage();
                updateCartDisplay();
            });

            itemElement.querySelector('.decrease-quantity').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    saveCartToStorage();
                    updateCartDisplay();
                }
            });
        });

        // Update total
        const totalElement = cartPopup.querySelector('.total-price');
        if (totalElement) {
            totalElement.textContent = `${total} EGP`;
        }
    }

    // Function to handle checkout button click
    function handleCheckout() {
        window.location.href = 'checkout.html';
    }

    // Add event listener to checkout button
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }

    // Add global function to remove items
    window.removeFromCart = function(index) {
        Swal.fire({
            title: 'Remove Product?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
            confirmButtonColor: '#593e26',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#6B7280'
        }).then((result) => {
            if (result.isConfirmed) {
                cartItems.splice(index, 1);
                // Save to localStorage after removing
                saveCartToStorage();
                cartItemCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
                updateCartDisplay();
                Swal.fire({
                    title: 'Removed!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#593e26',
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        });
    };
});


// dress hover
document.querySelectorAll(".course-image").forEach(img => {
    img.addEventListener("mouseover", function() {
        this.src = this.getAttribute("data-hover");
    });

    img.addEventListener("mouseout", function() {
        this.src = this.getAttribute("data-original");
    });
});

// Initialize Slick Slider for brands using jquery
$(document).ready(function(){
    $('.brands-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });
});
$(document).ready(function(){
    $('.coll').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
});




// Popup Functions
const offerPopup = document.getElementById('offer popup');

// Open popup when clicking 
document.getElementById('offer').addEventListener('click', (e) => {
    e.preventDefault();
    openOfferPopup();
});

function openOfferPopup() {
    offerPopup.classList.remove('hidden');
    offerPopup.classList.add('flex');
    setTimeout(() => {
        offerPopup.classList.add('opacity-100', 'translate-y-0');
        offerPopup.classList.remove('opacity-0', '-translate-y-10');
    }, 30);
}

function closeOfferPopup() {
    offerPopup.classList.remove('opacity-100', 'translate-y-0');
    offerPopup.classList.add('opacity-0', '-translate-y-10');
    setTimeout(() => {
        offerPopup.classList.add('hidden');
        offerPopup.classList.remove('flex');
    }, 500);
}

// Close popup when clicking outside
offerPopup.addEventListener('click', (e) => {
    if (e.target === offerPopup) {
        closeOfferPopup();
    }
});




// Popup Functions
const searchPopup = document.getElementById('search popup');

// Open popup when clicking 
document.getElementById('search').addEventListener('click', (e) => {
    e.preventDefault();
    openSearchPopup();
});

function openSearchPopup() {
    searchPopup.classList.remove('hidden');
    searchPopup.classList.add('flex');
    setTimeout(() => {
        searchPopup.classList.add('opacity-100', 'translate-y-0');
        searchPopup.classList.remove('opacity-0', '-translate-y-10');
    }, 30);
}

function closeSearchPopup() {
    searchPopup.classList.remove('opacity-100', 'translate-y-0');
    searchPopup.classList.add('opacity-0', '-translate-y-10');
    setTimeout(() => {
        searchPopup.classList.add('hidden');
        searchPopup.classList.remove('flex');
    }, 500);
}

// Close popup when clicking outside
searchPopup.addEventListener('click', (e) => {
    if (e.target === searchPopup) {
        closeSearchPopup();
    }
});



// ScrollReveal().reveal('.reveal', {
//     distance: '50px',    // Distance the element moves
//     duration: 1000,      // Animation duration in milliseconds
//     delay: 200,          // Delay before animation starts
//     origin: 'bottom',    // Animation starting point
//     interval: 100,       // Delay between each element's animation
//     easing: 'ease-in-out' // Animation easing
// });

document.addEventListener("DOMContentLoaded", function() {
    function setupScrolling(containerId, leftBtnId, rightBtnId ) {
        const container = document.getElementById(containerId);
        const scrollLeftBtn = document.getElementById(leftBtnId);
        const scrollRightBtn = document.getElementById(rightBtnId);

        if (container && scrollLeftBtn && scrollRightBtn) {
            scrollRightBtn.addEventListener("click", () => {
                container.scrollBy({ left: 300, behavior: "smooth" });
            });

            scrollLeftBtn.addEventListener("click", () => {
                container.scrollBy({ left: -300, behavior: "smooth" });
            });
            
        }
    }

    // استدعاء الدالة لكل مجموعة عناصر
    setupScrolling("container", "scroll-left", "scroll-right" );
    setupScrolling("container-bag", "left", "right");
    setupScrolling("container-shoose", "left-so", "right-so" );
});







// Scroll to top button
const topBtn = document.querySelector(".top");
window.onscroll = function() {
    if (window.scrollY >= 600) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};

topBtn.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};
