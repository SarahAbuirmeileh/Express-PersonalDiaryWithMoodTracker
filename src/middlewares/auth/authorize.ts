import express from 'express';
import Tag from '../../db/models/tag.js';
import Diary from '../../db/models/diary.js';

const authorize = (ownershipType: string) => {
    return async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // Check roles/permissions if we want to use them

        if (ownershipType === "TagOwnership") {
            checkTagOwnership(req, res, next);
        } else if (ownershipType === "diaryOwnership") {
            checkDiaryOwnership(req, res, next);
        } else if (ownershipType === "userOwnership") {
            checkUserOwnership(req, res, next);
        } else {
            res.status(403).send({ message: "Authorized Error: You don't have the permission to access this resource!" });
        }
    }
}

const checkTagOwnership = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const tagId = req.params.id;
        let tag;

        try {
            tag = await Tag.findById(tagId);
        } catch (err) {
            console.error("Error finding tag:", err);
            return res.status(500).send({
                message: "Authorization Failed",
                error: "Internal server error"
            });
        }

        if (!tag) {
            return res.status(404).send({
                message: "Authorization Failed",
                error: "Error: Tag not found!"
            });
        }

        if (res.locals.user && res.locals.user.id == tag.user?.toString()) {
            return next();
        }

        return res.status(403).json({
            message: "Authorization failed",
            error: "You don't have permission to access this resource!"
        });
    } catch (err) {
        console.error("Error checking diary ownership:", err);
        return res.status(500).json({
            message: "Authorization failed",
            error: "Internal server error"
        });
    }
};

const checkDiaryOwnership = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const diaryId = req.params.id;
        let diary;

        try {
            diary = await Diary.findById(diaryId);
        } catch (err) {
            console.error("Error finding diary:", err);
            return res.status(500).json({
                message: "Authorization failed",
                error: "Internal server error"
            });
        }

        if (!diary) {
            return res.status(404).json({
                message: "Authorization failed",
                error: "Error: Diary not found!"
            });
        }

        if (res.locals.user && res.locals.user.id == diary.user.toString()) {
            return next();
        }

        return res.status(403).json({
            message: "Authorization failed",
            error: "You don't have permission to access this resource!"
        });
    } catch (err) {
        console.error("Error checking diary ownership:", err);
        return res.status(500).json({
            message: "Authorization failed",
            error: "Internal server error"
        });
    }
};

const checkUserOwnership = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {

    const id = req.params.id;
    if (res.locals.user) {
        if (res.locals.user.id == id) {
            next();
        }
    }
    res.status(403).send({
        message: "Authorization failed",
        error: "You don't have permission to access this resource!"
    });
}

export {
    authorize,
}