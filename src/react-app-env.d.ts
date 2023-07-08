/// <reference types="react-scripts" />

interface Window {
  // TODO: fix the type
  ethereum?: any;
}

declare module "*.json" {
  const value: any;
  export default value;
}
