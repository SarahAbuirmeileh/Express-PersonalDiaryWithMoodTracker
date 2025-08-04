export namespace NSQuoteColor {
  export interface IQuoteColorPayload {
    backgroundColor: string;
    theme: string;
  }

  export interface IQuoteColorUpdate {
    backgroundColor?: string;
    theme?: string;
  }
}
