import Box, { BoxProps } from "./Box.tsx";

export interface WordProps {
  boxState: BoxProps[];
}

function Word(props: WordProps) {
  return (
    <div className="row-container">
      {props.boxState.map((value: BoxProps, index: number) => {
        return <Box key={`box-${index}`} {...value} />;
      })}
    </div>
  );
}

export default Word;
