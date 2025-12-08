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
        /(?:<figure [^>]*>\s*)?<a[^>]*?href=["']((?:[^"']*(?!\.\w+))(?:\.(?!\w+))?)["']>\s*<img[^>]*src=["']((?:\S+))['"](?:[^>]*?width=["']?(\d+)["'])?(?:[^>]*?height=["']?(\d+)["'])?(?:[^>]*?alt=["']([^>]+)["'])?>\s*<\/a>(?:\s*<\/figure>)?/gi
    // /(?:<figure [^>]*>\s*)?<a[^>]*?href=["']((?:[^"'])*\.(mp4|ogg|webm|avi|mov))["']>\s*<img[^>]*src=["']((?:\S+))['"](?:[^>]*?width=["']?(\d+)["'])?(?:[^>]*?height=["']?(\d+)["'])?(?:[^>]*?alt=["']([^>]+)["'])?>\s*<\/a>(?:\s*<\/figure>)?/gi

    const videoContentReplacement = (
        match: string,
        linkSrc: string,
        //ext: string,
        imageSrc: string,
        width: number = 16,
        height: number = 9,
        alt: string = ''
    ) =>
        `<video poster="${imageSrc}" src="${linkSrc}" width="${width}" height="${height}" title="${alt}" />`

    const content = html
        //.replace(/<(\/?)(tbody)([^>]*)>/g, '')
        //.replace(/<\/?table>/g, '')
        .replace(linkImgRegex, videoContentReplacement)
        .replace(/<[^/>][^>]?>(?:[\s+|&nbsp;]+)?<\/[^>]+>/g, '')
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
                (domNode.firstChild?.tagName === 'video' ||
                    domNode.lastChild?.tagName === 'video' ||
                    (domNode.firstChild?.tagName === 'figure' &&
                        ((domNode.firstChild as Element).firstChild as Element)?.tagName ===
                            'video'))
            ) {
                return (
                    <td className="video-grid">
                        {domNode.firstChild?.tagName === 'figure'
                            ? domToReact((domNode.firstChild as ExtendedDOMNode).children, options)
                            : domToReact(domNode.children, options)}
                    </td>
                )
            }

            if (
                domNode instanceof Element &&
                ((domNode.tagName === 'img' && domNode.parent.tagName !== 'figure') ||
                    (domNode.attribs.class === 'image' && domNode?.firstChild.tagName === 'img'))
            ) {
                const imgNode =
                    domNode.tagName === 'img' ? domNode : (domNode.firstChild as Element)
                if (!imgNode.attribs.src) return null

                const host = process.env.API_SERVER || process.env.NEXT_PUBLIC_API_SERVER || "https://sferaprint.istarck.ru"
                const src = buildAbsoluteUrl(host, imgNode.attribs.src)
                const width = parseInt(imgNode.attribs?.width || '') || 16
                const height = parseInt(imgNode.attribs?.height || '') || 9

                return (
                    <figure
                        className="image"
                        style={{ height: 0, paddingTop: `${(height / width) * 100}%` }}
                    >
                        <LazyImage
                            src={src}
                            alt={domNode.attribs.alt || ''}
                            sizes="(min-width:992px) 70vw, 100vw"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </figure>
                )
            } else if (domNode instanceof Element && domNode.tagName === 'video') {
                if (!domNode.attribs?.src || !domNode.attribs?.poster) return null

                const host = process.env.API_SERVER || process.env.NEXT_PUBLIC_API_SERVER || "https://sferaprint.istarck.ru"
                const src = buildAbsoluteUrl(host, domNode.attribs.src)
                const poster = buildAbsoluteUrl(host, domNode.attribs.poster)
                const width = parseInt(domNode.attribs?.width || '16')
                const height = parseInt(domNode.attribs?.height || '9')
                const orientation = width >= height ? ' landscape' : ' portrait'
                return (
                    <figure
                        className={'video' + orientation}
                        style={
                            orientation === ' landscape'
                                ? {
                                      height: 0,
                                      paddingTop: `${(height / width) * 100}%`
                                  }
                                : {}
                        }
                    >
                        <VideoPlayer
                            src={src}
                            poster={poster}
                            autoPlay
                            controls={false}
                            sizes="(min-width:992px) 70vw, 100vw"
                            width={width}
                            height={height}
                            alt={domNode.attribs.title}
                            className="video-player"
                        />
                    </figure>
                )
            }
        }
    }
    return parse(content, options) || null
}
