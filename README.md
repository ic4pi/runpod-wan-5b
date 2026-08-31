# Wan2.2 TI2V-5B RunPod Serverless Worker

Run [Wan2.2 TI2V-5B](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B-Diffusers)
(text/image-to-video) as a RunPod Serverless endpoint. Sibling to
[runpod-sdxl](https://github.com/ic4pi/runpod-sdxl) and
[runpod-wan](https://github.com/ic4pi/runpod-wan) (Wan2.1 1.3B) — its own
repo/endpoint so it can use GPU sizing matched to this specific model
instead of sharing a pool with a much lighter one. All are serverless
(scale-to-zero), so running several endpoints side by side costs nothing
extra while idle.

## Model

`Wan-AI/Wan2.2-TI2V-5B-Diffusers` — the dense 5B unified text+image-to-video
model from Wan2.2. Needs meaningfully more VRAM than the 1.3B model in
`runpod-wan` (~27GB+ at fp16 for even modest frame counts without
optimization), so `handler.py` uses `enable_model_cpu_offload()` to fit a
24GB card when one's available, with 48GB cards as fallback in
`.runpod/hub.json`'s GPU pool.

Requires `diffusers==0.36.0`+ (pinned in `requirements.txt`) — earlier
diffusers releases don't have TI2V-5B support.

## Usage

Same input shape as `runpod-wan`: `prompt` (required), `negative_prompt`,
`height` (480), `width` (832), `num_frames` (81), `num_inference_steps`
(50), `guidance_scale` (5.0), `fps` (24), `seed`.

### Example Request

```json
{
  "input": {
    "prompt": "a golden retriever running through a field of sunflowers, cinematic lighting",
    "negative_prompt": "blurry, low quality, static, overexposed, watermark",
    "height": 480,
    "width": 832,
    "num_frames": 81,
    "num_inference_steps": 50,
    "guidance_scale": 5.0,
    "fps": 24,
    "seed": 1337
  }
}
```

By default the mp4 comes back as a base64 data URL. Set `BUCKET_ENDPOINT_URL`,
`BUCKET_NAME`, `BUCKET_ACCESS_KEY_ID`, and `BUCKET_SECRET_ACCESS_KEY` as
endpoint env vars (any S3-compatible storage) to have the worker upload and
return a `video_url` link instead — recommended, since mp4s get large.

Call `/run` (async) and poll `/status/{id}` rather than `/runsync` — video
generation takes minutes, not seconds.
