import { Component, createElement } from "react";

import { RichText, RichTextProps } from "./components/RichText";
import RichTextContainer, { RichTextContainerProps } from "./components/RichTextContainer";

import { ValidateConfigs } from "./components/ValidateConfigs";

// tslint:disable-next-line class-name
export class preview extends Component<RichTextContainerProps, {}> {
    render() {
        return createElement(ValidateConfigs, { ...this.props as RichTextContainerProps, showOnError: true },
            createElement(RichText, preview.transformProps(this.props))
        );
    }

    private static transformProps(props: RichTextContainerProps): RichTextProps {
        const valueAttribute = props.stringAttribute ? props.stringAttribute.split(".")[ 2 ] : "";

        return {
            ... RichTextContainer.getPartialRichTextProps(props) as RichTextProps,
            readOnly: props.editable === "never",
            recreate: true,
            update: true,
            value: `<p>${valueAttribute ? `[${valueAttribute}]` : props.stringAttribute}</p>`
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
