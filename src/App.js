import React from "react";

import "./App.css";
import { Editor } from "slate-react";
import { Value } from "slate";
import initialValue from "./value.json";
import { isKeyHotkey } from "is-hotkey";
const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

function CodeNode(props) {
  return (
    <pre
      {...props.attributes}
      style={{ backgroundColor: "#333", padding: ".5em", borderRadius: "1em" }}
    >
      - <code>{props.children}</code>
    </pre>
  );
}

function App() {
  const [state, setState] = React.useState({
    value: Value.fromJSON(initialValue)
  });

  const onChange = ({ value }) => {
    setState({ value });
  };
  const ref = React.useRef();

  const onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else {
      return next();
    }
    console.log(mark);
    event.preventDefault();
    editor.toggleMark(mark);
    // Determine whether any of the currently selected blocks are code blocks.
    const isCode = editor.value.blocks.some(block => block.type === "code");

    // Toggle the block type depending on `isCode`.
    editor.setBlocks(isCode ? "paragraph" : "code");
  };

  const renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "code":
        return <CodeNode {...props} />;
      default:
        return next();
    }
  };

  const renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={ref}
          value={state.value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          renderMark={renderMark}
          renderBlock={renderBlock}
        />
      </header>
    </div>
  );
}

export default App;
