'use client'

import { Canvas } from '@react-three/fiber'
import ModelViewer from '@/shared/ui/model-viewer-3d'
import { useGLTF } from '@react-three/drei'
import { Model } from '@/components/page-header/transformed-model'
import { Suspense } from 'react'

function HeaderAnimation() {
    return (
        <Canvas
            camera={{
                far: 1000,
                near: 0.1,
                fov: 22.895,
                position: [16.603, 7.633, 11.061],
                rotation: [-0.62, 0.593, 0.379]
            }}
        >
            <ambientLight intensity={0.1} />
            <directionalLight intensity={1} />
            <spotLight
                intensity={0.5}
                angle={0.1}
                penumbra={1}
                position={[10, 15, 10]}
                castShadow={true}
            />

            <Suspense fallback={null}>
                <ModelViewer modelUrl={'/models/model-transformed.glb'} play={true} loop={false} />
            </Suspense>
        </Canvas>
    )
}

export default HeaderAnimation

useGLTF.preload('/models/model-transformed.glb')
