import "./globals.css";
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
        <Navigation></Navigation>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
