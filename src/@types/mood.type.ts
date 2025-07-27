import express from "express";

export namespace NSMood {
    export interface IMood {
        name: string;
        emoji: string;
        color: string;
    }

    export interface IMoodCreateRequest extends express.Request<{}, {}, IMood, {}> { }

    export interface IEditMood {
        id: string;
        name?: string;
        emoji?: string;
        color?: string;
    }

    export interface IMoodUpdateRequest extends express.Request<{ id: string }, {}, IEditMood, {}> { }

}
