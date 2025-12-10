'use client' // Error boundaries must be Client Components

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        // global-error must include html and body tags
        <html>
            <body>
                <h2>Что-то пошло не так!</h2>
                <button onClick={() => reset()}>Повторить</button>
            </body>
        </html>
    )
}
