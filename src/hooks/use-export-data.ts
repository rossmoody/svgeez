import type { Collection, PageData } from 'src/types'

import { StorageUtils } from 'src/utils/storage-utils'

export const useExportData = () => {
  const exportData = async () => {
    const data: Promise<PageData>[] = []
    const collections = (await StorageUtils.getStorageData<Collection[]>('collections')) ?? []

    collections.forEach((collection) => {
      data.push(StorageUtils.getPageData(collection.id))
    })

    await Promise.all(data)
      .then((data) => {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'data.json'
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => {
        alert('Error exporting data')
      })
  }

  return { exportData }
}
