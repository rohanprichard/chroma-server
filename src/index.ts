import { ChromaClient } from "chromadb";
import app from "./app";

const PORT = process.env.PORT || 3000;
const chromaUrl = process.env.CHROMADB_URL || "http://localhost:8000";
export const client = new ChromaClient({ path: chromaUrl });

app.listen(PORT, () => {
    console.log(`Chroma Server is running on http://localhost:${PORT}`);
});
