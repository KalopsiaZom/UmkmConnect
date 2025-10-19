const form = document.getElementById("umkmForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("user_id"); // Get user ID from localStorage User where it will be inserted to UMKM table as user_id foreign key

  if (!userId) {
    alert("You must log in first!");
    window.location.href = "/login.html";
    return;
  }

  const umkmData = {
    business_name: document.getElementById("business_name").value,
    business_desc: document.getElementById("business_desc").value,
    location: document.getElementById("location").value,
    owner: document.getElementById("owner").value,
    category: document.getElementById("category").value,
    revenue: document.getElementById("revenue").value
  };

  try {
    const res = await fetch(`/api/umkm/add/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(umkmData)
    });

    const data = await res.json();

    if (res.ok) {
      message.textContent = "UMKM added successfully!";
      message.style.color = "green";
      message.style.display = "block";

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 2000);
    } else {
      message.textContent = data.error || "Failed to add UMKM!";
      message.style.color = "red";
      message.style.display = "block";
    }
  } catch (err) {
    message.textContent = "Server error. Please try again.";
    message.style.color = "red";
    message.style.display = "block";
  }
});
