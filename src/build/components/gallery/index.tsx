import React from 'react'

import loc from '../utils/localization'
import { useData } from '../../providers/data-provider'
import DataGallery from './data-gallery'
import EmptyGallery from './empty-gallery'
import SVGClass from '../../../find/svg-class'

const Gallery = () => {
  const { data } = useData()

  console.log(data)

  if (!data || data.length < 1) {
    return (
      <EmptyGallery
        headline={loc('gallery_noAvailTitle')}
        description={loc('gallery_noAvailDesc')}
      />
    )
  }

  return <DataGallery data={data as SVGClass[][]} />
}

export default Gallery
