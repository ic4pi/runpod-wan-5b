INPUT_SCHEMA = {
    'prompt': {
        'type': str,
        'required': True,
    },
    'negative_prompt': {
        'type': str,
        'required': False,
        'default': None
    },
    'height': {
        'type': int,
        'required': False,
        'default': 480
    },
    'width': {
        'type': int,
        'required': False,
        'default': 832
    },
    'num_frames': {
        'type': int,
        'required': False,
        'default': 81,
        'constraints': lambda n: 8 <= n <= 121
    },
    'num_inference_steps': {
        'type': int,
        'required': False,
        'default': 50
    },
    'guidance_scale': {
        'type': float,
        'required': False,
        'default': 5.0
    },
    'fps': {
        'type': int,
        'required': False,
        'default': 24
    },
    'seed': {
        'type': int,
        'required': False,
        'default': None
    },
}
