import React, {
  ChangeEvent,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Popover,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  ButtonGroup,
  Tooltip,
  PopoverHeader,
  PopoverTrigger,
  IconButton,
  PopoverArrow,
  Flex,
} from "@chakra-ui/react";
import { withReact, Slate, Editable, ReactEditor, useSlate } from "slate-react";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Element,
  Transforms,
  Editor,
  Text,
  Node,
  NodeEntry,
} from "slate";
import { RenderLeafProps } from "slate-react";
import styled from "styled-components";

import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import { CustomElement } from "../../constants/costum-types"; // Import your custom types here
import {
  BiBold,
  BiItalic,
  BiUnderline,
  BiHeading,
  BiListUl,
} from "react-icons/bi";
import { FaQuoteLeft } from "react-icons/fa";
import { RiListOrdered } from "react-icons/ri";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  propose: (transactionId: string) => Promise<void>;
}
type ToolbarButton = (typeof toolbarButtons)[number];

const toolbarButtons = [
  { format: "bold", label: "Bold", icon: BiBold },
  { format: "italic", label: "Italic", icon: BiItalic },
  { format: "underline", label: "Underline", icon: BiUnderline },
  { format: "heading-two", label: "H2", icon: BiHeading },
  { format: "heading-three", label: "H3", icon: BiHeading },
  { format: "blockquote", label: "Quote", icon: FaQuoteLeft },
  { format: "numbered-list", label: "Numbered List", icon: RiListOrdered },
  { format: "bulleted-list", label: "Bulleted List", icon: BiListUl },
] as const;

// usage
const text = { text: "This is some text" };
const paragraph = { type: "paragraph", children: [text] };
const editor = createEditor();

const match: NodeEntry<CustomElement>[] = Array.from(
  Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === "paragraph",
  })
);

match.forEach(([node, path]) => {
  if ("type" in node && node.type === "paragraph") {
    console.log(node.children);
  }
});

const StyledH2 = styled.h2`
  font-size: 30pt;
`;

const StyledH3 = styled.h3`
  font-size: 24pt;
`;

const toggleFormat = (editor: Editor, format: any) => {
  const isBlock = [
    "heading-two",
    "heading-three",
    "blockquote",
    "bulleted-list",
    "numbered-list",
  ].includes(format);

  if (isBlock) {
    const isActive = isBlockActive(editor, format);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : format },
      { match: (n: any) => Editor.isBlock(editor, n) }
    );
  } else {
    const isActive = isFormatActive(editor, format);
    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: (n: any) => Text.isText(n), split: true }
    );
  }
};
const isBlockActive = (editor: Editor, format: string) => {
  const match: any = Array.from(
    Editor.nodes(editor, {
      match: (n: any) => Element.isElement(n) && n.type === "paragraph",
    })
  );
  return !!match;
};

const Toolbar = () => {
  const editor = useSlate();

  return (
    <Flex>
      <ButtonGroup>
        {toolbarButtons.map((button) => (
          <Tooltip label={button.label} key={button.format}>
            <IconButton
              onMouseDown={(event) => {
                event.preventDefault();
                toggleFormat(editor, button.format);
              }}
              icon={<button.icon />}
              aria-label={""}
            />
          </Tooltip>
        ))}
      </ButtonGroup>
    </Flex>
  );
};

const isFormatActive = (editor: Editor, format: string) => {
  match.forEach(([node, path]: any) => {
    if ("type" in node && node.type === "paragraph") {
      console.log(node.children);
    }
  });
  return !!match;
};

export default function CreateProposalArticle() {
  const address = useAddress();
  const [category, setCategory] = useState("");
  const [headline, setHeadline] = useState("");
  const [teaser, setTeaser] = useState("");
  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");
  const editor = useMemo(() => withReact(createEditor()), []); // initialize the Slate editor
  const [bodyValue, setBodyValue] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  const { contract: voteContract, isLoading: isVoteLoading } = useContract<any>(
    process.env.NEXT_PUBLIC_VOTE_ADDRESS
  );

  const vote = voteContract as unknown as MySmartContract;

  const uploadBoth = async () => {
    if (!file || !category || !headline || !teaser) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("headline", headline);
    formData.append("teaser", teaser);
    formData.append("body", JSON.stringify(bodyValue));

    try {
      const response = await fetch("/api/uploadBoth", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
      if (vote) {
        await vote.propose(json.txId);
        window.location.reload();
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "heading-two":
        return <StyledH2 {...props.attributes}>{props.children}</StyledH2>;
      case "heading-three":
        return <StyledH3 {...props.attributes}>{props.children}</StyledH3>;
      case "blockquote":
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
      case "link":
        return (
          <a {...props.attributes} href={props.element.href}>
            {props.children}
          </a>
        );
      case "image":
        return <img {...props.attributes} src={props.element.url} />;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  return (
    <Box borderWidth="1px" borderRadius="lg" padding="6" marginTop="4">
      {address && (
        <>
          <FormControl marginTop="4">
            <FormLabel>Category</FormLabel>
            <Input
              placeholder="Enter category"
              onChange={(e) => setCategory(e.target.value)}
              bg="gray.700"
              textColor="white"
              borderRadius="xl"
            />
          </FormControl>
          <FormControl marginTop="4">
            <FormLabel>Headline</FormLabel>
            <Input
              placeholder="Enter headline"
              onChange={(e) => setHeadline(e.target.value)}
              bg="gray.700"
              textColor="white"
              borderRadius="xl"
            />
          </FormControl>
          <FormControl marginTop="4">
            <FormLabel>Teaser</FormLabel>
            <Input
              placeholder="Enter teaser"
              onChange={(e) => setTeaser(e.target.value)}
              bg="gray.700"
              textColor="white"
              borderRadius="xl"
            />
          </FormControl>
          <FormControl marginTop="4">
            <FormLabel>Arweave File</FormLabel>
            <Input
              type="file"
              placeholder="Upload a file"
              onChange={handleFileChange}
              cursor="pointer"
              border="2px dashed"
              height={24}
              borderColor="gray.700"
              borderRadius="xl"
            />
          </FormControl>
          <FormControl marginTop="4">
            <Slate
              editor={editor}
              initialValue={bodyValue}
              onChange={(value) => setBodyValue(value)}
            >
              <Toolbar />
              <Editable
                renderElement={renderElement}
                renderLeaf={Leaf}
                placeholder="Enter some text..."
              />
            </Slate>
          </FormControl>

          <Button
            colorScheme="blue"
            marginTop="4"
            disabled={isVoteLoading}
            isLoading={isVoteLoading}
            onClick={uploadBoth}
          >
            Create Proposal and Article
          </Button>
        </>
      )}
    </Box>
  );
}
const Leaf = (props: RenderLeafProps) => {
  let { children } = props;
  if (props.leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (props.leaf.italic) {
    children = <em>{children}</em>;
  }
  if (props.leaf.underline) {
    children = <u>{children}</u>;
  }
  if (props.leaf.code) {
    children = <code>{children}</code>;
  }

  return <span {...props.attributes}>{children}</span>;
};
