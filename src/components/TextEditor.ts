import { Component, DOM, createElement } from "react";
import * as classNames from "classnames";

import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin, { Separator } from "draft-js-inline-toolbar-plugin";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import { ContentState, Editor as DraftEditor, EditorState, convertFromHTML } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {
    BlockquoteButton,
    BoldButton,
    CodeBlockButton,
    CodeButton,
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
import "../ui/TextEditor.scss";

const linkifyPlugin = createLinkifyPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin({
    structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        CodeButton,
        Separator,
        HeadlineOneButton,
        HeadlineTwoButton,
        HeadlineThreeButton,
        UnorderedListButton,
        OrderedListButton,
        BlockquoteButton,
        CodeBlockButton
    ]
});
const pluginsList = [ inlineToolbarPlugin, linkifyPlugin ];

interface TextEditorProps {
    className?: string;
    style?: object;
    value: string;
    onChange?: (data: string) => void;
    readOnly?: boolean;
}

interface TextEditorState {
    editorState: EditorState;
}

class TextEditor extends Component<TextEditorProps, TextEditorState> {
    public static defaultProps: Partial<TextEditorProps> = {
        readOnly: false,
        value: ""
    };
    private editor: DraftEditor;

    constructor(props: TextEditorProps) {
        super(props);

        this.setEditorState(props.value);

        this.onChange = this.onChange.bind(this);
        this.refEditor = this.refEditor.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    render() {
        const { className, readOnly, style } = this.props;

        return DOM.div(
            {
                className: classNames("widget-text-editor form-control mx-textarea-input mx-textarea", className),
                onClick: this.onFocus,
                style
            },
            createElement(Editor, {
                editorState: this.state.editorState,
                onBlur: this.onBlur,
                onChange: this.onChange,
                plugins: pluginsList,
                readOnly,
                ref: this.refEditor
            }),
            createElement(inlineToolbarPlugin.InlineToolbar)
        );
    }

    componentWillReceiveProps(nextProps: TextEditorProps) {
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
        this.editor.focus();
    }

    private onChange(editorState: EditorState) {
        this.setState({ editorState });
    }

    private onBlur() {
        if (this.props.onChange) {
            const content = this.state.editorState.getCurrentContent();
            this.props.onChange(stateToHTML(content));
        }
    }

    private refEditor(element: any) {
        this.editor = element;
    }
}

export { TextEditor, TextEditorProps, linkifyPlugin, inlineToolbarPlugin, pluginsList };
