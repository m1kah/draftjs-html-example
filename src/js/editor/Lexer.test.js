import { convertFromHTML, ContentState, EditorState } from "draft-js";
import { TEXT, OL, UL, P } from "../Token";
import Lexer from "./Lexer";

test("Next token", () => {
  const input = `
    <p>
    Some text <b>with bold</b>, <i>italic</i> and <u>underline</u>.
    </p>
    <p>
    P tag is used between 2 text blocks.
    </p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
    </ul>
    Also br tag can be used<br/>
    - for example, for<br/>
    - text lists<br/>
  `;
  const blocks = convertFromHTML(input);
  const contentState = ContentState.createFromBlockArray(
    blocks.contentBlocks,
    blocks.entityMap
  );
  const editorState = EditorState.createWithContent(contentState);

  const tests = [
    { token: TEXT, text: "Some text with bold, italic and underline." },
    { token: P, text: "" },
    { token: TEXT, text: "P tag is used between 2 text blocks." },
    { token: P, text: "" },
    { token: UL },
    { token: UL },
    { token: TEXT, text: "Also br tag can be used\n" },
    { token: TEXT, text: "- for example, for\n" },
    { token: TEXT, text: "- text lists\n" },
  ];

  const lexer = new Lexer(input);
  tests.forEach= lexer.nextToken();
  });
});
