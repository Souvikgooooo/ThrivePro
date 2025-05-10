// declarations.d.ts
declare module '*.jsx' {
  const value: any; // Or more specific type React.FC<any> or similar
  export default value;
}
