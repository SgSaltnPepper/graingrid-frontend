// This tells TypeScript to stop panicking when it sees a CSS import
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}