import React, { useState } from "react";
import "../styles/pages/FastAdd.css"; // Importing CSS for styling

const UploadCSV = () => {
    const [file, setFile] = useState(null);
    const [deckName, setDeckName] = useState("");
    const [deck, setDeck] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const userId = 1; // Hardcoded user ID currently, TODO: Replace with actual user authentication system

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a CSV file.");
            return;
        }
        if (!deckName.trim()) {
            alert("Please enter a deck name.");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            setIsUploading(true);
            setProgress(0);
            
            const text = event.target.result;
            const lines = text.split("\n");

            const newDeck = {
                name: deckName.trim(),
                cards: []
            };

            lines.forEach(line => {
                const columns = line.split(",");
                if (columns.length >= 2) {
                    newDeck.cards.push({ front: columns[0].trim(), back: columns[1].trim() });
                }
            });
            
            try {
                const deckResponse = await fetch("http://localhost:5000/api/decks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, name: deckName.trim(), description: "" })
                });
                
                const deckData = await deckResponse.json();
                if (!deckResponse.ok) throw new Error(deckData.error);
                
                const deckId = deckData.deck_id;
                setProgress(20);
                
                await Promise.all(newDeck.cards.map(async (card, index) => {
                    await fetch(`http://localhost:5000/api/flashcards/${deckId}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ deck_id: deckId, front: card.front, back: card.back })
                    });
                    setProgress(20 + ((index + 1) / newDeck.cards.length) * 80);
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
            }
        };
        
        reader.readAsText(file);
    };

    return (
        <div className="upload-container">
            <h2 className="upload-header">Upload a CSV File</h2>
            <div className="upload-form">
                <label>Deck Name</label>
                <input
                    type="text"
                    placeholder="Enter deck name"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                />
                <label>Select File</label>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={isUploading}>Upload</button>
                {isUploading && (
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
            {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
        </div>
    );
};

export default UploadCSV;