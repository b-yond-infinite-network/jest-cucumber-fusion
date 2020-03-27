declare module "jest-cucumber-fusion" {
    import { loadFeature } from "jest-cucumber";
  
    type CallBack = (...args: string[]) => void | Promise<void>;
  
    function Given(name: string | RegExp, callback: CallBack): void;
    function When(name: string | RegExp, callback: CallBack): void;
    function Then(name: string | RegExp, callback: CallBack): void;
    function And(name: string | RegExp, callback: CallBack): void;
    function But(name: string | RegExp, callback: CallBack): void;
  
    function Before(callback: () => void | Promise<void>): void;
    function After(callback: () => void | Promise<void>): void;
  
    function Fusion(feature: string, options?: Parameters<typeof loadFeature>[1]): void;
  }
  