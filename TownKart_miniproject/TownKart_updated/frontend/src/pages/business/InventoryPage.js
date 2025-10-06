import { motion } from 'framer-motion';

const InventoryPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Inventory</h1>
        <p className="text-gray-600 dark:text-gray-400">Update stock levels here. (Coming soon)</p>
      </div>
    </motion.div>
  );
};

export default InventoryPage;


