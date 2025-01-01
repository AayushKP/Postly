import { useState, ChangeEvent, KeyboardEvent } from "react";
import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const [currentLine, setCurrentLine] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // State for tracking suggestion generation
  const navigate = useNavigate();

  let typingTimeout: number | null = null; // Corrected type for Hono environment

  const fetchSuggestion = async (text: string) => {
    setIsGenerating(true); // Set to true when starting the generation
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/suggest/line`, {
        content: text,
      });
      setCurrentSuggestion(response.data.suggestions || "");
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    } finally {
      setIsGenerating(false); // Set to false after the generation request completes
    }
  };

  const handleTitleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Clear the previous timeout if any
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to fetch the suggestion after 2 seconds of inactivity
    if (newTitle) {
      typingTimeout = setTimeout(async () => {
        await fetchSuggestion(newTitle);
      }, 2000); // 2 seconds delay
    } else {
      setCurrentSuggestion(""); // Clear suggestion if the title is empty
    }
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && currentSuggestion) {
      e.preventDefault();
      const newLine = `${currentLine}${currentSuggestion}`;
      setLines([...lines, newLine]);
      setCurrentLine("");
      setCurrentSuggestion("");
      await fetchSuggestion(newLine); // Fetch next line suggestion
    } else if (e.key === "Enter") {
      e.preventDefault();
      const newLine = currentLine.trim();
      if (newLine) {
        setLines([...lines, newLine]);
        setCurrentLine("");
        await fetchSuggestion(newLine); // Fetch next line suggestion
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCurrentLine(text);
    if (text) {
      fetchSuggestion(text);
    } else {
      setCurrentSuggestion("");
    }
  };

  const handlePublish = async () => {
    try {
      const content = lines.join("\n");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing the blog:", error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          {/* Title Input */}
          <input
            onChange={handleTitleChange}
            value={title}
            type="text"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="Title"
          />

          {/* Text Editor */}
          <div className="relative mt-2">
            <div
              className="absolute top-0 left-0 w-full h-full text-gray-400 pointer-events-none whitespace-pre-wrap"
              style={{
                padding: "0.5rem",
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
              }}
            >
              {lines.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
              {currentLine && <div>{currentLine}</div>}
              {currentSuggestion && (
                <div className="text-gray-400">{currentSuggestion}</div>
              )}
              {isGenerating && <div className="text-gray-500"></div>}
            </div>

            {/* Editable Text Area */}
            <textarea
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              value={currentLine}
              rows={10}
              className="relative block w-full px-2 py-2 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
              style={{ caretColor: "black" }}
            />
          </div>

          <button
            onClick={handlePublish}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish post
          </button>
        </div>
      </div>
    </div>
  );
};
