import React from 'react'

import { AppData } from '../../layout'

import LoadingGallery from './loading-gallery'
import EmptyGallery from './empty-gallery'
import DataGallery from './data-gallery'

interface GalleryData {
  data: AppData
}

const Gallery = ({ data }: GalleryData) => {
  switch (data) {
    case undefined: {
      return <LoadingGallery />
    }

    case 'empty': {
      return (
        <EmptyGallery
          headline="Shucks, couldn't find any SVGs to gobble"
          description="No worries. Upload your own SVGs to this page and optimize them
      using SVGO."
        />
      )
    }

    case 'system': {
      return (
        <EmptyGallery
          headline="Upload an SVG"
          description="Drag an SVG to this page to optimize it."
        />
      )
    }

    default: {
      return <DataGallery data={data} />
    }
  }
}

export default Gallery
