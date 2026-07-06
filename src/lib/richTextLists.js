import { BulletList, OrderedList } from "@tiptap/extension-list";

function listClassAttribute() {
  return {
    class: {
      default: null,
      parseHTML: (element) => element.getAttribute("class"),
      renderHTML: (attributes) => (attributes.class ? { class: attributes.class } : {}),
    },
  };
}

export const StyledBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...listClassAttribute(),
    };
  },
});

export const StyledOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...listClassAttribute(),
    };
  },
});

export const BULLET_STYLE_OPTIONS = [
  { label: "Disc •", value: "list-bullet-disc" },
  { label: "Circle ○", value: "list-bullet-circle" },
  { label: "Square ■", value: "list-bullet-square" },
  { label: "Dash –", value: "list-bullet-dash" },
  { label: "Star ★", value: "list-bullet-star" },
];

export const ORDERED_STYLE_OPTIONS = [
  { label: "1, 2, 3", value: "list-ol-decimal" },
  { label: "a, b, c", value: "list-ol-lower-alpha" },
  { label: "A, B, C", value: "list-ol-upper-alpha" },
  { label: "i, ii, iii", value: "list-ol-lower-roman" },
  { label: "I, II, III", value: "list-ol-upper-roman" },
];

export function getDefaultBulletStyle() {
  return BULLET_STYLE_OPTIONS[0].value;
}

export function getDefaultOrderedStyle() {
  return ORDERED_STYLE_OPTIONS[0].value;
}
