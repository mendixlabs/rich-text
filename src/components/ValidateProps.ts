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
        return props.minNumberOfLines !== 0 && props.minNumberOfLines > props.maxNumberOfLines
            ? `The minimum number of lines ${props.minNumberOfLines} should not be greater than the maximum ${props.maxNumberOfLines}` // tslint:disable-line
            : "";
    }
}
