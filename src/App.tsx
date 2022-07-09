import React, { useState } from "react";
import Card from "./Components/Cards/Card";
import InputField from "./Components/InputFIeld/InputField";
import styles from "./GlobalStyles/app.module.scss";
import "./GlobalStyles/variable.scss";
const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todoList, setTodoList] = useState<
    { title: string; completed: boolean; id: number }[]
  >([]);
  const [todoListCopy, setTodoListCopy] = useState<
    { title: string; completed: boolean; id: number }[]
  >([]);
  const [draggedElement, setDraggedElement] = useState<number>();

  const updateTodoList = (
    action: string,
    id?: number,
    title?: string,
    dragId?: number,
    dropId?: number
  ) => {
    switch (action) {
      case "push":
        if (title) {
          setTodoList([
            ...todoList,
            { title: title, completed: false, id: todoList.length + 1 },
          ]);
          setTodoListCopy([
            ...todoList,
            { title: title, completed: false, id: todoList.length + 1 },
          ]);
          setTodo("");
        }
        break;
      case "updateCopy":
        let copy = [...todoListCopy];
        if (id !== undefined && title) {
          copy[id] = { ...copy[id], title: title };
          setTodoListCopy([...copy]);
        }
        break;
      case "saveChange":
        setTodoList([...todoListCopy]);
        break;
      case "manageTask":
        let list = [...todoListCopy];
        if (id !== undefined) {
          list[id] = { ...list[id], completed: !list[id].completed };
          setTodoListCopy([...list]);
          setTodoList([...list]);
        }
        break;
      case "deleteTask":
        let list1 = [...todoList];
        if (id !== undefined) {
          list1.splice(id, 1);
          setTodoListCopy([...list1]);
          setTodoList([...list1]);
        }
        break;
      case "changeCardPosition":
        if (dragId === undefined || dropId === undefined) return;
        let arr = [...todoList];
        arr[dragId] = todoList[dropId];
        arr[dropId] = todoList[dragId];
        setTodoList([...arr]);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <h1>Todo-fy</h1>
      <InputField
        todo={todo}
        setTodo={setTodo}
        updateTodoList={updateTodoList}
      />
      <div className={styles.todo__list__container}>
        {todoList.map((details, index) => (
          <Card
            detailsCopy={todoListCopy[index]}
            details={details}
            key={details.id}
            updateTodoList={updateTodoList}
            setDraggedElement={setDraggedElement}
            draggedElement={draggedElement}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
