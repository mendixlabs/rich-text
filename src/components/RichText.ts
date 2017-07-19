import { Component, ReactNode, createElement } from "react";
import * as classNames from "classnames";

import * as Quill from "quill";
import * as sanitizeHtml from "sanitize-html";

import { ReadOnlyStyle } from "./RichTextContainer";

import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../ui/RichText.scss";
import { getAdvancedOptions, getBasicOptions, getToolbar } from "../utils/Quill";

export interface CommonRichTextProps {
    editorOption: EditorOption;
    hasContext: boolean;
    value: string;
    readOnly: boolean;
    readOnlyStyle: ReadOnlyStyle;
    theme: Theme;
    customOptions?: { option: string }[];
    minNumberOfLines: number;
    maxNumberOfLines: number;
}

interface RichTextProps extends CommonRichTextProps {
    className?: string;
    onChange?: (value: string) => void;
    style?: object;
}

export type EditorOption = "basic" | "extended" | "custom";
export type Theme = "snow" | "bubble";

// TODO: look into using a state machine
// TODO: Clean out the spaghetti
class RichText extends Component<RichTextProps, {}> {
    private quillNode?: HTMLElement;
    private quill?: Quill.Quill;

    constructor(props: RichTextProps) {
        super(props);

        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.setQuillNode = this.setQuillNode.bind(this);
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-rich-text", this.props.className, {
                    [ RichText.getReadOnlyClasses(this.props.readOnlyStyle) ]: this.props.readOnly
                }),
                dangerouslySetInnerHTML: this.getReadOnlyText(),
                style: this.props.style
            },
            this.renderQuillNode()
        );
    }

    componentDidMount() {
        this.setUpEditor(this.props);
    }

    componentDidUpdate(prevProps: RichTextProps) {
        if (prevProps.readOnly && !this.props.readOnly && this.props.readOnlyStyle !== "text") {
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

    private static getReadOnlyClasses(readOnlyStyle: ReadOnlyStyle): string {
        return classNames({
            "disabled-text": readOnlyStyle === "text",
            "disabled-bordered": readOnlyStyle === "bordered",
            "disabled-bordered-toolbar": readOnlyStyle === "borderedToolbar"
        });
    }

    private getReadOnlyText(): { __html: string } | undefined {
        return this.props.readOnly && this.props.readOnlyStyle === "text"
            ? { __html: sanitizeHtml(this.props.value) }
            : undefined;
    }

    private renderQuillNode(): ReactNode {
        return !(this.props.readOnly && this.props.readOnlyStyle === "text")
            ? createElement("div", {
                className: classNames("widget-rich-text-quill"),
                ref: this.setQuillNode
            })
            : null;
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
        if (this.quillNode) { // Look into silencing ts compiler on this
            const quillEditor = this.quillNode.getElementsByClassName("ql-editor")[ 0 ] as HTMLDivElement;
            if (quillEditor) {
                // may not need readOnlyStyle = text... check
                if (!props.readOnly || props.readOnly && props.readOnlyStyle !== "text" || !props.hasContext) {
                    quillEditor.classList.add("form-control");
                }

                const averageLineHeight = 1.42857; // move to top of class. Document source of magic number. Voldemort
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
            return getBasicOptions();
        }
        if (this.props.editorOption === "extended") {
            return getAdvancedOptions();
        }

        return getToolbar(this.props.customOptions || null);
    }
}

export { RichText, RichTextProps };
