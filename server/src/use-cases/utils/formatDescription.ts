export function formatDescription(description: string) {
  const words = description.toLowerCase().split(' ')

  const formattedDescription = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return formattedDescription
}
