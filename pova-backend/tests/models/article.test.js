// test/article.test.js

import { expect } from 'chai';
import { addArticle, getArticle, deleteArticle } from '../../models/article.js';
import { connectDB, client, db } from '../../config/db.js';
import { ObjectId } from 'mongodb';



describe("Article Model", function () {
    this.timeout(10000);
    before(async function () {
        await connectDB();
    });

  after(async function() {
    await client.close();
  });

  describe('addArticle()', function() {
    it('should add a valid article and return article ID', async function() {
      const articleData = {
        authorId: '60c72b2f4f1c2d0023c3b76d',
        title: 'Test Article',
        content: 'This is a test article',
        category: 'Tech',
        tags: ['test', 'article']
      };
      const articleId = await addArticle(articleData);
      expect(articleId).to.be.a('string');
    });

    it('should throw an error for invalid article data', async function() {
      const invalidArticleData = {
        title: 'Incomplete Article',
        content: 'Missing authorId'
      };
      try {
        await addArticle(invalidArticleData);
      } catch (err) {
        expect(err).to.be.an('error');
        expect(err.message).to.contain('authorId');
      }
    });
  });

  describe('getArticle()', function() {
    let articleId;

    before(async function() {
      const articleData = {
        authorId: '60c72b2f4f1c2d0023c3b76d',
        title: 'Another Test Article',
        content: 'This is another test article',
        category: 'Tech',
        tags: ['test', 'article']
      };
      articleId = await addArticle(articleData);
    });

    it('should retrieve an article by ID', async function() {
      const article = await getArticle(articleId);
      expect(article).to.have.property('title', 'Another Test Article');
    });

    it('should return null for non-existing article ID', async function() {
      const nonExistingId = new ObjectId().toString();
      const article = await getArticle(nonExistingId);
      expect(article).to.be.null;
    });
  });

  describe('deleteArticle()', function() {
    let articleId;

    before(async function() {
      const articleData = {
        authorId: '60c72b2f4f1c2d0023c3b76d',
        title: 'Delete Test Article',
        content: 'This is an article to delete',
        category: 'Tech',
        tags: ['delete', 'article']
      };
      articleId = await addArticle(articleData);
    });

    it('should delete an article and return its ID', async function() {
      const deletedId = await deleteArticle(articleId);
      expect(deletedId).to.equal(articleId);
    });

    it('should return null for non-existing article ID', async function() {
      const nonExistingId = new ObjectId().toString();
      const result = await deleteArticle(nonExistingId);
      expect(result).to.be.null;
    });
  });
});
