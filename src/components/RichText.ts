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
    customOptions?: Array<{ option: QuillOptions }>;
}

export type QuillOptions = "spacer" | "bold" | "italic" | "underline" | "strike" | "orderedList" | "bulletList"
    | "blockQuote" | "codeBlock" | "subScript" | "superScript" | "indent" | "outdent" | "direction" | "textColor"
    | "backgroundColor" | "align";

class RichText extends Component<RichTextProps, {}> {
    private quillNode?: HTMLElement;
    private quill?: Quill.Quill;
    private static quillOptions: { [key: string]: any } = {
        align: { align: [] },
        bold: "bold",
        bulletList: { list: "bullet" },
        direction: { direction: "rtl" },
        fillColor: { background: [] },
        headers: { header: [ 1, 2, 3, 4, 5, 6, false ] },
        indent: { indent: "-1" },
        italic: "italic",
        orderedList: { list: "ordered" },
        outdent: { indent: "+1" },
        strike: "strike",
        subScript: { script: "sub" },
        superScript: { script: "super" },
        textColor: { color: [] },
        underline: "underline"
    };

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

        if (this.props.editorMode === "advanced") {
            return RichText.getAdvancedOptions();
        }

        return RichText.getCustomOptions(this.props.customOptions ? this.props.customOptions : null);
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
                [ RichText.quillOptions.headings ],

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

    private static getCustomOptions(options: Array<{ option: QuillOptions }> | null) {
        const toolbar: { toolbar?: any[] } = {};
        if (options && options.length) {
            toolbar.toolbar = [ ...this.processCustomOptions(options) ];
        }

        return toolbar;
    }

    private static processCustomOptions(options: Array<{ option: QuillOptions }>): any[] {
        const validOptions: any[] = [];
        let grouping: any[] = [];
        options.forEach(option => {
            if (option.option === "spacer") {
                validOptions.push(grouping);
                grouping = [];
            } else {
                grouping.push(RichText.quillOptions[ option.option ]);
            }
        });

        if (grouping.length) {
            validOptions.push(grouping);
        }

        return validOptions;
    }
}

export { RichText, RichTextProps };
