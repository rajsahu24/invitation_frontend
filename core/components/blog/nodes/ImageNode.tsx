"use client";

import { 
  ElementNode, 
  EditorConfig, 
  LexicalEditor, 
  LexicalNode,
  SerializedElementNode
} from "lexical";

type SerializedImageNode = SerializedElementNode & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

// ImageNode with size control
export class ImageNode extends ElementNode {
  __src: string;
  __alt: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__width, node.__height, node.__key);
  }

  constructor(src: string = "", alt: string = "", width?: number, height?: number, key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
  }

  getSrc(): string {
    return this.__src;
  }

  getAlt(): string {
    return this.__alt;
  }

  getWidth(): number | undefined {
    return this.__width;
  }

  getHeight(): number | undefined {
    return this.__height;
  }

  setWidth(width: number | undefined): void {
    this.__width = width;
  }

  setHeight(height: number | undefined): void {
    this.__height = height;
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const div = document.createElement("div");
    div.className = "image-node-container my-6 flex justify-center";
    
    const img = document.createElement("img");
    img.src = this.__src;
    img.alt = this.__alt || "Blog image";
    img.className = "rounded-lg shadow-sm object-contain";
    
    // Set dimensions
    if (this.__width) {
      img.style.width = `${this.__width}px`;
      img.style.maxWidth = "100%";
    } else {
      img.style.maxWidth = "100%";
    }
    
    if (this.__height) {
      img.style.height = `${this.__height}px`;
    }
    
    img.style.height = "auto";
    
    div.appendChild(img);
    
    return div;
  }

  updateDOM(_prevNode: ImageNode, _dom: HTMLElement, _config: EditorConfig): boolean {
    return false;
  }

  static importJSON(serialized: SerializedImageNode): ImageNode {
    return new ImageNode(serialized.src, serialized.alt, serialized.width, serialized.height);
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
    };
  }
}

export function $createImageNode(src: string, alt: string = ""): ImageNode {
  return new ImageNode(src, alt);
}

export function $isImageNode(node: LexicalNode | null | undefined): boolean {
  return node instanceof ImageNode;
}
