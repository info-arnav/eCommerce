import { ClientCache } from "@/components/cache";
import "./globals.css";
import { AuthProvider } from "@/components/authProvider";
import Footer from "@/components/footer";
import MetaTags from "@/components/metaTags";
import Navigation from "@/components/navigation";

let midMetaTags = MetaTags("title", "desc");

midMetaTags.title = {
  template: `%s | ${process.env.BRAND}`,
  default: process.env.BRAND,
};

export const metadata = midMetaTags;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientCache>
          <AuthProvider>
            <Navigation></Navigation>
            {children}
            <Footer></Footer>
          </AuthProvider>
        </ClientCache>
      </body>
    </html>
  );
}
