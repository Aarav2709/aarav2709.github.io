const element = (tagName, properties = {}, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});

const isElement = (node, tagName) => node?.type === "element" && (!tagName || node.tagName === tagName);

function getText(node) {
  if (node.type === "text") {
    return node.value;
  }

  return Array.isArray(node.children) ? node.children.map(getText).join("") : "";
}

function addClass(node, className) {
  const current = node.properties?.className ?? [];
  const classes = Array.isArray(current) ? current : [current];

  node.properties = { ...node.properties, className: [...classes, className] };
}

// Mirrors github-slugger so ids match Astro's headings.
function createSlugger() {
  const seen = new Map();

  return (text) => {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "")
      .replace(/ /g, "-");
    const count = seen.get(base) ?? 0;

    seen.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  };
}

function enhanceHeading(node, slug) {
  const id = node.properties?.id ?? slug(getText(node));

  node.properties = { ...node.properties, id };
  node.children.push(
    element("a", { className: ["headingAnchor"], href: `#${id}`, ariaLabel: "Link to this section" }),
  );
}

function enhanceDiff(pre) {
  const code = pre.children?.find((child) => isElement(child, "code"));

  if (code?.properties?.["data-language"] !== "diff") {
    return;
  }

  for (const line of code.children ?? []) {
    if (!isElement(line) || !("data-line" in (line.properties ?? {}))) {
      continue;
    }

    const text = getText(line).trimStart();

    if (text.startsWith("+") && !text.startsWith("+++")) {
      addClass(line, "blogDiffAddition");
    }

    if (text.startsWith("-") && !text.startsWith("---")) {
      addClass(line, "blogDiffDeletion");
    }
  }
}

function toFigure(image) {
  const caption = image.properties?.title;
  const zoom = element(
    "button",
    { type: "button", className: ["blogZoom"], ariaLabel: "View image full size" },
    [image],
  );

  return element(
    "figure",
    { className: ["blogFigure"] },
    typeof caption === "string" && caption
      ? [zoom, element("figcaption", {}, [{ type: "text", value: caption }])]
      : [zoom],
  );
}

function enhanceChildren(node, slug) {
  if (!Array.isArray(node.children)) {
    return;
  }

  node.children = node.children.map((child) => {
    enhanceChildren(child, slug);

    if (!isElement(child)) {
      return child;
    }

    if (/^h[2-4]$/.test(child.tagName)) {
      enhanceHeading(child, slug);
    }

    if (child.tagName === "pre") {
      enhanceDiff(child);
    }

    if ("data-rehype-pretty-code-figure" in (child.properties ?? {})) {
      child.children.push(
        element("button", { type: "button", className: ["codeCopy"], dataCodeCopy: "" }, [
          { type: "text", value: "Copy" },
        ]),
      );
    }

    const onlyChild = child.children?.length === 1 ? child.children[0] : null;

    if (child.tagName === "p" && isElement(onlyChild, "img")) {
      return toFigure(onlyChild);
    }

    return child;
  });
}

export default function rehypeBlogFeatures() {
  return (tree) => {
    enhanceChildren(tree, createSlugger());
  };
}
