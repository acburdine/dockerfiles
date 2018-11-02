# slides

Docker image that will serve markdown-formatted files as a slideshow, using [remark.js](https://github.com/gnab/remark).

## Usage

- `docker pull acburdine/slides:latest`
- `docker run --rm -d --name my-slideshow -p 3000:3000 -v /path/to/slides/dir:/opt/slides acburdine/slides:latest`
- Visit localhost:3000 in your browser

## Notes

This image is equipped to reload on changes, so if you change a slide file locally, you should be able to refresh the page in your browser and you'll get the updated changes.

## Environment Variables

- `PORT` - customize the port the image listens on (default `3000`)
- `SLIDES_DIR` - directory inside the container slides (default `/opt/slides`)
- `SLIDES_EXT` - extension of slide files (default `.md`)
