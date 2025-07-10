import express from "express";

export namespace NSTag {
    export type tagType = 'global' | 'custom';

    export interface ITag {
        name: string;
        emoji: string;
        type: tagType;
        user: number;
    }

    export interface ITagCreateRequest extends express.Request<{}, {}, ITag, {}> { }

    export interface IEditTag {
        id: string;
        name?: string;
        emoji?: string;
        type?: tagType;
        user?: string;
    }

    export interface ITagUpdateRequest extends express.Request<{ id: string }, {}, IEditTag, {}> { }

}