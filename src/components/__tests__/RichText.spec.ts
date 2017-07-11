import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import { RichText, RichTextProps } from "../RichText";

describe("RichText", () => {
    const renderTextEditor = (props: RichTextProps) => shallow(createElement(RichText, { ...props }));
    let textEditor: ShallowWrapper<RichTextProps, any>;
    const defaultProps: RichTextProps = {
        editorOption: "basic",
        hasContext: true,
        maxNumberOfLines: 10,
        minNumberOfLines: 10,
        onChange: jasmine.any(Function),
        readOnly: false,
        readOnlyStyle: "bordered",
        theme: "snow",
        value: `<p>Rich Text</p>`
    };

    describe("that is not read-only", () => {
        it("renders the structure correctly", () => {
            textEditor = renderTextEditor(defaultProps);

            expect(textEditor).toBeElement(
                DOM.div({ className: "widget-rich-text read-only-bordered" },
                    DOM.div({ className: "widget-rich-text-quill" })
                )
            );
        });

        it("renders a quill editor", () => {
            textEditor = renderTextEditor(defaultProps);
            const textEditorInstance = textEditor.instance() as any;
            const quillNode = textEditorInstance.quillNode = document.createElement("div");
            document.createElement("div").appendChild(quillNode);

            const editorSpy = spyOn(textEditorInstance, "setUpEditor").and.callThrough();
            textEditorInstance.componentDidMount();

            expect(editorSpy).toHaveBeenCalled();
        });

        it("updates when the editor value changes", () => {
            textEditor = renderTextEditor(defaultProps);
            const textEditorInstance = textEditor.instance() as any;
            const quillNode = textEditorInstance.quillNode = document.createElement("div");
            document.createElement("div").appendChild(quillNode);

            const editorSpy = spyOn(textEditorInstance, "updateEditor").and.callThrough();
            textEditorInstance.componentDidUpdate(defaultProps);
            textEditorInstance.componentDidMount();
            defaultProps.value = "New value";
            textEditorInstance.componentDidUpdate(defaultProps);

            expect(editorSpy).toHaveBeenCalledTimes(2);
        });

        describe("with editor mode set to", () => {
            const getToolBar: any = (props: RichTextProps) => {
                textEditor = renderTextEditor(props);
                const textEditorInstance = textEditor.instance() as any;
                const quillNode = textEditorInstance.quillNode = document.createElement("div");
                document.createElement("div").appendChild(quillNode);
                textEditorInstance.componentDidMount();

                return textEditorInstance.quill.getModule("toolbar");
            };

            it("basic renders a basic text editor", () => {
                const toolbar = getToolBar(defaultProps);

                expect(toolbar.options.container.length).toBe(2);
            });

            it("extended renders an advanced text editor", () => {
                defaultProps.editorOption = "extended";
                const toolbar = getToolBar(defaultProps);

                expect(toolbar.options.container.length).toBe(7);
            });

            it("custom renders a custom toolbar", () => {
                defaultProps.editorOption = "custom";
                defaultProps.customOptions = [ { option: "bold" }, { option: "spacer" }, { option: "underline" } ];
                const toolbar = getToolBar(defaultProps);

                expect(toolbar.options.container.length).toBe(2);
            });
        });
    });

    describe("that is read-only", () => {
        defaultProps.readOnly = true;

        it("with read-only style text renders the structure correctly", () => {
            defaultProps.readOnlyStyle = "text";
            textEditor = renderTextEditor(defaultProps);

            expect(textEditor).toBeElement(
                DOM.div({
                    className: "widget-rich-text read-only-text",
                    dangerouslySetInnerHTML: { __html: defaultProps.value }
                })
            );
        });

        it("with read-only style bordered has the read-only-bordered class", () => {
            defaultProps.readOnlyStyle = "bordered";
            textEditor = renderTextEditor(defaultProps);

            expect(textEditor.hasClass("read-only-bordered")).toBe(true);
        });

        it("with read-only style borderedToolbar has the read-only-bordered-toolbar class", () => {
            defaultProps.readOnlyStyle = "borderedToolbar";
            textEditor = renderTextEditor(defaultProps);

            expect(textEditor.hasClass("read-only-bordered-toolbar")).toBe(true);
        });
    });

    it("that has no context has the no-context class", () => {
        defaultProps.hasContext = false;
        textEditor = renderTextEditor(defaultProps);

        expect(textEditor.hasClass("no-context")).toBe(true);
    });
});
