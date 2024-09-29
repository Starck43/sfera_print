import React from 'react'
import Image from 'next/image'
import Player from 'next-video/player'
import parse, {
    Element,
    Text,
    domToReact,
    type DOMNode,
    type HTMLReactParserOptions
} from 'html-react-parser'
import { buildAbsoluteUrl } from '@/shared/lib/helpers/url'

export const parseHtml = async (html: string | null): Promise<React.ReactNode | null> => {
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
    ) => `<video poster="${imageSrc}" src="${linkSrc}"/>`

    const content = html
        .replace(/<(\/?)(table|tbody)([^>]*)>/g, '')
        .replace(/<(\/?)(tr|td)([^>]*)>/g, '<$1div>')
        .replace(/<[^/>][^>]?>(?:[\s+|&nbsp;]+)?<\/[^>]+>/g, '')
        .replace(linkImgRegex, videoContentReplacement)
        .replace(/\n+\s*/g, '\n')
        .trim()

    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (
                domNode instanceof Element &&
                domNode.tagName === 'div' &&
                domNode.children?.length === 1 &&
                domNode.children[0] instanceof Text
            ) {
                return <p>{domNode.children[0].data}</p>
            } else if (
                domNode instanceof Element &&
                domNode.tagName === 'div' &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                domNode.firstChild?.name === 'img'
            ) {
                return (
                    <div className="media-grid">
                        {domToReact(domNode.children as DOMNode[], options)}
                    </div>
                )
            }

            if (domNode instanceof Element && domNode.tagName === 'img') {
                if (!domNode.attribs?.src) return null

                const host = process.env.NEXT_PUBLIC_API_SERVER || 'localhost:8000'
                const src = buildAbsoluteUrl(host, domNode.attribs.src)

                return (
                    <div className="image-wrapper">
                        <Image src={src} alt={domNode.attribs.alt} fill />
                    </div>
                )
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
                            height: '100%'
                        }}
                    >
                        <style>{`
                            :root {--media-primary-color: var(--white-color);--media-accent-color: var(--secondary-color);}
                            ::part(center) {--media-control-background: rgba(0,0,0, 0.5) !important;}
                            ::part(seek-backward), ::part(seek-forward) {display: none;}
                            [slot=poster] {object-fit: cover;}
						`}</style>
                    </Player>
                )
            }
        }
    }

    return parse(content, options)
}
