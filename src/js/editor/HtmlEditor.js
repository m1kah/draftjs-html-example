import React from "react";
import style from "styled-components";
import { Editor, EditorState, RichUtils } from "draft-js";
import { evalHtml } from "./HtmlEvaluator";

const Button = style.button`
  padding: 5px;
  border: 1px solid #ccc;
  color: #333;
  background-color: ${(props) => (props.active ? "#ddd" : "#ccc")};
  &:hover {
    background-color: #ddd;
  }
  width: 40px;
  line-height: 30px;
`;

const ButtonGroup = style.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 4px;
`;

const ButtonRow = style.div`
  display: flex;
  padding-bottom: 10px;
`;

const EditorContainer = style.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 15px 10px;
  min-height: 20px;
`;

const Component = style.div`
`;

const Output = style.pre`
  margin-top: 20px;
  margin-right: 10px;
  margin-left: 10px;
  border-top: 1px dashed #ddd;
  padding: 20px 0;
  font-family: monospace;
`;

class StyleButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onToggle(e) {
    e.preventDefault();
    this.props.onToggle(this.props.value);
  }

  render() {
    return (
      <Button active={this.props.active} onMouseDown={(e) => this.onToggle(e)}>
        {this.props.label}
      </Button>
    );
  }
}

const BLOCK_TYPES_OPTIONS = [
  { label: "UL", type: "unordered-list-item" },
  { label: "OL", type: "ordered-list-item" },
];

class BlockTypeButtons extends React.Component {
  render() {
    const selection = this.props.editorState.getSelection();
    const blockType = this.props.editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <ButtonGroup>
        {BLOCK_TYPES_OPTIONS.map((option) => (
          <StyleButton
            key={option.label}
            active={option.type === blockType}
            label={option.label}
            onToggle={this.props.onToggle}
            value={option.type}
          />
        ))}
      </ButtonGroup>
    );
  }
}

const INLINE_STYLE_OPTIONS = [
  { label: "B", style: "BOLD" },
  { label: "I", style: "ITALIC" },
  { label: "U", style: "UNDERLINE" },
];

class InlineStyleButtons extends React.Component {
  render() {
    const currentStyle = this.props.editorState.getCurrentInlineStyle();
    return (
      <ButtonGroup>
        {INLINE_STYLE_OPTIONS.map((option) => (
          <StyleButton
            key={option.label}
            active={currentStyle.has(option.style)}
            label={option.label}
            onToggle={this.props.onToggle}
            value={option.style}
          />
        ))}
      </ButtonGroup>
    );
  }
}

export default class HtmlEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  onChange(editorState) {
    this.setState({ editorState });
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  toggleInlineStyle(style) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style));
  }

  toggleBlockType(type) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, type));
  }

  render() {
    return (
      <Component>
        <ButtonRow>
          <InlineStyleButtons
            editorState={this.state.editorState}
            onToggle={(style) => this.toggleInlineStyle(style)}
          />
          <BlockTypeButtons
            editorState={this.state.editorState}
            onToggle={(type) => this.toggleBlockType(type)}
          />
        </ButtonRow>
        <EditorContainer>
          <Editor
            editorState={this.state.editorState}
            onChange={(editorState) => this.onChange(editorState)}
            handleKeyCommand={(command) => this.handleKeyCommand(command)}
          />
        </EditorContainer>
        <Output>{evalHtml(this.state.editorState)}</Output>
      </Component>
    );
  }
}
