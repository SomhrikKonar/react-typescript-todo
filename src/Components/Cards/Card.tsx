import React, { useRef, useState } from "react";
import styles from "./styles.module.scss";
import edit from "./Svgs/Edit.svg";
import deleteSvg from "./Svgs/Delete.svg";
import tick from "./Svgs/Tick.svg";
interface Props {
  details: {
    title: string;
    completed: boolean;
    id: number;
  };
  detailsCopy: {
    title: string;
    completed: boolean;
    id: number;
  };
  updateTodoList: (
    action: string,
    id?: number,
    title?: string,
    dragId?: number,
    dropId?: number
  ) => void;
  draggedElement: number | undefined;
  setDraggedElement: React.Dispatch<React.SetStateAction<number | undefined>>;
  index: number;
}
function Card({
  details,
  detailsCopy,
  updateTodoList,
  draggedElement,
  setDraggedElement,
  index,
}: Props) {
  const { title, completed, id } = details;
  const [editField, setEditField] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDone = (type: string) => {
    if (type === "update") {
      updateTodoList("saveChange", undefined, undefined);
      setEditField(false);
    } else if (type === "completed") {
      updateTodoList("manageTask", id - 1, undefined);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    if (cardRef.current && index !== draggedElement) {
      cardRef.current.style.opacity = "0.5";
      cardRef.current.style.background = "grey";
    }
    return false;
  };

  const handleDragExist = (e: any) => {
    if (cardRef.current && index !== draggedElement) {
      cardRef.current.style.opacity = "1";
      cardRef.current.style.background =
        "linear-gradient(to right,#d2dae0,#e2ebf0)";
    }
  };

  const handleDrop = (e: any) => {
    updateTodoList(
      "changeCardPosition",
      undefined,
      undefined,
      draggedElement,
      index
    );
    if (cardRef.current) {
      cardRef.current.style.opacity = "1";
      cardRef.current.style.background =
        "linear-gradient(to right,#d2dae0,#e2ebf0)";
    }
  };

  const handleDragStart = (e: any) => {
    setDraggedElement(index);
    if (cardRef.current) {
      cardRef.current.style.opacity = "0.2";
      cardRef.current.style.background = "#377dff";
    }
  };

  const handleDragEnd = (e: any) => {
    setDraggedElement(undefined);
    if (cardRef.current) {
      cardRef.current.style.opacity = "1";
      cardRef.current.style.background =
        "linear-gradient(to right,#d2dae0,#e2ebf0)";
    }
  };

  return (
    <div
      className={styles.cardContainer}
      draggable
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragExist}
      ref={cardRef}
    >
      <input
        readOnly={!editField}
        className={`${styles.title} ${
          completed ? styles.completedTaskTitle : ""
        }`}
        onChange={(e) => {
          updateTodoList("updateCopy", id - 1, e.target.value);
        }}
        value={editField ? detailsCopy.title : title}
      />
      <div className={styles.optionContainer}>
        <img
          className={styles.icon}
          src={deleteSvg}
          onClick={() => updateTodoList("deleteTask", id - 1, undefined)}
        />
        {!completed && editField ? (
          <img
            className={styles.icon}
            src={edit}
            onClick={() => setEditField(false)}
          />
        ) : (
          !completed && (
            <img
              className={styles.icon}
              src={edit}
              onClick={() => setEditField(true)}
            />
          )
        )}
        <img
          className={styles.icon}
          src={tick}
          onClick={() =>
            editField ? handleDone("update") : handleDone("completed")
          }
        />
      </div>
    </div>
  );
}

export default Card;
