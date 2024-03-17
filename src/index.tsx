import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

export interface SProps {
  onConfirm?: (src: string, blob: Blob | null) => void
  onCancel?: () => void
  horizontal?: boolean
  visible?: boolean
}

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

          event.preventDefault() // 阻止在canvas画布上签名的时候页面跟着滚动

          const touches = event.touches[0]
          beginX = touches.clientX - signature.offsetLeft
          beginY = touches.clientY - signature.offsetTop

          if (horizontal) {
            beginX = touches.clientY
            beginY = signature.offsetHeight - touches.clientX
          }
        })

        canvas.addEventListener('touchmove', function (event: TouchEvent) {
          event.preventDefault() // 阻止在canvas画布上签名的时候页面跟着滚动

          const touches = event.touches[0]
          let stopX = touches.clientX - signature.offsetLeft
          let stopY = touches.clientY - signature.offsetTop

          if (horizontal) {
            stopX = touches.clientY
            stopY = signature.offsetHeight - touches.clientX
          }

          writing(beginX, beginY, stopX, stopY, ctx)
          beginX = stopX // 这一步很关键，需要不断更新起点，否则画出来的是射线簇
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

  const writing = (beginX: number, beginY: number, stopX: number, stopY: number, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath() // 开启一条新路径
    ctx.globalAlpha = 1 // 设置图片的透明度
    ctx.lineWidth = 3 // 设置线宽
    ctx.strokeStyle = 'black' // 设置路径颜色
    ctx.moveTo(beginX, beginY) // 从(beginX, beginY)这个坐标点开始画图
    ctx.lineTo(stopX, stopY) // 定义从(beginX, beginY)到(stopX, stopY)的线条（该方法不会创建线条）
    ctx.closePath() // 创建该条路径
    ctx.stroke() // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
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
