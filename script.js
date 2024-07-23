const apiUrl = "https://fe-students.onrender.com/api/users";

async function fetchUsers() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (
      !data.results ||
      !Array.isArray(data.results) ||
      data.results.length === 0
    ) {
      throw new Error("No users found or data is not in the expected format");
    }
    console.log(data.results);
    return data.results;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

function updateSidebar(users) {
  const userList = document.getElementById("userList");
  if (!userList) {
    console.error("User list element not found");
    return;
  }
  userList.innerHTML = "";
  users.forEach((user) => {
    console.log(user);
    user.weight = 1;
    const li = document.createElement("li");
    li.classList.add("user-item");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = user.name;
    li.appendChild(nameSpan);

    const weightSpan = document.createElement("span");
    weightSpan.textContent = `: ${user.weight}`;
    li.appendChild(weightSpan);

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.addEventListener("click", () => {
      user.weight++;
      weightSpan.textContent = `: ${user.weight}`;
    });
    li.appendChild(increaseButton);

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "-";
    decreaseButton.addEventListener("click", () => {
      if (user.weight > 0) {
        user.weight--;
        weightSpan.textContent = `: ${user.weight}`;
      }
    });
    li.appendChild(decreaseButton);

    userList.appendChild(li);
  });
}

function selectWinner(users) {
  const winnerDisplay = document.getElementById("winner");
  if (!winnerDisplay) {
    console.error("Winner display element not found");
    return;
  }
  if (users.length === 0) {
    winnerDisplay.textContent = "No users to select from";
    return;
  }

  const weightedUsers = [];
  users.forEach((user) => {
    for (let i = 0; i < user.weight; i++) {
      weightedUsers.push(user);
    }
  });

  const randomIndex = Math.floor(Math.random() * weightedUsers.length);
  const winner = weightedUsers[randomIndex];
  winnerDisplay.textContent = `Winner: ${winner.name}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const users = await fetchUsers();
    if (users.length === 0) {
      throw new Error("No users found or data is not in the expected format");
    }
    updateSidebar(users);

    const randomizerButton = document.querySelector(".randomizer-button");
    randomizerButton.addEventListener("click", () => {
      selectWinner(users);
    });
  } catch (error) {
    console.error("Initialization error:", error.message);
    const winnerDisplay = document.getElementById("winner");
    if (winnerDisplay) {
      winnerDisplay.textContent = "Failed to load users";
    }
  }
});
