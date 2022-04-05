import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { element, render } from "./view/html-util.js";

export class App {
  constructor() {
    this.todoListModel = new TodoListModel();
  }
  mount() {
    const formElement = document.querySelector("#js-form");
    const inputElement = document.querySelector("#js-form-input");
    const containerElement = document.querySelector("#js-todo-list");
    const todoItemCountElement = document.querySelector("#js-todo-count");

    this.todoListModel.onChange(() => {
      const todoListElement = element`<ul />`;
      const todoItems = this.todoListModel.getTodoItems();
      todoItems.forEach(item => {
        // タスクが完了済みならchecked属性をつけ、未完了ならchecked属性を外す
        const todoItemElement = item.completed
          ? element`<li><input type="checkbox" class="checkbox" checked><s>${item.title}</s></input></li>`
          : element`<li><input type="checkbox" class="checkbox">${item.title}</input></li>`
        // チェックボックスがトグルしたときに、イベントリスナー関数を登録する
        const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
        inputCheckboxElement.addEventListener("change", () => {
          this.todoListModel.updateTodo({
            id: item.id,
            completed: !item.completed
          });
        });
        todoListElement.appendChild(todoItemElement);
      });
      render(todoListElement, containerElement);
      todoItemCountElement.textContent = `Todo アイテム数 : ${this.todoListModel.getTotalCount()}`;
    });

    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      this.todoListModel.addTodo(new TodoItemModel({
        title: inputElement.value,
        completed: false
      }));
      inputElement.value = "";
    });
  }
}
