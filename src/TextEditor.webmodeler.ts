import { Component, createElement } from "react";
import { TextEditor, TextEditorProps } from "./components/TextEditor";
import TextEditorContainer, { TextEditorContainerProps } from "./components/TextEditorContainer";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<TextEditorContainerProps, {}> {

    componentWillMount() {
        const css = require("./ui/TextEditor.css");
        this.addPreviewStyle(css, "widget-text-editor");
    }

    render() {
        return createElement(TextEditor, this.transformProps(this.props));
    }

    private transformProps(props: TextEditorContainerProps): TextEditorProps {
        const valueAttribute = props.stringAttribute ? props.stringAttribute.split(".")[2] : "";
        return {
            className: props.class,
            readOnly: true,
            style: TextEditorContainer.parseStyle(props.style),
            value: valueAttribute ? "[" + valueAttribute + "]" : props.stringAttribute
        };
    }

    private addPreviewStyle(css: string, styleId: string) {
        // This workaround is to load style in the preview temporary till mendix has a better solution
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        const iFrameDoc = iFrame.contentDocument;
        if (!iFrameDoc.getElementById(styleId)) {
            const styleTarget = iFrameDoc.head || iFrameDoc.getElementsByTagName("head")[0];
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("id", styleId);
            styleElement.appendChild(document.createTextNode(css));
            styleTarget.appendChild(styleElement);
        }
    }
}
