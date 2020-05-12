export function evalHtml(editorState) {
  const content = editorState.getCurrentContent();
  const env = { textBlock: 0 };
  const html = content
    .getBlockMap()
    .map((block) => {
      return evalContentBlock(block, env);
    })
    .join("");
  let close = "";
  if (env.outer) {
    close = `</${env.outer}>\n`;
    env.outer = null;
  }
  return `${html}\n${close}`;
}

function evalContentBlock(contentBlock, env) {
  const contentType = contentBlock.getType();
  if (contentType === "unordered-list-item") {
    return startOrAppend(evalText(contentBlock), "ul", env);
  } else if (contentType === "ordered-list-item") {
    return startOrAppend(evalText(contentBlock), "ol", env);
  }
  let close = "";
  if (env.outer) {
    close = `</${env.outer}>\n`;
    env.outer = null;
  }
  env.textBlock = env.textBlock = 1;
  return `${close}${evalText(contentBlock)}<br/>\n`;
}

function startOrAppend(text, tag, env) {
  if (!env.outer) {
    env.outer = tag;
    return `<${tag}>\n<li>${text}</li>\n`;
  }
  return `<li>${text}</li>\n`;
}

const STYLE_MAP = {
  BOLD: "b",
  ITALIC: "em",
  UNDERLINE: "ins",
};

function evalText(contentBlock) {
  const text = contentBlock.getText();
  const metaList = contentBlock.getCharacterList();
  let styles = [];
  const textArray = [];
  let i = 0;
  for (const meta of metaList) {
    const characterStyles = Array.from(meta.getStyle())
      .map((style) => STYLE_MAP[style])
      .filter((style) => style != null);
    const removed = styles.filter((style) => !characterStyles.includes(style));
    const added = characterStyles.filter((style) => !styles.includes(style));
    for (let j = removed.length - 1; j >= 0; j--) {
      textArray.push(`</${removed[j]}>`);
    }
    for (let j = 0; j < added.length; j++) {
      textArray.push(`<${added[j]}>`);
    }
    styles = characterStyles;
    textArray.push(text[i]);
    i++;
  }
  styles.forEach((style) => textArray.push(`</${style}>`));
  return textArray.join("");
}
