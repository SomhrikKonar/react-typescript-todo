import React, { useEffect, useState } from "react";
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
  const [lastDropId, setLastDropId] = useState<number>(0);

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
      case "updateCardPosition":
        if (
          dragId === undefined ||
          dropId === undefined ||
          dropId === lastDropId ||
          draggedElement === undefined
        )
          return;
        let newArr: { title: string; completed: boolean; id: number }[] = [];

        for (let i = 0; i < todoList.length; i++) {
          if (todoList[i].title !== "") {
            newArr.push(todoList[i]);
          }
        }
        newArr.splice(dropId < draggedElement ? dropId : dropId + 1, 0, {
          title: "",
          completed: false,
          id: 9999,
        });
        // console.log(newArr, dropId, draggedElement);
        setLastDropId(dropId);
        setTodoList([...newArr]);
        break;
      case "removeEmptyCard":
        if (draggedElement === undefined) return;
        let newArr1: { id: number; title: string; completed: boolean }[] = [];
        let existingCards: {
          [key: string]: { id: number; title: string; completed: boolean };
        } = {};
        todoList.map(
          (el) =>
            (existingCards = { ...existingCards, [" " + el.id]: { ...el } })
        );

        if (!existingCards[" 9999"]) newArr1 = [...todoList];
        else
          Object.entries(existingCards).map(([k, v]) => {
            if (k.trim() === "9999")
              newArr1.push(existingCards[" " + draggedElement]);
            else if (k.trim() !== draggedElement.toString()) newArr1.push(v);
          });
        setTodoList(newArr1);
        setTodoListCopy(newArr1);
        setDraggedElement(undefined);
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
            numberOfCards={todoListCopy.length}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
