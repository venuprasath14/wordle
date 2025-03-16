import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { BoxProps } from "./Box.tsx";
import Word, { WordProps } from "./Word.tsx";
import Keyboard, { KeyboardProps } from "./Keyboard.tsx";
import { WORDS as words } from "../constants/constants.ts";
import { getRndInteger, getCharIndex, charToCountMap } from "../utils/funcs.ts";

function Wordle() {
  const defaultState: BoxProps = {
    char: "",
    classNames: ["input-box", "default-box"],
  };

  const guess = useRef(0);
  const word = useRef<string>(words[getRndInteger(words.length)]);
  const won = useRef<boolean>(false);

  const [key, setKey] = useState<KeyboardEvent>();
  const [inputWord, setInputWord] = useState<string>("");

  const [history, setHistory] = useState<Array<WordProps>>(
    Array(6).fill({ boxState: Array(5).fill(defaultState) })
  );
  const [keyState, setKeyState] = useState<KeyboardProps>({
    classNames: Array(26).fill(["default-key"]),
  });

  const keyListener = (e: KeyboardEvent) => {
    if (guess.current > 5 || won.current) {
      document.removeEventListener("keypress", keyListener);
      return;
    }
    setKey(e);
  };

  const updateBoxState = (
    word: React.RefObject<string>,
    inputWord: string
  ): BoxProps[] => {
    const wordHash = charToCountMap(word.current);

    let updatedWordState: BoxProps[] = Array(5)
      .fill(defaultState)
      .map((val: BoxProps, index: number) => {
        if (word.current.charAt(index) === inputWord.charAt(index)) {
          const charCount = wordHash.get(inputWord.charAt(index));

          wordHash.set(inputWord.charAt(index), charCount - 1);

          return {
            ...val,
            char: inputWord.charAt(index),
            classNames: [val.classNames[0], "flip", "green-box"],
          };
        }

        return val;
      });

    updatedWordState = updatedWordState.map((val: BoxProps, index: number) => {
      if (word.current.charAt(index) === inputWord.charAt(index)) return val;

      const charCount = wordHash.get(inputWord.charAt(index));

      if (charCount > 0) {
        wordHash.set(inputWord.charAt(index), charCount - 1);

        return {
          ...val,
          char: inputWord.charAt(index),
          classNames: [val.classNames[0], "flip", "yellow-box"],
        };
      }

      return {
        ...val,
        char: inputWord.charAt(index),
        classNames: [val.classNames[0], "flip", "grey-box"],
      };
    });

    return updatedWordState;
  };

  const updateKeyState = (boxState: BoxProps[]) => {
    boxState.forEach((val: BoxProps) => {
      const charIndex = getCharIndex(val.char);

      if (keyState.classNames[charIndex][0] === "green-key") return;

      if (keyState.classNames[charIndex][0] === "yellow-key") {
        if (val.classNames[val.classNames.length - 1] === "green-box")
          keyState.classNames[charIndex] = ["green-key"];
      }

      keyState.classNames[charIndex] = [
        val.classNames[val.classNames.length - 1].replace("box", "key"),
      ];
    });
  };

  // keyboard listener
  useEffect(() => {
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, []);

  // input word constructor
  useEffect(() => {
    if (won.current) return;
    if (!key) return;
    if (key.key.length !== 1) return;
    if (inputWord.length >= 5) return;

    const c = key.key.toUpperCase().charCodeAt(0);

    if (!(c >= 65 && c <= 90)) return;

    setInputWord((inputWord) => inputWord + key.key.toUpperCase());
  }, [key]);

  // update the window on input word update
  useEffect(() => {
    if (won.current) return;
    if (guess.current > 5) return;

    const updatedWord: BoxProps[] = Array(5)
      .fill(defaultState)
      .map((val: BoxProps, index: number) => {
        return {
          ...val,
          char: inputWord.charAt(index) ?? "",
          classNames: [...val.classNames],
        };
      });

    setHistory([
      ...history.slice(0, guess.current),
      { boxState: updatedWord },
      ...history.slice(guess.current + 1, 6),
    ]);
  }, [inputWord]);

  // validate input word when enter key is pressed
  useEffect(() => {
    if (won.current) return;
    if (!key) return;
    if (key.key.toLowerCase() !== "enter") return;
    if (guess.current > 5) return;
    if (inputWord.length !== 5) {
      toast("input not enough");
      return;
    }

    let boxState: BoxProps[] = [];
    let valid: boolean = false;

    if (words.indexOf(inputWord) === -1) {
      boxState = Array(5)
        .fill(defaultState)
        .map((val: BoxProps, index: number) => {
          return {
            ...val,
            char: inputWord.charAt(index) ?? "",
            classNames: [...val.classNames, "shake"],
          };
        });
    } else {
      valid = true;
      boxState = updateBoxState(word, inputWord);

      updateKeyState(boxState);
      setKeyState(keyState);
    }

    setHistory([
      ...history.slice(0, guess.current),
      { boxState: boxState },
      ...history.slice(guess.current + 1, 6),
    ]);

    if (!valid) return;
    if (inputWord === word.current) {
      won.current = true;
      toast("Great!");
      return;
    }
    if (guess.current === 5) toast(word.current);
    setInputWord("");
    guess.current = guess.current + 1;
  }, [key]);

  // delete input word when backspace key is pressed
  useEffect(() => {
    if (won.current) return;
    if (!key) return;
    if (key.key.toLowerCase() !== "backspace") return;
    if (guess.current > 5) return;
    if (inputWord.length === 0) return;

    setInputWord((inputWord) => inputWord.slice(0, inputWord.length - 1));
  }, [key]);

  return (
    <>
      <ToastContainer />
      <div className="wordle">
        {history.map((elem: WordProps, index: number) => {
          return <Word key={`word-${index}`} {...elem} />;
        })}
      </div>
      <div className="keyboard">
        <Keyboard {...keyState}></Keyboard>
      </div>
    </>
  );
}

export default Wordle;
