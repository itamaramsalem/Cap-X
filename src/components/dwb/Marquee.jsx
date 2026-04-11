/**
 * Infinite-scroll marquee.
 * Items are duplicated to create a seamless CSS loop.
 * Pauses on hover.
 */
export default function Marquee({
  items,
  speed = 30,
  reverse = false,
  className = '',
  itemClassName = '',
}) {
  const animName = reverse ? 'marquee-right' : 'marquee-left';
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={{ animation: `${animName} ${speed}s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className={`inline-flex items-center ${itemClassName}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
