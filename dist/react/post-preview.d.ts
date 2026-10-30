import type { ReactNode } from "react";
/**
 * A social post as it will look on its channel (Facebook, Instagram,
 * LinkedIn, Threads): who posts it with their avatar, when, the image on top with
 * the text under it, and the channel's reactions. The reactions are
 * decoration, hidden from screen readers.
 *
 * `children` is the post's text, or an editor for it. Without `avatar` the
 * avatar is the name's first letter. `imagePlaceholder` fills the image's
 * place until there is one (Instagram needs one).
 */
export declare function PostPreview({ platform, name, meta, avatar, image, imageAlt, imagePlaceholder, className, children, }: {
    platform: string;
    name: string;
    /** Under the name, e.g. "Just now · Facebook". */
    meta?: ReactNode;
    avatar?: string | null;
    image?: string | null;
    imageAlt?: string;
    imagePlaceholder?: ReactNode;
    className?: string;
    children?: ReactNode;
}): import("react").JSX.Element;
