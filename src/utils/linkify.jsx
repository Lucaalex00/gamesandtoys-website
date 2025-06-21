// Check if in "TEXT" there are any LINKS

export function linkify(text)  {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 underline break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
