// Create Feature -front-end rendering
// function that renders the new list item
function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

// initial page load renders
let ourHTML = items.map(function(item) {
  return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)

// references the input box
let createField = document.getElementById("create-field")

document.getElementById('create-form').addEventListener("submit", function(e) {
  // prevents default form submission behavior
  e.preventDefault()
  // async - sends the new item to the server without reloading
  axios.post('/create-item', {text: createField.value}).then(
    // then creates the html for the new item once sent to the database
    function (response) {
    document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
    createField.value = ""
    createField.focus()
  }).catch(
    // or displays error message
    function() {
    console.log("Please try again later")
    })
})



 // listens for click anywhere on document
document.addEventListener("click", function(e) {

  // The delete button
  // if the clicked element in the document has the class delete-me -- delete button
  if(e.target.classList.contains("delete-me")) {
    // if user confirms in popup alert
    if (confirm("Do you really want to delete this item?")) {
        // async - deletes the new item from the server without reloading
      axios.post('/delete-item', { id: e.target.getAttribute("data-id")}).then(
        function () {
          // removes the element from the page
        e.target.parentElement.parentElement.remove()
      }).catch(
        // or displays error message
        function() {
        console.log("Please try again later")
        })
    }
  }

  // Update button
  // if the clicked element in the document has the class edit-me -- edit button
  if(e.target.classList.contains("edit-me")) {
    // assign the user input for the Edit button to a variable
    let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    // if the user entered anything -- so "cancel" doesn't clear the object
    if (userInput) {
      // async - upates the item on the server without reloading
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(
        // updates the list to reflect the change
        function () {
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
      }).catch(function() {
        // or displays error message
        console.log("Please try again later")
      })
    }
  }
})
