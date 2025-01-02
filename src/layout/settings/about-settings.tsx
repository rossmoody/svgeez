import { links } from 'src/constants/links'
import { loc } from 'src/utils/i18n'

import { Category } from './category'
import { Item } from './item'

export const AboutSettings = () => (
  <Category description={loc('settings_about_desc')} title={loc('settings_about')}>
    <Item>
      <Item.Section>
        <Item.Heading>{loc('settings_contribute')}</Item.Heading>
        <Item.Description>
          {loc('settings_contribute_desc')}{' '}
          <a className="anchor" href={links.githubRepository}>
            {loc('settings_contribute_desc_2')}
          </a>
          .
        </Item.Description>
      </Item.Section>

      <Item.Section>
        <Item.Heading>{loc('settings_bug')}</Item.Heading>
        <Item.Description>
          {loc('settings_bug_desc')}{' '}
          <a className="anchor" href={links.githubIssues}>
            {loc('settings_open_issue')}
          </a>
          .
        </Item.Description>
      </Item.Section>

      <Item.Section>
        <Item.Heading>{loc('settings_disclaimer')}</Item.Heading>
        <Item.Description>{loc('settings_disclaimer_desc')}</Item.Description>
      </Item.Section>
    </Item>
  </Category>
)
