declare module "draft-js-plugins-editor" {
    const Editor: any;
    function createEditorStateWithText(text: string): Draft.EditorState;

    export { Editor as default, createEditorStateWithText };
}

declare module "draft-js-inline-toolbar-plugin" {
    interface ToolbarPlugin {
        InlineToolbar: React.ComponentClass<{}>;
        initialize: () => void;
        onChange: (editorState: Draft.EditorState) => void;
    }
    function createInlineToolbarPlugin(options?: { structure?: Array<React.ComponentClass<{}>> }): ToolbarPlugin;
    const Separator: React.ComponentClass<{}>;

    export { createInlineToolbarPlugin as default, Separator };
}

declare module "draft-js-linkify-plugin" {
    function createLinkifyPlugin(): any;

    export { createLinkifyPlugin as default };
}

declare module "draft-js-buttons" {
    const BlockquoteButton: React.ComponentClass<{}>;
    const BoldButton: React.ComponentClass<{}>;
    const CodeBlockButton: React.ComponentClass<{}>;
    const CodeButton: React.ComponentClass<{}>;
    const HeadlineOneButton: React.ComponentClass<{}>;
    const HeadlineThreeButton: React.ComponentClass<{}>;
    const HeadlineTwoButton: React.ComponentClass<{}>;
    const ItalicButton: React.ComponentClass<{}>;
    const OrderedListButton: React.ComponentClass<{}>;
    const UnderlineButton: React.ComponentClass<{}>;
    const UnorderedListButton: React.ComponentClass<{}>;

    export {
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
    };
}
