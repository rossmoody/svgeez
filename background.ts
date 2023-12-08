import { logger } from 'src/utils/logger'
import { findSvg, type DocumentData } from 'svg-gobbler-scripts'
import Chrome from './src/utils/chrome-utils'

/**
 * Functions related to initializing the extension. This includes setting the
 * extension icons and launching the onboarding experience.
 */
class Background {
  /**
   * Initializes the extension.
   */
  static init() {
    Background.setExtensionIcons()
    Background.launchOnboardingExperience()
    Background.launchExtensionFromOnboarding()
    Background.launchSvgGobbler()
  }

  /**
   * Initializes SVG Gobbler conditionally based on the type of page the user is
   * currently on. Responsible for getting data from the active tab and sending
   * it to the content script.
   */
  static launchSvgGobbler() {
    const onClickHandler = async () => {
      let data = {
        data: [],
        host: 'Collection',
        origin: '',
      } as DocumentData

      const activeTab = await Chrome.getActiveTab()

      // Check if the active tab is a system page
      if (!activeTab.url?.includes('chrome://')) {
        data = await Chrome.executeScript(activeTab.id!, findSvg)
        logger.info(data.data)
      }

      // Add a listener
      chrome.runtime.onMessage.addListener(function listener(req, __, sendResponse) {
        if (req === 'gobble') {
          sendResponse({ data })
          chrome.runtime.onMessage.removeListener(listener)
        }
      })

      // Open the SVG Gobbler page
      await Chrome.createNewTab()
    }

    chrome.action.onClicked.addListener(onClickHandler)
  }

  /**
   * Launches the extension from the onboarding page.
   */
  static launchExtensionFromOnboarding() {
    chrome.runtime.onMessage.addListener(async function onboardingListener(req) {
      const { type, data } = req

      if (type === 'launch-svg-gobbler-from-onboarding') {
        chrome.runtime.onMessage.addListener(function listener(req, __, sendResponse) {
          if (req === 'gobble') {
            sendResponse({ data })
            chrome.runtime.onMessage.removeListener(listener)
          }
        })

        await Chrome.createNewTab()
      }
    })
  }

  /**
   * If the extension is installed for the first time, open the onboarding page.
   */
  static launchOnboardingExperience() {
    chrome.runtime.onInstalled.addListener(async (details) => {
      if (details.reason === 'install') {
        await Chrome.createNewTab('onboarding.html')
      }
    })
  }

  /**
   * Load the development icon if the extension is running in development mode.
   */
  static setExtensionIcons() {
    if (!('update_url' in chrome.runtime.getManifest())) {
      // The extension is running as an unpacked extension
      chrome.action.setIcon({
        path: {
          '16': 'assets/dev/16.png',
          '24': 'assets/dev/24.png',
          '32': 'assets/dev/32.png',
          '48': 'assets/dev/48.png',
          '64': 'assets/dev/64.png',
        },
      })
    } else {
      // The extension is running as a packed (installed) extension
      chrome.action.setIcon({
        path: {
          '16': 'assets/prod/16.png',
          '24': 'assets/prod/24.png',
          '32': 'assets/prod/32.png',
          '48': 'assets/prod/48.png',
          '64': 'assets/prod/64.png',
          '128': 'assets/prod/128.png',
          '256': 'assets/prod/256.png',
          '300': 'assets/prod/300.png',
        },
      })
    }
  }
}

Background.init()
