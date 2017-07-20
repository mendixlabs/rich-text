import { Component, ReactElement, createElement } from "react";
import { RichTextContainerProps } from "./RichTextContainer";
import { Alert } from "./Alert";

export class ValidateConfigs extends Component<RichTextContainerProps, {}> {
    render() {
        const message = ValidateConfigs.validate(this.props);

        return message
            ? createElement(Alert, { message })
            : this.props.children as ReactElement<RichTextContainerProps>;
    }

    private static validate(props: RichTextContainerProps): string {
        if (props.minNumberOfLines < 0) {
            return `The minimum number of lines must not be less than 0`;
        } else if (props.maxNumberOfLines < 0) {
            return `The maximum number of lines must not be less than 0`;
        } else if (props.minNumberOfLines !== 0 && props.minNumberOfLines > props.maxNumberOfLines) {
            return `The minimum number of lines ${props.minNumberOfLines} should not be greater than the maximum ${props.maxNumberOfLines}`; // tslint:disable-line
        }

        return "";
    }
}
