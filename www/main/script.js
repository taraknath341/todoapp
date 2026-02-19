"use strict";
const SearchQuery = new URLSearchParams(window.location.search);
let userName = SearchQuery.get("username");
if (userName === null) {
  window.location.pathname += "../";
}
const add_button = document.querySelector(".add-button"),
  input = document.querySelector("input"),
  todo_body = document.getElementById("todo-body"),
  DeleteTodo = function (todoName) {
    if (!todoName) {
      return;
    }
    fetch(window.location.origin, {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName,
        todoName
      })
    })
      .then(res => res.text())
      .then(res => {
        if (res !== todoName) {
          alert(res);
        }
        ServerSideReload();
      })
      .catch(err => err.message);
  },
  InsertTodo = function (todoName) {
    if (!todoName) {
      return;
    }
    fetch(window.location.origin, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName,
        todoName
      })
    })
      .then(res => res.text())
      .then(res => {
        if (res !== todoName) {
          alert(res);
        }
        ServerSideReload();
      })
      .catch(err => err.message);
  },
  ServerSideReload = function () {
    todo_body.innerHTML = `<span size="7" class="loading">Loading...</span>`;
    fetch(window.location.origin, {
      method: 'put',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName,
      })
    })
      .then(async res => {
        return res.text();
      })
      .then(res => {
        if (res === "Server Error") {
          return;
        }
        res = JSON.parse(res);
        todo_body.innerHTML = "";
        res.forEach(iv => {
          todo_body.innerHTML += `
            <div class="item" id="${iv}$">
              ${iv}
              <button onclick="{
                DeleteTodo(this.parentNode.id.slice(0, -1));
              }">Delete</button>
            </div>
          `;
        });
      })
      .catch(err => console.log(err.message));
  }
add_button.onclick = () => {
  input.focus();
}
input.onkeydown = (e) => {
  if (e.key !== "Enter") {
    return;
  }
  const todoName = input.value;
  input.value = "";
  InsertTodo(todoName);
}
ServerSideReload();