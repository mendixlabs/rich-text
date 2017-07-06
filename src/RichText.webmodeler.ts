import { Component, createElement } from "react";
import { RichText, RichTextProps } from "./components/RichText";
import TextEditorContainer, { RichTextContainerProps } from "./components/RichTextContainer";

// tslint:disable-next-line class-name
export class preview extends Component<RichTextContainerProps, {}> {
    render() {
        return createElement(RichText, preview.transformProps(this.props));
    }

    private static transformProps(props: RichTextContainerProps): RichTextProps {
        const valueAttribute = props.stringAttribute ? props.stringAttribute.split(".")[ 2 ] : "";

        return {
            className: props.class,
            editorOption: props.editorOption,
            hasContext: true,
            maxNumberOfLines: props.maxNumberOfLines,
            minNumberOfLines: props.minNumberOfLines,
            readOnly: props.editable === "never",
            readOnlyStyle: props.readOnlyStyle,
            style: TextEditorContainer.parseStyle(props.style),
            theme: props.theme,
            value: valueAttribute ? "[" + valueAttribute + "]" : props.stringAttribute
        };
    }
}

export function getPreviewCss() {
    return (
        require("quill/dist/quill.snow.css") +
        require("quill/dist/quill.bubble.css") +
        require("./ui/RichText.scss")
    );
}
