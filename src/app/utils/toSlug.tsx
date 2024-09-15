// Custom function to convert string to URL-friendly format
const stringToSlug = (str: string) => {
  return str.replace(/\s+/g, "-").toLowerCase();
};

const slugToString = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export { stringToSlug, slugToString };
