"use strict";

// DOM elements for filters and the gallery
const node_filters = document.querySelector("#filters");
const node_gallery = document.querySelector("#gallery");
const node_myProjectsTitle = document.querySelector("#myProjectsTitle");

// API URLs to fetch works and categories
const url_works = "http://localhost:5678/api/works";
const url_categories = "http://localhost:5678/api/categories";

// Array to store the works
let works = [];

// ------------------ Works ----------------------------

/**
 * Creates and displays a work item in the gallery
 * @param {Object} work - The work object to display
 */
function createWork(work) {
  let el_img = document.createElement("img");
  el_img.src = work.imageUrl;
  el_img.alt = work.title;

  let el_title = document.createElement("figcaption");
  el_title.textContent = work.title;

  let el_item = document.createElement("figure");
  el_item.classList.add("work-item");
  el_item.appendChild(el_img);
  el_item.appendChild(el_title);

  node_gallery.appendChild(el_item);
}

/**
 * Displays works filtered by category
 * @param {number} category - The ID of the category to filter by
 */
function showWorks(category) {
  // Reset Gallery
  resetGallery();

  // Display all works if the category is 0 (All)
  if (category == 0) {
    works.forEach((work) => createWork(work));
  } else {
    // Filter and display works by category
    works.forEach((work) => {
      if (work.categoryId == category) {
        createWork(work);
      }
    });
  }

  // Reset the active filter state
  resetActiveFilter(category);
}

/**
 * Resets the gallery by removing all child elements
 */
function resetGallery() {
  node_gallery.innerHTML = "";
}

// ------------------ Filters ----------------------------

/**
 * Creates a filter button for a category
 * @param {Object} category - The category object to create a filter for
 */
function createFilter(category) {
  let el_filter = document.createElement("button");
  el_filter.textContent = category.name;
  el_filter.classList.add("filter-item");
  el_filter.dataset.filter = category.id;

  el_filter.addEventListener("click", applyFilter);

  node_filters.append(el_filter);
}

/**
 * Applies a filter based on the click event on a filter button
 * @param {Event} event - The click event
 */
function applyFilter(event) {
  const btn = event.target;
  showWorks(btn.dataset.filter);
}

/**
 * Resets the active filter state by adding an 'is-active' class to the selected filter button
 * @param {number} category - The ID of the selected category
 */
function resetActiveFilter(category) {
  document
    .querySelectorAll(".filter-item")
    .forEach((button) => button.classList.remove("is-active"));
  document.querySelectorAll(".filter-item").forEach((button) => {
    if (button.dataset.filter == category) {
      button.classList.add("is-active");
    }
  });
}

// ------------------ Init ----------------------------

/**
 * function to initialize filters and display all works
 */
(async function () {
  const categories = await httpGet(url_categories);
  works = await httpGet(url_works);

  // Display the "All" Filters Buttons
  createFilter({ id: 0, name: "Tous" });
  // Create a filter button for each category
  categories.forEach((category) => createFilter(category));

  // Display all Works and set "Tous" as active filter by default
  showWorks(0);
  resetActiveFilter(0);

  // Initialize login status check
  checkLoginStatus();
})();

/**
 * Utility function to make GET requests
 * @param {string} url - The URL to make the request to
 * @returns {Promise<any>} - The response data
 */
async function httpGet(url) {
  const response = await fetch(url);
  return response.json();
}

/**
 * Utility function to check login status
 */
function checkLoginStatus() {
  const loginNav = document.querySelector("#loginNav");
  const logoutNav = document.querySelector("#logoutNav");
  const token = sessionStorage.getItem("token");

  if (token) {
    loginNav.style.display = "none";
    logoutNav.style.display = "inline";

    // Hide filters when logged in
    node_filters.style.display = "none";

    // Add "modifier" button next to "mes projets" title if not already added
    if (!document.querySelector(".modify-button")) {
      let modifyButton = document.createElement("button");
      modifyButton.textContent = "Modifier";
      modifyButton.classList.add("modify-button");
      node_myProjectsTitle.appendChild(modifyButton);
    }
  } else {
    loginNav.style.display = "inline";
    logoutNav.style.display = "none";

  
    // Remove "modifier" button if it exists
    const modifyButton = document.querySelector(".modify-button");
    if (modifyButton) {
      modifyButton.remove();
    }
  }
}

// Call checkLoginStatus on DOMContentLoaded
document.addEventListener("DOMContentLoaded", checkLoginStatus);
