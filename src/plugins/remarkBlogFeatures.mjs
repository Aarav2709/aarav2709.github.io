const calloutLabels = {
  danger: "Important",
  info: "Note",
  note: "Note",
  tip: "Tip",
  warning: "Warning",
};

function titleParagraph(className, children) {
  return {
    type: "paragraph",
    data: {
      hName: "p",
      hProperties: { className: [className] },
    },
    children,
  };
}

// Removes and returns a directive's [label].
function takeLabel(node) {
  const first = node.children[0];

  if (first?.data?.directiveLabel) {
    node.children.shift();
    return first.children;
  }

  return null;
}

function visit(node) {
  if (node.type === "code") {
    const meta = node.meta ?? "";

    if (!/\bshowLineNumbers(?:\{\d+\})?\b/.test(meta)) {
      node.meta = `${meta} showLineNumbers`.trim();
    }
  }

  if (node.type === "textDirective" && node.name === "kbd") {
    node.data = { ...node.data, hName: "kbd" };
  }

  if (node.type === "containerDirective" && node.name in calloutLabels) {
    const kind = node.name;
    const label = takeLabel(node) ?? [{ type: "text", value: calloutLabels[kind] }];

    node.data = {
      ...node.data,
      hName: "aside",
      hProperties: {
        className: ["blogCallout", `blogCallout-${kind}`],
      },
    };

    node.children.unshift(titleParagraph("blogCalloutTitle", label));
  }

  if (node.type === "containerDirective" && node.name === "margin") {
    const label = takeLabel(node) ?? [{ type: "text", value: "Side note" }];

    node.data = {
      ...node.data,
      hName: "aside",
      hProperties: { className: ["blogMarginNote"] },
    };

    node.children.unshift(titleParagraph("blogMarginNoteTitle", label));
  }

  if (node.type === "containerDirective" && node.name === "timeline") {
    node.data = {
      ...node.data,
      hName: "div",
      hProperties: { className: ["blogTimeline"] },
    };
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(visit);
  }
}

export default function remarkBlogFeatures() {
  return (tree) => {
    visit(tree);
  };
}
