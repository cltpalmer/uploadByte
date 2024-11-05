// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdgcr6p9CVlqfVvUFXlRUnOlGFOEP7Tzo",
  authDomain: "uploadbyte-20e75.firebaseapp.com",
  projectId: "uploadbyte-20e75",
  storageBucket: "uploadbyte-20e75.firebasestorage.app",
  messagingSenderId: "506934306676",
  appId: "1:506934306676:web:9245ebbbbc340b6d52ae21",
  measurementId: "G-FQXD1JF391",
  databaseURL: "https://uploadbyte-20e75-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("messageForm");
  const messageInput = document.getElementById("messageInput");
  const categoryInput = document.getElementById("categoryInput");
  const filterCategoryInput = document.getElementById("filterCategoryInput");
  const categoryMessages = document.getElementById("categoryMessages");
  const popupOverlay = document.getElementById("popupOverlay");
  const composeButton = document.getElementById("composeButton");
  const submitButton = document.getElementById("submitButton");
  const closeButton = document.getElementById("closeButton");
  const messageDetailOverlay = document.getElementById("messageDetailOverlay");
  const closeDetailButton = document.getElementById("closeDetailButton");
  const messageDetailText = document.getElementById("messageDetailText");

  // Function to save a message to Firebase
  function saveMessage(category, title, messageText) {
    const messageRef = ref(database, 'messages');
    const newMessageRef = push(messageRef);
    set(newMessageRef, {
      title: title,
      text: messageText,
      category: category,
      timestamp: Date.now()
    });
  }

  // Function to load messages from Firebase
  function loadMessages() {
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      displayMessages(data);
    });
  }

  // Function to display messages in the UI by category
  function displayMessages(data) {
    // Clear previous messages
    categoryMessages.innerHTML = "";

    // Get selected filter category
    const selectedCategory = filterCategoryInput.value;

    // Group messages by category
    const categories = ["general", "tech", "design", "other"];
    categories.forEach(cat => {
      if (selectedCategory === "all" || selectedCategory === cat) {
        const filteredMessages = Object.values(data || {}).filter(msg => msg.category === cat);

        if (filteredMessages.length > 0) {
          const categoryDiv = document.createElement("div");
          const categoryHeader = document.createElement("h3");
          categoryHeader.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
          categoryHeader.classList.add("category-header");

          categoryDiv.appendChild(categoryHeader);

          filteredMessages.forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add("message-item");

            // Create the message title element
            const titleElement = document.createElement("p");
            titleElement.textContent = msg.title;
            titleElement.style.cursor = "pointer";
            titleElement.onclick = () => {
              // Show the overlay with title and message
              showMessageDetail(msg.title, msg.text);
            };

            // Create the external icon element
            const externalIcon = document.createElement("img");
            externalIcon.src = "external.svg";
            externalIcon.alt = "External Link";
            externalIcon.classList.add("external-icon");

            // Append the title and icon to the message div
            msgDiv.appendChild(titleElement);
            msgDiv.appendChild(externalIcon);
            categoryDiv.appendChild(msgDiv);
          });

          categoryMessages.appendChild(categoryDiv);
        }
      }
    });
  }

  // Show popup on compose button click
  composeButton.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
  });

  // Close popup
  closeButton.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Submit message from popup
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Get the title, message, and category
    const titleText = titleInput.value;
    const messageText = messageInput.value;
    const category = categoryInput.value;
    
    // Save the message to Firebase
    saveMessage(category, titleText, messageText);
    
    // Clear the form and close the popup
    titleInput.value = "";
    messageInput.value = "";
    popupOverlay.style.display = "none";
    
    // Reload messages to reflect the new message
    loadMessages();
  });

  // Load messages initially and listen for updates
  loadMessages();

  // Filter messages when the dropdown value changes
  filterCategoryInput.addEventListener("change", () => {
    loadMessages(); // Reload messages to apply the filter
  });

  // Show message detail overlay
  function showMessageDetail(title, message) {
    const messageDetailText = document.getElementById("messageDetailText");
    messageDetailText.innerHTML = `<strong>${title}</strong><br>${message}`;
    messageDetailOverlay.style.display = "flex";
  }

  // Close message detail overlay
  closeDetailButton.addEventListener("click", () => {
    messageDetailOverlay.style.display = "none";
  });
});
