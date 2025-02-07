import express from "express";
import swaggerUi from "swagger-ui-express";
import collectionRoutes from "./routes/collectionRoutes";

const app = express();

app.use(express.json());

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Chroma API",
        version: "1.0.0",
        description: "API for interacting with the ChromaDB vector database.",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server",
        },
    ],

    paths: {
        // Tag Collections
        "/collections": {
            get: {
                tags: ["Collections"],
                summary: "Retrieve all collections",
                operationId: "getCollections",
                responses: {
                    "200": {
                        description: "Collections retrieved successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/GetCollectionsResponse",
                                },
                            },
                        },
                    },
                },
            },

            post: {
                tags: ["Collections"],
                summary: "Create a new collection",
                operationId: "createCollection",
                requestBody: {
                    description: "Collection to create",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateCollectionRequest",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Collection created successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/CreateCollectionResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid input.",
                    },
                },
            },

            delete: {
                tags: ["Collections"],
                summary: "Delete a collection",
                operationId: "deleteCollection",
                requestBody: {
                    description: "Collection to delete",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/DeleteCollectionRequest",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Collection deleted successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DeleteCollectionResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid input.",
                    },
                },
            },
        },
        // Tag Documents
        "/collections/{collectionName}/documents": {
            get: {
                tags: ["Documents"],
                summary: "Retrieve all documents in a collection",
                operationId: "getDocuments",
                parameters: [
                    {
                        name: "collectionName",
                        in: "path",
                        required: true,
                        description: "Name of the collection",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Documents retrieved successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/GetDocumentsResponse",
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Documents"],
                summary: "Add documents to a collection",
                operationId: "addDocument",
                parameters: [
                    {
                        name: "collectionName",
                        in: "path",
                        required: true,
                        description:
                            "Name of the collection to add documents to",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    description: "Documents to add",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AddDocumentRequest",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Documents added successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AddDocumentResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Error adding documents.",
                    },
                },
            },
            delete: {
                tags: ["Documents"],
                summary: "Delete a document from a collection",
                operationId: "deleteDocument",
                parameters: [
                    {
                        name: "collectionName",
                        in: "path",
                        required: true,
                        description: "Name of the collection",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                requestBody: {
                    description: "Document to delete",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/DeleteDocumentRequest",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Document deleted successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DeleteDocumentResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Error deleting document.",
                    },
                },
            },
        },
        // Tag Query
        "/collections/{collectionName}/query": {
            get: {
                tags: ["Query"],
                summary: "Query documents in a collection using a search term",
                operationId: "queryDocuments",
                parameters: [
                    {
                        name: "collectionName",
                        in: "path",
                        required: true,
                        description: "Name of the collection to query",
                        schema: {
                            type: "string",
                        },
                    },
                    {
                        name: "q",
                        in: "query",
                        required: true,
                        description: "Search query string",
                        schema: {
                            type: "string",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Query results returned successfully.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Document",
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid query parameter.",
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Collection: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Unique identifier for the collection",
                    },
                    name: {
                        type: "string",
                        description: "Name of the collection",
                    },
                    description: {
                        type: "string",
                        description: "Description of the collection",
                    },
                },
                required: ["id", "name", "description"],
            },
            CreateCollectionRequest: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                    description: {
                        type: "string",
                    },
                },
                required: ["name", "description"],
            },
            CreateCollectionResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Collection created successfully.",
                    },
                    collection: {
                        $ref: "#/components/schemas/Collection",
                    },
                },
                required: ["message", "collection"],
            },
            GetCollectionsResponse: {
                type: "object",
                properties: {
                    collections: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
                required: ["collections"],
            },
            DeleteCollectionRequest: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                },
                required: ["name"],
            },
            DeleteCollectionResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                    },
                },
                required: ["message"],
            },
            Document: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Document identifier",
                    },
                    content: {
                        type: "string",
                        description: "Content of the document",
                    },
                    metadata: {
                        type: "object",
                        description: "Additional metadata for the document",
                        additionalProperties: true,
                    },
                },
                required: ["id", "content"],
            },
            GetDocumentsResponse: {
                type: "object",
                properties: {
                    documents: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/Document",
                        },
                    },
                },
                required: ["documents"],
            },
            AddDocumentRequest: {
                type: "object",
                properties: {
                    document: {
                        type: "string",
                    },
                },
                required: ["document"],
            },
            AddDocumentResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Success!",
                    },
                },
                required: ["message"],
            },
            DeleteDocumentRequest: {
                type: "object",
                properties: {
                    documentId: {
                        type: "string",
                    },
                },
                required: ["documentId"],
            },
            DeleteDocumentResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                    },
                },
                required: ["message"],
            },
        },
    },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/collections", collectionRoutes);

app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        console.error(err);
        res.status(err.status || 500).json({
            error: err.message || "Internal Server Error",
        });
    },
);

export default app;
