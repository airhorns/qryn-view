// Import React dependencies.
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";
// Import the Slate editor factory.
import { createEditor, Text, Element as SlateElement, Descendant } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact,insertData } from "slate-react";
import { withHistory } from "slate-history";
import Prism from "prismjs";
import "prismjs/components/prism-promql";
import "prismjs/components/prism-sql";

// takes => default value from query
// output => view with highlighted text by language
//  PrismJS => select language before input

const CustomEditor = styled(Editable)`
  flex: 1;
  background: #121212;
  color: #ccc;
  padding: 4px 8px;
  font-size: 1em;
  font-family: monospace;
  margin: 3px;
  border-radius: 3px;
  line-height: 1.25;
`;

const QueryBar = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

function Leaf({ attributes, children, leaf }) {
 
  return (
    <span
      {...attributes}
      className={css`
        font-family: monospace;
        // background: black;
        ${leaf.comment &&
        css`
          color: blue;
        `}
        ${(leaf.operator || leaf.url) &&
        css`
          color: white;
        `}
        ${leaf.keyword &&
        css`
          color: #57aed4;
        `}
        ${(leaf.variable || leaf.regex) &&
        css`
          color: #e90;
        `}
        ${(leaf.number ||
          leaf.boolean ||
          leaf.tag ||
          leaf.constant ||
          leaf.symbol ||
          leaf["attr-name"] ||
          leaf.selector) &&
        css`
          color: #dd4a68;
        `}
        ${leaf.punctuation &&
        css`
          color: orange;
        `}
        ${(leaf.string || leaf.char) &&
        css`
          color: #7bdb40;
        `}
        ${(leaf.function || leaf["class-name"] || leaf["attr-name"]) &&
        css`
          color: #dd4a68;
        `}
          ${leaf["context-labels"] &&
        css`
          color: orange;
        `}
          ${leaf["label-key"] &&
        css`
          color: green;
        `}
      `}
    >
      {children}
    </span>
  );
}

export default function QueryEditor({ onQueryChange, value, onKeyDown }) {
  // Create a Slate editor object that won't change across renders.
//  the value could change, so add useEffect



  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  /* const editorRef = useRef()
  if(!editorRef.current) editorRef.current =  withHistory(withReact(createEditor()))
  const editor = editorRef.current */
 const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  // Keep track of state for the value of the editor.

  const [language, setLanguage] = useState("sql");

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];
      if (!Text.isText(node) || node.length <1) {
        return ranges;
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[language]);
      let start = 0;
      for (const token of tokens) {
        const length = getLength(token);
        const end = start + length;

        if (typeof token !== "string") {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset:  end },
          });
        }
        start = end;
      }
      return ranges;
    },
    [language]
  );

  function getLength(token) {
    if (typeof token === "string") {
      return token.length;
    } else if (typeof token.content === "string") {
      return token.content.length;
    } else {
      return token.content.reduce((l, t) => l + getLength(t), 0);
    }
  }


  const [editorValue, setEditorValue] = useState(value)

  useEffect(()=>{
setEditorValue(value)
  },[])
  useEffect(()=>{
    setEditorValue(value)
   editor.children = value
  },[value])
  return (
    <QueryBar>
      {/* <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value={"sql"}>{"SQL"}</option>
        <option value={"promql"}>{"promQL"}</option>
      </select> */}
      <Slate editor={editor} value={editorValue} onChange={onQueryChange}>
        <CustomEditor
        decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Enter a cLoki Query"
          onKeyDown={onKeyDown}
          spellCheck="false"
        />
      </Slate>
    </QueryBar>
  );
}

