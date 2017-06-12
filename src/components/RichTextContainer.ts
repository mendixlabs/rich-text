import { Component, createElement } from "react";

import { RichText } from "./RichText";

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
    onChangeMicroflow: string;
}

interface RichTextState {
    value: string;
}

class RichTextContainer extends Component<RichTextContainerProps, RichTextState> {
    private subscriptionHandles: number[] = [];

    constructor(props: RichTextContainerProps) {
        super(props);

        this.state = {
            value: this.getValue(props.stringAttribute, props.mxObject)
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubscriptions = this.handleSubscriptions.bind(this);
    }

    render() {
        return createElement(RichText, {
            className: this.props.class,
            onChange: this.handleOnChange,
            readOnly: this.isReadOnly(),
            style: RichTextContainer.parseStyle(this.props.style),
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

    private isReadOnly() {
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

        const context = new window.mendix.lib.MxContext();
        context.setContext(mxObject.getEntity(), mxObject.getGuid());
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
