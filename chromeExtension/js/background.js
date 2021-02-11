const UNSPLASH_ACCESS_KEY = '22vgum6aGFfjr4LWCm7F0dK0S7kPnR9ED_b6hm-0Y8Q';

function validateResponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }

  return response;
}

async function getRandomPhoto() {
  const endpoint ='https://api.unsplash.com/photos/random?orientation=landscape';

  const headers = new Headers();
  headers.append('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`);

  let response = await fetch(endpoint, { headers });
  const json = await validateResponse(response).json();
  response = await fetch(json.urls.raw + '&q=85&w=2000');
  json.blob = await validateResponse(response).blob();
  return json;
}

async function nextImage() {
  try {
    const image = await getRandomPhoto();
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image.blob);
    fileReader.addEventListener('load', (event) => {
      const { result } = event.target;
      image.base64 = result;
      chrome.storage.local.set({ nextImage: image });
    });
  } catch (err) {
    console.log(err);
  }
}

chrome.runtime.onInstalled.addListener(nextImage);

chrome.runtime.onMessage.addListener((request) => {
    if(request.command === 'next-image')
        nextImage();
});