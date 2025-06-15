import React from 'react'
import type { Swiper as SwiperCore } from 'swiper/types'

import type { Media } from '@/components/post'
import { classnames } from '@/shared/lib/helpers/classnames'
import { LazyImage } from '@/shared/ui/lazy-image'

import cls from './Slider.module.sass'

interface ThumbsProps {
    media: Media[]
    activeIndex: number
    swiperRef: React.RefObject<SwiperCore> | undefined
}

const SliderThumbs = ({ media, activeIndex, swiperRef }: ThumbsProps) => {
    const handleThumbClick = (index: number) => {
        swiperRef?.current?.slideTo(index) // Переключение на слайд с указанным индексом
    }
    return (
        <div className={cls.thumbs__container}>
            {media?.map((item, idx) => (
                <div
                    key={'thumb-' + idx + '_' + item.id}
                    className={classnames(cls, [
                        'thumb',
                        idx === activeIndex ? 'active' : undefined
                    ])}
                    style={{width: '150px', height: '150px'}}
                    onClick={() => handleThumbClick(idx)}
                >
                    <LazyImage
                        src={
                            typeof item.image === 'object' && 'src' in item.image
                                ? item.image.src
                                : item.image
                        }
                        srcSet={
                            typeof item.image === 'object' && 'srcset' in item.image
                                ? item.image.srcset
                                : undefined
                        }
                        alt={item.title}
                        className={cls.thumbImage}
                    />
                </div>
            ))}
        </div>
    )
}

export default SliderThumbs
