"use client";

import { useCallback, useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode, $createLinkNode } from "@lexical/link";
import { $getRoot, $createTextNode, $createParagraphNode } from "lexical";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, EditorState } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { mergeRegister } from "@lexical/utils";
import { 
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, Quote, Code, 
  Link, Image as ImageIcon, Undo, Redo,
  Heading1, Heading2, Heading3
} from "lucide-react";

// Custom Image Node
import { ImageNode, $createImageNode } from "./nodes/ImageNode";

// Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
          }
        });
      }),
      // Register undo/redo state
      editor.registerCommand(
        UNDO_COMMAND,
        () => {
          setCanUndo(true);
          return false;
        },
        1
      ),
      editor.registerCommand(
        REDO_COMMAND,
        () => {
          setCanRedo(true);
          return false;
        },
        1
      )
    );
  }, [editor]);

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (tag: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => {
          const node = new CodeNode("javascript");
          return node;
        });
      }
    });
  };

  const insertLink = useCallback(() => {
    if (linkUrl === "") return;
    
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Check if there's selected text
        const anchor = selection.anchor;
        const focus = selection.focus;
        
        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          // No selection - insert link with placeholder text
          const linkNode = $createLinkNode(linkUrl);
          const textNode = $createTextNode('link text');
          linkNode.append(textNode);
          selection.insertNodes([linkNode]);
        } else {
          // Has selection - use Lexical's link format
          // First, get the selected text and create a link around it
          const selectedText = selection.getTextContent();
          if (selectedText) {
            // Delete the selected text first
            selection.deleteCharacter(false);
            
            // Then insert link with the text
            const linkNode = $createLinkNode(linkUrl);
            const textNode = $createTextNode(selectedText);
            linkNode.append(textNode);
            selection.insertNodes([linkNode]);
          }
        }
      }
    });
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-2">
      <div className="flex flex-wrap items-center gap-1 max-w-4xl mx-auto">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} disabled={!canUndo}>
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} disabled={!canRedo}>
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text Formatting */}
        <ToolbarButton 
          onClick={() => formatText("bold")} 
          active={isBold}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => formatText("italic")} 
          active={isItalic}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => formatText("underline")} 
          active={isUnderline}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => formatText("strikethrough")} 
          active={isStrikethrough}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton onClick={() => formatHeading("h1")} title="Heading 1">
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatHeading("h2")} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatHeading("h3")} title="Heading 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists & Blocks */}
        <ToolbarButton onClick={formatBulletList} title="Bullet List">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={formatNumberedList} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={formatQuote} title="Quote">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={formatCode} title="Code Block">
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} title="Insert Link">
            <Link className="w-4 h-4" />
          </ToolbarButton>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg flex gap-2">
              <input
                type="url"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && insertLink()}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={insertLink}
                className="px-2 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <ImageUploadButton editor={editor} />
      </div>
    </div>
  );
}

// Toolbar Button Component
function ToolbarButton({ 
  onClick, 
  active = false, 
  disabled = false, 
  children,
  title 
}: { 
  onClick: () => void; 
  active?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${active 
          ? "bg-purple-100 text-purple-700" 
          : "hover:bg-gray-100 text-gray-600"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />;
}

// Image Upload Button with Drag & Drop and Size Control
function ImageUploadButton({ editor }: { editor: any }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | undefined>(undefined);

  const handleImageUpload = useCallback((file: File, size?: number) => {
    if (!file || !file.type.startsWith("image/")) return;
    
    setUploading(true);
    
    // Read file as base64 for preview
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const fileName = file.name;
      
      // Insert image node with size
      editor.update(() => {
        const root = $getRoot();
        const imageNode = new ImageNode(base64, fileName, size);
        
        const firstChild = root.getFirstChild();
        
        if (firstChild) {
          firstChild.insertAfter(imageNode);
        } else {
          root.append(imageNode);
        }
      }, {
        onError: (error: Error) => {
          console.error('Error inserting image:', error);
          setUploading(false);
        }
      });
      setUploading(false);
      setShowSizeOptions(false);
      setSelectedSize(undefined);
    };
    reader.onerror = () => {
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }, [editor]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file, selectedSize);
  }, [handleImageUpload, selectedSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file, selectedSize);
  }, [handleImageUpload, selectedSize]);

  const sizes = [
    { label: 'Full', value: undefined, icon: '↔' },
    { label: 'Large', value: 800, icon: 'L' },
    { label: 'Medium', value: 600, icon: 'M' },
    { label: 'Small', value: 400, icon: 'S' },
  ];

  return (
    <div 
      className={`relative ${isDragging ? "ring-2 ring-purple-500 ring-offset-2 rounded" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex items-center gap-1">
        <label className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer transition-all duration-200 inline-flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </label>

        {/* Size Options */}
        <div className="relative">
          <button
            onClick={() => setShowSizeOptions(!showSizeOptions)}
            className={`p-2 rounded-lg transition-all duration-200 ${selectedSize ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Image Size"
          >
            <span className="text-xs font-bold">{selectedSize ? `${selectedSize}px` : 'Full'}</span>
          </button>
          {showSizeOptions && (
            <div className="absolute top-full left-0 mt-1 p-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => {
                    setSelectedSize(size.value);
                    setShowSizeOptions(false);
                  }}
                  className={`block w-full px-3 py-1 text-left text-sm rounded hover:bg-gray-100 ${selectedSize === size.value ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                >
                  {size.icon} {size.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-50/90 rounded-lg -left-2 -right-2">
          <span className="text-sm text-purple-600 font-medium">Drop image here</span>
        </div>
      )}
    </div>
  );
}

// Auto-save Plugin
function AutoSavePlugin({ onSave }: { onSave: (json: any) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      // Debounced save
      const timeoutId = setTimeout(() => {
        const json = editorState.toJSON();
        onSave(json);
      }, 1000);
      return () => clearTimeout(timeoutId);
    });
  }, [editor, onSave]);

  return null;
}

// Editor Config
const editorConfig = {
  namespace: "MediumEditor",
  theme: {
    paragraph: "mb-4 text-lg leading-relaxed text-gray-800",
    heading: {
      h1: "text-4xl font-bold mb-6 mt-8 text-gray-900",
      h2: "text-3xl font-bold mb-4 mt-6 text-gray-900",
      h3: "text-2xl font-semibold mb-3 mt-5 text-gray-900",
    },
    quote: "border-l-4 border-purple-500 pl-4 my-4 italic text-gray-600 text-lg",
    code: "bg-gray-100 rounded px-2 py-1 font-mono text-sm",
    list: {
      ul: "list-disc ml-6 mb-4",
      ol: "list-decimal ml-6 mb-4",
      listitem: "mb-1",
    },
    link: "text-purple-600 underline hover:text-purple-800",
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
      strikethrough: "line-through",
    },
  },
  onError(error: Error) {
    console.error("Editor error:", error);
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
    LinkNode,
    AutoLinkNode,
    ImageNode,
  ],
};

// Main Editor Component
export default function Editor() {
  const [content, setContent] = useState<any>(null);

  const handleChange = useCallback((editorState: EditorState) => {
    const json = editorState.toJSON();
    console.log("Editor content:", json);
  }, []);

  const handleSave = useCallback((json: any) => {
    setContent(json);
    // You can implement auto-save to localStorage or API here
    localStorage.setItem("blog-draft", JSON.stringify(json));
  }, []);

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem("blog-draft");
    if (saved) {
      console.log("Loaded saved draft");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <LexicalComposer initialConfig={editorConfig}>
        <div className="max-w-3xl mx-auto">
          <ToolbarPlugin />
          
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="
                  min-h-[calc(100vh-200px)] 
                  px-8 py-6 
                  focus:outline-none 
                  text-lg
               " 
              />
            }
            placeholder={
              <div className="absolute top-20 left-8 text-gray-400 text-lg pointer-events-none">
                <p className="mb-2 text-3xl font-serif text-gray-300">Tell your story...</p>
                <p className="text-gray-300">Title</p>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
          <AutoSavePlugin onSave={handleSave} />
        </div>
      </LexicalComposer>
    </div>
  );
}
