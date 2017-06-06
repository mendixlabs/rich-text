import { Component, createElement } from "react";
import { TextEditor, TextEditorProps } from "./components/TextEditor";
import TextEditorContainer, { TextEditorContainerProps } from "./components/TextEditorContainer";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<TextEditorContainerProps, {}> {
    render() {
        return createElement(TextEditor, preview.transformProps(this.props));
    }

    private static transformProps(props: TextEditorContainerProps): TextEditorProps {
        const valueAttribute = props.stringAttribute ? props.stringAttribute.split(".")[2] : "";

        return {
            className: props.class,
            readOnly: true,
            style: TextEditorContainer.parseStyle(props.style),
            value: valueAttribute ? "[" + valueAttribute + "]" : props.stringAttribute
        };
    }
}

export function getPreviewCss() {
    return require("./ui/TextEditor.scss");
}
