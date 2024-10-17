import React from 'react'
import Player from 'next-video/player'
import parse, {
    Element,
    Text,
    domToReact,
    htmlToDOM,
    type DOMNode,
    type HTMLReactParserOptions
} from 'html-react-parser'

import { buildAbsoluteUrl } from '@/shared/lib/helpers/url'
import { LazyImage } from '@/shared/ui/lazy-image'

type ExtendedDOMNode = DOMNode & {
    parent?: DOMNode
    children: DOMNode[]
    firstChild?: { name: string; tagName: string }
    lastChild?: { name: string; tagName: string }
}

export const parseHtml = (html: string | null): React.ReactNode | null => {
    if (!html) return null

    const linkImgRegex =
        /<a[^>]*?href=(["'])?((?:.(?!\1|>))*.(mp4|ogg|webm|avi|mov))[^>]*><img [^>]*?src=(["'])?((?:.(?!\1|>))*.)/gi
    const videoContentReplacement = (
        match: string,
        quote: string,
        linkSrc: string,
        ext: string,
        quote2: string,
        imageSrc: string
    ) => `<video poster="${imageSrc}" src="${linkSrc}" />`

    const content = html
        //.replace(/<(\/?)(tbody)([^>]*)>/g, '')
        //.replace(/<\/?table>/g, '')
        .replace(/<[^/>][^>]?>(?:[\s+|&nbsp;]+)?<\/[^>]+>/g, '')
        .replace(linkImgRegex, videoContentReplacement)
        .replace(/\n+\s*/g, '\n')
        .trim()

    const options: HTMLReactParserOptions = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        replace: (domNode: ExtendedDOMNode) => {
            if (domNode instanceof Element && domNode.tagName === 'pre' && (domNode.firstChild as Element).attribs.class === 'language-html') {
                console.log((domNode.firstChild as Element).firstChild)
                const textElement = ((domNode.firstChild as Element).firstChild as Text)
                return <>{domToReact(htmlToDOM(textElement.data))}</>
            }
            if (
                domNode instanceof Element &&
                domNode.tagName === 'td' &&
                domNode.children?.length > 1 &&
                (domNode.firstChild?.tagName === 'figure' || domNode.firstChild?.name === 'img')
            ) {
                return <td className="media-grid">{domToReact(domNode.children, options)}</td>
            } else if (
                domNode instanceof Element &&
                domNode.tagName === 'td' &&
                (domNode.firstChild?.name === 'video' || domNode.lastChild?.name === 'video')
            ) {
                return <td className="video-wrapper">{domToReact(domNode.children, options)}</td>
            } else if (domNode instanceof Element && domNode.tagName === 'img') {
                if (!domNode.attribs?.src) return null

                const host = process.env.NEXT_PUBLIC_API_SERVER || 'localhost:8000'
                const src = buildAbsoluteUrl(host, domNode.attribs.src)
                const img = (
                    <LazyImage
                        src={src}
                        alt={domNode.attribs.alt || ''}
                        sizes="50vw"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                )

                if (domNode.parent?.tagName === 'figure') return img
                return <div className="image">{img}</div>
            } else if (domNode instanceof Element && domNode.tagName === 'video') {
                if (!domNode.attribs?.src || !domNode.attribs?.poster) return null

                const host = process.env.NEXT_PUBLIC_API_SERVER || 'localhost:8000'
                const src = buildAbsoluteUrl(host, domNode.attribs.src)
                const poster = buildAbsoluteUrl(host, domNode.attribs.poster)

                return (
                    <Player
                        src={src}
                        poster={poster}
                        muted
                        style={{
                            width: '100%',
                            height: 'auto'
                        }}
                        blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    >
                        <style>{`
                            :root {--media-range-track-height: 2px; --media-primary-color: var(--white-color);--media-accent-color: var(--secondary-color);}
                            ::part(center) {--media-control-background: rgba(0,0,0, 0.5) !important;padding: 0.8rem; border-radius: 50%; width: var(--controls-width); height: var(--controls-width);}
                            ::part(play) {--media-button-icon-transform: 0; --media-icon-color: var(--secondary-color) !important; transition: all 150ms ease-out !important;} 
                            ::part(play):hover {--media-icon-color: inherit !important; background-color: var(--secondary-color) !important;} 
                            ::part(seek-backward), ::part(seek-forward) {display: none;}
                            [slot=poster] {object-fit: cover;opacity: 1;}
						`}</style>
                    </Player>
                )
            }
        }
    }

    return parse(content, options)
}
