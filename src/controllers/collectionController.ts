import { Request, Response } from "express";
import { ChromaClient, Collection, Document, ID } from "chromadb";

import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const client = new ChromaClient({ path: "http://localhost:8000" });

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

interface CreateCollectionResponse {
    message: string;
}

interface GetCollectionsResponse {
    collections: string[];
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

export const createCollection = async (
    req: Request<{}, {}, CreateCollectionRequest>,
    res: Response<CreateCollectionResponse>,
) => {
    const { name, description } = req.body;
    let collection = await client.createCollection({
        name: name,
        metadata: {
            description: description,
        },
    });
    console.log(collection);
    return res.status(200).json({ message: "Success!" });
};

export const getCollections = async (
    req: Request,
    res: Response<GetCollectionsResponse>,
) => {
    const collectionNames = await client.listCollections();
    return res.json({ collections: collectionNames });
};

export const deleteCollection = async (
    req: Request<{ name: string }, {}, DeleteCollectionRequest>,
    res: Response<DeleteCollectionResponse>,
) => {
    const { name } = req.body;
    const collection = await client.getOrCreateCollection({ name: name });
    await client.deleteCollection(collection);
    return res.json({ message: "Success!" });
};

export const addDocument = async (
    req: Request<{ collectionName: string }, {}, AddDocumentRequest>,
    res: Response<AddDocumentResponse>,
) => {
    try {
        const collectionName = req.params.collectionName;
        const { document } = req.body;
        const collection = await client.getOrCreateCollection({
            name: collectionName,
        });
        const id = uuidv4();

        await collection.add({
            ids: [id],
            documents: [document],
            metadatas: [{ id: id }],
        });

        return res.json({ message: "Success!" });
    } catch (error) {
        console.error("Error adding document:", error);
        return res.status(400).json({ message: "Error adding document" });
    }
};

export const getDocuments = async (
    req: Request<{ collectionName: string }, {}, {}>,
    res: Response<GetDocumentsResponse>,
) => {
    const { collectionName } = req.params;
    const collection = await client.getOrCreateCollection({
        name: collectionName,
    });

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
};

export const deleteDocument = async (
    req: Request<{ collectionName: string }, {}, DeleteDocumentRequest>,
    res: Response<DeleteDocumentResponse>,
) => {
    const collectionName = req.params.collectionName;
    const { documentId } = req.body;
    const collection = await client.getOrCreateCollection({
        name: collectionName,
    });
    await collection.delete({ ids: [documentId] });
    return res.json({ message: "Success!" });
};
