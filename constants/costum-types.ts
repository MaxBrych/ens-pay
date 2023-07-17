import { BaseEditor, Text } from "slate";
import { ReactEditor } from "slate-react";

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type HeadingOneElement = {
  type: "heading-one";
  children: CustomText[];
};

export type HeadingTwoElement = {
  type: "heading-two";
  children: CustomText[];
};

export interface HeadingThreeElement {
  type: "heading-three";
  children: CustomText[];
}

export type BlockQuoteElement = {
  type: "block-quote";
  children: CustomText[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: CustomText[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: CustomText[];
};

export type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

export type FormattedText = {
  underline?: boolean;
  italic?: boolean;
  text: string;
  bold?: boolean;
};
export interface LinkElement {
  type: "link";
  href: string;
  children: CustomText[];
}

export interface ImageElement {
  type: "image";
  url: string;
  children: CustomText[];
}

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement
  | ImageElement;

export type CustomEditor = BaseEditor & ReactEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
