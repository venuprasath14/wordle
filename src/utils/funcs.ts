export function getCharIndex(char: string): number {
    return char.charCodeAt(0) - 65;
  }
  
  export function charToCountMap(text: string) {
    const countMap = new Map();
    for (let char of text) {
      countMap.set(char, (countMap.get(char) || 0) + 1);
    }
    return countMap;
  }
  
  export const getRndInteger = (max: number): number => {
    return Math.floor(Math.random() * (max - 0)) + 0;
  };
  