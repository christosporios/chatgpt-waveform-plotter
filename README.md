# MP3 Waveform Plotting Web App built with ChatGPT
A web app that allows users to upload an MP3 file and generate a waveform visualization of the audio. The waveform shows the low, mid, and high frequency amplitudes of the audio over time. The backend is responsible for processing the uploaded MP3 file, analyzing its audio data, and returning the results to the frontend to be visualized.

## Frontend
The frontend is built using HTML, CSS, and JavaScript. It uses the Pure CSS library to provide a minimal and clean design. The frontend listens for drag-and-drop events on the drop area, allowing users to easily upload MP3 files. The status of the audio analysis job is displayed to the user and updated in real-time. Finally, the waveform visualization is displayed using the HTML5 Canvas API.

## Backend
The backend is built using Node.js and Express. The uploaded MP3 file is processed using a Python script that performs the audio analysis and returns the results to the backend. The backend then sends the results to the frontend to be displayed.

This project was built with heavy use of OpenAI's GPT-3 API, which was used to generate much of the code for both the frontend and backend. The asynchronous nature of the audio analysis job processing and the integration with the Python script presented unique challenges, but the use of OpenAI's GPT-3 API allowed for a streamlined and efficient development process.

## Deployment
To deploy this project, you will need to have Node.js and Python installed on your system. You will also need to install the required Node.js packages by running npm install in the backend directory. The Python script requires the pydub library, which can be installed by running pip install pydub. Once the dependencies are installed, you can start the backend by running node index.js. The frontend can then be accessed by navigating to http://localhost:3000 in your web browser.