import sys
import json
import numpy as np
import matplotlib.pyplot as plt
from pydub import AudioSegment

def process_mp3(mp3_path):
    audio = AudioSegment.from_file(mp3_path, format="mp3")
    samples = np.array(audio.get_array_of_samples())
    duration = len(audio) / 1000
    sample_rate = audio.frame_rate
    num_samples = len(samples)
    num_buckets = 512
    bucket_size = num_samples // num_buckets

    waveform = []
    for i in range(num_buckets):
        start = i * bucket_size
        end = start + bucket_size
        bucket_samples = samples[start:end]
        
        fft = np.fft.rfft(bucket_samples)
        fft = np.abs(fft)

        low_freq = int(sample_rate * 0.05)
        mid_freq = int(sample_rate * 0.5)
        high_freq = int(sample_rate * 0.95)

        lows = np.mean(fft[:low_freq])
        mids = np.mean(fft[low_freq:mid_freq])
        highs = np.mean(fft[mid_freq:high_freq])

        waveform.append({
            "lows": 0 if np.isnan(lows) else lows,
            "mids": 0 if np.isnan(mids) else mids,
            "highs": 0 if np.isnan(highs) else highs
        })

    return {
        "duration": duration,
        "waveform": waveform
    }

if __name__ == "__main__":
    mp3_path = sys.argv[1]
    waveform_data = process_mp3(mp3_path)
    print(json.dumps(waveform_data))
