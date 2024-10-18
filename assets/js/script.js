let books;
let currentPage = 1; // Initialize the current page
const totalPages = 100; // Set a default total pages (gutendex API doesn't provide total pages)
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageInfo = document.getElementById("page-info");
const loadingElement = document.getElementById("loading");

const bookContainer = document.getElementById("book-container");

// Function to show loading cards
const showLoaders = () => {
  const loaderContainer = document.getElementById("loader-container");

  // Clear any existing loaders
  loaderContainer.innerHTML = "";

  // Create 8 loader cards
  for (let i = 0; i < 16; i++) {
    const loaderCard = document.createElement("div");
    loaderCard.classList.add("card", "is-loading");
    loaderCard.innerHTML = `
      <div class="image"></div>
      <div class="content">
          <h2></h2>
          <h3></h3>
          <p></p>
      </div>`;

    // Append the loader card to the loader container
    loaderContainer.appendChild(loaderCard);
  }
};

const hideLoaders = () => {
  const loaderContainer = document.getElementById("loader-container");
  loaderContainer.innerHTML = ""; // Clear the loader cards
};

// Call this function before fetching data
showLoaders();

const fetchBooks = async (page) => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlist_item"));

  const wishlistIds = wishlistItems
    ? Object?.keys(wishlistItems)?.map(Number)
    : [];

  // Show loading cards
  showLoaders();
  bookContainer.innerHTML = ""; // Clear previous books

  const response = await fetch(`https://gutendex.com/books/?page=${page}`);
  books = await response.json();

  // Hide loading cards after fetching data
  hideLoaders();

  // Clear previous books
  bookContainer.innerHTML = "";
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

  books.results.forEach((book) => {
    const isWishList = wishlistIds.includes(book.id);

    const bookCard = document.createElement("div");
    bookCard.innerHTML = `
    
     <div  onclick="handleBookDetails(${book.id})" class="book-card">
  <div class="image-container">
    <img
      src=${book.formats["image/jpeg"]}
      alt="Frankenstein Cover"
      class="book-cover"
    />
     <button style="border:none;" onclick="handleId(${
       book.id
     })" class="wishlistIcon">
     <img id='not-wish-${
       book.id
     }' style="w-[20px];" src="./assets/image/wishlist.svg" alt="">
     <img id='wished-${
       book.id
     }' style="w-[20px];display:none" src="./assets/image/wishlisted.svg" alt="">
     </button>

  </div>
  <div class="book-details">
    <h1 class="book-title">${book.title}</h1>
    <h2 class="book-author">by ${book?.authors[0]?.name}</h2>
    <p class="book-id"><strong>ID:</strong> ${book.id}</p>
    <p class="book-genres">
      <strong>Genres:</strong> ${book.subjects.join(", ")}
    </p>
  </div>
</div>
    
    `;

    bookContainer.appendChild(bookCard);

    if (isWishList) {
      document.getElementById(`wished-${book.id}`).style.display = "block";
      document.getElementById(`not-wish-${book.id}`).style.display = "none";
    }
  });
  // Update page information
  updatePagination();
};

// Function to update pagination controls
const updatePagination = () => {
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

  // Enable/disable buttons based on current page
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
};

// Event listeners for pagination buttons
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchBooks(currentPage);
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchBooks(currentPage);
  }
});

// Initial fetch for page 1
fetchBooks(1);

const searchBook = (e) => {
  const searchTerm = e.target.value;
  const filteredBooks = books.results.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const wishlistItems = JSON.parse(localStorage.getItem("wishlist_item"));

  const wishlistIds = wishlistItems
    ? Object?.keys(wishlistItems)?.map(Number)
    : [];

  bookContainer.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.innerHTML = `
    
     <div class="book-card">
  <div class="image-container">
    <img
      src=${book.formats["image/jpeg"]}
      alt="Frankenstein Cover"
      class="book-cover"
    />
     <button style="border:none;" onclick="handleId(${
       book.id
     })" class="wishlistIcon">
     <img id='not-wish-${
       book.id
     }' style="w-[20px];" src="./assets/image/wishlist.svg" alt="">
     <img id='wished-${
       book.id
     }' style="w-[20px];display:none" src="./assets/image/wishlisted.svg" alt="">
     </button>

  </div>
  <div class="book-details">
    <h1 class="book-title">${book.title}</h1>
    <h2 class="book-author">by ${book?.authors[0]?.name}</h2>
    <p class="book-id"><strong>ID:</strong> ${book.id}</p>
    <p class="book-genres">
      <strong>Genres:</strong> ${book.subjects.join(", ")}
    </p>
  </div>
</div>
    
    `;

    bookContainer.appendChild(bookCard);

    const isWishList = wishlistIds.includes(book.id);
    if (isWishList) {
      document.getElementById(`wished-${book.id}`).style.display = "block";
      document.getElementById(`not-wish-${book.id}`).style.display = "none";
    }
  });
};

const handleId = (id) => {
  let wishListItem = getWishListItems();
  const isExist = wishListItem[id];
  if (isExist) {
    delete wishListItem[id];
    document.getElementById(`wished-${id}`).style.display = "none";
    document.getElementById(`not-wish-${id}`).style.display = "block";

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Book of id ${id} id Removed to wishlist`,
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    wishListItem[id] = 1;
    document.getElementById(`wished-${id}`).style.display = "block";
    document.getElementById(`not-wish-${id}`).style.display = "none";
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Book of id ${id} id Added to wishlist`,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  localStorage.setItem("wishlist_item", JSON.stringify(wishListItem));
};

function showToaster(message) {
  var toaster = document.getElementById("toaster");
  toaster.innerText = message;
  toaster.className = "toaster show";
  setTimeout(function () {
    toaster.className = toaster.className.replace("show", "");
  }, 3000); // Hide the toaster after 3 seconds
}

const getWishListItems = () => {
  let wishListItem = {};

  //get the shopping cart from local storage
  const storedCart = localStorage.getItem("wishlist_item");
  if (storedCart) {
    wishListItem = JSON.parse(storedCart);
  }
  return wishListItem;
};

// redirect to book details
const handleBookDetails = (id) => {
  window.location.href = `bookdetails.html?id=${id}`;
};
