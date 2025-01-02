import _ from 'lodash'
import { useEffect, useState } from 'react'
import { SvgoPlugin, svgoPlugins } from 'src/constants/svgo-plugins'
import { loc } from 'src/utils/i18n'
import { StorageUtils } from 'src/utils/storage-utils'

import { Category } from './category'
import { Item } from './item'

export const ExportSettings = () => {
  const [storagePlugins, setStoragePlugins] = useState<SvgoPlugin[]>([])

  useEffect(() => {
    const fetchSvgoPlugins = async () => {
      const plugins = await StorageUtils.getStorageData<SvgoPlugin[]>('plugins')
      setStoragePlugins(plugins ?? [])
    }

    fetchSvgoPlugins()
  }, [])

  const isChecked = (plugin: SvgoPlugin) => {
    return storagePlugins.some((p) => p.name === plugin.name)
  }

  const handleCheckboxChange =
    (plugin: SvgoPlugin) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target

      if (checked) {
        const plugins = [...storagePlugins, plugin]
        setStoragePlugins(plugins)
        StorageUtils.setStorageData('plugins', plugins)
      } else {
        const filteredPlugins = storagePlugins.filter((p) => p.name !== plugin.name)
        setStoragePlugins(filteredPlugins)
        StorageUtils.setStorageData('plugins', filteredPlugins)
      }
    }

  return (
    <Category description={loc('settings_export_desc')} title={loc('settings_export')}>
      <Item>
        <Item.Section>
          <Item.Heading>{loc('settings_default_svgo')}</Item.Heading>
          <Item.Description>{loc('settings_default_svgo_desc')}</Item.Description>
        </Item.Section>
        {_.sortBy(svgoPlugins, 'name').map((plugin) => (
          <div className="mt-4 flex gap-2" key={plugin.name}>
            <input
              checked={isChecked(plugin)}
              className="checkbox"
              id={plugin.name}
              onChange={handleCheckboxChange(plugin)}
              type="checkbox"
            />
            <div>
              <label className="block font-medium leading-4" htmlFor={plugin.name}>
                {plugin.label}
              </label>
              <span className="text-muted">{plugin.description}</span>
            </div>
          </div>
        ))}
      </Item>
    </Category>
  )
}
