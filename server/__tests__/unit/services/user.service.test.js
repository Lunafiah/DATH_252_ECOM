const container = require('../../../src/config/container');
const { createTestUser } = require('../../helpers/testUtils');

// Get service from container
const userService = container.getService('user');

describe('UserService', () => {
  describe('updateProfile', () => {
    it('should update user name', async () => {
      const user = await createTestUser({ name: 'Old Name' });

      const updated = await userService.updateProfile(user._id, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
    });

    it('should update user password', async () => {
      const user = await createTestUser();
      const oldPassword = user.password;

      const updated = await userService.updateProfile(user._id, { password: 'newpassword123' });

      expect(updated.password).not.toBe(oldPassword);
      expect(updated.password).not.toBe('newpassword123'); // Should be hashed
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.updateProfile('507f1f77bcf86cd799439011', { name: 'Test' })
      ).rejects.toThrow('Không tìm thấy người dùng');
    });
  });

  describe('addAddress', () => {
    it('should add new address to user', async () => {
      const user = await createTestUser();

      const addresses = await userService.addAddress(user._id, {
        street: '123 Main St',
        city: 'New York',
        phone: '1234567890',
      });

      expect(addresses).toHaveLength(1);
      expect(addresses[0].street).toBe('123 Main St');
      expect(addresses[0].city).toBe('New York');
    });

    it('should set first address as default', async () => {
      const user = await createTestUser();

      const addresses = await userService.addAddress(user._id, {
        street: '123 Main St',
        city: 'New York',
        phone: '1234567890',
      });

      expect(addresses[0].isDefault).toBe(true);
    });

    it('should add address to beginning of array', async () => {
      const user = await createTestUser();

      await userService.addAddress(user._id, {
        street: 'First Address',
        city: 'NYC',
        phone: '111',
      });

      const addresses = await userService.addAddress(user._id, {
        street: 'Second Address',
        city: 'LA',
        phone: '222',
      });

      expect(addresses).toHaveLength(2);
      expect(addresses[0].street).toBe('Second Address');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.addAddress('507f1f77bcf86cd799439011', {
          street: '123 St',
          city: 'NYC',
          phone: '123',
        })
      ).rejects.toThrow('User not found');
    });
  });

  describe('deleteAddress', () => {
    it('should delete address from user', async () => {
      const user = await createTestUser();

      const addresses = await userService.addAddress(user._id, {
        street: '123 Main St',
        city: 'New York',
        phone: '1234567890',
      });

      const addressId = addresses[0]._id.toString();

      const updatedAddresses = await userService.deleteAddress(user._id, addressId);

      expect(updatedAddresses).toHaveLength(0);
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.deleteAddress('507f1f77bcf86cd799439011', 'address123')
      ).rejects.toThrow('User not found');
    });
  });
});
