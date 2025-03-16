export interface BoxProps {
    char: any;
    classNames: string[];
    onClickFunc?: () => void;
  }
  
  function Box(props: BoxProps) {
    return (
      <div className={props.classNames.join(" ")} onClick={props.onClickFunc}>
        {props.char}
      </div>
    );
  }
  
  export default Box;
  