import { ChromaClient } from "chromadb";
import app from "./app";

const PORT = process.env.PORT || 3000;
export const client = new ChromaClient({ path: "http://localhost:8000" });

app.listen(PORT, () => {
    console.log(`Chroma Server is running on http://localhost:${PORT}`);
});
