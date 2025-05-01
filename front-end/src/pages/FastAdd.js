import React, { useState } from "react";
import "../styles/pages/FastAdd.css"; // Importing CSS for styling

const UploadCSV = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [deckName, setDeckName] = useState("");
    const [deck, setDeck] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const userId = 1;

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            alert("No file selected.");
            return;
        }
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setDeckName(selectedFile.name.replace(/\.json$/, ""));
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a JSON file.");
            return;
        }

        setIsUploading(true);
        setProgress(0);

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const textContent = event.target.result;
                if (!textContent) throw new Error("File is empty or unreadable.");
                const jsonData = JSON.parse(textContent);

                if (!Array.isArray(jsonData)) {
                    throw new Error("Invalid JSON format. Expected an array of flashcards.");
                }

                const newDeck = {
                    name: deckName.trim(),
                    cards: jsonData.map(card => ({
                        front: card.front?.trim() || "",
                        back: card.back?.trim() || ""
                    }))
                };

                const deckResponse = await fetch("http://localhost:5000/api/decks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, name: deckName.trim(), description: "" })
                });

                const deckData = await deckResponse.json();
                if (!deckResponse.ok) throw new Error(deckData.error);

                const deckId = deckData.deck_id;
                setProgress(10); // slight bump for deck creation

                await Promise.all(newDeck.cards.map(async (card, index) => {
                    await fetch(`http://localhost:5000/api/flashcards/${deckId}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ deck_id: deckId, front: card.front, back: card.back })
                    });
                    setProgress(10 + ((index + 1) / newDeck.cards.length) * 90); // complete to 100%
                }));

                setDeck(newDeck);
                setUploadMessage(`Deck '${deckName}' successfully created with ${newDeck.cards.length} cards!`);
                setTimeout(() => setUploadMessage(""), 5000);

                setFile(null);
                setDeckName("");
                document.querySelector("input[type=file]").value = "";
            } catch (error) {
                console.error("Error processing deck:", error);
                setUploadMessage("Failed to create deck and cards. Please try again.");
                setTimeout(() => setUploadMessage(""), 5000);
            } finally {
                setIsUploading(false);
                setProgress(0);
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="upload-container">
            <h2 className="upload-header">Upload a JSON File</h2>
            <div className="upload-form">
                <label>Deck Name</label>
                <input
                    type="text"
                    placeholder="Enter deck name"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                />
                <label>Select File</label>
                <input type="file" accept=".json" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={isUploading}>Upload</button>

                {isUploading && (
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        <p className="progress-text">{Math.floor(progress)}%</p>
                    </div>
                )}
            </div>
            {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
        </div>
    );
};

export default UploadCSV;
