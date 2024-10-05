'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { Group, LoopRepeat, LoopOnce } from 'three'

interface ModelViewerProps {
    modelUrl: string
    play?: boolean
    loop?: boolean
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl, play = true, loop = false }) => {
    const group = useRef<Group | null>(null)
    const { nodes, animations } = useGLTF(modelUrl)
    const { actions, names, mixer } = useAnimations(animations, group)

    useLayoutEffect(() => {
        if (!play) return

        animations.forEach( clip => { mixer.clipAction( clip ).loop = loop ? LoopRepeat : LoopOnce } )
        names.forEach((animation) => {
            actions?.[animation]?.play()
        })
        return () => {
            if (loop) return

            names.forEach((animation) => {
                actions?.[animation]?.stop()
            })
        }
    }, [actions, animations, loop, mixer, names, play])

    return (
        <group ref={group} dispose={null}>
            <group name="Scene">
                {Object.values(nodes).map((node) => {
                    if (node.name === 'Scene' || node.name === 'Camera') return null
                    return <primitive key={node.name} object={node} />
                })}
            </group>
        </group>
    )
}

export default ModelViewer
