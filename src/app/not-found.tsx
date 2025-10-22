import { Metadata } from "next"
import { permanentRedirect } from 'next/navigation'

export const metadata: Metadata = {
    title: "404",
    description: "Что-то пошло не так...",
}

export default function NotFound() {
    permanentRedirect('/')
}


