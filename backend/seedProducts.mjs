// Backward-compatible entry point. The frontend catalogue is the canonical product source.
if (!process.argv.includes('--apply')) {
    process.argv.push('--apply');
}

await import('./scripts/syncFrontendCatalog.mjs');
