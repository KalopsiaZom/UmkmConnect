// Fetch all users and display them in the table
async function loadUsers() {
  try {
    const res = await fetch("/api/users"); // backend route that lists users
    const users = await res.json();

    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = ""; // clear previous rows

    users.forEach(user => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="edit-btn" data-id="${user.id}">Edit</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    // Add event listeners for Edit buttons
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const userId = btn.dataset.id;
        window.location.href = `edit.html?id=${userId}`;
      });
    });
  } catch (err) {
    alert("❌ Error loading users: " + err.message);
  }
}

loadUsers();
