import { getCharIndex } from "../utils/funcs.ts";
import Box from "./Box.tsx";
import { useCallback, useRef } from "react";

export interface KeyboardProps {
  classNames: string[][];
}

function Keyboard(props: KeyboardProps) {
  const rowOne = useRef<Array<string>>([
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
  ]);
  const rowTwo = useRef<Array<string>>([
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
  ]);
  const rowThree = useRef<Array<string>>(["Z", "X", "C", "V", "B", "N", "M"]);

  const emitEvent = useCallback((key: string): void => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: key,
      })
    );
  }, []);

  return (
    <>
      <div className="row-container">
        {rowOne.current.map((value: string, index: number) => {
          return (
            <Box
              onClickFunc={() => emitEvent(value)}
              key={`key-${index}`}
              char={value}
              classNames={[
                "keyboard-basic",
                "keyboard-key",
                ...props.classNames[getCharIndex(value)],
              ]}
            />
          );
        })}
      </div>
      <div className="row-container">
        {rowTwo.current.map((value: string, index: number) => {
          return (
            <Box
              onClickFunc={() => emitEvent(value)}
              key={`key-${index}`}
              char={value}
              classNames={[
                "keyboard-basic",
                "keyboard-key",
                ...props.classNames[getCharIndex(value)],
              ]}
            />
          );
        })}
      </div>
      <div className="row-container">
        <Box
          onClickFunc={() => emitEvent("enter")}
          key={"key-enter"}
          char={"ENTER"}
          classNames={["keyboard-basic", "keyboard-spl", "default-key"]}
        />
        {rowThree.current.map((value: string, index: number) => {
          return (
            <Box
              onClickFunc={() => emitEvent(value)}
              key={`key-${index}`}
              char={value}
              classNames={[
                "keyboard-basic",
                "keyboard-key",
                ...props.classNames[getCharIndex(value)],
              ]}
            />
          );
        })}
        <Box
          onClickFunc={() => emitEvent("backspace")}
          key={"key-backspace"}
          char={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 0 24 24"
              width="20"
            >
              <path
                fill="var(--color-tone-1)"
                d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
              ></path>
            </svg>
          }
          classNames={["keyboard-basic", "keyboard-spl", "default-key"]}
        ></Box>
      </div>
    </>
  );
}

export default Keyboard;
