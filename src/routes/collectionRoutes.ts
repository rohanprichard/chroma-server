import { Router } from "express";
import {
    createCollection,
    getCollections,
    deleteCollection,
    getDocuments,
    addDocument,
    deleteDocument,
} from "../controllers/collectionController";

const router = Router();

router.post("/", createCollection);
router.get("/", getCollections);
router.delete("/", deleteCollection);

router.get("/:collectionName/documents", getDocuments);
router.post("/:collectionName/documents", addDocument);
router.delete("/:collectionName/documents", deleteDocument);

export default router;
