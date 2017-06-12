import { Component, DOM, createElement } from "react";
import * as classNames from "classnames";

import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin, { Separator } from "draft-js-inline-toolbar-plugin";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import { ContentState, Editor as DraftEditor, EditorState, convertFromHTML } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {
    BoldButton,
    HeadlineOneButton,
    HeadlineThreeButton,
    HeadlineTwoButton,
    ItalicButton,
    OrderedListButton,
    UnderlineButton,
    UnorderedListButton
} from "draft-js-buttons";

import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-linkify-plugin/lib/plugin.css";
import "../ui/RichText.scss";

interface RichTextProps {
    className?: string;
    style?: object;
    value: string;
    onChange?: (data: string) => void;
    readOnly: boolean;
}

interface TextEditorState {
    editorState: EditorState;
}

class RichText extends Component<RichTextProps, TextEditorState> {
    public static defaultProps: Partial<RichTextProps> = {
        readOnly: false,
        value: ""
    };
    private editor?: DraftEditor;
    private linkifyPlugin = createLinkifyPlugin();
    private inlineToolbarPlugin = createInlineToolbarPlugin({
        structure: [
            BoldButton,
            ItalicButton,
            UnderlineButton,
            Separator,
            HeadlineOneButton,
            HeadlineTwoButton,
            HeadlineThreeButton,
            UnorderedListButton,
            OrderedListButton
        ]
    });
    private hasFocus = false;

    constructor(props: RichTextProps) {
        super(props);

        this.setEditorState(props.value);

        this.onChange = this.onChange.bind(this);
        this.refEditor = this.refEditor.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    render() {
        const { className, readOnly, style } = this.props;
        const editableClasses = "form-control mx-textarea-input mx-textarea-input-noresize";

        return DOM.div(
            {
                className: classNames("widget-rich-text mx-textarea", className, {
                    [`${editableClasses}`]: !readOnly
                }),
                onClick: this.onFocus,
                style
            },
            createElement(Editor, {
                editorState: this.state.editorState,
                onBlur: this.onBlur,
                onChange: this.onChange,
                plugins: [ this.inlineToolbarPlugin, this.linkifyPlugin ],
                readOnly,
                ref: this.refEditor
            }),
            !this.props.readOnly ? createElement(this.inlineToolbarPlugin.InlineToolbar) : null
        );
    }

    componentWillReceiveProps(nextProps: RichTextProps) {
        if (nextProps.value !== this.props.value) {
            this.setEditorState(nextProps.value);
        }
    }

    private setEditorState(value: string) {
        const blocksFromHTML = convertFromHTML(value);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML);
        this.state = {
            editorState: EditorState.createWithContent(contentState)
        };
    }

    private onFocus() {
        if (this.editor) {
            this.editor.focus();
        }

        this.hasFocus = true;
    }

    private onChange(editorState: EditorState) {
        if (!this.hasFocus && this.editor) {
            this.editor.blur();
        } else {
            this.setState({ editorState });
        }
    }

    private onBlur() {
        if (this.props.onChange && this.hasFocus) {
            const content = this.state.editorState.getCurrentContent();
            this.props.onChange(stateToHTML(content));
        }
        this.hasFocus = false;
    }

    private refEditor(element: any) {
        this.editor = element;
    }
}

export { RichText, RichTextProps };
