import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { TextEditor, TextEditorProps } from "../TextEditor";
import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import { EditorState } from "draft-js";

describe("TextEditor", () => {
    const renderTextEditor = (value: string) => shallow(createElement(TextEditor, { value }));
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    let textEditor: ShallowWrapper<TextEditorProps, any>;
    const editableClasses = "form-control mx-textarea-input mx-textarea-input-noresize";

    beforeEach(() => {
        textEditor = renderTextEditor("Text Editor");
    });

    it("renders the structure correctly", () => {
        expect(textEditor).toBeElement(
            DOM.div(
                {
                    className: `widget-text-editor mx-textarea ${editableClasses}`,
                    onClick: jasmine.any(Function) as any
                },
                createElement(Editor, {
                    editorState: jasmine.any(Object),
                    onBlur: jasmine.any(Function),
                    onChange: jasmine.any(Function),
                    plugins: jasmine.any(Array),
                    readOnly: false,
                    ref: jasmine.any(Function)
                }),
                createElement(inlineToolbarPlugin.InlineToolbar)
            )
        );
    });

    it("that is editable has the required css classes", () => {
        expect(textEditor.hasClass(editableClasses)).toBe(true);
    });

    it("that is read only does not have the editability css classes", () => {
        textEditor = shallow(createElement(TextEditor, { readOnly: true, value: "Value" }));

        expect(textEditor.hasClass(editableClasses)).toBe(false);
    });

    it("updates the editor state only when the value is changed", () => {
        const editorStateSpy = spyOn(EditorState, "createWithContent").and.callThrough();
        textEditor = renderTextEditor("Text Editor");

        expect(editorStateSpy).toHaveBeenCalled();

        const textEditorInstance = textEditor.instance() as any;
        textEditorInstance.componentWillReceiveProps({ value: "Text Editor" });

        expect(editorStateSpy).toHaveBeenCalledTimes(1);

        textEditorInstance.componentWillReceiveProps({ value: "New Editor" });

        expect(editorStateSpy).toHaveBeenCalledTimes(2);
    });

    it("updates the editor state when the editor is changed", () => {
        const draftEditor = textEditor.find(Editor);
        const editorState = textEditor.state().editorState;

        draftEditor.simulate("change");

        expect(editorState).not.toBe(textEditor.state().editorState);
    });

    it("triggers the specified on change action when the editor loses focus", () => {
        const onChangeSpy = jasmine.createSpy("onChange");
        textEditor = shallow(createElement(TextEditor, { onChange: onChangeSpy, value: "Value" }));
        const draftEditor = textEditor.find(Editor);

        draftEditor.simulate("blur");

        expect(onChangeSpy).toHaveBeenCalled();
    });
});
