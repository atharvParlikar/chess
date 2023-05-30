import { motion } from 'framer-motion';

const Notification = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="border-2 border-black p-6 rounded-md bg-gray-300 text-bold font-mono z-10 fixed top-6 right-6"
    >
      {message}
    </motion.div>
  );
}

export default Notification;