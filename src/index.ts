import { ChromaClient } from "chromadb";
import app from "./app";

const PORT = process.env.PORT || 3002;
// Use the CHROMADB_URL environment variable if available (set by docker-compose), otherwise default to localhost.
const chromaUrl = process.env.CHROMADB_URL || "http://localhost:8002";
export const client = new ChromaClient({ path: chromaUrl });

app.listen(PORT, () => {
    console.log(`Chroma Server is running on http://localhost:${PORT}`);
});
