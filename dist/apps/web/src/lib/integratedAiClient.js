export const integratedAiClient = {
  stream: async (url, { body, signal, images }) => {
    const formData = new FormData();
    formData.append('message', JSON.stringify(body.message));
    
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });
    }

    const response = await fetch(`/hcgi/api${url}`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(error.message || 'Failed to stream from AI');
    }

    return response;
  }
};
