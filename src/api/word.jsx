const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Fetches a random word from https://random-word-api.vercel.app/
 * @returns {Object} returns response parsed as object
 */
const getWord = async () => {
    try {
        const response = await fetch(`${apiUrl}/word`, {
            method: "GET"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export { getWord };