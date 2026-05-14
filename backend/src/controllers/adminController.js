import { query } from '../config/db.js';



// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const [rows] = await query('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
