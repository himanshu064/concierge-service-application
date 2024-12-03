const generateColorFromText = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360; // Generate a hue based on the hash
  return `hsl(${hue}, 30%, 50%)`; // Return an HSL color with vibrant saturation and lightness
};

export default generateColorFromText;