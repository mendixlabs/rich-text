import { Component, DOM, createElement } from "react";

import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
import createInlineToolbarPlugin, { Separator } from "draft-js-inline-toolbar-plugin";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";

// Need poly fills for IE11
// import "core-js/es6/map";
// import "core-js/es6/weak-map";
// import "core-js/fn/object/assign";
// import "core-js/fn/symbol";
// import "core-js/fn/array/from";
// import "core-js/fn/string/starts-with";
// import "core-js/fn/string/ends-with";

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
import "../ui/TextEditor.css";

export interface TextEditorProps {
    className?: string;
    style?: object;
    value?: string;
    onChange?: (data: string) => void;
    readOnly?: boolean;
    valueType: "text" | "raw" | "html" | "markdown";
}

interface TextEditorState {
    editorState: any;
}

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
const { InlineToolbar } = inlineToolbarPlugin;
const pluginsList = [ inlineToolbarPlugin, linkifyPlugin ];

export class TextEditor extends Component<TextEditorProps, TextEditorState> {
    public static defaultProps: Partial<TextEditorProps> = {
        readOnly: false
    };
    private editor: any;
    constructor(props: TextEditorProps) {
        super(props);
        if (props.valueType === "raw" && props.value) {
            try {
                this.state = {
                    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(props.value)))
                };
            } catch (e) {
                this.state = {
                    editorState: createEditorStateWithText("ERROR")
                };
            }
        } else if (props.valueType === "html" && props.value) {
            try {
                this.state = {
                    editorState: stateFromHTML(props.value)
                };
            } catch (e) {
                this.state = {
                    editorState: createEditorStateWithText("ERROR")
                };
            }
        } else {
            this.state = {
                editorState: createEditorStateWithText("")
            };
        }
        this.focus = this.focus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.refEditor = this.refEditor.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentWillReceiveProps(nextProps: TextEditorProps) {
        if (nextProps.value !== this.props.value) {
            if (nextProps.valueType === "raw" && nextProps.value) {
                try {
                    this.state = {
                        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(nextProps.value)))
                    };
                } catch (e) {
                    this.state = {
                        editorState: createEditorStateWithText("ERROR")
                    };
                }
            } else {
                this.state = {
                    editorState: createEditorStateWithText("")
                };
            }
        }
    }

    onChange(editorState: TextEditorState) {
        this.setState({
            editorState
        });
    }

    focus() {
        this.editor.focus();
    }

    onBlur() {
        if (this.props.onChange) {
            const content = this.state.editorState.getCurrentContent();
            let data = "";
            if (this.props.valueType === "raw") {
                data = JSON.stringify(convertToRaw(content));
            } else if (this.props.valueType === "html") {
                data = stateToHTML(content);
            }
            this.props.onChange(data);
        }
    }

    refEditor(element: any) {
        this.editor = element;
    }

    render() {
        return DOM.div({ className: "editor form-control mx-textarea-input mx-textarea", onClick: this.focus },
            createElement(Editor, {
                editorState: this.state.editorState,
                onBlur: this.onBlur,
                onChange: this.onChange,
                plugins: pluginsList,
                readOnly: this.props.readOnly,
                ref: this.refEditor
            } as any),
            createElement(InlineToolbar)
        );
    }
}
