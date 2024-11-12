import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full p-4 bg-black border-t border-gray-200 shadow flex justify-between items-center dark:bg-black dark:border-gray-600">
      <div className="text-sm text-gray-400">
        © {new Date().getFullYear()} GenerateAI. All Rights Reserved.
      </div>

      <ul className="flex space-x-6">
        <li>
          <a href="/about" className="text-sm text-gray-400 hover:underline">
            About
          </a>
        </li>
        <li>
          <a href="/privacy_policy" className="text-sm text-gray-400 hover:underline">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="/licensing" className="text-sm text-gray-400 hover:underline">
            Licensing
          </a>
        </li>
        <li>
          <a href="/contato" className="text-sm text-gray-400 hover:underline">
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
