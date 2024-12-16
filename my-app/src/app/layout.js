import "./globals.css";
import { Poppins } from "next/font/google";
import AuthProvider from "../components/AuthProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/footer"; // Caminho correto

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "AnuncIA - Anúncios em um clique",
  icons: {
    icon: "https://media.licdn.com/dms/image/v2/C4D0BAQH0lo-u5Wpe7g/company-logo_200_200/company-logo_200_200/0/1654550785312/mapmarketplaces_logo?e=2147483647&v=beta&t=uc-BPtacGsO7DjuAtE9pxFPcCuhjCPgGn2MhPkfoDFs",
  },
  description: "Generated by MAP DEVS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
