import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

export interface SProps {
  /** Confirm callback; `src` is the signature image dataURL, `blob` is the matching PNG Blob */
  onConfirm?: (src: string, blob: Blob | null) => void
  /** Cancel callback */
  onCancel?: () => void
  /** Write in landscape mode (canvas rotated 90°), defaults to false */
  horizontal?: boolean
  /** Whether the signature pad is visible, defaults to false */
  visible?: boolean
}

/**
 * Fullscreen handwritten signature pad. Rendered into document.body via a Portal,
 * supports portrait / landscape writing, and exports the signature image through onConfirm.
 */
const Signature: React.FC<SProps> = (props) => {
  const { onConfirm, horizontal, visible, onCancel } = props
  const ref = useRef<HTMLDivElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [drawed, setDrawed] = useState<boolean>(false)
  const [draw, setDraw] = useState<boolean>(false)

  useEffect(() => {
    if (horizontal && ref.current && visible) {
      const signature = ref.current

      signature.style.width = '100vh'
      signature.style.height = '100vw'
      signature.style.transform = 'rotate(90deg)'
      signature.style.transformOrigin = '0% 0%'
      signature.style.left = '100vw'
    }

    if (ref.current && visible) {
      const signature = ref.current

      const canvas = document.querySelector('.Signature-canvas') as HTMLCanvasElement

      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      setCanvas(canvas)

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#E9E9E9'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        setCtx(ctx)

        let beginX: number, beginY: number

        canvas.addEventListener('touchstart', function (event: TouchEvent) {
          setDraw(true)

          event.preventDefault() // Prevent the page from scrolling while signing on the canvas

          const touches = event.touches[0]
          beginX = touches.clientX - signature.offsetLeft
          beginY = touches.clientY - signature.offsetTop

          if (horizontal) {
            beginX = touches.clientY
            beginY = signature.offsetHeight - touches.clientX
          }
        })

        canvas.addEventListener('touchmove', function (event: TouchEvent) {
          event.preventDefault() // Prevent the page from scrolling while signing on the canvas

          const touches = event.touches[0]
          let stopX = touches.clientX - signature.offsetLeft
          let stopY = touches.clientY - signature.offsetTop

          if (horizontal) {
            stopX = touches.clientY
            stopY = signature.offsetHeight - touches.clientX
          }

          writing(beginX, beginY, stopX, stopY, ctx)
          beginX = stopX // Crucial: keep updating the start point, otherwise strokes fan out as rays from one origin
          beginY = stopY

          setDrawed(true)
        })
      }
    }

    if (!visible) {
      setDraw(false)
    }
  }, [horizontal, ref, visible])

  useEffect(() => {
    window.addEventListener('resize', function () {
      if (canvas) {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
      }
    })
  }, [canvas])

  // Draw one stroke segment from (beginX, beginY) to (stopX, stopY)
  const writing = (beginX: number, beginY: number, stopX: number, stopY: number, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath()
    ctx.globalAlpha = 1
    ctx.lineWidth = 3
    ctx.strokeStyle = 'black'
    ctx.moveTo(beginX, beginY)
    ctx.lineTo(stopX, stopY)
    ctx.closePath()
    ctx.stroke()
  }

  const confirm = () => {
    if (canvas && drawed) {
      canvas.toBlob((blob) => {
        const image = new Image()
        image.src = canvas.toDataURL('image/png')
        onConfirm && onConfirm(image.src, blob)
      }, 'image/png')
    }
  }

  const onClear = () => {
    if (canvas && ctx) {
      setDraw(false)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  if (visible) {
    return ReactDOM.createPortal(
      <div className='Signature-container'>
        <div className='Signature' ref={ref}>
          {!draw && <div className='Signature-title'>签字区域</div>}
          <canvas className='Signature-canvas' />
          <div className='Signature-buttonGoup'>
            <div onClick={onCancel}>取消</div>
            <div onClick={onClear}>重置</div>
            <div onClick={confirm}>确认</div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return null
}

export default Signature
