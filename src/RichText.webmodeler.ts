import { Component, DOM, createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { RichText, RichTextProps } from "./components/RichText";
import TextEditorContainer, { RichTextContainerProps } from "./components/RichTextContainer";

// tslint:disable-next-line class-name
export class preview extends Component<RichTextContainerProps, {}> {
    private richTextNode: HTMLDivElement;

    constructor(props: RichTextContainerProps) {
        super(props);

        this.getRichTextNode = this.getRichTextNode.bind(this);
    }

    render() {
        return DOM.div({ ref: this.getRichTextNode });
    }

    componentDidMount() {
        render(createElement(RichText, preview.transformProps(this.props)), this.richTextNode);
        this.forceUpdate();
    }

    componentWillReceiveProps(newProps: RichTextContainerProps) {
        unmountComponentAtNode(this.richTextNode);
        render(createElement(RichText, preview.transformProps(newProps)), this.richTextNode);
    }

    componentDidUpdate() {
        render(createElement(RichText, preview.transformProps(this.props)), this.richTextNode);
    }

    private getRichTextNode(node: HTMLDivElement) {
        this.richTextNode = node;
    }

    private static transformProps(props: RichTextContainerProps): RichTextProps {
        const valueAttribute = props.stringAttribute ? props.stringAttribute.split(".")[ 2 ] : "";

        return {
            className: props.class,
            customOptions: props.customOptions,
            editorOption: props.editorOption,
            hasContext: true,
            maxNumberOfLines: props.maxNumberOfLines,
            minNumberOfLines: props.minNumberOfLines,
            readOnly: props.editable === "never",
            readOnlyStyle: props.readOnlyStyle,
            style: TextEditorContainer.parseStyle(props.style),
            theme: props.theme,
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
