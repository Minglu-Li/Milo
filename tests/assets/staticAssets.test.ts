import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { siteContent } from '../../src/content/profile'

describe('static assets', () => {
  it('ships the favicon and a 1200 by 630 Open Graph image', async () => {
    await access(resolve('public/favicon.svg'))
    const metadata = await sharp(resolve('public/og-image.png')).metadata()
    expect(metadata.width).toBe(1200)
    expect(metadata.height).toBe(630)
  })

  it('resolves every configured local public asset', async () => {
    const configured = [siteContent.avatar, ...Object.values(siteContent.resumes)].filter(Boolean) as string[]
    await Promise.all(configured.map((asset) => access(resolve('public', asset.replace(/^\//, '')))))
  })
})