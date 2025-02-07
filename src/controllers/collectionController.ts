import { Request, Response } from "express";
import { Collection, Document, ID } from "chromadb";
import { client } from "../index";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

interface CreateCollectionRequest {
    name: string;
    description: string;
}

interface DeleteCollectionRequest {
    name: string;
}

interface AddDocumentRequest {
    collectionName: string;
    document: string;
}

interface DeleteDocumentRequest {
    documentId: string;
}

interface QueryDocumentsRequest {
    query: string;
}

interface CreateCollectionResponse {
    message: string;
}

interface GetCollectionsResponse {
    collections: Collection[];
}

interface DeleteCollectionResponse {
    message: string;
}

interface GetDocumentsResponse {
    ids: ID[];
    documents: string[];
}

interface AddDocumentResponse {
    message: string;
}

interface DeleteDocumentResponse {
    message: string;
}

interface QueryDocumentsResponse {
    ids: ID[];
    documents: string[];
}

interface ErrorResponse {
    message: string;
}

export const createCollection = async (
    req: Request<{}, {}, CreateCollectionRequest>,
    res: Response<CreateCollectionResponse | ErrorResponse>,
) => {
    try {
        const { name, description } = req.body;
        let collection = await client.createCollection({
            name: name,
            metadata: {
                description: description,
            },
        });
        console.log(collection);
        return res.status(200).json({ message: "Success!" });
    } catch (error) {
        console.error("Error creating collection:", error);
        return res.status(500).json({ message: "Error creating collection" });
    }
};

export const getCollections = async (
    req: Request,
    res: Response<GetCollectionsResponse | ErrorResponse>,
) => {
    try {
        const collectionNames = await client.listCollections();
        const collections: Collection[] = [];
        for (const collectionName of collectionNames) {
            const collection = await client.getOrCreateCollection({
                name: collectionName,
            });
            collections.push(collection);
        }

        return res.json({ collections: collections });
    } catch (error) {
        console.error("Error getting collections:", error);
        return res.status(500).json({ message: "Error getting collections" });
    }
};

export const deleteCollection = async (
    req: Request<{ name: string }, {}, DeleteCollectionRequest>,
    res: Response<DeleteCollectionResponse | ErrorResponse>,
) => {
    try {
        const { name } = req.body;
        const collection = await client.getOrCreateCollection({ name: name });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        await client.deleteCollection(collection);
        return res.json({ message: "Success!" });
    } catch (error) {
        console.error("Error deleting collection:", error);
        return res.status(500).json({ message: "Error deleting collection" });
    }
};

export const addDocument = async (
    req: Request<{ collectionName: string }, {}, AddDocumentRequest>,
    res: Response<AddDocumentResponse | ErrorResponse>,
) => {
    try {
        const collectionName = req.params.collectionName;
        const { document } = req.body; // Metadata
        const collection = await client.getOrCreateCollection({
            name: collectionName,
        });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const id = uuidv4();

        await collection.add({
            ids: [id],
            documents: [document],
            metadatas: [{ id: id }],
        });

        return res.json({ message: "Success!" });
    } catch (error) {
        console.error("Error adding document:", error);
        return res.status(500).json({ message: "Error adding document" });
    }
};

export const getDocuments = async (
    req: Request<{ collectionName: string }, {}, {}>,
    res: Response<GetDocumentsResponse | ErrorResponse>,
) => {
    try {
        const { collectionName } = req.params;
        const collection = await client.getOrCreateCollection({
            name: collectionName,
        });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const response = await collection.get({
            //@ts-ignore
            include: ["documents"],
        });
        return res.json({
            ids: response.ids,
            documents: response.documents.filter(
                (doc): doc is string => doc !== null,
            ),
        });
    } catch (error) {
        console.error("Error getting documents:", error);
        return res.status(500).json({ message: "Error getting documents" });
    }
};

export const deleteDocument = async (
    req: Request<{ collectionName: string }, {}, DeleteDocumentRequest>,
    res: Response<DeleteDocumentResponse>,
) => {
    try {
        const { collectionName } = req.params;
        const { documentId } = req.body;
        const collection = await client.getOrCreateCollection({
            name: collectionName,
        });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        await collection.delete({ ids: [documentId] });
        return res.json({ message: "Success!" });
    } catch (error) {
        console.error("Error deleting document:", error);
        return res.status(500).json({ message: "Error deleting document" });
    }
};

export const queryDocuments = async (
    req: Request<{ collectionName: string }, {}, QueryDocumentsRequest>,
    res: Response<QueryDocumentsResponse | ErrorResponse>,
) => {
    try {
        const { collectionName } = req.params;
        const { query } = req.body;

        const collection = await client.getOrCreateCollection({
            name: collectionName,
        });
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }
        const response = await collection.query({
            queryTexts: query,
            nResults: 2,
        });

        console.log(response);
        const ids = response.ids[0] || [];
        const documents = (response.documents[0] || []).filter(
            (doc): doc is string => doc !== null,
        );
        return res.json({ ids, documents });
    } catch (error) {
        console.error("Error querying documents:", error);
        return res.status(500).json({ ids: [], documents: [] });
    }
};
