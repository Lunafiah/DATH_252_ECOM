/**
 * Base Repository Interface
 * Defines common CRUD operations for all repositories
 * This is an abstract class that should be extended by concrete repositories
 */
class IRepository {
  /**
   * Find a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Find one document matching the query
   * @param {Object} query - Query object
   * @returns {Promise<Object|null>}
   */
  async findOne(query) {
    throw new Error('Method findOne() must be implemented');
  }

  /**
   * Find all documents matching the query
   * @param {Object} query - Query object
   * @param {Object} options - Options (sort, limit, etc.)
   * @returns {Promise<Array>}
   */
  async find(query = {}, options = {}) {
    throw new Error('Method find() must be implemented');
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>}
   */
  async create(data) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Update a document by ID
   * @param {string} id - Document ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>}
   */
  async update(id, updateData) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Delete a document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>}
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Count documents matching the query
   * @param {Object} query - Query object
   * @returns {Promise<number>}
   */
  async count(query = {}) {
    throw new Error('Method count() must be implemented');
  }
}

module.exports = IRepository;
