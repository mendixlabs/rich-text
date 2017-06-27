import { Component, DOM } from "react";
import * as classNames from "classnames";

import * as Quill from "quill";
import { EditorMode } from "./RichTextContainer";

import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

interface RichTextProps {
    className?: string;
    editorMode: EditorMode;
    onChange?: (value: string) => void;
    readOnly: boolean;
    style?: object;
    value: string;
    theme: "bubble" | "snow";
}

class RichText extends Component<RichTextProps, {}> {
    private quillNode?: HTMLElement;
    private quill?: Quill.Quill;

    constructor(props: RichTextProps) {
        super(props);

        this.state = { text: props.value };
        this.handleChange = this.handleChange.bind(this);
        this.setQuillNode = this.setQuillNode.bind(this);
    }

    render() {
        return DOM.div({ className: classNames("widget-rich-text", this.props.className), style: this.props.style },
            DOM.div({ className: "widget-rich-text-quill", ref: this.setQuillNode })
        );
    }

    componentDidMount() {
        this.renderEditor(this.props.value);
    }

    componentWillReceiveProps(nextProps: RichTextProps) {
        if (nextProps.value !== this.props.value) {
            this.renderEditor(nextProps.value);
        }
    }

    private setQuillNode(node: HTMLElement) {
        this.quillNode = node;
    }

    private renderEditor(text: string) {
        if (this.quillNode && !this.quill) {
            this.quill = new Quill(this.quillNode, {
                modules: this.getEditorModules(),
                theme: this.props.theme
            });
            this.quill.on("text-change", this.handleChange);
        }
        if (this.quill) {
            this.quill.clipboard.dangerouslyPasteHTML(text);
        }
    }

    private handleChange() {
        if (this.props.onChange && this.quill) {
            this.props.onChange((this.quill as any).container.firstChild.innerHTML);
        }
    }

    private getEditorModules(): Quill.StringMap {
        if (this.props.editorMode === "basic") {
            return RichText.getBasicOptions();
        }

        return RichText.getAdvancedOptions();
    }

    private static getBasicOptions(): Quill.StringMap {
        return {
            toolbar: [
                [ "bold", "italic", "underline" ],
                [ { list: "ordered" }, { list: "bullet" } ]
            ]
        };
    }

    private static getAdvancedOptions(): Quill.StringMap {
        return {
            toolbar: [
                [ { header: [ 1, 2, 3, 4, 5, 6, false ] } ],

                [ "bold", "italic", "underline", "strike" ],
                [ "blockquote", "code-block" ],

                [ { list: "ordered" }, { list: "bullet" } ],
                [ { script: "sub" }, { script: "super" } ],
                [ { indent: "-1" }, { indent: "+1" } ],
                [ { direction: "rtl" } ],

                [ { color: [] }, { background: [] } ],
                [ { align: [] } ],

                [ "clean" ]
            ]
        };
    }
}

export { RichText, RichTextProps };
