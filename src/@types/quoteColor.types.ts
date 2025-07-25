export namespace NSQuoteColor {
    
  export interface IQuoteColorPayload {
    backgroundColor: string;
    textColor: string;
  }

  export interface IQuoteColorUpdate {
    backgroundColor?: string;
    textColor?: string;
  }
}