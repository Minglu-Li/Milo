module.exports = {
  ci: {
    collect: {
      // staticDistDir: './dist',
      numberOfRuns: 3,
      settings: { chromeFlags: '--no-sandbox', preset: 'desktop', throttlingMethod: 'provided' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './lhci-reports' },
  },
}
