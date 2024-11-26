import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full p-4 bg-black border-t border-gray-200 shadow flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 dark:bg-black dark:border-gray-600">
      {/* Seção de copyright */}
      <div className="text-sm text-center sm:text-left text-gray-400">
        © {new Date().getFullYear()} GenerateAI. All Rights Reserved.
      </div>

      {/* Lista de links */}
      <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 justify-center sm:justify-end items-center">
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
