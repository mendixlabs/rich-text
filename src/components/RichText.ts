import { Component, DOM } from "react";
import * as classNames from "classnames";

import * as Quill from "quill";
import { EditorOption, ReadOnlyStyle } from "./RichTextContainer";

import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../ui/RichText.scss";

interface RichTextProps {
    className?: string;
    editorOption: EditorOption;
    onChange?: (value: string) => void;
    readOnly: boolean;
    readOnlyStyle: ReadOnlyStyle;
    hasContext: boolean;
    style?: object;
    value: string;
    theme: "bubble" | "snow";
    customOptions?: Array<{ option: string }>;
    minNumberOfLines: number;
    maxNumberOfLines: number;
}

class RichText extends Component<RichTextProps, {}> {
    private quillNode?: HTMLElement;
    private quill?: Quill.Quill;
    private static quillOptions: { [key: string]: any } = {
        align: { align: [] },
        blockQuote: "blockquote",
        bold: "bold",
        bulletList: { list: "bullet" },
        clean: "clean",
        codeBlock: "code-block",
        direction: { direction: "rtl" },
        fillColor: { background: [] },
        headings: { header: [ 1, 2, 3, 4, 5, 6, false ] },
        indent: { indent: "-1" },
        italic: "italic",
        link: "link",
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

        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.setQuillNode = this.setQuillNode.bind(this);
    }

    render() {
        const { className, hasContext, readOnly, readOnlyStyle } = this.props;

        if (readOnly && readOnlyStyle === "text") {
            return DOM.div({
                className: classNames("widget-rich-text read-only-text", className),
                dangerouslySetInnerHTML: { __html: this.props.value },
                style: this.props.style
            });
        }

        return DOM.div({
                className: classNames("widget-rich-text", className, {
                    "no-context": !hasContext,
                    "read-only-bordered": readOnly && readOnlyStyle === "bordered",
                    "read-only-bordered-toolbar": readOnly && readOnlyStyle === "borderedToolbar"
                }),
                style: this.props.style
            },
            DOM.div({
                className: classNames("widget-rich-text-quill"),
                ref: this.setQuillNode
            })
        );
    }

    componentDidMount() {
        this.setUpEditor(this.props);
    }

    componentDidUpdate(prevProps: RichTextProps) {
        if (prevProps.readOnly && !this.props.readOnly) {
            this.setUpEditor(this.props);
        }
        this.updateEditor(this.props);
    }

    componentWillUnmount() {
        this.handleSelectionChange();
        if (this.quill) {
            this.quill.off("selection-change", this.handleSelectionChange);
        }
    }

    private setQuillNode(node: HTMLElement) {
        this.quillNode = node;
    }

    private setUpEditor(props: RichTextProps) {
        if (this.quillNode && !this.quill) {
            this.quill = new Quill(this.quillNode, {
                modules: this.getEditorOptions(),
                theme: props.theme
            });

            this.quill.on("selection-change", this.handleSelectionChange);
        }
    }

    private handleSelectionChange() {
        if (this.quill && !this.quill.hasFocus() && this.props.onChange) {
            const value = (this.quill as any).container.firstChild.innerHTML;
            if (this.props.value !== value) {
                this.props.onChange(value);
            }
        }
    }

    private updateEditor(props: RichTextProps) {
        if (this.quill) {
            this.quill.enable(!props.readOnly && props.hasContext);
            this.quill.clipboard.dangerouslyPasteHTML(props.value);

            this.setEditorStyle(props);
        }
    }

    private setEditorStyle(props: RichTextProps) {
        if (this.quillNode) {
            const quillEditor = this.quillNode.getElementsByClassName("ql-editor")[ 0 ] as HTMLDivElement;
            if (quillEditor) {
                if (!props.readOnly || props.readOnly && props.readOnlyStyle !== "text" || !props.hasContext) {
                    quillEditor.classList.add("form-control");
                }

                const averageLineHeight = 1.42857;
                if (props.minNumberOfLines > 0) {
                    quillEditor.style.minHeight = `${(props.minNumberOfLines + 1) * averageLineHeight}em`;
                }
                if (props.maxNumberOfLines > 0) {
                    quillEditor.style.maxHeight = `${(props.maxNumberOfLines + 1) * averageLineHeight}em`;
                }
            }
        }
    }

    private getEditorOptions(): Quill.StringMap {
        if (this.props.editorOption === "basic") {
            return RichText.getBasicOptions();
        }
        if (this.props.editorOption === "extended") {
            return RichText.getAdvancedOptions();
        }

        return RichText.getCustomOptions(this.props.customOptions || null);
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
                [ "bold", "italic", "underline", "strike", { color: [] }, { background: [] } ],
                [ "link" ],
                [ { list: "ordered" }, { list: "bullet" } ],
                [ { indent: "-1" }, { indent: "+1" } ],
                [ { align: [] } ],
                [ "clean" ]
            ]
        };
    }

    private static getCustomOptions(options: Array<{ option: string }> | null) {
        const toolbar: { toolbar?: any[] } = {};
        if (options && options.length) {
            toolbar.toolbar = [ ...this.processCustomOptions(options) ];
        }

        return toolbar;
    }

    private static processCustomOptions(options: Array<{ option: string }>): any[] {
        const validOptions: any[] = [];
        let grouping: any[] = [];
        options.forEach(option => {
            if (option.option === "spacer") {
                validOptions.push(grouping);
                grouping = [];
            } else {
                grouping.push(RichText.quillOptions[option.option]);
            }
        });

        if (grouping.length) {
            validOptions.push(grouping);
        }

        return validOptions;
    }
}

export { RichText, RichTextProps };
