const links = document.querySelectorAll('link[rel="import"]');
// Import and add each page to the DOM
Array.prototype.forEach.call(links, (link:any) => {
  const template = link.import.querySelector('.task-template');
  const clone = document.importNode(template.content, true);
  if (link.href.match('about.html')) {
    document.querySelector('body').appendChild(clone);
  } else {
    document.querySelector('.content').appendChild(clone);
  }
});
