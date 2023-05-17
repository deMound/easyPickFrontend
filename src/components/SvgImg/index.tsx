export default function SvgImg(image: string) {
  return <img src={`data:image/svg+xml;utf8,${image}`} />;
}
