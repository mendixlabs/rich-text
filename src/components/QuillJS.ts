import { Component, createElement } from "react";

import * as ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

interface QuillJSProps {
    onChange: (value: string) => void;
    value: string;
    theme: "bubble" | "snow";
}

interface QuillJSState {
    text: string;
}

class QuillJS extends Component<QuillJSProps, QuillJSState> {
    constructor(props: QuillJSProps) {
        super(props);

        this.state = { text: props.value };
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return createElement(ReactQuill, {
            onChange: this.handleChange,
            theme: this.props.theme,
            value: this.state.text
        });
    }

    componentWillReceiveProps(nextProps: QuillJSProps) {
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

export { QuillJS };
