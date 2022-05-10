import {
  Box,
  Flex,
  FormLabel,
  Switch,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { useOptions } from 'src/build/providers/options-provider'
import { Plugin } from 'svgo'
import plugins from './svgo/svgo-plugins'

type Props = {
  name: Plugin
}

const PluginOption = ({ name }: Props) => {
  const { options, setOptions } = useOptions()
  const subduedText = useColorModeValue('gray.500', 'gray.400')
  const plugin = plugins.find((plugin) => plugin.name === name)

  return (
    <Flex align="center" justify="space-between">
      <FormLabel htmlFor={plugin?.name} _hover={{ cursor: 'pointer' }}>
        <Box flex="1">
          <Text as="h4" fontWeight="medium" fontSize="md">
            {plugin?.title}
          </Text>
          <Text color={subduedText} fontSize="sm">
            {plugin?.description}
          </Text>
        </Box>
      </FormLabel>

      <Switch
        colorScheme="red"
        id={plugin?.name}
        onChange={(event) => {
          const checked = event.target.checked
          const plugins = options.config.plugins

          if (checked) {
            plugins?.push(name)
          } else {
            plugins?.filter((plugin) => plugin === name)
          }

          setOptions((prevOptions) => ({
            ...prevOptions,
            config: {
              ...prevOptions.config,
              plugins,
            },
          }))
        }}
      />
    </Flex>
  )
}

export default PluginOption
