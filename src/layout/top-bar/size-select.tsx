import clsx from 'clsx'
import { useCollection } from 'src/providers'

export const sizes = [
  { value: 16, label: '16px' },
  { value: 20, label: '20px' },
  { value: 24, label: '24px' },
  { value: 40, label: '40px' },
  { value: 64, label: '64px' },
  { value: 96, label: '96px' },
  { value: 128, label: '128px' },
  { value: 256, label: '256px' },
]

export const SizeSelect = () => {
  const { state, dispatch } = useCollection()

  function handleSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const view = { ...state.view, size: Number(e.target.value) }
    chrome.storage.local.set({ view })
    dispatch({ type: 'set-view', payload: view })
  }

  return (
    <>
      <label htmlFor="size" className="hidden">
        Size
      </label>
      <select
        id="size"
        value={state.view.size}
        onChange={handleSizeChange}
        className={clsx(
          'rounded-md border-none text-sm font-semibold',
          'h-8 bg-transparent text-center',
          'focus cursor-pointer bg-none px-1.5 py-0',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        )}
      >
        {sizes.map((size) => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>
    </>
  )
}
