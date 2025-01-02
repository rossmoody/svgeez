import { PropsWithChildren } from 'react'

const Heading = ({ children }: PropsWithChildren) => {
  return <h3 className="text-base font-semibold leading-7">{children}</h3>
}

const Description = ({ children }: PropsWithChildren) => {
  return <p className="text-muted mb-6 text-sm leading-6">{children}</p>
}

const Setting = ({ children }: PropsWithChildren) => {
  return <div className="mb-5">{children}</div>
}

export const Section = ({ children }: PropsWithChildren) => {
  return <div className="mb-5">{children}</div>
}

export const Item = ({ children }: PropsWithChildren) => {
  return <div className="sm:max-w-xl sm:grid-cols-6 md:col-span-2">{children}</div>
}

Item.Heading = Heading
Item.Description = Description
Item.Section = Section
Item.Setting = Setting
