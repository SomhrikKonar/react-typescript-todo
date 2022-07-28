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
  numberOfCards: number;
}
function Card({
  details,
  detailsCopy,
  updateTodoList,
  draggedElement,
  setDraggedElement,
  numberOfCards,
}: Props) {
  const { title, completed, id } = details;
  const [editField, setEditField] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [allowMouseLeave, setAllowMouseLeave] = useState<boolean>();

  const handleDone = (type: string) => {
    if (type === "update") {
      updateTodoList("saveChange", undefined, undefined);
      setEditField(false);
    } else if (type === "completed") {
      updateTodoList("manageTask", id - 1, undefined);
    }
  };

  const handleMouseDown = (e: any) => {
    setDraggedElement(id);
    if (cardRef.current) {
      cardRef.current.style.zIndex = "2";
    }
  };

  const handleMouseUp = () => {
    if (draggedElement === undefined) return;
    if (cardRef.current) {
      cardRef.current.style.position = "relative";
      cardRef.current.style.top = `0px`;
      cardRef.current.style.left = `0px`;
      cardRef.current.style.zIndex = "1";
    }
    updateTodoList("removeEmptyCard");
  };

  const handleMouseMove = (e: any) => {
    if (draggedElement === undefined) return;

    let width = window.innerWidth - 100;

    let noOfColumn = Math.floor(width / 290);

    let noOfRow = Math.ceil(numberOfCards / noOfColumn);

    if (cardRef.current) {
      let newY = e.clientY - 247 - 30;
      let newX = e.clientX - 125;

      let newRow = Math.ceil(newY / 50);
      let newColumn = Math.round(newX / 250);

      newRow = newRow > noOfRow ? noOfRow : newRow < 1 ? 1 : newRow;
      newColumn =
        newColumn > noOfColumn ? noOfColumn : newColumn < 1 ? 1 : newColumn;

      let eleIndex = newColumn - 1 + (newRow - 1) * noOfColumn;

      updateTodoList(
        "updateCardPosition",
        undefined,
        undefined,
        draggedElement,
        eleIndex > numberOfCards - 1 ? numberOfCards - 1 : eleIndex
      );

      cardRef.current.style.position = "fixed";
      cardRef.current.style.top = `${e.clientY - 30}px`;
      cardRef.current.style.left = `${e.clientX - 125}px`;

      if (!allowMouseLeave) setAllowMouseLeave(true);
    }
  };

  const handleMouseEnter = () => {
    if (draggedElement === undefined || allowMouseLeave) return;
    setAllowMouseLeave(true);
  };

  const handleMouseLeave = () => {
    if (draggedElement === undefined || !allowMouseLeave) return;
    handleMouseUp();
  };

  return (
    <div
      className={styles.cardContainer}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      // onTouchStart={handleMouseDown}
      // onTouchMove={handleMouseMove}
      // onTouchEnd={handleMouseUp}
      // onTouchCancel={() => setDraggedElement(undefined)}
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
      {title && (
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
      )}
    </div>
  );
}

export default Card;
