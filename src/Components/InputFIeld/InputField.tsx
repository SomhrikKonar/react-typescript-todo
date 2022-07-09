import React from "react";
import styles from "./styles.module.scss";

interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  updateTodoList: (action: string, id?: number, title?: string) => void;
}

const InputField: React.FC<Props> = ({ todo, setTodo, updateTodoList }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (todo.length <= 0) {
          alert("Invalid");
          return;
        }
        updateTodoList("push", undefined, todo);
      }}
    >
      <input
        type="text"
        className={styles.input__field}
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button className={styles.submit__btn}>Go</button>
    </form>
  );
};

export default InputField;
