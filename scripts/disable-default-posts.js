const postProcessor = hexo.extend.processor.store.find((processor) =>
  processor.pattern.match('_posts/example.md')
);

if (postProcessor) {
  postProcessor.pattern = new (require('hexo-util').Pattern)('__blog_posts_disabled__/**');
}

hexo.extend.filter.register('before_generate', function() {
  hexo.model('Post').remove({ source: /^_posts[\\/]/ });
});
