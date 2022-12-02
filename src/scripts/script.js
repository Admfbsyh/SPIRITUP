// Add Menu Hamburger
const menu = document.getElementById("menu-label");
const sidebar = document.getElementsByClassName("sidebar")[0];
const imgDiv = document.querySelector(".list-item-user");
const img = document.querySelector("#photo");
const file = document.querySelector("#file");
const uploadBtn = document.querySelector("#uploadBtn");

menu.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
  console.log("ok");
});

// Add Choosed File User Profile

imgDiv.addEventListener("mouseenter", function () {
  uploadBtn.style.display = "block";
});

imgDiv.addEventListener("mouseleave", function () {
  uploadBtn.style.display = "none";
});

file.addEventListener("change", function () {
  const choosedFile = this.files[0];

  if (choosedFile) {
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      img.setAttribute("src", reader.result);
    });

    reader.readAsDataURL(choosedFile);
  }
});
