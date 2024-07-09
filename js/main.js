const siteName = document.getElementById("siteName");
const siteURL = document.getElementById("siteURL");
const addBtn = document.getElementById("addBtn");
const tableBody = document.getElementById("tableBody");
const nameOfSite = document.querySelector(".nameOfSite");
const urlValidation = document.querySelector(".urlValidation");

let currentIndex = -1;
let bookmarksList = JSON.parse(localStorage.getItem("bookmarksList")) || [];

display();

addBtn.addEventListener("click", checkStatusBtn);

function checkStatusBtn() {
  if (nameValidation() && validateURL() && isNameUnique()) {
    currentIndex === -1 ? addBookmark() : updateBookmark();
    clearInputs();
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
    resetForm();
    display();
  } else {
    siteNameInput();
    siteURLInput();
  }
}

function display() {
  tableBody.innerHTML = bookmarksList
    .map(
      (bookmark, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${bookmark.sName}</td>
            <td><button class="btn visitBtn" onclick="visitBookmark(${i})"><span class="fa-solid fa-eye"></span> Visit</button></td>
            <td><button class="btn updateBtn" onclick="editBookmark(${i})"><span class="fa-solid fa-gear"></span> Update</button></td>
            <td><button class="btn deleteBtn" onclick="deleteBookmark(${i})"><span class="fa-solid fa-trash"></span> Delete</button></td>
        </tr>`
    )
    .join("");
}

function addBookmark() {
  bookmarksList.push({ sName: siteName.value, sURL: siteURL.value });
}

function updateBookmark() {
  bookmarksList[currentIndex] = { sName: siteName.value, sURL: siteURL.value };
  currentIndex = -1;
  addBtn.innerHTML = "Add Bookmark";
}

function visitBookmark(index) {
  window.open(bookmarksList[index].sURL, "_blank");
}

function editBookmark(index) {
  currentIndex = index;
  siteName.value = bookmarksList[index].sName;
  siteURL.value = bookmarksList[index].sURL;
  addBtn.innerHTML = "Update Bookmark";
}

function deleteBookmark(index) {
  bookmarksList.splice(index, 1);
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList));
  display();
}

function nameValidation() {
  return /^[A-Za-z]{3}/.test(siteName.value);
}

function validateURL() {
  return /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
    siteURL.value
  );
}

function isNameUnique() {
  const newName = siteName.value.trim().toLowerCase();
  return !bookmarksList.some(
    (item, index) =>
      item.sName.toLowerCase() === newName && index !== currentIndex
  );
}

function siteNameInput() {
  const isValid = nameValidation() && isNameUnique();
  updateValidationUI(siteName, isValid);
  nameOfSite.classList.toggle("d-none", isValid);
}

function siteURLInput() {
  const isValid = validateURL();
  updateValidationUI(siteURL, isValid);
  urlValidation.classList.toggle("d-none", isValid);
}

function updateValidationUI(element, isValid) {
  element.classList.toggle("valid", isValid);
  element.classList.toggle("invalid", !isValid);
  element.style.borderColor = isValid ? "#198754" : "#dc3545";
  element.style.boxShadow = isValid
    ? "0 0 0 0.25rem rgba(25,135,84,.25)"
    : "0 0 0 0.25rem rgba(220,53,69,.25)";
}

function clearInputs() {
  siteName.classList.remove("valid");
  siteName.style.borderColor = "#d99c39";
  siteName.style.boxShadow = "0 0 0 0.25rem #fec26055";
  siteURL.classList.remove("valid");
  siteURL.style.borderColor = "#d99c39";
  siteURL.style.boxShadow = "0 0 0 0.25rem #fec26055";
}

function resetForm() {
  siteName.value = "";
  siteURL.value = "";
}
