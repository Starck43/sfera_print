import { Metadata } from 'next'
import { VideoPlayer } from '@/shared/ui/video-player'

export const metadata: Metadata = {
    title: 'Главная'
}

const isDev = process.env.NODE_ENV === 'development'

export default function Home() {
    return (
        <VideoPlayer
            src={{
                608: '/videos/atmo-h-video.mp4',
                portrait: '/videos/atmo-v-video.mp4',
                landscape: '/videos/atmo-h-video.mp4',
                default: '/videos/atmo-h-video.mp4'
            }}
            autoPlay={!isDev}
            controls={false}
            loop={!isDev}
            style={{ width: '100%', height: '100%' }}
        />
    )
}
