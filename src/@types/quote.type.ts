import express from "express";

export namespace NSQuote {
  export interface IQuote {
    text: string;
    author: string;
  }

  export interface IQuoteCreateRequest
    extends express.Request<{}, {}, IQuote, {}> {}

  export interface IEditQuote {
    id: string;
    text?: string;
    author?: string;
  }

  export interface IQuoteUpdateRequest
    extends express.Request<{ id: string }, {}, IEditQuote, {}> {}
}
