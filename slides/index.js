const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const port = process.env.PORT || 3000;
const template = fs.readFileSync('./index.html', {encoding: 'utf8'});
const slidesDir = process.env.SLIDES_DIR || '/opt/slides';
const slideExt = process.env.SLIDES_EXT || '.md';

function buildContent(slideFile) {
  const file = path.join(slidesDir, slideFile);
  if (!file.endsWith(slideExt) || !fs.existsSync(file)) return null;
  const title = path.basename(file, slideExt);
  const contents = fs.readFileSync(file, {encoding: 'utf8'});

  return {
    title,
    contents: template.replace('%%CONTENT%%', contents).replace('%%TITLE%%', title)
  };
}

const slides = fs.readdirSync(slidesDir).reduce((slides, slideFile) => {
  const data = buildContent(slideFile);
  if (!data) return slides;
  return {
    ...slides,
    [data.title]: data.contents
  };
}, {});

fs.watch(slidesDir, (_, file) => {
  const data = buildContent(file);
  if (!data) {
    const title = path.basename(file, slideExt);
    delete slides[title];
    return;
  }

  slides[data.title] = data.contents;
});

const handler = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const slide = parsedUrl.pathname.replace(/^\//, '');

  if (!slides[slide]) {
    response.status = 404;
    response.setHeader('Content-Type', 'text/html');
    response.end('<!DOCTYPE html><html><body><h1>Page not found</h1></body></html>');
    return;
  }

  response.setHeader('Content-Type', 'text/html');
  response.end(slides[slide]);
}

function shutdown() {
  console.log('Shutting down....');
  process.exit(0);
}

process.removeAllListeners('SIGINT').on('SIGINT', shutdown).removeAllListeners('SIGTERM').on('SIGTERM', shutdown);

const server = http.createServer(handler);
server.listen(port, (err) => {
  if (err) {
    console.error('Something went wrong starting the server');
    process.exit(1);
  }

  console.log(`Server is listening on port ${port}`);
});
