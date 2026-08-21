import { parse } from 'yaml'
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'


type Workflow = {
  on?: {
    push?: { branches?: string[] }
    workflow_dispatch?: Record<string, never>
  }
  permissions?: Record<string, string>
  concurrency?: { group?: string; 'cancel-in-progress'?: boolean }
  jobs?: Record<string, {
    needs?: string
    environment?: string | { name?: string }
    steps?: Array<{ uses?: string; run?: string; with?: Record<string, unknown> }>
  }>
}

describe('GitHub Pages workflow', () => {
  it('checks the site before deploying dist from main', async () => {
    const source = await readFile('.github/workflows/deploy.yml', 'utf8')
    const workflow = parse(source) as Workflow

    expect(workflow.on?.push?.branches).toEqual(['main'])
    expect(workflow.on?.workflow_dispatch).toEqual({})
    expect(workflow.permissions).toMatchObject({
      contents: 'read',
      pages: 'write',
      'id-token': 'write',
    })
    expect(workflow.concurrency).toEqual({ group: 'pages', 'cancel-in-progress': true })

    const checkSteps = workflow.jobs?.check?.steps ?? []
    const runCommands = checkSteps.flatMap((step) => (step.run ?? '').split(/\r?\n/))
    expect(runCommands).toEqual(expect.arrayContaining([
      'npm ci',
      'npm test',
      'npm run build',
      'npx playwright install --with-deps chromium',
      'npm run test:e2e',
      'npm run test:lighthouse',
    ]))

    const artifactStep = checkSteps.find((step) => step.uses === 'actions/upload-pages-artifact@v5')
    expect(artifactStep?.with).toMatchObject({ path: './dist' })

    const deployJob = workflow.jobs?.deploy
    expect(deployJob?.needs).toBe('check')
    expect(deployJob?.environment).toMatchObject({ name: 'github-pages' })
    expect(deployJob?.steps).toEqual(expect.arrayContaining([
      expect.objectContaining({ uses: 'actions/deploy-pages@v5' }),
    ]))
  })
})
