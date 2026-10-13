const assetFiles = import.meta.glob('../assets/**/*', {
  eager: true,
  import: 'default',
  query: '?url',
})

export function asset(path) {
  const normalizedPath = path.replace(/^assets\//, '')
  const file = assetFiles[`../assets/${normalizedPath}`]
  if (!file) {
    throw new Error(`Asset not found: ${path}`)
  }
  return file
}
