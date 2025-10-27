const API_URL = import.meta.env.VITE_VIA_KASHMIR_ADMIN_SERVER_API || 'https://via-kashmir-admin-panel-server.vercel.app';

export const generateAPIToken = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "client_id": "via_kashmir",
                "client_secret": "3f7b2vc8e-f9e8-4di3e-9d25-9eaafc7e9871awdfu6389987ybdowhksdfh78309374jnfdsfkutwuqe"
            }),
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convert response to JSON
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error generating API token:', error);
        return { error: error.message };
    }
};
