import styled from "@emotion/styled";
import { css } from "@emotion/css";
import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";

import { createEditor, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import Prism from "prismjs";
import "prismjs/components/prism-promql";
import "prismjs/components/prism-sql";
import { themes } from "../theme/themes";
import { ThemeProvider } from "@emotion/react";
import { useSelector } from "react-redux";
const CustomEditor = styled(Editable)`
    flex: 1;
 //   height: 100%;
    background: ${({theme}: any) => theme.inputBg};
    border: 1px solid ${({theme}: any) => theme.buttonBorder};
    color: ${({theme}: any) => theme.textColor};
    padding: 4px 8px;
    font-size: 1em;
    font-family: monospace;
    margin: 0px 5px;
   // margin-bottom: 20px;
    border-radius: 3px;
    line-height: 1.5;
    line-break: anywhere;
    overflow-y: scroll;
`;
// const Resizable = css`
//     margin-bottom: 10px;
//     width: 100%;
// `;
const QueryBar = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 100%;
`;

function Leaf({ attributes, children, leaf }: any) {
    const theme = useSelector((store: any) => store.theme);
    const _themes: any = themes;
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
                    color: ${_themes[theme].textOff};
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
                    color: green;
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

export function getTokenLength(token: any) {
    if (typeof token === "string") {
        return token?.length;
    }

    if (typeof token?.content === "string") {
        return token?.content.length;
    }

    return token?.content?.reduce((l: any, t: any) => l + getTokenLength(t), 0);
}

export default function QueryEditor({
    onQueryChange,
    value,
    onKeyDown,
    defaultValue,
    isSplit,
    // wrapperRef
}: any) {
    const theme = useSelector((store: any) => store.theme);

    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    // const [height, setHeight] = useState(0);
    // const [width, setWidth] = useState(0);
    const editor = useMemo(() => withHistory(withReact(createEditor() as any)), []);
    const ref = useRef(null);    

    // useEffect(()=> {
    //     setHeight(30)
    // },[setHeight])
    // useEffect(()=> {
    //     setWidth(wrapperRef)
    // },[width, setWidth, isSplit, wrapperRef])
    // Keep track of state for the value of the editor.

    const [language] = useState("sql");

    const decorate = useCallback(
        ([node, path]: any) => {
            const ranges: any[] = [];
            if (!Text.isText(node) || (node as any)?.length < 1) {
                return ranges;
            }
            const tokens = Prism.tokenize(node.text, Prism.languages[language]);
            let start = 0;
            for (const token of tokens) {
                const length = getTokenLength(token);
                const end = start + length;

                if (typeof token !== "string") {
                    ranges.push({
                        [token.type]: true,
                        anchor: { path, offset: start },
                        focus: { path, offset: end },
                    });
                }
                start = end;
            }
            return ranges;
        },
        [language]
    );

    const [editorValue, setEditorValue] = useState(value);

    useEffect(() => {
        setEditorValue(value);
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setEditorValue(value);
        editor.children = value;
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, setEditorValue]);

    const _themes: any = themes;

    return (
        <ThemeProvider theme={_themes[theme]}>
            <QueryBar ref={ref}>
                {/* <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value={"sql"}>{"SQL"}</option>
            <option value={"promql"}>{"promQL"}</option>
        </select> */}
                <Slate
                    editor={editor}
                    value={editorValue}
                    onChange={onQueryChange}
                >

                        <CustomEditor
                            decorate={decorate}
                            renderLeaf={renderLeaf}
                            placeholder={''}
                            onKeyDown={onKeyDown}
                            spellCheck="false"
                        />
                    {/* </ResizableBox> */}
                </Slate>
            </QueryBar>
        </ThemeProvider>
    );
}
