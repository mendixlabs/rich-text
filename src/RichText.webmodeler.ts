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
            readOnly: true,
            style: TextEditorContainer.parseStyle(props.style),
            value: valueAttribute ? "[" + valueAttribute + "]" : props.stringAttribute
        };
    }
}

export function getPreviewCss() {
    return (
        require("./ui/RichText.scss") +
        require("draft-js-inline-toolbar-plugin/lib/plugin.css") +
        require("draft-js-linkify-plugin/lib/plugin.css")
    );
}
