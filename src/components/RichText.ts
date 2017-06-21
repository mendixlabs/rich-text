import { Component, DOM, createElement } from "react";
import * as classNames from "classnames";

import * as QuillEditor from "react-quill";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

interface RichTextProps {
    className?: string;
    onChange?: (value: string) => void;
    readOnly: boolean;
    style?: object;
    value: string;
    theme: "bubble" | "snow";
}

interface RichTextState {
    text: string;
}

class RichText extends Component<RichTextProps, RichTextState> {
    constructor(props: RichTextProps) {
        super(props);

        this.state = { text: props.value };
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return DOM.div({ className: classNames("widget-rich-text", this.props.className), style: this.props.style },
            createElement(QuillEditor, {
                onChange: this.handleChange,
                readOnly: this.props.readOnly,
                theme: this.props.theme,
                value: this.state.text
            })
        );
    }

    componentWillReceiveProps(nextProps: RichTextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ text: nextProps.value });
        }
    }

    handleChange(text: string) {
        this.setState({ text });
        if (this.props.onChange) {
            this.props.onChange(text);
        }
    }
}

export { RichText, RichTextProps };
