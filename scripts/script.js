// Icon responsive
var menuIcon = document.getElementById("menu-icon");
var mainNav = document.getElementById("main-nav");
var menuIconI = document.getElementById("menu-icon-i");

if (menuIcon) {
  menuIcon.addEventListener("click", function () {
    mainNav.classList.toggle("nav-open");
    if (mainNav.classList.contains("nav-open")) {
      menuIconI.classList.replace("fa-bars", "fa-xmark");
    } else {
      menuIconI.classList.replace("fa-xmark", "fa-bars");
    }
  });

  document.querySelectorAll("#nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("nav-open");
      menuIconI.classList.replace("fa-xmark", "fa-bars");
    });
  });
}

// Shop page
var productGrid = document.getElementById("product-grid");

if (productGrid) {
  var filterToggleBtn = document.getElementById("filter-toggle-btn");
  var filterSidebar = document.getElementById("filter-sidebar");
  var filterCloseBtn = document.getElementById("filter-close-btn");
  var sidebarOverlay = document.getElementById("sidebar-overlay");

  if (filterToggleBtn)
    filterToggleBtn.addEventListener("click", function () {
      filterSidebar.classList.add("sidebar-open");
      sidebarOverlay.classList.add("active");
    });

  if (filterCloseBtn)
    filterCloseBtn.addEventListener("click", function () {
      filterSidebar.classList.remove("sidebar-open");
      sidebarOverlay.classList.remove("active");
    });

  if (sidebarOverlay)
    sidebarOverlay.addEventListener("click", function () {
      filterSidebar.classList.remove("sidebar-open");
      sidebarOverlay.classList.remove("active");
    });

  var allCards = Array.from(productGrid.querySelectorAll(".product-card"));
  var searchInput = document.getElementById("search-input");
  var productCount = document.getElementById("product-count");
  var noResults = document.getElementById("no-results");

  function applyFilters() {
    var searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var checkedPrices = Array.from(
      document.querySelectorAll(".price-filter:checked"),
    ).map(function (el) {
      return el.value;
    });
    var checkedGenres = Array.from(
      document.querySelectorAll(".genre-filter:checked"),
    ).map(function (el) {
      return el.value;
    });

    var count = 0;

    allCards.forEach(function (card) {
      var name = card.dataset.name.toLowerCase();
      var price = parseFloat(card.dataset.price);
      var genre = card.dataset.genre;
      var show = true;

      if (searchVal && !name.includes(searchVal)) show = false;

      if (show && checkedPrices.length > 0) {
        var matchPrice = checkedPrices.some(function (range) {
          var parts = range.split("-");
          return price >= parseFloat(parts[0]) && price <= parseFloat(parts[1]);
        });
        if (!matchPrice) show = false;
      }

      if (show && checkedGenres.length > 0 && !checkedGenres.includes(genre))
        show = false;

      card.style.display = show ? "" : "none";
      if (show) count++;
    });

    if (productCount) productCount.textContent = count;
    if (noResults) noResults.style.display = count === 0 ? "block" : "none";
  }

  function resetFilters() {
    if (searchInput) searchInput.value = "";
    document
      .querySelectorAll(".price-filter, .genre-filter")
      .forEach(function (el) {
        el.checked = false;
      });
    applyFilters();
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);

  document
    .querySelectorAll(".price-filter, .genre-filter")
    .forEach(function (el) {
      el.addEventListener("change", applyFilters);
    });

  var resetBtn = document.getElementById("reset-filters");
  var noResultsReset = document.getElementById("no-results-reset");

  if (resetBtn) resetBtn.addEventListener("click", resetFilters);
  if (noResultsReset) noResultsReset.addEventListener("click", resetFilters);
}

// Price function
const qtyInputs = document.querySelectorAll(".qty-input");
const subtotalDisplay = document.querySelector(".summary-row span:last-child");
const totalDisplay = document.querySelector(
  ".summary-row.total span:last-child",
);

qtyInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    let quantity = e.target.value;

    if (quantity < 1) {
      e.target.value = 1;
      quantity = 1;
    }

    const row = e.target.closest("tr");
    const priceText = row.querySelector("td[data-label='Price']").innerText;
    const pricePerItem = parseFloat(priceText.replace("$", ""));

    // Update the subtotal for this specific row
    const rowSubtotal = (pricePerItem * quantity).toFixed(2);
    row.querySelector("td[data-label='Subtotal']").innerText =
      `$${rowSubtotal}`;

    let grandTotal = 0;
    document.querySelectorAll("td[data-label='Subtotal']").forEach((sub) => {
      grandTotal += parseFloat(sub.innerText.replace("$", ""));
    });

    if (subtotalDisplay && totalDisplay) {
      subtotalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
      totalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
    }
  });
});

const removeBtns = document.querySelectorAll(".remove-btn");
removeBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (confirm("Remove this item from your cart?")) {
      row.style.opacity = "0";
      setTimeout(() => {
        row.remove();

        let grandTotal = 0;
        document
          .querySelectorAll("td[data-label='Subtotal']")
          .forEach((sub) => {
            grandTotal += parseFloat(sub.innerText.replace("$", ""));
          });

        if (totalDisplay) totalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
        if (subtotalDisplay)
          subtotalDisplay.innerText = `$${grandTotal.toFixed(2)}`;
      }, 300);
    }
  });
});
