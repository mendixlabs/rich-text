import { Component, createElement } from "react";

import { RichText } from "./RichText";
import { Alert } from "./Alert";

interface WrapperProps {
    class?: string;
    mxform: mxui.lib.form._FormBase;
    mxObject?: mendix.lib.MxObject;
    style?: string;
    readOnly: boolean;
}

interface RichTextContainerProps extends WrapperProps {
    stringAttribute: string;
    editable: "default" | "never";
    editorOption: EditorOption;
    onChangeMicroflow: string;
    theme: "snow" | "bubble";
    customOptions?: Array<{ option: string }>;
    readOnlyStyle: ReadOnlyStyle;
    minNumberOfLines: number;
    maxNumberOfLines: number;
}

interface RichTextState {
    value: string;
    alertMessage?: string;
}

export type EditorOption = "basic" | "extended" | "custom";
export type ReadOnlyStyle = "bordered" | "text" | "borderedToolbar";

class RichTextContainer extends Component<RichTextContainerProps, RichTextState> {
    private subscriptionHandles: number[] = [];

    constructor(props: RichTextContainerProps) {
        super(props);

        this.state = {
            alertMessage: RichTextContainer.validateProps(props),
            value: this.getValue(props.stringAttribute, props.mxObject)
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubscriptions = this.handleSubscriptions.bind(this);
    }

    render() {
        if (this.state.alertMessage) {
            return createElement(Alert, { message: this.state.alertMessage });
        }

        return createElement(RichText, {
            className: this.props.class,
            customOptions: this.props.customOptions,
            editorOption: this.props.editorOption,
            hasContext: !!this.props.mxObject,
            maxNumberOfLines: this.props.maxNumberOfLines,
            minNumberOfLines: this.props.minNumberOfLines,
            onChange: this.handleOnChange,
            readOnly: this.isReadOnly(),
            readOnlyStyle: this.props.readOnlyStyle,
            style: RichTextContainer.parseStyle(this.props.style),
            theme: this.props.theme,
            value: this.state.value
        });
    }

    componentWillReceiveProps(newProps: RichTextContainerProps) {
        this.resetSubscriptions(newProps.mxObject);
        this.setState({
            value: this.getValue(newProps.stringAttribute, newProps.mxObject)
        });
    }

    componentWillUnmount() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    }

    private getValue(attributeName: string, mxObject?: mendix.lib.MxObject): string {
        if (mxObject) {
            const value = mxObject.get(attributeName);

            return value ? value.toString() : "";
        }

        return "";
    }

    private isReadOnly(): boolean {
        const { stringAttribute, editable, mxObject, readOnly } = this.props;
        if (editable === "default" && mxObject) {
            return readOnly || mxObject.isReadonlyAttr(stringAttribute);
        }

        return true;
    }

    private resetSubscriptions(mxObject?: mendix.lib.MxObject) {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.subscriptionHandles = [];

        if (mxObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: this.handleSubscriptions,
                guid: mxObject.getGuid()
            }));

            this.subscriptionHandles.push(window.mx.data.subscribe({
                attr: this.props.stringAttribute,
                callback: this.handleSubscriptions,
                guid: mxObject.getGuid()
            }));
        }
    }

    private handleSubscriptions() {
        this.setState({
            value: this.getValue(this.props.stringAttribute, this.props.mxObject)
        });
    }

    private handleOnChange(data: string) {
        const { mxObject, onChangeMicroflow } = this.props;
        if (!mxObject || !mxObject.getGuid()) {
            return;
        }
        mxObject.set(this.props.stringAttribute, data);

        if ( onChangeMicroflow && mxObject.getGuid()) {
            window.mx.ui.action(onChangeMicroflow, {
                error: error =>
                    window.mx.ui.error(`Error while executing microflow: ${onChangeMicroflow}: ${error.message}`),
                origin: this.props.mxform,
                params: {
                    applyto: "selection",
                    guids: [ mxObject.getGuid() ]
                }
            });
        }
    }

    public static validateProps(props: RichTextContainerProps): string {
        if (props.minNumberOfLines !== 0 && props.minNumberOfLines > props.maxNumberOfLines) {
            return `The minimum number of lines should not be greater than the maximum`;
        }

        return "";
    }

    public static parseStyle(style = ""): {[key: string]: string} {
        try {
            return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            // tslint:disable-next-line no-console
            console.log("Failed to parse style", style, error);
        }

        return {};
    }
}

export { RichTextContainer as default, RichTextContainerProps };
