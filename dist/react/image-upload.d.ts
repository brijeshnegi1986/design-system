import { type ReactNode } from "react";
/** Where an upload is, as the page that owns it knows it. The component
 * itself only adds the drag-over look and its own checks on the file. */
export type ImageUploadState = {
    status: "idle";
} | {
    status: "uploading";
    fileName: string;
    fileSize?: number;
    progress: number;
    onCancel?: () => void;
} | {
    status: "uploaded";
    fileName?: string;
    fileSize?: number;
    previewUrl: string;
    previewAlt?: string;
} | {
    status: "error";
    title: string;
    message: ReactNode;
};
/** "2.4 MB", "640 KB". */
export declare function formatFileSize(bytes: number): string;
/**
 * The NDS Image upload (Figma "Image upload", 900:161): one image for a post,
 * by dragging a file onto it or clicking to browse.
 *
 * - Default: a dashed area, "Drag an image here, or browse", and the file
 *   rules. The whole area is the click target (a label for a hidden file
 *   input), so it works from the keyboard too.
 * - Drag over: a 2px primary edge while a file is held over it.
 * - Uploading / Uploaded / Error: driven by `state` from the owner, which does
 *   the upload when `onFile` hands it a file.
 * - Disabled: greyed out, with the reason.
 *
 * Before calling onFile the component checks the type against `accept` and
 * the size against `maxBytes`, and shows its own error if either fails.
 */
export declare function ImageUpload({ state, onFile, onRemove, accept, typesLabel, maxBytes, disabled, disabledTitle, disabledMessage, inputLabel, className, }: {
    state: ImageUploadState;
    onFile: (file: File) => void;
    onRemove?: () => void;
    accept?: string;
    /** How the accepted types read in the rules line. */
    typesLabel?: string;
    maxBytes?: number;
    disabled?: boolean;
    disabledTitle?: string;
    disabledMessage?: ReactNode;
    /** The file input's accessible name. */
    inputLabel?: string;
    className?: string;
}): import("react").JSX.Element;
