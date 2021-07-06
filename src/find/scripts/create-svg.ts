import { PageElement } from './find-svgs'

type SvgType =
  | 'inline'
  | 'object'
  | 'sprite master'
  | 'sprite instance'
  | 'img src'
  | 'object'
  | 'bg img'
  | 'invalid'

export class SVG {
  originalElementRef: PageElement
  type: SvgType
  location: string
  id: number
  cors: boolean
  svgString: string
  presentationSvg: string
  size: string
  height?: number
  width?: number
  imgSrcHref?: string
  spriteHref?: string

  constructor(element: PageElement) {
    this.originalElementRef = element
    this.location = window.document.location.host
    this.cors = false
    this.id = Math.random()
    this.svgString = ''
    this.presentationSvg = ''
    this.size = 'N/A'
    this.type = 'invalid'

    this.determineType()
    if (this.type === 'invalid') return

    this.buildSymbolElement()
    this.removeFillNone()
    this.setClassWidthHeight()
    this.setSizeString()
  }

  async setSvgString() {
    const serializer = new XMLSerializer()

    this.svgString = serializer.serializeToString(this.originalElementRef)

    if (this.imgSrcHref) {
      try {
        const response = await fetch(this.imgSrcHref)
        this.svgString = await response.text()
      } catch (error) {
        this.cors = true
      }
    }

    if (this.spriteHref) {
      try {
        const response = await fetch(this.spriteHref)
        this.svgString = await response.text()
      } catch (error) {
        this.cors = true
        return this
      }
    }

    return this
  }

  createPresentationSvg() {
    const doc = new DOMParser().parseFromString(this.svgString, 'image/svg+xml')

    const { documentElement } = doc

    documentElement.removeAttribute('height')
    documentElement.removeAttribute('width')
    documentElement.removeAttribute('style')
    documentElement.removeAttribute('class')

    this.presentationSvg = new XMLSerializer().serializeToString(
      documentElement
    )

    return this
  }

  isValidSvg() {
    return this.type !== 'invalid'
  }

  private determineType() {
    switch (this.originalElementRef.tagName) {
      case 'svg': {
        this.type = 'inline'

        const elementChildren = [...this.originalElementRef.children]

        if (
          elementChildren.some(
            (element) => element.tagName === 'use' || element.tagName === 'img'
          )
        ) {
          const useElement = this.originalElementRef.querySelector('use')!
          const spriteHref = useElement.getAttribute('href')

          if (!spriteHref) return

          if (spriteHref.includes('.svg')) this.spriteHref = spriteHref
          this.type = 'sprite instance'
        }

        if (elementChildren.some((element) => element.tagName === 'symbol'))
          this.type = 'sprite master'

        break
      }

      case 'symbol': {
        this.type = 'sprite instance'

        break
      }

      case 'IMG': {
        const imgSrc = (this.originalElementRef as HTMLImageElement).src

        if (!imgSrc) return

        const imgSrcFileType = imgSrc.split('.').pop()

        if (
          imgSrcFileType === 'svg' ||
          imgSrc.includes('data:image/svg+xml;base64')
        ) {
          this.imgSrcHref = imgSrc
          this.type = 'img src'
        }

        break
      }

      case 'OBJECT': {
        this.imgSrcHref = (this.originalElementRef as HTMLObjectElement).data
        this.type = 'object'

        break
      }

      case 'DIV': {
        const style = window.getComputedStyle(
          this.originalElementRef as HTMLDivElement,
          null
        )
        const url = style.backgroundImage.slice(4, -1).replace(/"/g, '')
        const fileType = url.substr(url.lastIndexOf('.') + 1)

        if (style.backgroundImage !== 'none' && /(svg)$/gi.test(fileType)) {
          this.imgSrcHref = url
          this.type = 'bg img'
        }

        break
      }

      default:
        this.type = 'invalid'
    }
  }

  private removeFillNone() {
    const fillAttribute = this.originalElementRef.getAttribute('fill')

    if (fillAttribute && fillAttribute.includes('none'))
      this.originalElementRef.removeAttribute('fill')
  }

  private buildSymbolElement() {
    if (this.type !== 'sprite instance') return

    const nameSpace = 'http://www.w3.org/2000/svg'

    const symbolElement = this.originalElementRef.cloneNode(
      true
    ) as SVGSymbolElement

    symbolElement.removeAttribute('fill')

    const svgElement = document.createElementNS(nameSpace, 'svg')
    svgElement.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns',
      nameSpace
    )

    const useElement = document.createElementNS(nameSpace, 'use')
    useElement.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      `#${this.originalElementRef.id}`
    )

    svgElement.appendChild(symbolElement)
    svgElement.appendChild(useElement)

    this.originalElementRef = svgElement
  }

  private setClassWidthHeight() {
    const viewBox = this.originalElementRef.getAttribute('viewBox')

    if (viewBox) {
      const sizeArr = viewBox.split(' ')

      const [, , width, height] = sizeArr

      this.width = Number(width)
      this.height = Number(height)
    } else {
      const rects = this.originalElementRef.getBoundingClientRect()

      this.height = Math.ceil(rects.height)
      this.width = Math.ceil(rects.width)
    }
  }

  private setSizeString() {
    if (this.width === 0 || this.height === 0) return

    this.size = `${this.width}x${this.height}`
  }
}

export default SVG
