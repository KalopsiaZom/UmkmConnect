// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// DOM elements
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const form = document.getElementById("editForm");
const cancelBtn = document.getElementById("cancelBtn");

// Load user data
async function loadUser() {
  try {
    const res = await fetch(`/api/user/${id}`);
    const user = await res.json();

    usernameInput.value = user.username || "";
    emailInput.value = user.email || "";
    roleInput.value = user.role || "";
  } catch (err) {
    alert("Error loading user: " + err.message);
  }
}

// Save changes
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const email = emailInput.value;
  const role = roleInput.value;

  try {
    const res = await fetch(`/api/edit/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, role })
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ User updated!");
      window.location.href = "admin.html";
    } else {
      alert("❌ Error updating: " + result.error);
    }
  } catch (err) {
    alert("❌ Failed: " + err.message);
  }
});

// Cancel button
cancelBtn.addEventListener("click", () => {
  window.location.href = "admin.html";
});

loadUser();
