import type { Collection } from 'src/types'

import { nanoid } from 'nanoid'
import { PageData } from 'src/types'
import { StorageUtils } from 'src/utils/storage-utils'
import { SvgUtils } from 'src/utils/svg-utils'

export const useResetEnvironment = () => {
  const reset = async () => {
    await chrome.storage.local.clear()

    const collection: Collection = {
      href: 'svggobbler.com',
      id: nanoid(),
      name: 'Welcome to SVG Gobbler',
      origin: 'svggobbler.com',
    }

    const pageData: PageData = {
      data: [
        SvgUtils.createStorageSvg(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150.156 150.156"><g clip-path="url(#c)"><rect width="150.156" height="150.156" fill="#FB575E" rx="35.193"/><circle cx="24.635" cy="47.51" r="11.731" fill="#fff"/><circle cx="125.521" cy="47.51" r="11.731" fill="#fff"/><path fill="none" stroke="#fff" stroke-width="8.212" d="M24.635 47.51h100.886m-85.636 54.55s0-56.015 35.78-56.015 35.779 56.015 35.779 56.015"/><rect width="41.058" height="41.058" x="55.136" y="26.981" fill="#1E293B" rx="11.731"/><rect width="41.058" height="41.058" x="19.356" y="82.117" fill="#1E293B" rx="11.731"/><rect width="41.058" height="41.058" x="90.915" y="82.117" fill="#1E293B" rx="11.731"/></g></svg>',
        ),
      ],
      host: 'svggobbler.com',
      href: 'https://svggobbler.com',
      origin: 'svggobbler.com',
    }

    await StorageUtils.setPageData(collection.id, pageData)
    await StorageUtils.setStorageData('collections', [collection])
    window.location.reload()
  }

  return { reset }
}
