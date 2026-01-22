# Test Fixtures

This directory contains test fixtures used by the end-to-end tests.

## Files

- `test-image.jpg` - A simple 100x100 red image used for photo upload tests

## Generating Test Fixtures

The test image is generated using the Pillow library. To regenerate the test image, run:

```bash
python3 << 'EOF'
from PIL import Image
import os

os.makedirs('test/fixtures', exist_ok=True)
img = Image.new('RGB', (100, 100), color='red')
img.save('test/fixtures/test-image.jpg', 'JPEG')
print("Test image created successfully")
EOF
```

This requires the Pillow library to be installed:

```bash
pip install Pillow
```
