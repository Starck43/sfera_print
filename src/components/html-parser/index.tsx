import React from 'react'
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
import { VideoPlayer } from '@/shared/ui/video-player'

type ExtendedDOMNode = DOMNode & {
    parent?: DOMNode
    children: DOMNode[]
    firstChild?: { name: string; tagName: string }
    lastChild?: { name: string; tagName: string }
}

export const htmlParser = (html: string | null): React.ReactNode | null => {
    if (!html) return null

    const linkImgRegex =
        /<a[^>]*?href=["']?((?:.)*.(mp4|ogg|webm|avi|mov))[^>]*><img [^>]*?src=["']?((?:.)*.\.\w+)(?:[^>]*?width=["']?(\d+)["'])?(?:[^>]*?height=["']?(\d+)["'])?(?:[^>]*?alt=["']?([^>]+)["'])?[^>]*?><\/a>/gi
    const videoContentReplacement = (
        match: string,
        linkSrc: string,
        ext: string,
        imageSrc: string,
        width: number,
        height: number,
        alt: string
    ) =>
        `<video poster="${imageSrc}" src="${linkSrc}" width="${width || 1}" height="${
            height || 1
        }" title="${alt || ''}" />`

    const content = html
        //.replace(/<(\/?)(tbody)([^>]*)>/g, '')
        //.replace(/<\/?table>/g, '')
        .replace(/<[^/>][^>]?>(?:[\s+|&nbsp;]+)?<\/[^>]+>/g, '')
        .replace(linkImgRegex, videoContentReplacement)
        .replace(/\n+\s*/g, '\n')
        .trim()

    if (!content) return null

    const options: HTMLReactParserOptions = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        replace: (domNode: ExtendedDOMNode) => {
            if (
                domNode instanceof Element &&
                domNode.tagName === 'pre' &&
                (domNode.firstChild as Element).attribs.class === 'language-html'
            ) {
                const textElement = (domNode.firstChild as Element).firstChild as Text
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
                (domNode.firstChild?.tagName === 'video' || domNode.lastChild?.tagName === 'video')
            ) {
                const elem = domNode.firstChild as Element
                const orientation =
                    parseInt(elem.attribs?.width) >= parseInt(elem.attribs?.height)
                        ? ' landscape'
                        : ' portrait'

                return <td className={'video-wrapper' + orientation}>{domToReact(domNode.children, options)}</td>
            } else if (
                domNode instanceof Element &&
                domNode.tagName === 'td' &&
                domNode.firstChild.tagName === 'figure' &&
                ((domNode.firstChild as Element).firstChild as Element).tagName === 'video'
            ) {
                const elem = (domNode.firstChild as Element).firstChild as Element
                const orientation =
                    parseInt(elem.attribs?.width) >= parseInt(elem.attribs?.height)
                        ? ' landscape'
                        : ' portrait'
                return (
                    <td className={'video-wrapper' + orientation}>
                        {domToReact((domNode.firstChild as ExtendedDOMNode).children, options)}
                    </td>
                )
            }

            if (domNode instanceof Element && domNode.tagName === 'img') {
                if (!domNode.attribs?.src) return null

                const host = process.env.NEXT_PUBLIC_API_SERVER || 'localhost:8000'
                const src = buildAbsoluteUrl(host, domNode.attribs.src)
                const img = (
                    <LazyImage
                        src={src}
                        alt={domNode.attribs.alt}
                        sizes="(min-width:992px) 50vw, 100vw"
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
                    <VideoPlayer
                        src={src}
                        poster={poster}
                        //preload={'auto'}
                        width={parseInt(domNode.attribs.width)}
                        height={parseInt(domNode.attribs.height)}
                        alt={domNode.attribs.title}
                        className="video-player"
                    />
                )
            }
        }
    }
    return parse(content, options) || null
}
