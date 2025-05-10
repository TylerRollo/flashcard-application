import React, { useState } from "react";
import constants from "../utils/constants"; // Importing constants for validation
import "../styles/pages/FastAdd.css"; // Importing CSS for styling

const UploadCSV = () => {
    // State to store selected file and its name
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");

    // State to manage the deck name and created deck data
    const [deckName, setDeckName] = useState("");
    const [deck, setDeck] = useState(null);

    // States for progress tracking, upload status, and user feedback
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    // Static user ID (assumed placeholder)
    const userId = 1;

    // Handles file selection and sets deck name based on file name
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

    // Handles the actual upload process and deck/flashcards creation
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a JSON file.");
            return;
        }
        
        console.log(deckName.length); 
        if (deckName.length > constants.MAX_DECK_NAME_LENGTH) {
            alert(`Deck name cannot exceed ${constants.MAX_DECK_NAME_LENGTH} characters.`);
            return;
        }

        setIsUploading(true);
        setProgress(0);

        const reader = new FileReader();

        // FileReader's onload callback handles file processing
        reader.onload = async (event) => {
            try {
                const textContent = event.target.result;
                if (!textContent) throw new Error("File is empty or unreadable.");
                const jsonData = JSON.parse(textContent);

                // Validate JSON format
                if (!Array.isArray(jsonData)) {
                    throw new Error("Invalid JSON format. Expected an array of flashcards.");
                }

                // Prepare deck and flashcard data
                const newDeck = {
                    name: deckName.trim(),
                    cards: jsonData.map(card => ({
                        front: card.front?.trim() || "",
                        back: card.back?.trim() || ""
                    }))
                };

                // Create a new deck on the backend
                const deckResponse = await fetch("http://localhost:5000/api/decks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId, name: deckName.trim(), description: "" })
                });

                const deckData = await deckResponse.json();
                if (!deckResponse.ok) throw new Error(deckData.error);

                const deckId = deckData.deck_id;
                setProgress(10); // slight bump for deck creation

                // Upload each flashcard to the backend
                await Promise.all(newDeck.cards.map(async (card, index) => {
                    await fetch(`http://localhost:5000/api/flashcards/${deckId}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ deck_id: deckId, front: card.front, back: card.back })
                    });
                    // Update progress bar incrementally
                    setProgress(10 + ((index + 1) / newDeck.cards.length) * 90);
                }));

                // Update local state and show success message
                setDeck(newDeck);
                setUploadMessage(`Deck '${deckName}' successfully created with ${newDeck.cards.length} cards!`);
                setTimeout(() => setUploadMessage(""), 5000);

                // Reset file and deck input fields
                setFile(null);
                setDeckName("");
                document.querySelector("input[type=file]").value = "";
            } catch (error) {
                // Handle errors gracefully
                console.error("Error processing deck:", error);
                setUploadMessage("Failed to create deck and cards. Please try again.");
                setTimeout(() => setUploadMessage(""), 5000);
            } finally {
                // Cleanup UI states
                setIsUploading(false);
                setProgress(0);
            }
        };

        // Start reading the file as text
        reader.readAsText(file);
    };

    return (
        <div className="upload-container">
            <h2 className="upload-header">Upload a JSON File</h2>
            <div className="upload-form">
                {/* Deck name input */}
                <label>Deck Name</label>
                <input
                    type="text"
                    placeholder="Enter deck name"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                />

                {/* File input for JSON */}
                <label>Select File</label>
                <input type="file" accept=".json" onChange={handleFileChange} />

                {/* Upload button */}
                <button onClick={handleUpload} disabled={isUploading}>Upload</button>

                {/* Upload progress bar */}
                {isUploading && (
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        <p className="progress-text">{Math.floor(progress)}%</p>
                    </div>
                )}
            </div>

            {/* Upload feedback message */}
            {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
        </div>
    );
};

export default UploadCSV;
