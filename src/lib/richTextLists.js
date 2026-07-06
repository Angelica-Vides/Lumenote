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
  { value: "list-bullet-disc", icon: "•", title: "Disc bullets" },
  { value: "list-bullet-circle", icon: "○", title: "Circle bullets" },
  { value: "list-bullet-square", icon: "■", title: "Square bullets" },
  { value: "list-bullet-dash", icon: "–", title: "Dash bullets" },
  { value: "list-bullet-star", icon: "★", title: "Star bullets" },
];

export const ORDERED_STYLE_OPTIONS = [
  { value: "list-ol-decimal", icon: "1", title: "Numbered list" },
  { value: "list-ol-lower-alpha", icon: "a", title: "Lowercase letter list" },
  { value: "list-ol-upper-alpha", icon: "A", title: "Uppercase letter list" },
  { value: "list-ol-lower-roman", icon: "i", title: "Lowercase roman list" },
  { value: "list-ol-upper-roman", icon: "I", title: "Uppercase roman list" },
];

export function getDefaultBulletStyle() {
  return BULLET_STYLE_OPTIONS[0].value;
}

export function getDefaultOrderedStyle() {
  return ORDERED_STYLE_OPTIONS[0].value;
}
